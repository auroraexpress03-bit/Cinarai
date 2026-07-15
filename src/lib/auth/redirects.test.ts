import test from 'node:test';
import assert from 'node:assert/strict';
import { getRoleBasedDashboardPath } from './redirects';

test('routes teachers to the guru dashboard', () => {
  assert.equal(getRoleBasedDashboardPath('teacher'), '/dashboard/guru');
});

test('routes students to the student dashboard', () => {
  assert.equal(getRoleBasedDashboardPath('student'), '/dashboard/siswa');
});

test('routes admins to the admin dashboard root', () => {
  assert.equal(getRoleBasedDashboardPath('admin'), '/dashboard');
});
