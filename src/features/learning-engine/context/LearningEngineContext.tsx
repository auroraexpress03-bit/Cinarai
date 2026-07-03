"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { Comic } from "@/types/comic";
import type { Sintaks, SintaksStatus } from "@/types/progress";
import { SINTAKS } from "@/types/progress";
import {
  LEARNING_STAGES,
  FINISH_STAGE,
  type LearningStage,
  type LearningEngineState,
  type LearningEngineActions,
} from "../types";

type LearningEngineContextValue = LearningEngineState & LearningEngineActions;

const LearningEngineContext = createContext<LearningEngineContextValue | null>(null);

const ALL_STAGES: LearningStage[] = [...LEARNING_STAGES, FINISH_STAGE];

function buildInitialStatus(): Record<Sintaks, SintaksStatus> {
  return SINTAKS.reduce(
    (acc, s, i) => {
      acc[s] = i === 0 ? "CURRENT" : "LOCKED";
      return acc;
    },
    {} as Record<Sintaks, SintaksStatus>,
  );
}

interface LearningEngineProviderProps {
  comic: Comic;
  children: React.ReactNode;
}

export function LearningEngineProvider({ comic, children }: LearningEngineProviderProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [stageStatus, setStageStatus] = useState<Record<Sintaks, SintaksStatus>>(buildInitialStatus);

  const currentStage = ALL_STAGES[stageIndex];
  const totalStages = ALL_STAGES.length;

  const goNext = useCallback(() => {
    setStageIndex((i) => Math.min(i + 1, totalStages - 1));
  }, [totalStages]);

  const goPrev = useCallback(() => {
    setStageIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToStage = useCallback((stage: LearningStage) => {
    const idx = ALL_STAGES.indexOf(stage);
    if (idx !== -1) setStageIndex(idx);
  }, []);

  const completeStage = useCallback((stage: Sintaks) => {
    setStageStatus((prev) => {
      const next = { ...prev };
      next[stage] = "COMPLETED";
      const idx = SINTAKS.indexOf(stage);
      const nextSintaks = SINTAKS[idx + 1];
      if (nextSintaks && next[nextSintaks] === "LOCKED") {
        next[nextSintaks] = "CURRENT";
      }
      return next;
    });
  }, []);

  const value = useMemo<LearningEngineContextValue>(
    () => ({
      comic,
      currentStage,
      stageIndex,
      totalStages,
      isFirstStage: stageIndex === 0,
      isLastStage: stageIndex === totalStages - 1,
      stageStatus,
      goNext,
      goPrev,
      goToStage,
      completeStage,
    }),
    [comic, currentStage, stageIndex, totalStages, stageStatus, goNext, goPrev, goToStage, completeStage],
  );

  return <LearningEngineContext.Provider value={value}>{children}</LearningEngineContext.Provider>;
}

export function useLearningEngine(): LearningEngineContextValue {
  const ctx = useContext(LearningEngineContext);
  if (!ctx) throw new Error("useLearningEngine must be used within LearningEngineProvider");
  return ctx;
}
