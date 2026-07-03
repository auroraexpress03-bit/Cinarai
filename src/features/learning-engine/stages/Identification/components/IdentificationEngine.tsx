'use client';

import { useEffect } from 'react';
import { useIdentification } from '../hooks/useIdentification';
import TargetCard from './TargetCard';

interface IdentificationEngineProps {
  comicId: number;
  lokasi: string;
  subtitle: string;
  kelas: string;
  learningTargets: readonly string[];
  /** Dipanggil setiap kali status isComplete berubah */
  onCompleteChange?: (isComplete: boolean) => void;
}

export default function IdentificationEngine({
  comicId,
  lokasi,
  subtitle,
  kelas,
  learningTargets,
  onCompleteChange,
}: IdentificationEngineProps) {
  const { state, markObserved, percentage } = useIdentification({
    comicId,
    lokasi,
    learningTargets,
  });

  // Notify parent when completion status changes
  useEffect(() => {
    onCompleteChange?.(state.isComplete);
  }, [state.isComplete, onCompleteChange]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header card */}
      <div className="rounded-3xl bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 sm:px-5">
          <h3 className="text-sm font-bold text-white">Apa yang Perlu Kamu Temukan?</h3>
          <p className="mt-0.5 text-xs text-primary-100">
            {subtitle} · Kelas {kelas}
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-4 pt-3 pb-1 sm:px-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-neutral-500">
              {state.observedCount} dari {state.items.length} ditemukan
            </span>
            <span className="text-[11px] font-black text-primary-600">{percentage}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className={[
                'h-1.5 rounded-full transition-all duration-500',
                state.isComplete
                  ? 'bg-gradient-to-r from-accent-400 to-accent-500'
                  : 'bg-gradient-to-r from-primary-400 to-primary-600',
              ].join(' ')}
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Target list */}
        <ul className="px-4 py-3 sm:px-5 flex flex-col gap-2">
          {state.items.map((item) => (
            <TargetCard
              key={item.id}
              item={item}
              onMarkObserved={markObserved}
            />
          ))}
        </ul>
      </div>

      {/* Completion banner */}
      {state.isComplete && (
        <div className="rounded-2xl bg-accent-50 border border-accent-200 px-4 py-3 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🎉</span>
          <div>
            <p className="text-sm font-black text-accent-800">Semua target ditemukan!</p>
            <p className="text-xs text-accent-600 mt-0.5">
              Kamu berhasil mengidentifikasi semua konsep di {lokasi}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
