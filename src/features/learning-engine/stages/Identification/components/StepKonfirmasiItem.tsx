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
  const isComplete = item.reasonStatus === 'SAVED';

  return (
    <li className={[
      'flex flex-col gap-3 rounded-2xl border-2 p-5',
      isComplete ? 'border-accent-200 bg-accent-50' : 'border-neutral-200 bg-white',
    ].join(' ')}>

      {/* Nomor + target */}
      <div className="flex items-start gap-4">
        <span className={[
          'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-lg font-black',
          isComplete ? 'bg-accent-500 text-white' : 'bg-primary-600 text-white',
        ].join(' ')}>
          {isComplete ? '✓' : item.targetIndex + 1}
        </span>
        <p className="text-base md:text-lg font-black text-neutral-800 leading-snug flex-1 pt-1.5">
          {item.targetText}
        </p>
      </div>

      {/* Detail jawaban */}
      <div className="flex flex-col gap-3 pl-14">
        <Row label="Jawaban" value={selectedOptionText} />
        <Row label="Catatan" value={item.note.trim() || null} />
        <Row label="Alasan" value={item.reason.trim() || null} />
      </div>
    </li>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">{label}</span>
      <p className={[
        'text-lg leading-relaxed mt-0.5',
        value ? 'text-neutral-700' : 'text-neutral-400 italic',
      ].join(' ')}>
        {value ?? 'Belum diisi'}
      </p>
    </div>
  );
}
