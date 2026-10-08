import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/db.js';

/**
 * FEAT — ตั้งเวลาเผยแพร่ + กรองตามหมวดหมู่ (test สเปก · เขียนไว้ก่อนโค้ด)
 * ⚠ starter: 3 ข้อนี้ FAIL โดยตั้งใจ — ทำ FEAT ให้ผ่านโดยห้ามแก้ test ในไฟล์นี้
 *
 * ข้อมูลตั้งต้น: ANN-007 และ ANN-008 เป็น published แต่ตั้งเวลาไว้ 2027-12-31 (ยังไม่ถึงเวลา)
 */
const app = createApp();
beforeEach(async () => { await loadSeed(); });

describe('FEAT · GET /api/announcements', () => {
  test('ประกาศที่ตั้งเวลาเผยแพร่ในอนาคต ยังไม่แสดงในรายการสาธารณะ', async () => {
    const r = await request(app).get('/api/announcements');
    expect(r.status).toBe(200);
    const ids = r.body.map((a) => a.id);
    expect(ids).not.toContain('ANN-007');
    expect(ids).not.toContain('ANN-008');
  });

  test('?category=3 คืนเฉพาะประกาศหมวด "กิจกรรม" ที่เผยแพร่แล้ว', async () => {
    const r = await request(app).get('/api/announcements?category=3');
    expect(r.status).toBe(200);
    expect(r.body.length).toBe(2);
    expect(r.body.every((a) => a.categoryId === 3)).toBe(true);
  });

  test('?category=abc (ไม่ใช่จำนวนเต็มบวก) → 400 พร้อม errors', async () => {
    const r = await request(app).get('/api/announcements?category=abc');
    expect(r.status).toBe(400);
    expect(Array.isArray(r.body.errors)).toBe(true);
    expect(r.body.errors.length).toBeGreaterThan(0);
  });
});
