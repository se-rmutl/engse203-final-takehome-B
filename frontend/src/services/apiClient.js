/**
 * ตัวกลางสำหรับคุยกับ API — ที่เดียวที่เรียก fetch()
 * ทุกฟังก์ชันใน announcementService / authService เรียกผ่านตรงนี้
 */
import { clearToken, getToken } from './authStore.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

/** error ที่รู้ว่ามาจาก API พร้อม status ที่ได้กลับมา */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseError(response) {
  try {
    const body = await response.json();
    const message = body.error ?? `คำขอไม่สำเร็จ (${response.status})`;
    return Array.isArray(body.errors) ? `${message}: ${body.errors.join(' · ')}` : message;
  } catch {
    return `คำขอไม่สำเร็จ (${response.status})`;
  }
}

/**
 * เรียก API แล้วคืนข้อมูลที่ parse แล้ว
 * - ตอบ 2xx → คืนข้อมูล (204 คืน null เพราะไม่มี body)
 * - ตอบ 4xx/5xx → โยน ApiError พร้อม status
 * - ต่อ API ไม่ได้เลย → โยน ApiError status 0
 */
export async function apiFetch(path, options = {}) {
  // มี token ก็แนบไปทุกคำขอ (ที่เดียว — page และ service ไม่ต้องรู้เรื่องนี้)
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('ติดต่อเซิร์ฟเวอร์ไม่ได้ — ตรวจว่าเปิด API ที่พอร์ต 3001 แล้วหรือยัง', 0);
  }

  if (!response.ok) {
    // token หมดอายุหรือใช้ไม่ได้ → ล้างทิ้ง ให้หน้าจอกลับเป็นสถานะยังไม่เข้าสู่ระบบ
    if (response.status === 401 && token) clearToken();
    throw new ApiError(await parseError(response), response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}
