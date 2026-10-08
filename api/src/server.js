import { config } from './config.js';
import { createApp } from './app.js';
import { loadSeed } from './services/db.js';

await loadSeed();
const app = createApp();

app.listen(config.port, () => {
  console.log(`ระบบประกาศข่าวคณะ (API) พร้อมที่ http://localhost:${config.port}`);
  console.log(`[config] env = ${config.env} · CORS = ${config.corsOrigin}`);
  console.log('[config] JWT secret =', config.jwtSecret);
});
