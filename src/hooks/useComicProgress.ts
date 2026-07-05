'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSnackbar } from '@/context/SnackbarContext';
import { subscribeToComicProgress, saveComicProgress, extractFirebaseErrorCode } from '@/services/comicProgress';
import { completeSintaks, createInitialProgressState } from '@/lib/progressEngine';
import type { ComicProgressState, Sintaks } from '@/types/progress';

export function useComicProgress(comicId: number) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [state, setState] = useState<ComicProgressState>(
    createInitialProgressState(comicId)
  );
  // Keep a stable ref to the latest state so complete() never closes over stale state
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToComicProgress(user.uid, comicId, setState);
    return () => unsub();
  }, [user, comicId]);

  const complete = useCallback(async (sintaks: Sintaks): Promise<void> => {
    if (!user?.uid) {
      showSnackbar('Gagal menyimpan progress: login diperlukan.', 'error');
      throw new Error('unauthenticated');
    }

    const next = completeSintaks(stateRef.current, sintaks);
    try {
      await saveComicProgress(user.uid, next);
      setState(next);
    } catch (error) {
      const code = extractFirebaseErrorCode(error);
      showSnackbar(`Gagal menyimpan progress: ${code}`, 'error');
      throw error;
    }
  }, [user, showSnackbar]);

  return { state, complete };
}
