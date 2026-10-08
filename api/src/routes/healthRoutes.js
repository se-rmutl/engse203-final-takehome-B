import { Router } from 'express';
import { getDbStatus } from '../services/db.js';
import { config } from '../config.js';

/**
 * GET /api/health — ระบบบอกสถานะตัวเอง
 *   cloud เรียก endpoint นี้เพื่อเช็คว่า deploy สำเร็จ · บอกได้ว่าต่อฐานข้อมูลได้จริงไหม
 */
const router = Router();

router.get('/', (req, res) => {
  const db = getDbStatus();
  const ok = db.connected;
  res.status(ok ? 200 : 503).json({
    status: ok ? 'ok' : 'degraded',
    env: config.env,
    uptime: Math.round(process.uptime()),
    database: db,
    time: new Date().toISOString(),
  });
});

export default router;
