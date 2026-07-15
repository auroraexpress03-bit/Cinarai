'use client';

import { useMemo } from 'react';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';
import { TeacherDashboardLayout } from './TeacherDashboardLayout';
import { TeacherHeader } from './TeacherHeader';
import { TeacherModuleCards } from './TeacherModuleCards';
import { TeacherProgressOverview } from './TeacherProgressOverview';
import { TeacherRecentActivity } from './TeacherRecentActivity';
import { TeacherSidebar } from './TeacherSidebar';
import { TeacherStatCards } from './TeacherStatCards';

export default function GuruDashboardContent() {
  const { summary, progressItems, modules, recentActivities, loading, error } = useTeacherDashboard();

  const statCards = useMemo(() => {
    if (!summary) {
      return [
        { title: 'Jumlah Siswa', value: '0', icon: 'people' as const, accent: 'bg-primary-50 text-primary-700' },
        { title: 'Siswa Aktif', value: '0', icon: 'school' as const, accent: 'bg-secondary-50 text-secondary-700' },
        { title: 'Modul Pembelajaran', value: '0', icon: 'menuBook' as const, accent: 'bg-amber-50 text-amber-700' },
        { title: 'Rata-rata Progress', value: '0%', icon: 'trendingUp' as const, accent: 'bg-emerald-50 text-emerald-700' },
      ];
    }

    return [
      { title: 'Jumlah Siswa', value: `${summary.totalStudents}`, icon: 'people' as const, accent: 'bg-primary-50 text-primary-700' },
      { title: 'Siswa Aktif', value: `${summary.activeStudents}`, icon: 'school' as const, accent: 'bg-secondary-50 text-secondary-700' },
      { title: 'Modul Pembelajaran', value: `${summary.totalModules}`, icon: 'menuBook' as const, accent: 'bg-amber-50 text-amber-700' },
      { title: 'Rata-rata Progress', value: `${summary.averageProgress}%`, icon: 'trendingUp' as const, accent: 'bg-emerald-50 text-emerald-700' },
    ];
  }, [summary]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
        <TeacherDashboardLayout header={<TeacherHeader />} sidebar={<TeacherSidebar />}>
          <div className="rounded-[28px] border border-neutral-100 bg-white p-6 shadow-sm shadow-neutral-200/70">
            <p className="text-lg font-black text-neutral-900">Memuat data Dashboard Guru…</p>
            <p className="mt-2 text-sm text-neutral-600">Sedang mengambil statistik kelas dan aktivitas siswa dari Firestore.</p>
          </div>
        </TeacherDashboardLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
        <TeacherDashboardLayout header={<TeacherHeader />} sidebar={<TeacherSidebar />}>
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 shadow-sm shadow-rose-200/70">
            <p className="text-lg font-black text-rose-900">Gagal memuat Dashboard Guru</p>
            <p className="mt-2 text-sm text-rose-700">{error}</p>
          </div>
        </TeacherDashboardLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
      <TeacherDashboardLayout header={<TeacherHeader />} sidebar={<TeacherSidebar />}>
        <div className="space-y-6">
          <TeacherStatCards stats={statCards} />

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <TeacherProgressOverview items={progressItems} />
            <div className="space-y-6">
              <TeacherModuleCards modules={modules} />
              <TeacherRecentActivity activities={recentActivities} />
            </div>
          </div>

          <div className="rounded-[28px] border border-neutral-100 bg-white p-5 shadow-sm shadow-neutral-200/70 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-500">Fokus Hari Ini</p>
                <h2 className="mt-1 text-xl font-black text-neutral-900">Pantau perkembangan kelas dengan lebih cepat</h2>
              </div>
              <div className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">Siap dipantau</div>
            </div>
          </div>
        </div>
      </TeacherDashboardLayout>
    </div>
  );
}
