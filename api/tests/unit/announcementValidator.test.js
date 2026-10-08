import { describe, test, expect } from 'vitest';
import { validateAnnouncementInput, isIsoDateTime } from '../../src/validators/announcementValidator.js';

/** Unit test — ทดสอบ pure function โดยตรง ไม่ต้องเปิด server ไม่ต้องมีฐานข้อมูล */
const valid = {
  title: 'ประกาศทดสอบระบบ',
  body: 'เนื้อหาประกาศทดสอบที่ยาวเกินยี่สิบตัวอักษร',
  categoryId: 1,
  status: 'published',
  publishAt: '2026-09-01T09:00:00+07:00',
};
const withField = (patch) => ({ ...valid, ...patch });

describe('validateAnnouncementInput', () => {
  test('ทุกช่องถูกต้อง → ไม่มี error', () => {
    expect(validateAnnouncementInput(valid)).toEqual([]);
  });
  test('หัวข้อ 4 ตัวอักษร → error · 5 ตัวอักษร → ผ่าน (ค่าขอบ)', () => {
    expect(validateAnnouncementInput(withField({ title: 'กขคง' }))).toHaveLength(1);
    expect(validateAnnouncementInput(withField({ title: 'กขคงจ' }))).toEqual([]);
  });
  test('หัวข้อ 151 ตัวอักษร → error', () => {
    expect(validateAnnouncementInput(withField({ title: 'ก'.repeat(151) }))).toHaveLength(1);
  });
  test('เนื้อหา 19 ตัวอักษร → error · 20 ตัวอักษร → ผ่าน (ค่าขอบ)', () => {
    expect(validateAnnouncementInput(withField({ body: 'ก'.repeat(19) }))).toHaveLength(1);
    expect(validateAnnouncementInput(withField({ body: 'ก'.repeat(20) }))).toEqual([]);
  });
  test.each(['1', 0, -2, 1.5, null])('categoryId = %j → error', (categoryId) => {
    expect(validateAnnouncementInput(withField({ categoryId }))).toHaveLength(1);
  });
  test.each(['draft', 'published', 'archived'])('status "%s" → ผ่าน', (status) => {
    expect(validateAnnouncementInput(withField({ status }))).toEqual([]);
  });
  test('status "deleted" → error', () => {
    expect(validateAnnouncementInput(withField({ status: 'deleted' }))).toHaveLength(1);
  });
  test.each([null, undefined, 'text', 42, []])('input = %j → error เดียว', (input) => {
    expect(validateAnnouncementInput(input)).toEqual(['ต้องส่งข้อมูลประกาศมาด้วย']);
  });
  test('ผิดทุกช่อง → ได้ error ครบ 5 ข้อ', () => {
    expect(validateAnnouncementInput({})).toHaveLength(5);
  });
});

describe('isIsoDateTime', () => {
  test.each(['2026-10-08T09:00:00+07:00', '2026-10-08T02:00:00.000Z', '2026-10-08T09:00+07:00'])('"%s" → true', (v) => {
    expect(isIsoDateTime(v)).toBe(true);
  });
  test.each(['2026-10-08', '2026-10-08T09:00:00', '8/10/2026 09:00', '', 20261008])('%j → false', (v) => {
    expect(isIsoDateTime(v)).toBe(false);
  });
});
