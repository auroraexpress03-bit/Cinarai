'use client';

import { useState } from 'react';
import { useIdentificationContext } from '../context/IdentificationContext';
import IdentificationQuestion from './IdentificationQuestion';

export default function IdentificationActivity() {
  const { state, lokasi } = useIdentificationContext();
  const { items, isComplete } = state;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const currentItem = items[currentIndex];
  const currentChecked = currentItem
    ? currentItem.answerStatus === 'SAVED' || Boolean(checkedItems[currentItem.id])
    : false;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < items.length - 1 && currentChecked;

  if (!currentItem) return null;

  return (
    <div className="flex flex-col gap-4">
      <IdentificationQuestion
        item={currentItem}
        isChecked={currentChecked}
        onCheck={() => setCheckedItems((prev) => ({ ...prev, [currentItem.id]: true }))}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={!canGoPrev}
          className="inline-flex min-h-[56px] w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-base font-semibold text-neutral-700 transition duration-200 hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1))}
          disabled={!canGoNext}
          className="inline-flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-primary-600 px-5 py-4 text-base font-semibold text-white transition duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Lanjutkan
        </button>
      </div>

      {isComplete && (
        <div className="rounded-xl bg-accent-500 px-4 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🎉</span>
          <div>
            <p className="text-lg font-black text-white leading-tight">Hebat! Semua soal selesai!</p>
            <p className="text-base text-accent-100">Kamu berhasil di {lokasi}. Tekan Lanjut!</p>
          </div>
        </div>
      )}
    </div>
  );
}
