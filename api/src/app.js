import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { config } from './config.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // ① CORS — dev ใช้ (frontend 5173 เรียก API 3001 ข้ามพอร์ต)
  app.use(cors({ origin: config.corsOrigin }));

  // ② logging — test ไม่ต้อง log ทุกคำขอ ผลการทดสอบจะได้อ่านง่าย
  if (config.env !== 'test') app.use(morgan(config.isProd ? 'combined' : 'dev'));

  // ③ อ่าน JSON body — ใหญ่เกิน 10kb ได้ 413
  app.use(express.json({ limit: '10kb' }));

  // ④ security headers พื้นฐาน
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
    });
    next();
  });

  // ⑤ route ของ API — ทุกอย่างอยู่ใต้ /api
  app.get('/api', (req, res) => {
    res.json({ message: 'Faculty News API is running', version: '1.0.0' });
  });
  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/announcements', announcementRoutes);
  app.use('/api/admin', adminRoutes);

  // ⑥ หน้าแรก / — ขึ้นกับสภาพแวดล้อม
  if (config.isProd && existsSync(config.staticDir)) {
    // production: API เสิร์ฟหน้าเว็บที่ build แล้ว → เปิด URL เดียวได้ทั้งเว็บและ API
    app.use(express.static(config.staticDir));
    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(config.staticDir, 'index.html'));
    });
  } else {
    app.get('/', (req, res) => {
      res.json({ message: 'Faculty News API (dev) — หน้าเว็บอยู่ที่ Vite พอร์ต 5173', api: '/api' });
    });
  }

  // ⑦ ปิดท้าย — ต้องอยู่หลังสุดเสมอ
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
