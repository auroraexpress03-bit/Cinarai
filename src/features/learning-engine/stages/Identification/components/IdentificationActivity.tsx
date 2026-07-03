'use client';

import type { IdentificationItem } from '../types';
import ActivityItem from './ActivityItem';

interface IdentificationActivityProps {
  items: IdentificationItem[];
  onSelectOption: (itemId: string, optionId: string) => void;
  onNoteChange: (itemId: string, note: string) => void;
  onSave: (itemId: string) => void;
  isComplete: boolean;
  lokasi: string;
}

export default function IdentificationActivity({
  items,
  onSelectOption,
  onNoteChange,
  onSave,
  isComplete,
  lokasi,
}: IdentificationActivityProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 px-1">
        Target yang Perlu Ditemukan
      </p>

      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <ActivityItem
            key={item.id}
            item={item}
            onSelectOption={onSelectOption}
            onNoteChange={onNoteChange}
            onSave={onSave}
          />
        ))}
      </ul>

      {isComplete && (
        <div className="rounded-2xl bg-accent-50 border border-accent-200 px-4 py-3.5 flex items-center gap-3 mt-1">
          <span className="text-2xl flex-shrink-0">🎉</span>
          <div className="min-w-0">
            <p className="text-sm font-black text-accent-800 leading-tight">
              Semua target ditemukan!
            </p>
            <p className="text-xs text-accent-600 mt-0.5 leading-snug">
              Kamu berhasil mengidentifikasi semua konsep di {lokasi}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
