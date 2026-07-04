'use client';

import { useIdentificationContext } from '../context/IdentificationContext';
import ActivityItem from './ActivityItem';

export default function IdentificationActivity() {
  const { state, lokasi } = useIdentificationContext();
  const { items, isComplete } = state;

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </ul>

      {isComplete && (
        <div className="rounded-2xl bg-accent-500 px-5 py-5 flex items-center gap-4 mt-1">
          <span className="text-2xl md:text-4xl flex-shrink-0">🎉</span>
          <div className="min-w-0">
            <p className="text-xl md:text-2xl font-black text-white leading-tight">
              Hebat! Semua soal selesai!
            </p>
            <p className="text-base md:text-lg text-accent-100 mt-1 leading-snug">
              Kamu berhasil di {lokasi}. Tekan Berikutnya!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
