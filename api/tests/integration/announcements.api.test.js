import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/db.js';
import { loginAsStaff } from '../helpers/auth.js';

/**
 * Integration test — ยิง HTTP จริงผ่านทุกชั้น: route → controller → service → SQLite
 * beforeEach เรียก loadSeed() ใหม่ทุกข้อ → ได้ฐานข้อมูลในหน่วยความจำชุดใหม่ (ประกาศตั้งต้น 10 รายการ)
 */
const app = createApp();
let auth;
beforeEach(async () => {
  await loadSeed();
  auth = { Authorization: `Bearer ${await loginAsStaff(app)}` };
});

const valid = {
  title: 'ประกาศทดสอบอัตโนมัติ',
  body: 'เนื้อหาประกาศทดสอบอัตโนมัติที่ยาวพอสมควร',
  categoryId: 3,
  status: 'published',
  publishAt: '2026-09-30T09:00:00+07:00',
};

describe('GET /api/categories', () => {
  test('คืนหมวดหมู่ 4 รายการ', async () => {
    const r = await request(app).get('/api/categories');
    expect(r.status).toBe(200);
    expect(r.body.map((c) => c.name)).toEqual(['ทั่วไป', 'ทุนการศึกษา', 'กิจกรรม', 'สอบ']);
  });
});

describe('GET /api/announcements (สาธารณะ)', () => {
  test('คืนเฉพาะประกาศสถานะ published', async () => {
    const r = await request(app).get('/api/announcements');
    expect(r.status).toBe(200);
    expect(r.body.length).toBeGreaterThan(0);
    expect(r.body.every((a) => a.status === 'published')).toBe(true);
  });
  test('รูปข้อมูลเป็น camelCase พร้อมชื่อหมวดหมู่ (ไม่ใช่ category_id)', async () => {
    const r = await request(app).get('/api/announcements');
    expect(Object.keys(r.body[0]).sort()).toEqual(
      ['authorName', 'body', 'categoryId', 'categoryName', 'createdAt', 'id', 'publishAt', 'status', 'title'],
    );
  });
  test('ไม่มีฉบับร่างและที่เก็บเข้าคลังในรายการ', async () => {
    const ids = (await request(app).get('/api/announcements')).body.map((a) => a.id);
    expect(ids).not.toContain('ANN-005');
    expect(ids).not.toContain('ANN-006');
  });
});

describe('GET /api/announcements/:id (สาธารณะ)', () => {
  test('ประกาศที่เผยแพร่แล้ว → 200', async () => {
    const r = await request(app).get('/api/announcements/ANN-001');
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ id: 'ANN-001', categoryName: 'ทั่วไป' });
  });
  test.each(['ANN-005', 'ANN-006', 'ANN-999'])('%s (ร่าง / เก็บเข้าคลัง / ไม่มี) → 404', async (id) => {
    const r = await request(app).get(`/api/announcements/${id}`);
    expect(r.status).toBe(404);
    expect(r.body.error).toMatch(/ไม่พบประกาศ/);
  });
});

describe('GET /api/admin/announcements (เจ้าหน้าที่)', () => {
  test('เห็นครบทุกสถานะ 10 รายการ', async () => {
    const r = await request(app).get('/api/admin/announcements').set(auth);
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(10);
    expect(new Set(r.body.map((a) => a.status))).toEqual(new Set(['draft', 'published', 'archived']));
  });
});

describe('POST /api/announcements', () => {
  test('ข้อมูลถูกต้อง → 201 · ได้รหัสถัดไป · ผู้ประกาศมาจากบัญชีที่เข้าสู่ระบบ', async () => {
    const r = await request(app).post('/api/announcements').set(auth).send(valid);
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({
      id: 'ANN-011', categoryId: 3, categoryName: 'กิจกรรม', authorName: 'ฝ่ายข่าว คณะวิศวกรรมศาสตร์',
    });
  });
  test('ส่ง authorName มาเองก็ไม่มีผล (ใช้ชื่อจาก token)', async () => {
    const r = await request(app).post('/api/announcements').set(auth).send({ ...valid, authorName: 'คนอื่น' });
    expect(r.body.authorName).toBe('ฝ่ายข่าว คณะวิศวกรรมศาสตร์');
  });
  test('ข้อมูลไม่ครบ → 400 พร้อมรายการ errors', async () => {
    const r = await request(app).post('/api/announcements').set(auth).send({ title: 'สั้น' });
    expect(r.status).toBe(400);
    expect(Array.isArray(r.body.errors)).toBe(true);
    expect(r.body.errors.length).toBeGreaterThan(1);
  });
  test('ลบรายการกลาง แล้วเพิ่มใหม่ → รหัสไม่ซ้ำของเดิม', async () => {
    await request(app).delete('/api/announcements/ANN-003').set(auth).expect(204);
    const r = await request(app).post('/api/announcements').set(auth).send(valid);
    expect(r.status).toBe(201);
    const ids = (await request(app).get('/api/admin/announcements').set(auth)).body.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('PUT /api/announcements/:id', () => {
  test('แก้หัวข้อและเก็บเข้าคลัง → 200 · หายจากรายการสาธารณะ', async () => {
    const r = await request(app).put('/api/announcements/ANN-001').set(auth)
      .send({ ...valid, title: 'เปิดภาคเรียน (แก้ไข)', status: 'archived' });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ title: 'เปิดภาคเรียน (แก้ไข)', status: 'archived' });
    await request(app).get('/api/announcements/ANN-001').expect(404);
  });
  test('สถานะนอกรายการ → 400', async () => {
    const r = await request(app).put('/api/announcements/ANN-001').set(auth).send({ ...valid, status: 'deleted' });
    expect(r.status).toBe(400);
  });
  test('ประกาศที่ไม่มีอยู่ → 404', async () => {
    const r = await request(app).put('/api/announcements/ANN-999').set(auth).send(valid);
    expect(r.status).toBe(404);
  });
});

describe('DELETE /api/announcements/:id', () => {
  test('ลบแล้ว GET ซ้ำ → 404', async () => {
    await request(app).delete('/api/announcements/ANN-002').set(auth).expect(204);
    await request(app).get('/api/announcements/ANN-002').expect(404);
  });
  test('ลบรายการที่ไม่มี → 404', async () => {
    await request(app).delete('/api/announcements/ANN-999').set(auth).expect(404);
  });
});

describe('ระบบ', () => {
  test('health บอกว่าต่อฐานข้อมูลได้', async () => {
    const r = await request(app).get('/api/health');
    expect(r.status).toBe(200);
    expect(r.body.database).toMatchObject({ connected: true, driver: 'sqlite' });
  });
  test('เส้นทางที่ไม่มี → 404 เป็น JSON', async () => {
    const r = await request(app).get('/api/nope');
    expect(r.status).toBe(404);
    expect(r.body.error).toMatch(/ไม่พบเส้นทาง/);
  });
  test('ส่ง JSON ที่เสีย → 400 เป็น JSON ไม่ใช่ 500', async () => {
    const r = await request(app).post('/api/announcements').set(auth)
      .set('Content-Type', 'application/json').send('{"title": ');
    expect(r.status).toBe(400);
    expect(r.body).toHaveProperty('error');
  });
});
