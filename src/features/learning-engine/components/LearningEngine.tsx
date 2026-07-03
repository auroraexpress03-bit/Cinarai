'use client';

import type { Comic } from '@/types/comic';
import { LearningEngineProvider } from '../context/LearningEngineContext';
import LearningLayout from './layout/LearningLayout';
import StageRouter from './StageRouter';
import { useLearningEngine } from '../hooks/useLearningEngine';

function LearningEngineInner() {
  const { isLoading, isFinished } = useLearningEngine();

  if (isLoading) {
    return <LearningPageSkeleton />;
  }

  // FinishStage renders full-screen without layout
  if (isFinished) {
    return <StageRouter />;
  }

  return (
    <LearningLayout>
      <StageRouter />
    </LearningLayout>
  );
}

interface LearningEngineProps {
  comic: Comic;
}

export default function LearningEngine({ comic }: LearningEngineProps) {
  return (
    <LearningEngineProvider comic={comic}>
      <LearningEngineInner />
    </LearningEngineProvider>
  );
}

// ── Loading skeleton that mirrors the real chrome ─────────────────────────────

export function LearningPageSkeleton() {
  return (
    <div className="flex flex-col bg-[#f0f7ff]" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 px-3 py-2.5">
        <div className="h-9 w-9 rounded-xl bg-white/20 flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2.5 w-24 rounded-full bg-white/30" />
          <div className="h-3.5 w-40 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-neutral-100 px-4 py-2">
        <div className="flex justify-between mb-1">
          <div className="h-2.5 w-24 rounded-full skeleton" />
          <div className="h-2.5 w-12 rounded-full skeleton" />
        </div>
        <div className="h-1 w-full rounded-full bg-neutral-100" />
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100 px-3 py-2 flex gap-1.5 overflow-hidden">
        {[80, 64, 88, 72, 68, 80, 64, 72].map((w, i) => (
          <div key={i} className="h-6 rounded-full skeleton flex-shrink-0" style={{ width: w }} />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-3 space-y-3 overflow-hidden">
        {/* Cover image placeholder */}
        <div className="-mx-3 h-56 skeleton" />
        <div className="h-5 w-3/4 rounded-full skeleton" />
        <div className="h-3.5 w-1/2 rounded-full skeleton" />
        <div className="flex gap-2 mt-1">
          {[72, 64, 80].map((w, i) => (
            <div key={i} className="h-6 rounded-full skeleton" style={{ width: w }} />
          ))}
        </div>
        <div className="rounded-2xl bg-white shadow-sm p-4 space-y-2.5">
          {[100, 90, 95, 85].map((w, i) => (
            <div key={i} className="h-3 rounded-full skeleton" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t border-neutral-200 px-3 pt-2.5 pb-3 flex gap-2">
        <div className="h-11 w-24 rounded-xl skeleton" />
        <div className="h-11 flex-1 rounded-xl skeleton" />
      </div>
    </div>
  );
}
