import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';
import { config } from '../config.js';

/**
 * db.js — เปิดฐานข้อมูล SQLite (node:sqlite · sync) ที่เดียวทั้งระบบ
 *
 *   loadSeed()     เปิดฐานข้อมูล · ถ้ายังไม่มีตารางให้สร้างจาก schema.sql
 *                  test ใช้ DB_FILE=':memory:' → เรียกแต่ละครั้งได้ฐานข้อมูลใหม่พร้อมข้อมูลตั้งต้น
 *   getDb()        service อื่นเรียกใช้ connection เดียวกันนี้
 *   getDbStatus()  ใช้โดย GET /api/health
 */
let db;

export async function loadSeed() {
  db = new DatabaseSync(config.dbFile);
  db.exec('PRAGMA foreign_keys = ON');   // ⚠ ต้องเปิดทุกครั้งที่เปิดฐานข้อมูล
  const ready = db.prepare(
    "SELECT COUNT(*) c FROM sqlite_master WHERE type='table' AND name='announcements'"
  ).get().c;
  if (!ready && existsSync(config.schemaFile)) {
    db.exec(readFileSync(config.schemaFile, 'utf8'));
  }
}

export function getDb() {
  if (!db) throw new Error('ยังไม่ได้เปิดฐานข้อมูล — เรียก loadSeed() ก่อน');
  return db;
}

export function getDbStatus() {
  try {
    if (!db) return { connected: false, reason: 'ยังไม่ได้เปิดฐานข้อมูล' };
    const n = db.prepare("SELECT COUNT(*) c FROM sqlite_master WHERE type='table'").get().c;
    return { connected: true, driver: 'sqlite', tables: n };
  } catch (e) {
    return { connected: false, reason: e.message };
  }
}
