'use client';

import { Card, ProgressBar, ProgressRing, Badge, Skeleton } from './ui';
import type { DashboardSummary, StudentRow } from '../types';

interface Props {
  summary: DashboardSummary;
  topStudents: StudentRow[];
  loading: boolean;
}

export function DashboardOverview({ summary, topStudents, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Completion rate card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5 flex items-center gap-5">
          <ProgressRing value={summary.completionRate} size={72} stroke={6} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Tingkat Penyelesaian
            </p>
            <p className="mt-1 text-2xl font-black text-neutral-900">{summary.completionRate}%</p>
            <p className="text-xs text-neutral-500">
              {summary.totalCompleted} dari {summary.totalStudents * summary.totalComics} modul
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-5">
          <ProgressRing value={summary.averageProgress} size={72} stroke={6} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Rata-rata Progress
            </p>
            <p className="mt-1 text-2xl font-black text-neutral-900">{summary.averageProgress}%</p>
            <p className="text-xs text-neutral-500">dari {summary.totalStudents} siswa</p>
          </div>
        </Card>
      </div>

      {/* Top students */}
      {topStudents.length > 0 && (
        <Card>
          <div className="px-5 pt-4 pb-3 border-b border-neutral-100">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Siswa Teratas
            </p>
            <h2 className="text-base font-black text-neutral-900">Progress Terbaik 🏆</h2>
          </div>
          <ul className="divide-y divide-neutral-50">
            {topStudents.slice(0, 5).map((s, i) => (
              <li key={s.uid} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-black text-primary-700">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 truncate">{s.displayName}</p>
                  <ProgressBar value={s.averageProgress} className="mt-1" />
                </div>
                <Badge color={s.averageProgress >= 80 ? 'accent' : s.averageProgress >= 50 ? 'primary' : 'warning'}>
                  {s.averageProgress}%
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
