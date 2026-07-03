'use client';

import { useCallback, useMemo, useState } from 'react';
import type { IdentificationState } from '../types';
import {
  createIdentificationState,
  resetIdentificationState,
  selectAnswer,
  updateNote,
  saveAnswer,
} from '../services/identificationService';

export interface UseIdentificationReturn {
  state: IdentificationState;
  selectOption: (itemId: string, optionId: string) => void;
  setNote: (itemId: string, note: string) => void;
  save: (itemId: string) => void;
  reset: () => void;
  percentage: number;
}

interface UseIdentificationOptions {
  comicId: number;
  lokasi: string;
  learningTargets: readonly string[];
}

export function useIdentification({
  comicId,
  lokasi,
  learningTargets,
}: UseIdentificationOptions): UseIdentificationReturn {
  const [state, setState] = useState<IdentificationState>(() =>
    createIdentificationState(comicId, lokasi, learningTargets)
  );

  const selectOption = useCallback((itemId: string, optionId: string) => {
    setState((prev) => selectAnswer(prev, itemId, optionId));
  }, []);

  const setNote = useCallback((itemId: string, note: string) => {
    setState((prev) => updateNote(prev, itemId, note));
  }, []);

  const save = useCallback((itemId: string) => {
    setState((prev) => saveAnswer(prev, itemId));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => resetIdentificationState(prev));
  }, []);

  const percentage = useMemo(() => {
    if (state.items.length === 0) return 0;
    return Math.round((state.observedCount / state.items.length) * 100);
  }, [state.observedCount, state.items.length]);

  return { state, selectOption, setNote, save, reset, percentage };
}
