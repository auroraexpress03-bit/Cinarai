'use client';

import { useMemo } from 'react';
import { useGuruDashboard } from '../hooks/useGuruDashboard';
import { TeacherDashboardLayout } from './TeacherDashboardLayout';
import { TeacherHeader } from './TeacherHeader';
import { TeacherModuleCards } from './TeacherModuleCards';
import { TeacherProgressOverview } from './TeacherProgressOverview';
import { TeacherRecentActivity } from './TeacherRecentActivity';
import { TeacherSidebar } from './TeacherSidebar';
import { TeacherStatCards } from './TeacherStatCards';
import {
  guruActivities,
  guruDashboardStats,
  guruModules,
  guruProgressItems,
} from '../helpers/guruDashboardData';

export default function GuruDashboardContent() {
  const { summary, comicProgress, stageProgress, recentActivities, loading, error } = useGuruDashboard();

  const statCards = useMemo(() => {
    if (summary) {
      return [
        { title: 'Siswa Aktif', value: `${summary.activeStudents}`, icon: 'people' as const, accent: 'bg-primary-50 text-primary-700' },
        { title: 'Kelas Dibimbing', value: `${summary.totalTeachers}`, icon: 'school' as const, accent: 'bg-secondary-50 text-secondary-700' },
        { title: 'Selesai 1+ Komik', value: `${summary.studentsWithAnyCompletedComic}`, icon: 'menuBook' as const, accent: 'bg-amber-50 text-amber-700' },
        { title: 'Selesai Semua', value: `${summary.studentsCompletedAllComics}`, icon: 'trendingUp' as const, accent: 'bg-emerald-50 text-emerald-700' },
      ];
    }

    return guruDashboardStats;
  }, [summary]);

  const progressItems = useMemo(() => {
    if (comicProgress.length > 0) {
      return comicProgress.slice(0, 3).map((entry) => ({ label: entry.label, value: entry.percentage }));
    }

    return guruProgressItems;
  }, [comicProgress]);

  const moduleItems = useMemo(() => {
    if (stageProgress.length > 0) {
      return [
        {
          title: 'Pemahaman Komik',
          description: 'Menyusun pemahaman naratif berdasarkan visual dan alur.',
          completed: Math.max(40, summary?.studentsWithAnyCompletedComic ?? 40),
          progress: Math.max(65, stageProgress[0]?.percentage ?? 65),
          badge: 'Prioritas',
        },
        {
          title: 'Refleksi Belajar',
          description: 'Mendorong siswa mengekspresikan pemahaman lewat observasi.',
          completed: Math.max(24, summary?.studentsCompletedAllComics ?? 24),
          progress: Math.max(58, stageProgress[1]?.percentage ?? 58),
          badge: 'Baru',
        },
      ];
    }

    return guruModules;
  }, [stageProgress, summary]);

  const activityItems = useMemo(() => {
    if (recentActivities.length > 0) {
      return recentActivities.slice(0, 3).map((entry) => ({
        title: entry.title,
        time: entry.occurredAt instanceof Date ? entry.occurredAt.toLocaleDateString('id-ID') : 'Baru',
        detail: entry.description ?? `${entry.studentName} menerima update terbaru.`,
      }));
    }

    return guruActivities;
  }, [recentActivities]);

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
      <TeacherDashboardLayout
        header={<TeacherHeader />}
        sidebar={<TeacherSidebar />}
      >
        <div className="space-y-6">
          {error && (
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              Menggunakan tampilan contoh sementara karena data real-time belum tersedia.
            </div>
          )}

          <TeacherStatCards stats={statCards} />

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <TeacherProgressOverview items={progressItems} />
            <div className="space-y-6">
              <TeacherModuleCards modules={moduleItems} />
              <TeacherRecentActivity activities={activityItems} />
            </div>
          </div>

          <div className="rounded-[28px] border border-neutral-100 bg-white p-5 shadow-sm shadow-neutral-200/70 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-500">Fokus Hari Ini</p>
                <h2 className="mt-1 text-xl font-black text-neutral-900">Pantau perkembangan kelas dengan lebih cepat</h2>
              </div>
              <div className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
                {loading ? 'Memuat…' : 'Siap dipantau'}
              </div>
            </div>
          </div>
        </div>
      </TeacherDashboardLayout>
    </div>
  );
}
