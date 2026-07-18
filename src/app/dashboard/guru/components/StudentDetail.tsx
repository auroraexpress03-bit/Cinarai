'use client';

import { Card, ProgressBar, ProgressRing, Badge, Skeleton } from './ui';
import type { ComicDocument, ComicProgressDocument } from '@/types/firestore';
import type { AiInsight } from '../types';

interface ComicEntry {
  comic: ComicDocument;
  progress: ComicProgressDocument | null;
}

interface Props {
  uid: string;
  displayName: string;
  email: string;
  schoolName: string;
  gradeLevel: number | null;
  isActive: boolean;
  comicProgress: ComicEntry[];
  reflections: unknown[];
  activities: unknown[];
  insight: AiInsight | null;
  insightLoading: boolean;
  insightError: string | null;
  loading: boolean;
  onBack: () => void;
  onGenerateInsight: () => void;
  onGeneratePdf: () => void;
}

export function StudentDetail({
  displayName,
  email,
  schoolName,
  gradeLevel,
  isActive,
  comicProgress,
  reflections,
  activities,
  insight,
  insightLoading,
  insightError,
  loading,
  onBack,
  onGenerateInsight,
  onGeneratePdf,
}: Props) {
  const avgProgress =
    comicProgress.length > 0
      ? Math.round(
          comicProgress.reduce((s, e) => s + (e.progress?.percentage ?? 0), 0) /
            comicProgress.length
        )
      : 0;

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Back + actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm border border-neutral-200 hover:bg-neutral-50 transition-colors"
        >
          ← Kembali
        </button>
        <button
          onClick={onGeneratePdf}
          className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
        >
          📄 Unduh PDF
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Identity */}
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-2xl font-black text-primary-700">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black text-neutral-900 truncate">{displayName}</h2>
                <p className="text-sm text-neutral-500 truncate">{email}</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <Badge color="primary">{schoolName}</Badge>
                  {gradeLevel && <Badge color="secondary">Kelas {gradeLevel}</Badge>}
                  <Badge color={isActive ? 'accent' : 'error'}>
                    {isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
              </div>
              <ProgressRing value={avgProgress} size={64} stroke={5} className="flex-shrink-0" />
            </div>
          </Card>

          {/* Comic progress */}
          <Card>
            <div className="px-5 pt-4 pb-3 border-b border-neutral-100">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Progress</p>
              <h3 className="text-base font-black text-neutral-900">Semua Komik 📚</h3>
            </div>
            <ul className="divide-y divide-neutral-50">
              {comicProgress.map(({ comic, progress }) => (
                <li key={comic.comicId} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <p className="text-sm font-semibold text-neutral-800 truncate flex-1">
                      {comic.title}
                    </p>
                    <Badge
                      color={
                        !progress
                          ? 'error'
                          : progress.status === 'completed'
                          ? 'accent'
                          : 'primary'
                      }
                    >
                      {!progress
                        ? 'Belum mulai'
                        : progress.status === 'completed'
                        ? 'Selesai'
                        : `${progress.percentage ?? 0}%`}
                    </Badge>
                  </div>
                  <ProgressBar value={progress?.percentage ?? 0} />
                  {progress && (
                    <p className="mt-1 text-xs text-neutral-400">
                      Tahap terakhir: {progress.completedStage || '—'}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard emoji="📝" label="Refleksi" value={String(reflections.length)} />
            <StatCard emoji="⚡" label="Aktivitas" value={String(activities.length)} />
            <StatCard
              emoji="✅"
              label="Komik Selesai"
              value={String(comicProgress.filter((e) => e.progress?.status === 'completed').length)}
            />
          </div>

          {/* AI Insight */}
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  AI Assistant
                </p>
                <h3 className="text-base font-black text-neutral-900">Analisis Siswa 🤖</h3>
              </div>
              {!insight && (
                <button
                  onClick={onGenerateInsight}
                  disabled={insightLoading}
                  className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60 transition-colors"
                >
                  {insightLoading ? 'Menganalisis…' : 'Analisis'}
                </button>
              )}
            </div>

            {insightError && (
              <p className="text-sm text-error-600 bg-error-50 rounded-xl px-4 py-3">{insightError}</p>
            )}

            {insightLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
            )}

            {insight && !insightLoading && (
              <div className="space-y-3 text-sm">
                <InsightRow label="Kemampuan" value={insight.capabilitySummary} />
                <InsightRow label="Tahap Terbaik" value={insight.bestStage} />
                <InsightRow label="Tahap Terlemah" value={insight.weakestStage} />
                <InsightRow label="Pola Kesalahan" value={insight.errorPattern} />
                <InsightRow label="Rekomendasi" value={insight.teacherRecommendation} />
                <InsightRow label="Remedial" value={insight.remedial} />
                <InsightRow label="Pengayaan" value={insight.enrichment} />
                {insight.provider && (
                  <p className="text-xs text-neutral-400 pt-1">Provider: {insight.provider}</p>
                )}
              </div>
            )}

            {!insight && !insightLoading && !insightError && (
              <p className="text-sm text-neutral-400">
                Klik &ldquo;Analisis&rdquo; untuk mendapatkan insight AI tentang perkembangan siswa ini.
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="text-lg font-black text-neutral-900">{value}</p>
        <p className="text-xs text-neutral-500">{label}</p>
      </div>
    </Card>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 px-4 py-3">
      <p className="text-xs font-bold text-neutral-500 mb-0.5">{label}</p>
      <p className="text-sm text-neutral-800 leading-relaxed">{value}</p>
    </div>
  );
}
