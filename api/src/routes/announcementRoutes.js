import { Router } from 'express';
import * as controller from '../controllers/announcementController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateAnnouncement } from '../middleware/validateAnnouncement.js';

const router = Router();

// ใครก็อ่านประกาศที่เผยแพร่แล้วได้
router.get('/', controller.listPublished);
router.get('/:id', controller.getPublished);

// สร้าง · แก้ไข · ลบ — เฉพาะเจ้าหน้าที่ (ตรวจตัวตนก่อน แล้วค่อยตรวจข้อมูล)
const staffOnly = [authenticate, requireRole('staff')];
router.post('/', ...staffOnly, validateAnnouncement, controller.create);
router.put('/:id', ...staffOnly, validateAnnouncement, controller.update);
router.delete('/:id', ...staffOnly, controller.remove);

export default router;
