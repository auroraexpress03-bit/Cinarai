'use client';

import Image from 'next/image';
import { useLearningEngine } from '../../hooks/useLearningEngine';

export default function CoverStage() {
  const { comic } = useLearningEngine();

  const hours = Math.floor(comic.estimatedMinutes / 60);
  const minutes = comic.estimatedMinutes % 60;
  const estimasiLabel = hours > 0
    ? `${hours} jam ${minutes > 0 ? `${minutes} menit` : ''}`.trim()
    : `${minutes} menit`;

  return (
    <div className="flex flex-col gap-3 animate-fade-in-up">
      {/* Cover Image — full-width bleed on mobile, rounded on sm+ */}
      <div className="-mx-3 sm:mx-0">
        <div className="relative w-full aspect-[3/4] sm:rounded-3xl overflow-hidden shadow-md bg-neutral-200">
          <Image
            src={comic.cover}
            alt={`Cover ${comic.title}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, 672px"
          />
        </div>
      </div>

      {/* Judul & Subjudul */}
      <div className="px-0">
        <h2 className="text-xl font-black text-neutral-950 sm:text-2xl leading-snug">
          {comic.title}
        </h2>
        <p className="mt-1 text-base text-neutral-500 leading-relaxed">{comic.subtitle}</p>
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-[11px] font-semibold text-primary-700">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {comic.lokasi}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-semibold text-secondary-700">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Kelas {comic.kelas}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {estimasiLabel}
        </span>
      </div>

      {/* Target Pembelajaran */}
      <section className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-100">
          <h3 className="text-sm font-black text-neutral-700">
            🎯 Yang Akan Kamu Pelajari
          </h3>
        </div>
        <ul className="px-3 py-2.5 flex flex-col gap-1.5">
          {comic.learningTargets.map((target, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-black text-primary-700 mt-0.5">
                {i + 1}
              </span>
              <p className="text-base text-neutral-700 leading-relaxed">{target}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
