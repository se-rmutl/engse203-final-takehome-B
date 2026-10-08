/**
 * token.js — อ่าน payload ของ JWT ฝั่งเบราว์เซอร์ (pure function · ทดสอบได้)
 *
 * ⚠ แค่ "อ่าน" เพื่อแสดงชื่อและซ่อน/แสดงปุ่ม — ไม่ได้ "ตรวจ" ว่า token จริง
 *   การตรวจจริงเกิดที่ API ทุกครั้ง เพราะโค้ดฝั่งเบราว์เซอร์ใครก็แก้ได้
 *
 *   decodeTokenPayload(token)      → payload (object) หรือ null ถ้าอ่านไม่ได้
 *   isTokenExpired(payload, nowMs) → true ถ้า exp ผ่านไปแล้ว
 */
export function decodeTokenPayload(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('[token] อ่าน payload ของ token ไม่ได้:', error);
    return null;
  }
}

/** ไม่มี payload หรือไม่มี exp → ให้ API เป็นผู้ตัดสิน (API ตรวจทุกคำขออยู่แล้ว) */
export function isTokenExpired(payload, nowMs = Date.now()) {
  if (!payload || typeof payload.exp !== 'number') return false;
  return payload.exp * 1000 <= nowMs;
}
