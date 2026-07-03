"use client";

import { useLearningEngine } from "../hooks/useLearningEngine";
import CoverStage from "./stages/CoverStage";
import ContextualizationStage from "./stages/ContextualizationStage";
import IdentificationStage from "./stages/IdentificationStage";
import NavigationStage from "./stages/NavigationStage";
import ArgumentationStage from "./stages/ArgumentationStage";
import ResolutionStage from "./stages/ResolutionStage";
import ApplicationStage from "./stages/ApplicationStage";
import IntrospectionStage from "./stages/IntrospectionStage";
import FinishStage from "./stages/FinishStage";

export default function StageRouter() {
  const { comic, currentStage, goNext, goPrev } = useLearningEngine();

  if (!comic) return null;

  const props = { comic, onNext: goNext, onPrev: goPrev };

  switch (currentStage) {
    case "Cover":
      return <CoverStage {...props} />;
    case "Contextualization":
      return <ContextualizationStage {...props} />;
    case "Identification":
      return <IdentificationStage {...props} />;
    case "Navigation":
      return <NavigationStage {...props} />;
    case "Argumentation":
      return <ArgumentationStage {...props} />;
    case "Resolution":
      return <ResolutionStage {...props} />;
    case "Application":
      return <ApplicationStage {...props} />;
    case "Introspection":
      return <IntrospectionStage {...props} />;
    case "Finish":
      return <FinishStage comic={comic} />;
    default:
      return null;
  }
}
