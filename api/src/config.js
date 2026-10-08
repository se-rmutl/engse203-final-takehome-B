/**
 * config.js — รวมการอ่าน environment variable ไว้ที่เดียว
 *
 *   - ไม่ให้ค่า config กระจายอยู่ทั่วโค้ด
 *   - แยก dev / production ด้วยค่าเดียว: NODE_ENV
 *   - ที่อื่น import { config } จากไฟล์นี้
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '..');

export const config = {
  // สภาพแวดล้อม — 'development' · 'test' · 'production'
  env: process.env.NODE_ENV ?? 'development',
  isProd: process.env.NODE_ENV === 'production',

  // พอร์ตของ API
  port: Number(process.env.PORT ?? 3001),

  // ที่อยู่ frontend ที่อนุญาตให้เรียก (CORS)
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  // ไฟล์ฐานข้อมูล (test ใช้ ':memory:' — ดู vitest.config.js)
  dbFile: process.env.DB_FILE || path.join(API_ROOT, 'data', 'news.db'),
  schemaFile: path.join(API_ROOT, 'data', 'schema.sql'),

  // production เสิร์ฟไฟล์ frontend ที่ build แล้วจากที่ไหน
  staticDir: process.env.STATIC_DIR ?? path.join(API_ROOT, '..', 'frontend', 'dist'),

  // JWT — ใช้เซ็น token ตอนเข้าสู่ระบบ
  jwtSecret: 'faculty-news-secret',
};
