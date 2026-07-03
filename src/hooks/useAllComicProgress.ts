'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { subscribeToAllComicProgress } from '@/services/comicProgress';
import type { ComicProgressState } from '@/types/progress';

export function useAllComicProgress() {
  const { user } = useAuth();
  const [states, setStates] = useState<ComicProgressState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    const unsub = subscribeToAllComicProgress(user.uid, (s) => {
      setStates(s);
      setIsLoading(false);
    });
    return () => unsub();
  }, [user]);

  const getProgress = (comicId: number): ComicProgressState | undefined =>
    states.find((s) => s.comicId === comicId);

  return { states, getProgress, isLoading };
}
