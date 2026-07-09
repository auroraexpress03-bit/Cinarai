'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';

export default function ResolutionStage() {
  const { comic, setCanAdvance } = useLearningEngine();
  const [misiStarted, setMisiStarted] = useState(false);

  // Cover screen: advance is locked until student presses Mulai Misi
  useEffect(() => {
    setCanAdvance(misiStarted);
  }, [misiStarted, setCanAdvance]);

  if (!misiStarted) {
    return <ResolutionCover comic={comic} onStart={() => setMisiStarted(true)} />;
  }

  // ── Placeholder: soal akan dibangun di sini ──
  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">

      {/* Stage header */}
      <header className="rounded-[24px] bg-gradient-to-br from-primary-600 to-primary-700 px-4 py-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <span className="text-lg font-black text-white">6</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70">
              Resolution
            </p>
            <h2 className="mt-0.5 text-base font-black text-white sm:text-lg">
              Misi Bangun Ruang
            </h2>
          </div>
        </div>
      </header>

      {/* Placeholder content */}
      <div className="rounded-[24px] border-2 border-dashed border-neutral-200 bg-white px-5 py-10 text-center">
        <p className="text-3xl">🚧</p>
        <p className="mt-3 text-sm font-black text-neutral-500">
          Soal misi akan ditampilkan di sini.
        </p>
      </div>

    </div>
  );
}

// ─── ResolutionCover ──────────────────────────────────────────────────────────

interface ResolutionCoverProps {
  comic: { title: string; lokasi: string; kelas: string; cover: string };
  onStart: () => void;
}

function ResolutionCover({ comic, onStart }: ResolutionCoverProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">

      {/* Hero image */}
      <div className="-mx-3 sm:mx-0">
        <div className="relative overflow-hidden sm:rounded-[24px]" style={{ aspectRatio: '16/9' }}>
          <Image
            src={comic.cover}
            alt={`Cover ${comic.title}`}
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 640px) 100vw, 672px"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-800/40 to-transparent" />

          {/* Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end px-5 pb-6 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <span className="text-3xl">🏛️</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-lg sm:text-4xl">
              RESOLUTION
            </h1>
            <p className="mt-1 text-base font-black text-secondary-300 drop-shadow sm:text-lg">
              Misi Bangun Ruang
            </p>
          </div>
        </div>
      </div>

      {/* Description card */}
      <div className="rounded-[24px] bg-white px-5 py-5 shadow-sm">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5 text-sm font-bold text-primary-700">
            📍 {comic.lokasi}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100 px-3 py-1.5 text-sm font-bold text-secondary-700">
            📚 Kelas {comic.kelas}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
          Sekarang saatnya menggunakan pengetahuanmu untuk menyelesaikan tantangan matematika
          berdasarkan bagian-bagian Candi Jawi.
        </p>
      </div>

      {/* What you will do */}
      <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h3 className="text-base font-black text-neutral-700">🎯 Yang Akan Kamu Lakukan</h3>
        </div>
        <ul className="flex flex-col gap-3 px-5 py-4">
          {[
            { emoji: '🔍', text: 'Membaca soal tantangan berdasarkan bagian Candi Jawi.' },
            { emoji: '🧮', text: 'Menghitung menggunakan rumus bangun ruang yang sudah kamu pelajari.' },
            { emoji: '✅', text: 'Menyelesaikan misi dan melanjutkan perjalanan belajarmu.' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl bg-primary-50 p-3 sm:p-4">
              <span className="flex-shrink-0 text-xl">{item.emoji}</span>
              <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onStart}
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[20px] bg-primary-600 px-6 py-4 text-base font-black text-white shadow-[0_4px_16px_rgba(24,117,204,0.35)] transition hover:bg-primary-700 active:scale-[0.98]"
      >
        <span>🚀</span>
        Mulai Misi
      </button>

    </div>
  );
}
