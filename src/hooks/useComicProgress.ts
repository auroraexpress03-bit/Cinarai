'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { subscribeToComicProgress, saveComicProgress } from '@/services/comicProgress';
import { completeSintaks, createInitialProgressState } from '@/lib/progressEngine';
import type { ComicProgressState, Sintaks } from '@/types/progress';

export function useComicProgress(comicId: number) {
  const { user } = useAuth();
  const [state, setState] = useState<ComicProgressState>(
    createInitialProgressState(comicId)
  );

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToComicProgress(user.uid, comicId, setState);
    return () => unsub();
  }, [user, comicId]);

  const complete = async (sintaks: Sintaks) => {
    if (!user) return;
    const next = completeSintaks(state, sintaks);
    setState(next);
    await saveComicProgress(user.uid, next);
  };

  return { state, complete };
}
