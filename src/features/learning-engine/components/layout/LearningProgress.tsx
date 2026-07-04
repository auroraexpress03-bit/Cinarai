'use client';

import { Stage, LEARNING_STAGES } from '../../types';
import { useLearningEngine } from '../../hooks/useLearningEngine';

const STAGE_LABELS: Record<Stage, string> = {
  [Stage.Cover]:             'Cover',
  [Stage.Contextualization]: 'Kontekstualisasi',
  [Stage.Identification]:    'Identifikasi',
  [Stage.Navigation]:        'Navigasi',
  [Stage.Argumentation]:     'Argumentasi',
  [Stage.Resolution]:        'Resolusi',
  [Stage.Application]:       'Aplikasi',
  [Stage.Introspection]:     'Introspeksi',
  [Stage.Finish]:            'Selesai',
};

export default function LearningProgress() {
  const { currentStage, stageIndex, progress } = useLearningEngine();

  const stageNumber = stageIndex + 1;
  const totalLearning = LEARNING_STAGES.length;

  return (
    <div className="bg-white border-b border-neutral-100 px-4 py-2 sm:px-6">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-bold text-neutral-700 truncate">
          {STAGE_LABELS[currentStage]}
        </span>
        <span className="text-sm font-black text-primary-600 ml-2 flex-shrink-0">
          Tahap {Math.min(stageNumber, totalLearning)} dari {totalLearning}
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700"
          style={{ width: `${progress.percentage}%` }}
          role="progressbar"
          aria-valuenow={stageNumber}
          aria-valuemin={1}
          aria-valuemax={totalLearning}
          aria-label={`Tahap ${stageNumber} dari ${totalLearning}`}
        />
      </div>
    </div>
  );
}
