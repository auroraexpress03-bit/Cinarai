import type { UserRole } from '@/types/firestore';

export const getRoleBasedDashboardPath = (role?: UserRole | null): string => {
  switch (role) {
    case 'teacher':
      return '/teacher/dashboard';
    case 'admin':
      return '/dashboard';
    case 'student':
    default:
      return '/dashboard/siswa';
  }
};
