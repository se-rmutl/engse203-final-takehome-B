import { useSyncExternalStore } from 'react';
import { getToken, subscribe } from '../services/authStore.js';
import { decodeTokenPayload } from '../utils/token.js';
import { canManage } from '../utils/permissions.js';

/**
 * ผู้ใช้ปัจจุบัน — component ที่เรียก hook นี้จะ render ใหม่เมื่อเข้า/ออกจากระบบ
 *   คืน { user, isStaff }  (user = payload ของ token หรือ null)
 */
export default function useAuth() {
  const token = useSyncExternalStore(subscribe, getToken, () => null);
  const user = token ? decodeTokenPayload(token) : null;
  return { user, isStaff: canManage(user) };
}
