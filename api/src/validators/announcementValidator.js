/**
 * announcementValidator.js — กฎตรวจข้อมูล เป็น "pure function" (ทดสอบด้วย unit test ได้ทันที)
 *
 *   validateAnnouncementInput(input) → [] ถ้าผ่าน · ['ข้อความ error', ...] ถ้าไม่ผ่าน
 */
export const STATUSES = ['draft', 'published', 'archived'];

export const MIN_TITLE = 5;
export const MAX_TITLE = 150;
export const MIN_BODY = 20;
export const MAX_BODY = 5000;

// วันเวลา ISO 8601 ที่ต้องมีเขตเวลาเสมอ เช่น 2026-10-08T09:00:00+07:00 หรือ 2026-10-08T02:00:00.000Z
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

/** ตรวจช่องข้อความหนึ่งช่อง — คืนข้อความ error หรือ null */
function checkText(value, label, { min, max }) {
  if (typeof value !== 'string') return `${label}ต้องเป็นข้อความ`;
  const length = value.trim().length;
  if (length < min) return `${label}ต้องมีอย่างน้อย ${min} ตัวอักษร`;
  if (length > max) return `${label}ต้องไม่เกิน ${max} ตัวอักษร`;
  return null;
}

export function isIsoDateTime(value) {
  return typeof value === 'string' && ISO_DATETIME.test(value) && !Number.isNaN(Date.parse(value));
}

export function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

export function validateAnnouncementInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return ['ต้องส่งข้อมูลประกาศมาด้วย'];
  }
  const errors = [
    checkText(input.title, 'หัวข้อ', { min: MIN_TITLE, max: MAX_TITLE }),
    checkText(input.body, 'เนื้อหา', { min: MIN_BODY, max: MAX_BODY }),
    isPositiveInteger(input.categoryId) ? null : 'หมวดหมู่ต้องเป็นรหัสตัวเลข (จำนวนเต็มบวก)',
    STATUSES.includes(input.status) ? null : 'สถานะต้องเป็น draft, published หรือ archived',
    isIsoDateTime(input.publishAt)
      ? null
      : 'วันเวลาเผยแพร่ต้องเป็นรูปแบบ ISO 8601 พร้อมเขตเวลา เช่น 2026-10-08T09:00:00+07:00',
  ];
  return errors.filter(Boolean);
}

/** ข้อมูลเข้าสู่ระบบ — ตรวจแค่รูปแบบ ส่วนถูกหรือผิดให้ authService ตัดสิน */
export function validateLoginInput(input) {
  if (!input || typeof input !== 'object') return ['ต้องส่งอีเมลและรหัสผ่าน'];
  const errors = [];
  if (typeof input.email !== 'string' || !input.email.includes('@') || input.email.length > 254) {
    errors.push('รูปแบบอีเมลไม่ถูกต้อง');
  }
  if (typeof input.password !== 'string' || input.password.length === 0 || input.password.length > 200) {
    errors.push('กรุณาระบุรหัสผ่าน');
  }
  return errors;
}
