import { describe, test, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../../src/utils/password.js';

// hash ของ "news1234" ที่อยู่ใน schema.sql (บัญชี news@eng.rmutl.ac.th) — โค้ดเราต้องตรวจ hash นี้ผ่าน
const SEED_HASH = 'scrypt$6136b7555d8c71f9345099a546ebf4f0$121fd74a7e54170a43c12bd4220a0cffda0e29c182f05af32cc043c922d94c5204af779034374de9aa69091a694bd27d59b49508547fcd10ca403795ea3abce2';

describe('hashPassword', () => {
  test('รูปแบบ scrypt$salt$hash', () => {
    expect(hashPassword('secret-1')).toMatch(/^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
  });
  test('รหัสผ่านเดียวกัน hash 2 ครั้ง ได้ไม่เหมือนกัน (salt สุ่ม)', () => {
    expect(hashPassword('secret-1')).not.toBe(hashPassword('secret-1'));
  });
});

describe('verifyPassword', () => {
  test('รหัสผ่านถูก → true · ผิด → false', () => {
    const stored = hashPassword('secret-1');
    expect(verifyPassword('secret-1', stored)).toBe(true);
    expect(verifyPassword('secret-2', stored)).toBe(false);
  });
  test('ตรวจ hash ของบัญชีเจ้าหน้าที่ใน schema.sql ได้', () => {
    expect(verifyPassword('news1234', SEED_HASH)).toBe(true);
  });
  test.each([undefined, '', 'plain-text', 'md5$abc$def'])('hash ผิดรูปแบบ %j → false (ไม่พัง)', (stored) => {
    expect(verifyPassword('news1234', stored)).toBe(false);
  });
});
