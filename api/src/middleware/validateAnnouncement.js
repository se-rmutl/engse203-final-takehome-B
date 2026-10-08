import { validateAnnouncementInput } from '../validators/announcementValidator.js';

/**
 * middleware บาง ๆ — เรียก pure function แล้วตัดสินว่าจะไปต่อหรือตอบ 400
 * กฎทั้งหมดอยู่ใน validators/announcementValidator.js
 */
export function validateAnnouncement(req, res, next) {
  const errors = validateAnnouncementInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลประกาศไม่ถูกต้อง', errors });
  }
  next();
}
