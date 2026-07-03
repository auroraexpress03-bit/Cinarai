'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const LearningJourney = dynamic(() => import('@/components/dashboard/LearningJourney'), {
  ssr: false,
  loading: () => (
    <section className="rounded-base border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <div className="h-4 w-28 rounded bg-neutral-200 animate-pulse" />
        <div className="mt-2 h-6 w-40 rounded bg-neutral-200 animate-pulse" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-neutral-200 animate-pulse flex-shrink-0" />
            <div className="flex-1 h-24 rounded-base bg-neutral-200 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  ),
});

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-neutral-50 px-4 py-5 text-neutral-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Selamat datang,</p>
              <h1 className="text-xl font-bold text-neutral-950">
                {user?.displayName ?? user?.email ?? 'Siswa'}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 shadow-sm hover:bg-neutral-50"
            >
              Keluar
            </button>
          </div>

          <LearningJourney />
        </div>
      </main>
    </ProtectedRoute>
  );
}
