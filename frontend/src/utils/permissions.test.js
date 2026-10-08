import { describe, test, expect } from 'vitest';
import { canManage } from './permissions.js';

describe('canManage', () => {
  test('เจ้าหน้าที่ → true', () => {
    expect(canManage({ sub: '1', name: 'News Desk', role: 'staff' })).toBe(true);
  });
  test.each([null, undefined, {}, { role: 'viewer' }, { role: 'STAFF' }])('%j → false', (payload) => {
    expect(canManage(payload)).toBe(false);
  });
});
