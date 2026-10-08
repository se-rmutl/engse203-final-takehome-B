import { describe, test, expect } from 'vitest';
import { visibilityOf } from './visibility.js';

/**
 * FEAT — test สเปก (เขียนไว้ก่อนโค้ด)
 * ⚠ starter: 2 ข้อนี้ FAIL โดยตั้งใจ — ทำ visibilityOf ให้ผ่านโดยห้ามแก้ test ในไฟล์นี้
 */
const NOW = Date.parse('2026-10-20T12:00:00+07:00');

describe('FEAT · visibilityOf', () => {
  test('ฉบับร่าง → draft · เก็บเข้าคลัง → archived (ไม่สนเวลาเผยแพร่)', () => {
    expect(visibilityOf({ status: 'draft', publishAt: '2026-01-01T09:00:00+07:00' }, NOW)).toBe('draft');
    expect(visibilityOf({ status: 'archived', publishAt: '2026-01-01T09:00:00+07:00' }, NOW)).toBe('archived');
  });

  test('published ที่ยังไม่ถึงเวลา → scheduled · ถึงเวลาแล้ว → live', () => {
    expect(visibilityOf({ status: 'published', publishAt: '2027-12-31T09:00:00+07:00' }, NOW)).toBe('scheduled');
    expect(visibilityOf({ status: 'published', publishAt: '2026-08-03T09:00:00+07:00' }, NOW)).toBe('live');
  });
});
