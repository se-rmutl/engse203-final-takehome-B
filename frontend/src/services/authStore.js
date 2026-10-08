/**
 * authStore.js — เก็บ token ของเจ้าหน้าที่ฝั่งเบราว์เซอร์ (localStorage)
 *
 *   localStorage อยู่รอดเมื่อ refresh หน้า · ⚠ สคริปต์ที่แทรกเข้ามาในหน้าเว็บ (XSS) อ่านได้
 *   → ห้ามใช้ dangerouslySetInnerHTML กับข้อมูลที่ผู้ใช้กรอก
 */
import { decodeTokenPayload, isTokenExpired } from '../utils/token.js';

const KEY = 'faculty-news.auth.token';
const EVENT = 'auth:changed';

export function getToken() {
  try {
    const token = localStorage.getItem(KEY);
    if (token && isTokenExpired(decodeTokenPayload(token), Date.now())) {
      localStorage.removeItem(KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function setToken(token) {
  try { localStorage.setItem(KEY, token); } catch { /* storage ถูกปิด — ใช้งานต่อได้แต่ไม่จำ */ }
  window.dispatchEvent(new Event(EVENT));
}

export function clearToken() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  window.dispatchEvent(new Event(EVENT));
}

/** ให้ React รู้เมื่อเข้า/ออกจากระบบ (ใช้กับ useSyncExternalStore) */
export function subscribe(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);   // เปิดหลายแท็บ — ออกจากระบบแท็บหนึ่ง อีกแท็บรู้ด้วย
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
