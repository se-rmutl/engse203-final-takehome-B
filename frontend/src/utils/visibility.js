/**
 * visibility.js — ผู้อ่านทั่วไปเห็นประกาศนี้หรือยัง (pure function)
 *
 *   visibilityOf(announcement, nowMs) → 'draft' | 'scheduled' | 'live' | 'archived'
 *     announcement มี status และ publishAt (รูปแบบเดียวกับที่ API ส่งมา)
 *     nowMs        เวลาปัจจุบันเป็นมิลลิวินาที (ส่งเข้ามา เพื่อให้ test กำหนดเวลาได้)
 */
// TODO (FEAT): คืนค่าตามสถานะและเวลาเผยแพร่ — ดูสเปกใน TAKEHOME_B.md และ visibility.test.js
export function visibilityOf(announcement, nowMs = Date.now()) {
  return 'live';
}
