'use client';

import { useEffect } from 'react';
import { useIdentification } from '../hooks/useIdentification';
import IdentificationHeader from './IdentificationHeader';
import IdentificationProgress from './IdentificationProgress';
import IdentificationTitle from './IdentificationTitle';
import IdentificationInstructions from './IdentificationInstructions';
import IdentificationActivity from './IdentificationActivity';

interface IdentificationLayoutProps {
  comicId: number;
  lokasi: string;
  subtitle: string;
  kelas: string;
  learningTargets: readonly string[];
  onCompleteChange?: (isComplete: boolean) => void;
}

/**
 * IdentificationLayout — konten stage Identification.
 * Dirender di dalam LearningContent (sudah scroll + max-w-2xl).
 * Tidak memiliki BottomNav sendiri — navigasi ditangani LearningBottomNav global.
 */
export default function IdentificationLayout({
  comicId,
  lokasi,
  subtitle,
  kelas,
  learningTargets,
  onCompleteChange,
}: IdentificationLayoutProps) {
  const { state, selectOption, setNote, save, percentage } = useIdentification({
    comicId,
    lokasi,
    learningTargets,
  });

  useEffect(() => {
    onCompleteChange?.(state.isComplete);
  }, [state.isComplete, onCompleteChange]);

  return (
    <div className="flex flex-col gap-4">
      {/* Zona 1 — Header */}
      <IdentificationHeader
        lokasi={lokasi}
        subtitle={subtitle}
        kelas={kelas}
      />

      {/* Zona 2 — Progress */}
      <IdentificationProgress
        observedCount={state.observedCount}
        totalCount={state.items.length}
        percentage={percentage}
        isComplete={state.isComplete}
      />

      {/* Zona 3 — Judul */}
      <IdentificationTitle lokasi={lokasi} />

      {/* Zona 4 — Petunjuk */}
      <IdentificationInstructions />

      {/* Zona 5 — Area Aktivitas */}
      <IdentificationActivity
        items={state.items}
        onSelectOption={selectOption}
        onNoteChange={setNote}
        onSave={save}
        isComplete={state.isComplete}
        lokasi={lokasi}
      />
    </div>
  );
}
