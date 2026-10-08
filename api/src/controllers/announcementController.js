import * as service from '../services/announcementService.js';

/** controller รู้จัก req/res และตัดสิน status code — แต่ไม่จัดการข้อมูลเอง */

const notFound = (res, id) => res.status(404).json({ error: `ไม่พบประกาศรหัส ${id}` });

export function listCategories(req, res) {
  res.status(200).json(service.listCategories());
}

/** GET /api/announcements — สาธารณะ */
export function listPublished(req, res) {
  res.status(200).json(service.findPublished());
}

/** GET /api/announcements/:id — สาธารณะ · ฉบับร่าง/เก็บเข้าคลัง → 404 */
export function getPublished(req, res) {
  const found = service.findPublishedById(req.params.id);
  if (!found) return notFound(res, req.params.id);
  res.status(200).json(found);
}

/** GET /api/admin/announcements — เจ้าหน้าที่ · ทุกสถานะ */
export function listAll(req, res) {
  res.status(200).json(service.findAll());
}

export function create(req, res) {
  const authorName = String(req.user?.name ?? 'ไม่ระบุชื่อ');   // ผู้ประกาศ = เจ้าหน้าที่ที่เข้าสู่ระบบ
  const created = service.create(req.body, authorName);
  res.status(201).json(created);
}

export function update(req, res) {
  const updated = service.update(req.params.id, req.body);
  if (!updated) return notFound(res, req.params.id);
  res.status(200).json(updated);
}

export function remove(req, res) {
  const removed = service.remove(req.params.id);
  if (!removed) return notFound(res, req.params.id);
  res.status(204).end();
}
