'use client';

import { useState } from 'react';
import Image from 'next/image';
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

  const hasSelection = item.selectedOptionId !== null;
  const isCorrect = item.selectedOptionId === item.correctOptionId;
  const selectedOption = item.options.find((o) => o.id === item.selectedOptionId) ?? null;
  const correctOption = item.options.find((o) => o.id === item.correctOptionId) ?? null;
  const totalItems = state.items.length;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-lg shadow-neutral-100 sm:p-6">
      {/* Gambar objek */}
      <figure
        className="overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50"
        aria-label={`Gambar soal ${item.targetIndex + 1}: ${item.imageAlt}`}
      >
        <div
          id={`img-desc-${item.id}`}
          className="relative aspect-[16/10] w-full bg-neutral-900"
        >
          {imgError ? (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-100"
              role="alert"
              aria-live="polite"
            >
              <svg
                className="h-12 w-12 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
                focusable="false"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v8l3-3m0 0l3 3m-3-3V4" />
              </svg>
              <p className="text-sm font-semibold text-neutral-400">Gagal memuat gambar — {item.imageAlt}</p>
            </div>
          ) : (
            <>
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                loading={item.targetIndex === 0 ? undefined : 'lazy'}
                priority={item.targetIndex === 0}
                aria-describedby={`question-${item.id}`}
                onError={() => setImgError(true)}
              />

              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {item.highlight && (
                  <Image
                    src={item.highlight}
                    alt=""
                    fill
                    className="object-contain opacity-90 mix-blend-screen"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  />
                )}
                {item.crop && (
                  <div className="absolute bottom-3 right-3 h-20 w-28 overflow-hidden rounded-xl border border-white/70 bg-white/80 shadow-lg backdrop-blur-sm">
                    <Image
                      src={item.crop}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </figure>

      {/* Nomor soal + pertanyaan */}
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

      {/* Pilihan jawaban */}
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
