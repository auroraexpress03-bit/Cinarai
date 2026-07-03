"use client";

import { getComicById } from "../services/comicService";
import LearningEngine from "./LearningEngine";

interface LearningEngineRootProps {
  comicId: number;
}

export default function LearningEngineRoot({ comicId }: LearningEngineRootProps) {
  const comic = getComicById(comicId);
  if (!comic) return null;
  return <LearningEngine comic={comic} />;
}
