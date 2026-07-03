"use client";

import type { Comic } from "@/types/comic";
import { LearningEngineProvider } from "../context/LearningEngineContext";
import StageRouter from "./StageRouter";

interface LearningEngineProps {
  comic: Comic;
}

export default function LearningEngine({ comic }: LearningEngineProps) {
  return (
    <LearningEngineProvider comic={comic}>
      <StageRouter />
    </LearningEngineProvider>
  );
}
