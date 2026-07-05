'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Stage, LEARNING_STAGES } from '../../types';
import { useLearningEngine } from '../../hooks/useLearningEngine';

export default function LearningHeader() {
  const { comic, currentStage, progress, resetProgress } = useLearningEngine();
  const visibleStages = LEARNING_STAGES.filter((stage) => stage !== Stage.Finish);
  const currentStep = visibleStages.indexOf(currentStage as (typeof visibleStages)[number]);
  const stepNumber = currentStep >= 0 ? currentStep + 1 : 1;
  const progressPct = Math.round(progress.percentage);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = useCallback(async () => {
    if (isResetting) return;
    const confirmed = window.confirm(
      'Ulang pembelajaran dari awal? Progress dan jawaban yang sudah disimpan akan dihapus.'
    );
    if (!confirmed) return;

    setIsResetting(true);
    try {
      await resetProgress();
    } finally {
      setIsResetting(false);
    }
  }, [isResetting, resetProgress]);

  return (
    <header
      className="border-b border-neutral-100 bg-white shadow-sm"
      style={{ paddingTop: 'max(0px, env(safe-area-inset-top))' }}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 overflow-hidden px-3 py-3 sm:px-4 md:px-6 md:py-4 lg:px-8">
        <Link
          href="/dashboard"
          aria-label="Kembali ke dashboard"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-black leading-tight text-neutral-800 md:text-base lg:text-lg">
            {comic.title}
          </h1>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting}
            className="flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-warning-200 bg-warning-50 px-3 text-sm font-bold text-warning-700 transition-colors hover:bg-warning-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResetting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-warning-300 border-t-warning-700" />
            ) : (
              <span className="text-base">↺</span>
            )}
            <span className="hidden sm:inline">Ulang</span>
          </button>

          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[11px] font-semibold text-neutral-500 sm:text-xs">
              {stepNumber} / {visibleStages.length}
            </span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-100 sm:w-20">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
