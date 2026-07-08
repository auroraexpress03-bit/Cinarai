'use client';

import { useMemo } from 'react';
import { useLearningEngine } from '../../../hooks/useLearningEngine';
import { LEARNING_STAGES } from '../../../types';

export default function IdentificationHeader() {
  const { currentStage } = useLearningEngine();

  const { stageNumber, totalStages } = useMemo(() => {
    const index = LEARNING_STAGES.indexOf(currentStage);
    return {
      stageNumber: index === -1 ? 0 : index + 1,
      totalStages: LEARNING_STAGES.length,
    };
  }, [currentStage]);

  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <h1 className="text-2xl font-black uppercase tracking-[0.35em] text-neutral-900 sm:text-3xl">
        IDENTIFICATION
      </h1>
      <span className="text-base font-semibold uppercase tracking-[0.2em] text-neutral-400 whitespace-nowrap">
        Tahap {stageNumber} dari {totalStages}
      </span>
    </div>
  );
}
