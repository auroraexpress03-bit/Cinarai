'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'student' | 'teacher' | 'admin';
}

function roleToDashboard(role: string): string {
  if (role === 'teacher') return '/dashboard/guru';
  if (role === 'admin') return '/dashboard/admin';
  return '/dashboard/siswa';
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRole,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/auth/login');
      return;
    }

    if (user.role !== allowedRole) {
      router.replace(roleToDashboard(user.role));
    }
  }, [allowedRole, loading, router, user]);

  if (loading || !user || user.role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
};
