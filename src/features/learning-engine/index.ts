export { default as LearningEngine } from "./components/LearningEngine";
export { default as LearningEngineRoot } from "./components/LearningEngineRoot";
export { LearningEngineProvider, useLearningEngine } from "./context/LearningEngineContext";
export { getComicById, getComicBySlug } from "./services/comicService";
export type {
  LearningStage,
  LearningEngineState,
  LearningEngineActions,
  StageProps,
} from "./types";
