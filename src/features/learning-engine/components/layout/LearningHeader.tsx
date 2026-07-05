'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';

export default function LearningHeader() {
  const { comic, resetProgress, isSaving } = useLearningEngine();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsConfirmOpen(false);
    setIsResetting(true);
    try {
      await resetProgress();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <header
      className="bg-white border-b border-neutral-100 shadow-sm"
      style={{ paddingTop: 'max(0px, env(safe-area-inset-top))' }}
    >
      <div className="mx-auto w-full max-w-[1400px] flex items-center gap-3 px-3 py-2.5 md:px-6 md:py-3 lg:px-8 overflow-hidden">
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
          <p className="text-xs md:text-xs font-semibold text-neutral-400 truncate">
            Kelas {comic.kelas} · {comic.lokasi}
          </p>
          <h1 className="text-sm md:text-base lg:text-lg font-black text-neutral-800 truncate leading-tight">
            {comic.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            disabled={isResetting || isSaving}
            className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1.5 text-[11px] font-semibold text-primary-700 transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResetting ? 'Memproses...' : '🔄 Ulangi Pembelajaran'}
          </button>

          {/* Desktop: show subtitle */}
          <p className="hidden lg:block text-sm text-neutral-400 truncate max-w-xs xl:max-w-sm">
            {comic.subtitle}
          </p>
        </div>
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl">
            <p className="text-base font-black text-neutral-900">
              Apakah kamu yakin ingin mengulang pembelajaran?
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              Semua jawaban pada komik ini akan dihapus.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-full border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full bg-primary-600 px-3 py-2 text-sm font-semibold text-white"
              >
                Ya, Ulangi
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
