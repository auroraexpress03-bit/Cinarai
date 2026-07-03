export { default as IdentificationEngine } from './components/IdentificationEngine';
export { default as TargetCard } from './components/TargetCard';
export { useIdentification } from './hooks/useIdentification';
export {
  createIdentificationState,
  markItemObserved,
  resetIdentificationState,
} from './services/identificationService';
export type {
  IdentificationItem,
  IdentificationItemStatus,
  IdentificationState,
  MarkObservedPayload,
} from './types';
