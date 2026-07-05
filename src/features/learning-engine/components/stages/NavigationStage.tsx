'use client';

import { useEffect } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';

const progressSteps = [
  { label: 'Contextualization', status: '✓' },
  { label: 'Identification', status: '✓' },
  { label: 'Navigation', status: 'ACTIVE' },
  { label: 'Argumentation', status: 'LOCK' },
  { label: 'Resolution', status: 'LOCK' },
  { label: 'Application', status: 'LOCK' },
  { label: 'Introspection', status: 'LOCK' },
];

export default function NavigationStage() {
  const { comic, setCanAdvance } = useLearningEngine();

  useEffect(() => {
    setCanAdvance(true);
  }, [setCanAdvance]);

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 shadow-sm sm:px-5 sm:py-3.5 sm:text-base"
          >
            Kembali
          </button>
          <button
            type="button"
            className="flex-1 rounded-2xl bg-primary-600 px-4 py-3 text-sm font-black text-white shadow-sm sm:px-5 sm:py-3.5 sm:text-base"
          >
            Lanjut
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {progressSteps.map((step) => {
            const isActive = step.status === 'ACTIVE';
            const isDone = step.status === '✓';
            const isLocked = step.status === 'LOCK';

            return (
              <div
                key={step.label}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                <span className="text-xs">
                  {isActive ? '●' : isDone ? '✓' : isLocked ? '🔒' : '•'}
                </span>
                <span>{step.label}</span>
                <span className="text-xs font-bold uppercase tracking-wide">
                  {step.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[24px] bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-2xl text-white shadow-sm">
            🧭
          </div>
          <div>
            <h2 className="text-xl font-black text-neutral-900 sm:text-2xl">Navigasi Bangun Ruang</h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600 sm:text-base">
              Jelajahi <span className="font-black text-primary-700">{comic.lokasi}</span> melalui pengalaman interaktif yang masih dalam tahap UI placeholder.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex min-h-[260px] flex-col rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-neutral-900">Eksplorasi Bangun Ruang</h3>
            <span className="text-2xl">🧊</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Jelajahi bentuk dan karakteristik bangun ruang melalui visual sederhana.
          </p>
          <div className="mt-auto pt-4">
            <button
              type="button"
              disabled
              className="w-full rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              🧊 Lihat Model 3D
            </button>
          </div>
          <span className="mt-3 inline-flex w-fit rounded-full bg-warning-100 px-3 py-1 text-sm font-bold text-warning-700">
            Coming Soon
          </span>
        </div>

        <div className="flex min-h-[260px] flex-col rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-neutral-900">QR Model</h3>
            <span className="text-2xl">📱</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Gunakan QR untuk membuka model 3D pada perangkat lain.
          </p>
          <div className="mt-auto pt-4">
            <button
              type="button"
              disabled
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              📥 Tampilkan QR
            </button>
          </div>
          <span className="mt-3 inline-flex w-fit rounded-full bg-warning-100 px-3 py-1 text-sm font-bold text-warning-700">
            Coming Soon
          </span>
        </div>

        <div className="flex min-h-[260px] flex-col rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-neutral-900">AI Assistant</h3>
            <span className="text-2xl">🤖</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Tanyakan apa saja mengenai bangun ruang.
          </p>
          <textarea
            disabled
            placeholder="Tulis pertanyaanmu..."
            className="mt-4 min-h-[96px] w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-neutral-500 outline-none"
          />
          <div className="mt-3">
            <button
              type="button"
              disabled
              className="w-full rounded-2xl bg-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Kirim
            </button>
          </div>
          <span className="mt-3 inline-flex w-fit rounded-full bg-warning-100 px-3 py-1 text-sm font-bold text-warning-700">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}
