import { describe, test, expect } from 'vitest';
import { decodeTokenPayload, isTokenExpired } from './token.js';

// สร้าง token รูปแบบเดียวกับ JWT (ไม่ต้องมีลายเซ็นจริง เพราะฝั่งเบราว์เซอร์ไม่ได้ตรวจลายเซ็น)
const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const fakeToken = (payload) => `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;

describe('decodeTokenPayload', () => {
  test('อ่าน sub · name · role จาก payload ได้', () => {
    const payload = { sub: '1', name: 'News Desk', role: 'staff', iat: 1760000000 };
    expect(decodeTokenPayload(fakeToken(payload))).toEqual(payload);
  });
  test('token เสีย → null (ไม่พัง)', () => {
    expect(decodeTokenPayload('not-a-token')).toBeNull();
  });
});

describe('isTokenExpired', () => {
  const now = 1_700_000_000_000;
  test('ยังไม่หมดอายุ → false', () => {
    expect(isTokenExpired({ exp: now / 1000 + 60 }, now)).toBe(false);
  });
  test('หมดอายุแล้ว → true', () => {
    expect(isTokenExpired({ exp: now / 1000 - 1 }, now)).toBe(true);
  });
  test('หมดอายุพอดีวินาทีนี้ → true', () => {
    expect(isTokenExpired({ exp: now / 1000 }, now)).toBe(true);
  });
});
