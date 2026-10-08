import { useState } from 'react';
import { fromLocalInputValue, toLocalInputValue } from '../utils/datetime.js';

const CATEGORIES = [
  { id: 1, name: 'ทั่วไป' },
  { id: 2, name: 'ทุนการศึกษา' },
  { id: 3, name: 'กิจกรรม' },
  { id: 4, name: 'สอบ' },
  { id: 5, name: 'ฝึกงาน' },
];

const STATUS_OPTIONS = [
  ['draft', 'ฉบับร่าง'],
  ['published', 'เผยแพร่'],
  ['archived', 'เก็บเข้าคลัง'],
];

function toForm(announcement) {
  return {
    title: announcement?.title ?? '',
    body: announcement?.body ?? '',
    categoryId: announcement ? String(announcement.categoryId) : '',
    status: announcement?.status ?? 'draft',
    publishAt: toLocalInputValue(announcement?.publishAt ?? new Date().toISOString()),
  };
}

function validate(form) {
  const errors = {};
  const title = form.title.trim().length;
  const body = form.body.trim().length;
  if (title < 5 || title > 150) errors.title = 'หัวข้อต้องมี 5–150 ตัวอักษร';
  if (body < 20 || body > 5000) errors.body = 'เนื้อหาต้องมี 20–5000 ตัวอักษร';
  if (!form.categoryId) errors.categoryId = 'กรุณาเลือกหมวดหมู่';
  if (!fromLocalInputValue(form.publishAt)) errors.publishAt = 'กรุณาระบุวันเวลาเผยแพร่';
  return errors;
}

function AnnouncementForm({ initialValue = null, onSubmit, submitLabel = 'บันทึก' }) {
  const [form, setForm] = useState(() => toForm(initialValue));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFeedback('กรุณาตรวจข้อมูลที่ระบุ');
      return;
    }
    setSubmitting(true);
    setFeedback('กำลังบันทึก…');
    try {
      await onSubmit({
        title: form.title.trim(),
        body: form.body.trim(),
        categoryId: Number(form.categoryId),
        status: form.status,
        publishAt: fromLocalInputValue(form.publishAt),
      });
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'บันทึกไม่สำเร็จ');
      setSubmitting(false);
    }
  }

  const a11y = (field) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  return (
    <form data-testid="announcement-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="title">หัวข้อ</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} {...a11y('title')} />
        <small className="error" id="title-error">{errors.title ?? ''}</small>
      </div>
      <div className="field">
        <label htmlFor="body">เนื้อหา</label>
        <textarea id="body" name="body" rows="6" value={form.body} onChange={handleChange} {...a11y('body')} />
        <small className="error" id="body-error">{errors.body ?? ''}</small>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="categoryId">หมวดหมู่</label>
          <select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange} {...a11y('categoryId')}>
            <option value="">-- เลือกหมวดหมู่ --</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <small className="error" id="categoryId-error">{errors.categoryId ?? ''}</small>
        </div>
        <div className="field">
          <label htmlFor="status">สถานะ</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            {STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="publishAt">วันเวลาเผยแพร่</label>
          <input id="publishAt" name="publishAt" type="datetime-local" value={form.publishAt} onChange={handleChange} {...a11y('publishAt')} />
          <small className="error" id="publishAt-error">{errors.publishAt ?? ''}</small>
        </div>
      </div>
      <button className="button primary" type="submit" disabled={submitting}>
        {submitting ? 'กำลังบันทึก…' : submitLabel}
      </button>
      <p className="status" role="status">{feedback}</p>
    </form>
  );
}

export default AnnouncementForm;
