'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';
import LearningHeader from '../layout/LearningHeader';
import LearningProgress from '../layout/LearningProgress';

const PdfReader = dynamic(() => import('@/components/comic/PdfReader'), { ssr: false });

export default function ContextualizationStage() {
  const { comic, progress, setCanAdvance, completeAndAdvance, isSaving } = useLearningEngine();

  const alreadyCompleted = progress.sintaksList.some(
    (s) => s.sintaks === 'Contextualization' && s.status === 'COMPLETED'
  );

  useEffect(() => {
    setCanAdvance(alreadyCompleted);
    return () => setCanAdvance(true);
  }, [alreadyCompleted, setCanAdvance]);

  const handlePdfComplete = useCallback(async () => {
    await completeAndAdvance('Contextualization');
  }, [completeAndAdvance]);

  return (
    <div
      className="flex flex-col bg-[#f0f7ff]"
      style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Shared header — identical to every other stage */}
      <div className="flex-shrink-0">
        <LearningHeader />
        <LearningProgress />
      </div>

      {/* PDF Reader — fills remaining space */}
      {!comic.pdfPath ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <span className="text-6xl">📄</span>
          <p className="text-2xl font-black text-neutral-700">PDF belum tersedia</p>
          <p className="text-xl text-neutral-400">Komik ini belum memiliki file PDF.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <PdfReader
            pdfPath={comic.pdfPath}
            onComplete={handlePdfComplete}
            showCompleteButton={!alreadyCompleted}
            completeButtonLabel="Saya Sudah Membaca ✅"
            completeButtonDisabled={isSaving}
          />
        </div>
      )}
    </div>
  );
}
