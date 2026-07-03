'use client';

import type { IdentificationItem } from '../types';

interface TargetCardProps {
  item: IdentificationItem;
  onMarkObserved: (itemId: string) => void;
}

export default function TargetCard({ item, onMarkObserved }: TargetCardProps) {
  const isObserved = item.status === 'OBSERVED';

  return (
    <li
      className={[
        'flex items-start gap-3 rounded-2xl px-4 py-3.5 transition-colors',
        isObserved
          ? 'bg-accent-50 border border-accent-200'
          : 'bg-white border border-neutral-100 shadow-sm',
      ].join(' ')}
    >
      {/* Status indicator */}
      <button
        type="button"
        onClick={() => !isObserved && onMarkObserved(item.id)}
        disabled={isObserved}
        aria-label={
          isObserved
            ? `Target ${item.targetIndex + 1} sudah ditemukan`
            : `Tandai target ${item.targetIndex + 1} sebagai ditemukan`
        }
        className={[
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-black transition-colors mt-0.5',
          isObserved
            ? 'bg-accent-500 text-white cursor-default'
            : 'bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-pointer',
        ].join(' ')}
      >
        {isObserved ? '✓' : item.targetIndex + 1}
      </button>

      {/* Target text */}
      <p
        className={[
          'text-sm leading-relaxed flex-1',
          isObserved ? 'text-accent-800 font-medium' : 'text-neutral-700',
        ].join(' ')}
      >
        {item.targetText}
      </p>

      {/* Observed badge */}
      {isObserved && (
        <span className="flex-shrink-0 self-center rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-black text-accent-700">
          Ditemukan
        </span>
      )}
    </li>
  );
}
