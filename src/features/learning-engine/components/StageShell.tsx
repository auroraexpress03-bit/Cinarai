'use client';

import React from 'react';
import type { LearningStage } from '../types';

interface StageShellProps {
  stage: LearningStage;
  onComplete: () => Promise<void>;
  isCompleting?: boolean;
  children: React.ReactNode;
}

export function StageShell({ stage, onComplete, isCompleting = false, children }: StageShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Stage header */}
      <div className="px-4 py-4 bg-white border-b border-neutral-200 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
          {stage}
        </p>
      </div>

      {/* Stage content */}
      <div className="flex-1 px-4 py-6 sm:px-6">
        {children}
      </div>

      {/* Footer action */}
      <div className="px-4 py-4 bg-white border-t border-neutral-200 sm:px-6">
        <button
          onClick={onComplete}
          disabled={isCompleting}
          className="w-full rounded-xl bg-primary-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
        >
          {isCompleting ? 'Menyimpan...' : 'Lanjut'}
        </button>
      </div>
    </div>
  );
}
