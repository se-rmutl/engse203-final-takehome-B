import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/db.js';
import { resetLoginLimiter } from '../../src/routes/authRoutes.js';
import { STAFF, loginAsStaff, tokenFor } from '../helpers/auth.js';

/** เข้าสู่ระบบและสิทธิ์ — 401 (ไม่รู้ว่าเป็นใคร) · 403 (รู้แต่ไม่มีสิทธิ์) */
const app = createApp();
beforeEach(async () => { await loadSeed(); resetLoginLimiter(); });

const valid = {
  title: 'ประกาศจากการทดสอบสิทธิ์',
  body: 'เนื้อหาประกาศสำหรับทดสอบสิทธิ์ของเจ้าหน้าที่',
  categoryId: 1,
  status: 'draft',
  publishAt: '2026-09-01T09:00:00+07:00',
};

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token และข้อมูลผู้ใช้', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);          // header.payload.signature
    expect(r.body.user).toMatchObject({ role: 'staff', name: 'ฝ่ายข่าว คณะวิศวกรรมศาสตร์' });
    expect(r.body.user).not.toHaveProperty('passwordHash');
  });
  test('บัญชีเจ้าหน้าที่ที่สอง (งานวิชาการ) เข้าสู่ระบบได้', async () => {
    const r = await request(app).post('/api/auth/login').send({ email: 'academic@eng.rmutl.ac.th', password: 'news1234' });
    expect(r.status).toBe(200);
    expect(r.body.user).toMatchObject({ role: 'staff', name: 'งานวิชาการ คณะวิศวกรรมศาสตร์' });
  });
  test('payload ของ token มี sub · name · role แต่ไม่มีรหัสผ่าน', async () => {
    const payload = jwt.decode(await loginAsStaff(app));     // decode ได้ทุกคน — payload ไม่ใช่ความลับ
    expect(payload).toMatchObject({ sub: '1', name: 'ฝ่ายข่าว คณะวิศวกรรมศาสตร์', role: 'staff' });
    expect(JSON.stringify(payload)).not.toMatch(/news1234|scrypt/);
  });
  test('รหัสผ่านผิด กับ อีเมลที่ไม่มี → 401 ข้อความเดียวกัน', async () => {
    const wrong = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    const unknown = await request(app).post('/api/auth/login').send({ email: 'ghost@eng.rmutl.ac.th', password: 'nope1234' });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(wrong.body.error).toBe(unknown.body.error);
  });
  test('ไม่ส่งรหัสผ่าน → 400', async () => {
    const r = await request(app).post('/api/auth/login').send({ email: STAFF.email });
    expect(r.status).toBe(400);
  });
  test('ผิดเกิน 5 ครั้ง → 429', async () => {
    for (let i = 0; i < 5; i += 1) {
      await request(app).post('/api/auth/login').send({ ...STAFF, password: `wrong-${i}` }).expect(401);
    }
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(r.status).toBe(429);
  });
});

describe('สิทธิ์ของ POST / PUT / DELETE และหน้าเจ้าหน้าที่', () => {
  test('ไม่มี token → 401 พร้อม WWW-Authenticate', async () => {
    const r = await request(app).post('/api/announcements').send(valid);
    expect(r.status).toBe(401);
    expect(r.headers['www-authenticate']).toMatch(/Bearer/);
  });
  test('Authorization ไม่ใช่ Bearer → 401', async () => {
    const r = await request(app).delete('/api/announcements/ANN-001').set('Authorization', 'Basic abc');
    expect(r.status).toBe(401);
  });
  test('token ที่ไม่ใช่รูปแบบ JWT → 401', async () => {
    const r = await request(app).delete('/api/announcements/ANN-001').set('Authorization', 'Bearer not-a-jwt');
    expect(r.status).toBe(401);
  });
  test('token ถูกต้องแต่ไม่ใช่เจ้าหน้าที่ → 403', async () => {
    const r = await request(app).post('/api/announcements')
      .set('Authorization', `Bearer ${tokenFor('viewer')}`).send(valid);
    expect(r.status).toBe(403);
  });
  test('เจ้าหน้าที่ → POST 201 · PUT 200 · DELETE 204', async () => {
    const auth = { Authorization: `Bearer ${await loginAsStaff(app)}` };
    const created = await request(app).post('/api/announcements').set(auth).send(valid).expect(201);
    await request(app).put(`/api/announcements/${created.body.id}`).set(auth).send({ ...valid, status: 'published' }).expect(200);
    await request(app).delete(`/api/announcements/${created.body.id}`).set(auth).expect(204);
  });
  test('GET /api/admin/announcements ไม่มี token → 401', async () => {
    await request(app).get('/api/admin/announcements').expect(401);
  });
  test('อ่านประกาศ (GET) ไม่ต้องเข้าสู่ระบบ', async () => {
    await request(app).get('/api/announcements').expect(200);
    await request(app).get('/api/categories').expect(200);
  });
});

describe('ข้อมูลอันตราย', () => {
  test('body ใหญ่เกิน 10kb → 413 เป็น JSON', async () => {
    const auth = { Authorization: `Bearer ${await loginAsStaff(app)}` };
    const r = await request(app).post('/api/announcements').set(auth).send({ ...valid, body: 'x'.repeat(20000) });
    expect(r.status).toBe(413);
    expect(r.body.error).toMatch(/ขนาดใหญ่เกิน/);
  });
  test('ทุกคำตอบมี security header', async () => {
    const r = await request(app).get('/api/health');
    expect(r.headers['x-content-type-options']).toBe('nosniff');
    expect(r.headers['x-frame-options']).toBe('DENY');
  });
});
