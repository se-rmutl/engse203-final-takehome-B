import { Router } from 'express';
import * as controller from '../controllers/announcementController.js';

const router = Router();

router.get('/', controller.listCategories);

export default router;
