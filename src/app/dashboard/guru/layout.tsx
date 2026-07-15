import type { ReactNode } from 'react';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

export default function GuruDashboardLayout({ children }: { children: ReactNode }) {
  return <RoleProtectedRoute allowedRole="teacher">{children}</RoleProtectedRoute>;
}
