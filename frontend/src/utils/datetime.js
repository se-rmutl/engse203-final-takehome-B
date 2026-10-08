/** แปลงวันเวลาไปมาระหว่าง API (ISO 8601) กับหน้าจอ */

const pad = (n) => String(n).padStart(2, '0');

/** ISO → ข้อความภาษาไทย เช่น "3 ส.ค. 2569 09:00" */
export function formatDateTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });
}

/** ISO → ค่าของ <input type="datetime-local"> (เวลาท้องถิ่นของเครื่อง) */
export function toLocalInputValue(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** ค่าของ <input type="datetime-local"> → ISO พร้อมเขตเวลา (Z) ที่ API รับได้ */
export function fromLocalInputValue(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}
