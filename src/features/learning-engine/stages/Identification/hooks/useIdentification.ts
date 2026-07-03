'use client';

import { useCallback, useMemo, useState } from 'react';
import type { IdentificationState } from '../types';
import {
  createIdentificationState,
  markItemObserved,
  resetIdentificationState,
} from '../services/identificationService';

export interface UseIdentificationReturn {
  state: IdentificationState;
  /** Tandai satu item sebagai OBSERVED berdasarkan id-nya */
  markObserved: (itemId: string) => void;
  /** Reset semua item ke PENDING */
  reset: () => void;
  /** Persentase penyelesaian (0–100) */
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

  const markObserved = useCallback((itemId: string) => {
    setState((prev) => markItemObserved(prev, itemId));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => resetIdentificationState(prev));
  }, []);

  const percentage = useMemo(() => {
    if (state.items.length === 0) return 0;
    return Math.round((state.observedCount / state.items.length) * 100);
  }, [state.observedCount, state.items.length]);

  return { state, markObserved, reset, percentage };
}
