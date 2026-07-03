import type { Comic } from "@/types/comic";
import type { Sintaks, SintaksStatus } from "@/types/progress";

export type { Sintaks, SintaksStatus };

export const LEARNING_STAGES: Sintaks[] = [
  "Cover",
  "Contextualization",
  "Identification",
  "Navigation",
  "Argumentation",
  "Resolution",
  "Application",
  "Introspection",
];

export const FINISH_STAGE = "Finish" as const;
export type FinishStage = typeof FINISH_STAGE;
export type LearningStage = Sintaks | FinishStage;

export interface StageProps {
  comic: Comic;
  onNext: () => void;
  onPrev: () => void;
}

export interface LearningEngineState {
  comic: Comic | null;
  currentStage: LearningStage;
  stageIndex: number;
  totalStages: number;
  isFirstStage: boolean;
  isLastStage: boolean;
  stageStatus: Record<Sintaks, SintaksStatus>;
}

export interface LearningEngineActions {
  goNext: () => void;
  goPrev: () => void;
  goToStage: (stage: LearningStage) => void;
  completeStage: (stage: Sintaks) => void;
}
