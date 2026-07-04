'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';
import { Stage, LEARNING_STAGES } from '../../types';

const PdfReader = dynamic(() => import('@/components/comic/PdfReader'), { ssr: false });

const STAGE_LABELS: Record<Stage, string> = {
  [Stage.Cover]:             '📖 Cover',
  [Stage.Contextualization]: '📚 Baca Komik',
  [Stage.Identification]:    '🔍 Identifikasi',
  [Stage.Navigation]:        '🧭 Navigasi',
  [Stage.Argumentation]:     '💬 Argumentasi',
  [Stage.Resolution]:        '💡 Resolusi',
  [Stage.Application]:       '🎯 Penerapan',
  [Stage.Introspection]:     '🪞 Refleksi',
  [Stage.Finish]:            '🏆 Selesai',
};

const VISIBLE_STAGES = LEARNING_STAGES.filter((s) => s !== Stage.Finish);

export default function ContextualizationStage() {
  const { comic, progress, setCanAdvance, completeAndAdvance, isSaving } = useLearningEngine();

  const alreadyCompleted = progress.sintaksList.some(
    (s) => s.sintaks === 'Contextualization' && s.status === 'COMPLETED'
  );

  useEffect(() => {
    setCanAdvance(alreadyCompleted);
    return () => setCanAdvance(true);
  }, [alreadyCompleted, setCanAdvance]);

  const handlePdfComplete = useCallback(async () => {
    await completeAndAdvance('Contextualization');
  }, [completeAndAdvance]);

  // Progress bar values
  const visibleIndex = VISIBLE_STAGES.indexOf(Stage.Contextualization);
  const stageNumber = visibleIndex + 1;
  const totalVisible = VISIBLE_STAGES.length;
  const progressPct = Math.round((stageNumber / totalVisible) * 100);

  return (
    <div
      className="flex flex-col bg-[#f0f7ff]"
      style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Header putih — identik dengan LearningHeader */}
      <header
        className="flex-shrink-0 flex items-center gap-3 bg-white border-b border-neutral-100 px-3 py-2.5 sm:px-6 sm:py-3 shadow-sm"
        style={{ paddingTop: 'max(0.625rem, env(safe-area-inset-top))' }}
      >
        <Link
          href="/dashboard"
          aria-label="Kembali ke dashboard"
          className="flex items-center justify-center h-9 w-9 flex-shrink-0 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-neutral-400 truncate">
            Kelas {comic.kelas} · {comic.lokasi}
          </p>
          <h1 className="text-sm font-black text-neutral-800 truncate sm:text-base leading-tight">
            {comic.title}
          </h1>
        </div>
      </header>

      {/* Progress bar — identik dengan LearningProgress */}
      <div className="flex-shrink-0 bg-white border-b border-neutral-100 px-4 py-2 sm:px-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-bold text-neutral-700 truncate">
            {STAGE_LABELS[Stage.Contextualization]}
          </span>
          <span className="text-xs font-semibold text-neutral-400 ml-2 flex-shrink-0">
            {stageNumber}/{totalVisible}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={stageNumber}
            aria-valuemin={1}
            aria-valuemax={totalVisible}
          />
        </div>
      </div>

      {/* PDF Reader — mengisi sisa layar */}
      {!comic.pdfPath ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <span className="text-5xl">📄</span>
          <p className="text-base font-bold text-neutral-700">PDF belum tersedia</p>
          <p className="text-sm text-neutral-400">Komik ini belum memiliki file PDF.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <PdfReader
            pdfPath={comic.pdfPath}
            onComplete={handlePdfComplete}
            showCompleteButton={!alreadyCompleted}
            completeButtonLabel="Saya Sudah Membaca ✅"
            completeButtonDisabled={isSaving}
          />
        </div>
      )}
    </div>
  );
}
