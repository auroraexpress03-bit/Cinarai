'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardRouter() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    if (user.role === 'teacher') {
      router.replace('/dashboard/guru');
    } else if (user.role === 'admin') {
      router.replace('/dashboard/admin');
    } else {
      router.replace('/dashboard/siswa');
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-primary-500 to-primary-600">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-lg">
        🎓
      </div>
      <div className="h-10 w-10 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      <p className="text-sm font-semibold text-primary-100">Memuat dashboard...</p>
    </div>
  );
}
