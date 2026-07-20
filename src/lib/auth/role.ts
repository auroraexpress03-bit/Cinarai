import type { UserRole } from '@/types/firestore';

export const allowedRoles = new Set<UserRole>(['student', 'teacher', 'admin']);

export function isAllowedUserRole(role: unknown): role is UserRole {
  return typeof role === 'string' && allowedRoles.has(role as UserRole);
}

export function resolveUserRoleFromProfileAndClaims(
  profileRole: unknown,
  claimsRole: unknown
): UserRole | null {
  const fromProfile = typeof profileRole === 'string' ? profileRole : null;
  const fromClaims = typeof claimsRole === 'string' ? claimsRole : null;

  const candidate = fromProfile ?? fromClaims;

  if (candidate && allowedRoles.has(candidate as UserRole)) {
    return candidate as UserRole;
  }

  return null;
}
