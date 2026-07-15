import type { UserRole } from '@/types/firestore';

export const getRoleBasedDashboardPath = (role?: UserRole | null): string => {
  switch (role) {
    case 'teacher':
      return '/dashboard/guru';
    case 'admin':
      return '/dashboard';
    case 'student':
    default:
      return '/dashboard/siswa';
  }
};
