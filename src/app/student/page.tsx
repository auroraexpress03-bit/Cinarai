'use client';

import DashboardPage from '@/app/dashboard/page';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

export default function StudentPage() {
  return (
    <RoleProtectedRoute allowedRole="student">
      <DashboardPage />
    </RoleProtectedRoute>
  );
}
