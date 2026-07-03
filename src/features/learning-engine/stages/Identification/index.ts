// Layout utama — gunakan ini di IdentificationStage
export { default as IdentificationLayout } from './components/IdentificationLayout';

// Sub-komponen zona
export { default as IdentificationHeader } from './components/IdentificationHeader';
export { default as IdentificationProgress } from './components/IdentificationProgress';
export { default as IdentificationTitle } from './components/IdentificationTitle';
export { default as IdentificationInstructions } from './components/IdentificationInstructions';
export { default as IdentificationActivity } from './components/IdentificationActivity';

// Area Aktivitas sub-komponen
export { default as ActivityItem } from './components/ActivityItem';
export { default as QuestionCard } from './components/QuestionCard';
export { default as AnswerOptions } from './components/AnswerOptions';
export { default as NoteArea } from './components/NoteArea';
export { default as SaveButton } from './components/SaveButton';

// Hook
export { useIdentification } from './hooks/useIdentification';

// Services
export {
  createIdentificationState,
  markItemObserved,
  selectAnswer,
  updateNote,
  saveAnswer,
  resetIdentificationState,
} from './services/identificationService';

// Types
export type {
  AnswerOption,
  AnswerStatus,
  IdentificationItem,
  IdentificationItemStatus,
  IdentificationState,
  MarkObservedPayload,
  SelectAnswerPayload,
  UpdateNotePayload,
  SaveAnswerPayload,
} from './types';
