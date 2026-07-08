'use client';

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

  const hasSelection = item.selectedOptionId !== null;
  const isCorrect = item.selectedOptionId === item.correctOptionId;
  const selectedOption = item.options.find((option) => option.id === item.selectedOptionId) ?? null;
  const correctOption = item.options.find((option) => option.id === item.correctOptionId) ?? null;
  const totalItems = state.items.length;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-lg shadow-neutral-100 sm:p-6">
      {/* Gambar objek */}
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
        <div className="relative aspect-[16/10] w-full bg-neutral-100">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 640px"
            priority={item.targetIndex === 0}
          />
        </div>
      </div>

      {/* Nomor soal + pertanyaan */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-base font-black text-white">
          {item.targetIndex + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            Soal {item.targetIndex + 1} dari {totalItems}
          </p>
          <p className="mt-1 text-base font-black leading-snug text-neutral-900 sm:text-lg">
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
