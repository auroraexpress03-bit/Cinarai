'use client';

import type { IdentificationItem } from '../types';

interface StepKonfirmasiItemProps {
  item: IdentificationItem;
  selectedOptionText: string | null;
}

export default function StepKonfirmasiItem({
  item,
  selectedOptionText,
}: StepKonfirmasiItemProps) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm sm:p-5">
      {/* Nomor + target */}
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-black text-primary-700 mt-0.5">
          {item.targetIndex + 1}
        </span>
        <p className="text-sm font-bold text-neutral-800 leading-snug flex-1">
          {item.targetText}
        </p>
      </div>

      {/* Jawaban */}
      <div className="flex flex-col gap-1 pl-9">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Jawaban
        </span>
        <p className={[
          'text-sm leading-relaxed',
          selectedOptionText ? 'text-neutral-700' : 'text-neutral-400 italic',
        ].join(' ')}>
          {selectedOptionText ?? 'Tidak ada jawaban'}
        </p>
      </div>

      {/* Catatan */}
      <div className="flex flex-col gap-1 pl-9">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Catatan
        </span>
        <p className={[
          'text-sm leading-relaxed',
          item.note.trim() ? 'text-neutral-700' : 'text-neutral-400 italic',
        ].join(' ')}>
          {item.note.trim() || 'Tidak ada catatan'}
        </p>
      </div>

      {/* Alasan */}
      <div className="flex flex-col gap-1 pl-9">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Alasan
        </span>
        <p className={[
          'text-sm leading-relaxed',
          item.reason.trim() ? 'text-neutral-700' : 'text-neutral-400 italic',
        ].join(' ')}>
          {item.reason.trim() || 'Tidak ada alasan'}
        </p>
      </div>
    </li>
  );
}
