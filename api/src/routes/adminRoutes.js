import { Router } from 'express';
import * as controller from '../controllers/announcementController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// ทุก route ในไฟล์นี้ต้องเป็นเจ้าหน้าที่
router.use(authenticate, requireRole('staff'));
router.get('/announcements', controller.listAll);

export default router;
