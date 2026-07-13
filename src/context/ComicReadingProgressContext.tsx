'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/** Progress membaca satu komik */
export interface ComicReadingProgress {
  comicId: number;
  currentPage: number;
  totalPages: number;
  completed: boolean;
  lastPage: number; // Halaman terakhir yang dibaca sebelum completed=true
}

interface ComicReadingProgressContextValue {
  progress: ComicReadingProgress | null;
  updateProgress: (comicId: number, page: number, totalPages: number) => void;
  markCompleted: (comicId: number, totalPages: number) => void;
  getLastPage: (comicId: number) => number;
  isComicCompleted: (comicId: number) => boolean;
  clearProgress: (comicId: number) => void;
}

const STORAGE_EVENT = 'cinarai:comic-reading-progress-cleared';

const ComicReadingProgressContext = createContext<ComicReadingProgressContextValue | null>(null);

export function useComicReadingProgress(): ComicReadingProgressContextValue {
  const ctx = useContext(ComicReadingProgressContext);
  if (!ctx) {
    throw new Error('useComicReadingProgress must be used within ComicReadingProgressProvider');
  }
  return ctx;
}

const STORAGE_KEY = 'cinarai:comic-reading-progress';

function getStoredProgress(): Record<number, ComicReadingProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveStoredProgress(data: Record<number, ComicReadingProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

function dispatchProgressClearedEvent(comicId?: number): void {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent(STORAGE_EVENT, { detail: { comicId } });
  window.dispatchEvent(event);
}

export function clearStoredComicReadingProgress(comicId?: number): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const parsed = JSON.parse(stored) as Record<number, ComicReadingProgress>;
    if (!parsed || typeof parsed !== 'object') {
      localStorage.removeItem(STORAGE_KEY);
      dispatchProgressClearedEvent(comicId);
      return;
    }

    if (typeof comicId === 'number') {
      delete parsed[comicId];
      if (Object.keys(parsed).length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    dispatchProgressClearedEvent(comicId);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    dispatchProgressClearedEvent(comicId);
  }
}

interface ComicReadingProgressProviderProps {
  children: React.ReactNode;
}

export function ComicReadingProgressProvider({ children }: ComicReadingProgressProviderProps) {
  const [allProgress, setAllProgress] = useState<Record<number, ComicReadingProgress>>(() =>
    getStoredProgress()
  );
  const [currentComicId, setCurrentComicId] = useState<number | null>(null);

  useEffect(() => {
    const handleStorageClear = (event: Event) => {
      const detail = (event as CustomEvent<{ comicId?: number }>).detail;
      const clearedComicId = detail?.comicId;

      setAllProgress((prev) => {
        if (typeof clearedComicId !== 'number') {
          return {};
        }
        if (!(clearedComicId in prev)) {
          return prev;
        }
        const next = { ...prev };
        delete next[clearedComicId];
        return next;
      });

      setCurrentComicId((current) => (current === clearedComicId ? null : current));
    };

    window.addEventListener(STORAGE_EVENT, handleStorageClear);
    return () => window.removeEventListener(STORAGE_EVENT, handleStorageClear);
  }, []);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    saveStoredProgress(allProgress);
  }, [allProgress]);

  const updateProgress = useCallback((comicId: number, page: number, totalPages: number) => {
    setCurrentComicId(comicId);
    setAllProgress((prev) => {
      const nextPage = Math.max(1, Math.min(page, totalPages));
      const current = prev[comicId] || {
        comicId,
        currentPage: 1,
        totalPages,
        completed: false,
        lastPage: 1,
      };

      const nextState = {
        ...current,
        currentPage: nextPage,
        totalPages,
        lastPage: current.completed ? current.lastPage : nextPage,
      };

      if (
        current.currentPage === nextState.currentPage &&
        current.totalPages === nextState.totalPages &&
        current.completed === nextState.completed &&
        current.lastPage === nextState.lastPage
      ) {
        return prev;
      }

      return {
        ...prev,
        [comicId]: nextState,
      };
    });
  }, []);

  const markCompleted = useCallback((comicId: number, totalPages: number) => {
    setCurrentComicId(comicId);
    setAllProgress((prev) => {
      const current = prev[comicId] || {
        comicId,
        currentPage: totalPages,
        totalPages,
        completed: false,
        lastPage: totalPages,
      };
      const nextState = {
        ...current,
        completed: true,
        currentPage: totalPages,
        totalPages,
        lastPage: totalPages,
      };

      if (
        current.completed === nextState.completed &&
        current.currentPage === nextState.currentPage &&
        current.totalPages === nextState.totalPages &&
        current.lastPage === nextState.lastPage
      ) {
        return prev;
      }

      return {
        ...prev,
        [comicId]: nextState,
      };
    });
  }, []);

  const clearProgress = useCallback((comicId: number) => {
    setCurrentComicId((current) => (current === comicId ? null : current));
    setAllProgress((prev) => {
      if (!(comicId in prev)) return prev;
      const next = { ...prev };
      delete next[comicId];
      return next;
    });
    clearStoredComicReadingProgress(comicId);
  }, []);

  const getLastPage = useCallback((comicId: number): number => {
    return allProgress[comicId]?.lastPage ?? 1;
  }, [allProgress]);

  const isComicCompleted = useCallback((comicId: number): boolean => {
    return allProgress[comicId]?.completed ?? false;
  }, [allProgress]);

  const progress = currentComicId ? allProgress[currentComicId] ?? null : null;

  const value: ComicReadingProgressContextValue = {
    progress,
    updateProgress,
    markCompleted,
    getLastPage,
    isComicCompleted,
    clearProgress,
  };

  return (
    <ComicReadingProgressContext.Provider value={value}>
      {children}
    </ComicReadingProgressContext.Provider>
  );
}
