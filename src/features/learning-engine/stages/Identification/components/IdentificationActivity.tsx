'use client';

import { useIdentificationContext } from '../context/IdentificationContext';
import IdentificationQuestion from './IdentificationQuestion';

export default function IdentificationActivity() {
  const {
    state,
    lokasi,
    currentQuestionIndex,
    checkedItems,
    setCheckedItems,
  } = useIdentificationContext();
  const { items, isComplete } = state;

  const currentItem = items[currentQuestionIndex];
  const currentChecked = currentItem
    ? currentItem.answerStatus === 'SAVED' || Boolean(checkedItems[currentItem.id])
    : false;

  if (!currentItem) return null;

  return (
    <div className="flex flex-col gap-4">
      <IdentificationQuestion
        item={currentItem}
        isChecked={currentChecked}
        onCheck={() =>
          setCheckedItems((prev) => ({ ...prev, [currentItem.id]: true }))
        }
      />

      {isComplete && (
        <div className="rounded-xl bg-accent-500 px-4 py-3 flex items-center gap-3">
          <span className="text-xl flex-shrink-0">🎉</span>
          <div>
            <p className="text-base font-black text-white leading-tight">Semua soal selesai!</p>
            <p className="text-sm text-accent-100">Kamu berhasil di {lokasi}. Tekan Lanjut!</p>
          </div>
        </div>
      )}
    </div>
  );
}
