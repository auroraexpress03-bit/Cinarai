'use client';

interface IdentificationProgressProps {
  observedCount: number;
  totalCount: number;
  percentage: number;
  isComplete: boolean;
}

export default function IdentificationProgress({
  observedCount,
  totalCount,
  percentage,
  isComplete,
}: IdentificationProgressProps) {
  return (
    <div className="rounded-2xl bg-white shadow-sm px-4 py-3 sm:px-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-neutral-700">
          Progress Identifikasi
        </span>
        <span
          className={[
            'text-xs font-black',
            isComplete ? 'text-accent-600' : 'text-primary-600',
          ].join(' ')}
        >
          {percentage}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className={[
            'h-2 rounded-full transition-all duration-500',
            isComplete
              ? 'bg-gradient-to-r from-accent-400 to-accent-500'
              : 'bg-gradient-to-r from-primary-400 to-primary-600',
          ].join(' ')}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${observedCount} dari ${totalCount} target ditemukan`}
        />
      </div>

      <p className="mt-1.5 text-[11px] text-neutral-400">
        <span className={['font-bold', isComplete ? 'text-accent-600' : 'text-primary-600'].join(' ')}>
          {observedCount}
        </span>
        {' '}dari{' '}
        <span className="font-bold text-neutral-600">{totalCount}</span>
        {' '}target ditemukan
      </p>
    </div>
  );
}
