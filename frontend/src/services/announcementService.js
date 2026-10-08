import { apiFetch, ApiError } from './apiClient.js';

/** Service Layer — page เรียกฟังก์ชันเหล่านี้ ไม่เรียก fetch เอง */

export { ApiError };

/** ประกาศที่เผยแพร่แล้ว (สาธารณะ) */
export async function getAnnouncements() {
  return apiFetch('/api/announcements');
}

export async function getAnnouncementById(id) {
  try {
    return await apiFetch(`/api/announcements/${encodeURIComponent(id)}`);
  } catch (error) {
    // 404 ไม่ใช่ความผิดพลาดของระบบ — แปลว่าไม่มี (หรือยังไม่เผยแพร่) ประกาศรหัสนี้
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** ทุกสถานะ — เฉพาะเจ้าหน้าที่ */
export async function getAdminAnnouncements() {
  return apiFetch('/api/admin/announcements');
}

export async function getAdminAnnouncementById(id) {
  const all = await getAdminAnnouncements();
  return all.find((a) => a.id === id) ?? null;
}

export async function createAnnouncement(input) {
  return apiFetch('/api/announcements', { method: 'POST', body: JSON.stringify(input) });
}

export async function updateAnnouncement(id, input) {
  return apiFetch(`/api/announcements/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) });
}

export async function deleteAnnouncement(id) {
  await apiFetch(`/api/announcements/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
