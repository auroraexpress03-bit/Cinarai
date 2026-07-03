'use client';

import { useCallback, useEffect } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';
import { IdentificationEngine } from '../../stages/Identification';

export default function IdentificationStage() {
  const { comic, setCanAdvance } = useLearningEngine();

  // Gate: tombol Next aktif hanya setelah semua target ditemukan
  useEffect(() => {
    setCanAdvance(false);
  }, [setCanAdvance]);

  const handleCompleteChange = useCallback(
    (isComplete: boolean) => {
      setCanAdvance(isComplete);
    },
    [setCanAdvance]
  );

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-black text-neutral-950 leading-snug">
          Identifikasi Masalah
        </h2>
        <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
          Temukan konsep matematika yang tersembunyi di {comic.lokasi}.
        </p>
      </div>

      <IdentificationEngine
        comicId={comic.id}
        lokasi={comic.lokasi}
        subtitle={comic.subtitle}
        kelas={comic.kelas}
        learningTargets={comic.learningTargets}
        onCompleteChange={handleCompleteChange}
      />
    </div>
  );
}
