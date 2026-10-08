import request from 'supertest';
import jwt from 'jsonwebtoken';
import { config } from '../../src/config.js';

/** บัญชีเจ้าหน้าที่จาก schema.sql (ใช้เฉพาะพัฒนาและทดสอบ) */
export const STAFF = { email: 'news@eng.rmutl.ac.th', password: 'news1234' };

/** เข้าสู่ระบบจริงผ่าน API แล้วคืน token */
export async function loginAsStaff(app) {
  const r = await request(app).post('/api/auth/login').send(STAFF);
  return r.body.token;
}

/** สร้าง token ด้วย role ที่ต้องการ — ใช้ทดสอบ 403 (และทดสอบ secret อื่นได้ด้วยพารามิเตอร์ที่ 2) */
export function tokenFor(role, secret = config.jwtSecret) {
  return jwt.sign({ sub: '1', name: 'ทดสอบ', role }, secret, { expiresIn: '5m' });
}
