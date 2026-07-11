'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { renderPdfPageToBlobUrl } from '@/lib/comic-image';
import type { IdentificationItem } from '../types';
import { useIdentificationContext } from '../context/IdentificationContext';
import IdentificationOptionGrid from './IdentificationOptionGrid';
import IdentificationFeedback from './IdentificationFeedback';

interface IdentificationQuestionProps {
  item: IdentificationItem;
  isChecked: boolean;
  onCheck?: () => void;
}

export default function IdentificationQuestion({
  item,
  isChecked,
  onCheck,
}: IdentificationQuestionProps) {
  const { selectOption, state } = useIdentificationContext();
  const [imgError, setImgError] = useState(false);
  const [renderedImageSrc, setRenderedImageSrc] = useState<string | null>(null);

  const hasSelection = item.selectedOptionId !== null;
  const isCorrect = item.selectedOptionId === item.correctOptionId;
  const selectedOption = item.options.find((o) => o.id === item.selectedOptionId) ?? null;
  const correctOption = item.options.find((o) => o.id === item.correctOptionId) ?? null;
  const totalItems = state.items.length;
  const effectiveImageSrc = renderedImageSrc ?? item.image;
  const hasImage = Boolean(effectiveImageSrc) && !imgError;

  useEffect(() => {
    let isActive = true;

    async function tryRenderPdfPage() {
      if (!item.sourcePdfPath || !item.sourcePage || renderedImageSrc) return;
      try {
        const blobUrl = await renderPdfPageToBlobUrl(item.sourcePdfPath, item.sourcePage);
        if (isActive) setRenderedImageSrc(blobUrl);
      } catch {
        if (isActive) setImgError(false);
      }
    }

    void tryRenderPdfPage();

    return () => {
      isActive = false;
    };
  }, [item.sourcePdfPath, item.sourcePage, renderedImageSrc]);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-lg shadow-neutral-100 sm:p-6">

      {/* ── Gambar objek ── */}
      <figure
        className="overflow-hidden rounded-2xl border border-neutral-100"
        aria-label={`Gambar soal ${item.targetIndex + 1}: ${item.imageAlt}`}
      >
        <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
          {hasImage ? (
            <>
              {/* Foto asli — 100% tajam, tanpa blur, tanpa overlay putih */}
              <Image
                src={effectiveImageSrc}
                alt={item.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                priority={item.targetIndex === 0}
                loading={item.targetIndex === 0 ? undefined : 'lazy'}
                aria-describedby={`question-${item.id}`}
                onError={() => setImgError(true)}
              />

              {/* Overlay SVG — hanya outline tipis + label, pointer-events none */}
              {item.highlight && (
                <Image
                  src={item.highlight}
                  alt=""
                  fill
                  className="pointer-events-none object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  aria-hidden="true"
                />
              )}
            </>
          ) : (
            /* Placeholder edukatif — hanya muncul jika gambar benar-benar tidak ada */
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-primary-50 px-6 text-center"
              role="img"
              aria-label={item.imageAlt}
            >
              <span className="text-5xl">🏛️</span>
              <p className="text-sm font-bold text-primary-700 leading-snug">{item.imageAlt}</p>
              <p className="text-xs text-primary-400">Amati bagian candi yang disebutkan</p>
            </div>
          )}
        </div>
      </figure>

      {/* ── Nomor soal + pertanyaan ── */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-base font-black text-white">
          {item.targetIndex + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            Soal {item.targetIndex + 1} dari {totalItems}
          </p>
          <p
            id={`question-${item.id}`}
            className="mt-1 text-base font-black leading-snug text-neutral-900 sm:text-lg"
          >
            {item.question}
          </p>
        </div>
        {isChecked && (
          <span
            className={[
              'flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-black',
              isCorrect ? 'bg-accent-100 text-accent-700' : 'bg-error-100 text-error-700',
            ].join(' ')}
          >
            {isCorrect ? '✓ Benar' : '✗ Kurang Tepat'}
          </span>
        )}
      </div>

      {/* ── Pilihan jawaban ── */}
      <div className="space-y-3">
        <IdentificationOptionGrid
          options={item.options}
          selectedOptionId={item.selectedOptionId}
          correctOptionId={isChecked ? item.correctOptionId : null}
          isAnswered={isChecked}
          disabled={isChecked}
          onSelect={(optionId) => selectOption(item.id, optionId)}
        />

        {!isChecked && onCheck && (
          <button
            type="button"
            disabled={!hasSelection}
            onClick={onCheck}
            className={[
              'w-full rounded-2xl py-4 text-base font-black transition duration-200',
              hasSelection
                ? 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98]'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed',
            ].join(' ')}
          >
            CEK JAWABAN
          </button>
        )}

        {isChecked && (
          <IdentificationFeedback
            isCorrect={isCorrect}
            selectedOptionText={selectedOption?.text ?? 'Belum dijawab'}
            correctOptionText={correctOption?.text ?? '-'}
            explanation={item.explanation}
            showCorrectOption={!isCorrect}
          />
        )}
      </div>
    </div>
  );
}
