import { getDb } from './db.js';

/**
 * announcementService.js — จัดการข้อมูลประกาศและหมวดหมู่
 *
 * ฐานข้อมูลเก็บ snake_case (category_id, publish_at) แต่ API ส่ง camelCase
 * → ใช้ JOIN + AS แปลงรูปข้อมูลตรงนี้ที่เดียว (หน้าที่ของ service)
 */
const SELECT_SHAPE = `
  SELECT a.id,
         a.title,
         a.body,
         a.category_id  AS categoryId,
         c.name         AS categoryName,
         a.status,
         a.publish_at   AS publishAt,
         a.author_name  AS authorName,
         a.created_at   AS createdAt
  FROM announcements a
  JOIN categories c ON c.id = a.category_id`;

export function listCategories() {
  return getDb().prepare('SELECT id, name FROM categories ORDER BY id').all();
}

/** ประกาศที่ผู้อ่านทั่วไปเห็น */
export function findPublished() {
  return getDb().prepare(`${SELECT_SHAPE} WHERE a.status = 'published' ORDER BY a.id`).all();
}

export function findPublishedById(id) {
  return getDb().prepare(`${SELECT_SHAPE} WHERE a.id = ? AND a.status = 'published'`).get(id) ?? null;
}

/** ทุกสถานะ — สำหรับหน้าเจ้าหน้าที่ */
export function findAll() {
  return getDb().prepare(`${SELECT_SHAPE} ORDER BY a.id`).all();
}

export function findById(id) {
  return getDb().prepare(`${SELECT_SHAPE} WHERE a.id = ?`).get(id) ?? null;
}

/** รหัสถัดไป เช่น ANN-011 — ต่อจากรหัสล่าสุด (ไม่ใช้ COUNT เพราะลบรายการกลางแล้วรหัสจะชน) */
function nextId() {
  const row = getDb().prepare(
    "SELECT id FROM announcements WHERE id LIKE 'ANN-%' ORDER BY id DESC LIMIT 1"
  ).get();
  const n = row ? Number(String(row.id).replace('ANN-', '')) + 1 : 1;
  return `ANN-${String(n).padStart(3, '0')}`;
}

export function create(input, authorName) {
  const id = nextId();
  getDb().prepare(
    `INSERT INTO announcements (id, title, body, category_id, status, publish_at, author_name, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, input.title.trim(), input.body.trim(), input.categoryId, input.status,
        input.publishAt, authorName, new Date().toISOString());
  return findById(id);
}

export function update(id, input) {
  const result = getDb().prepare(
    `UPDATE announcements
     SET title = ?, body = ?, category_id = ?, status = ?, publish_at = ?
     WHERE id = ?`
  ).run(input.title.trim(), input.body.trim(), input.categoryId, input.status, input.publishAt, id);
  return result.changes ? findById(id) : null;
}

export function remove(id) {
  const target = findById(id);
  if (!target) return null;
  getDb().prepare('DELETE FROM announcements WHERE id = ?').run(id);
  return target;
}
