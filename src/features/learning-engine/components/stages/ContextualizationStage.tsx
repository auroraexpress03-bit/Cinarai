'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';

const PdfReader = dynamic(() => import('@/components/comic/PdfReader'), { ssr: false });

export default function ContextualizationStage() {
  const { comic, progress, setCanAdvance } = useLearningEngine();

  const alreadyCompleted = progress.sintaksList.some(
    (s) => s.sintaks === 'Contextualization' && s.status === 'COMPLETED'
  );

  useEffect(() => {
    // If already completed (e.g. user returns to this stage), unlock immediately
    setCanAdvance(alreadyCompleted);
    return () => setCanAdvance(true);
  }, [alreadyCompleted, setCanAdvance]);

  const handlePdfComplete = () => {
    setCanAdvance(true);
  };

  if (!comic.pdfPath) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <p className="text-sm font-semibold text-neutral-500">PDF belum tersedia.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm"
      style={{ height: 'calc(100dvh - 220px)', minHeight: '400px' }}
    >
      <PdfReader
        pdfPath={comic.pdfPath}
        onComplete={handlePdfComplete}
      />
    </div>
  );
}
