'use client';

import Link from 'next/link';
import { useLearningEngine } from '../../hooks/useLearningEngine';

export default function LearningHeader() {
  const { comic } = useLearningEngine();

  return (
    <header
      className="border-b border-neutral-100 bg-white shadow-sm"
      style={{ paddingTop: 'max(0px, env(safe-area-inset-top))' }}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 overflow-hidden px-3 py-3 sm:px-4 md:px-6 md:py-4 lg:px-8">
        <Link
          href="/dashboard"
          aria-label="Kembali ke dashboard"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200"
        >
          {/* Home icon */}
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-black leading-tight text-neutral-800 md:text-lg">
            {comic.title}
          </h1>
        </div>
      </div>
    </header>
  );
}
