'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRoleBasedDashboardPath } from '@/lib/auth/redirects';

export default function StudentPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getRoleBasedDashboardPath('student'));
  }, [router]);
  return null;
}
