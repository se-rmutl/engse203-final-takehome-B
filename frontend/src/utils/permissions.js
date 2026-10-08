/**
 * permissions.js — ตัดสินว่าหน้าจอควรแสดงปุ่มจัดการประกาศหรือไม่ (pure function)
 *
 *   canManage(payload) → true เมื่อเป็นเจ้าหน้าที่
 *   ⚠ ใช้ซ่อน/แสดงปุ่มเท่านั้น — สิทธิ์จริงตรวจที่ API (requireRole) ทุกครั้ง
 */
export function canManage(payload) {
  return payload?.role === 'staff';
}
