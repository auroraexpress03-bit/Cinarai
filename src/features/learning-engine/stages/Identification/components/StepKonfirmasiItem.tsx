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
      'flex flex-col gap-2 rounded-xl border-2 p-4',
      isComplete ? 'border-accent-200 bg-accent-50' : 'border-neutral-200 bg-white',
    ].join(' ')}>

      <div className="flex items-start gap-3">
        <span className={[
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-black',
          isComplete ? 'bg-accent-500 text-white' : 'bg-primary-600 text-white',
        ].join(' ')}>
          {isComplete ? '✓' : item.targetIndex + 1}
        </span>
        <p className="text-base font-black text-neutral-800 leading-snug flex-1 pt-0.5">
          {item.targetText}
        </p>
      </div>

      <div className="flex flex-col gap-1 pl-11">
        <Row label="Jawaban" value={selectedOptionText} />
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
        'text-sm leading-relaxed',
        value ? 'text-neutral-700' : 'text-neutral-400 italic',
      ].join(' ')}>
        {value ?? 'Belum diisi'}
      </p>
    </div>
  );
}
