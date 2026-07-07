'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useIdentification as useIdentificationHook } from '../components/useIdentification';
import { useAuth } from '@/hooks/useAuth';
import { useSnackbar } from '@/context/SnackbarContext';
import { useLearningEngine } from '../../../hooks/useLearningEngine';
import { loadIdentificationAnswers, saveIdentificationAnswer } from '../services/identificationAnswerService';

type IdentificationStep = 'OBSERVE' | 'IDENTIFY' | 'CONFIRM';

interface IdentificationComicMeta {
  comicId: number;
  lokasi: string;
  subtitle: string;
  kelas: string;
  cover: string;
  title: string;
  learningTargets: readonly string[];
}

export interface IdentificationContextValue {
  // simplified identification state and actions
  state: ReturnType<typeof useIdentificationHook>['state'] & {
    // compatibility aliases for legacy components
    isComplete?: boolean;
    items?: unknown[];
    observedCount?: number;
    observe?: { note: string };
  };
  selectShape: (shape: string) => void;
  checkAnswers: () => Promise<void>;
  reset: () => void;
  // meta
  lokasi: string;
  cover: string;
  title: string;
  // navigation hooks used by surrounding layout
  currentStep: IdentificationStep;
  nextStep: () => void;
  previousStep: () => void;
  advance: () => void;
  // legacy optional handlers
  selectOption?: (itemId: string, optionId: string) => void;
  setObserveNote?: (note: string) => void;
}

const IdentificationContext = createContext<IdentificationContextValue | null>(null);

export function useIdentificationContext(): IdentificationContextValue {
  const ctx = useContext(IdentificationContext);
  if (!ctx) throw new Error('useIdentificationContext must be used within IdentificationProvider');
  return ctx;
}

interface IdentificationProviderProps extends IdentificationComicMeta {
  onCompleteChange?: (isComplete: boolean) => void;
  children: React.ReactNode;
}

function parseSelectedAnswer(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
  } catch {
    // ignore parse errors and fallback to comma-separated values
  }
  return raw.split(',').map((item) => item.trim()).filter(Boolean);
}

export function IdentificationProvider({
  comicId: _comicId,
  lokasi,
  subtitle: _subtitle,
  kelas: _kelas,
  cover,
  title,
  learningTargets: _learningTargets,
  onCompleteChange,
  children,
}: IdentificationProviderProps) {
  const identification = useIdentificationHook();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { nextStage } = useLearningEngine();
  const restoredRef = useRef(false);

  useEffect(() => {
    if (!user?.uid || restoredRef.current) return;
    let active = true;
    restoredRef.current = true;

    const restore = async () => {
      try {
        const answers = await loadIdentificationAnswers(user.uid, _comicId);
        const answer = answers.find((item) => item.step === 0);
        if (!active || !answer) return;

        const shapes = parseSelectedAnswer(answer.selectedAnswer);
        if (shapes.length === 0) return;

        identification.setSelectedShapes(shapes);
      } catch (error) {
        console.error('[IdentificationContext] restore answers failed', error);
        showSnackbar('Gagal memuat jawaban identifikasi.', 'error');
      }
    };

    void restore();
    return () => {
      active = false;
    };
  }, [user?.uid, _comicId, identification, showSnackbar]);

  const saveAnswers = useCallback(async (selectedShapes: string[]) => {
    if (!user?.uid) {
      showSnackbar('Login diperlukan untuk menyimpan jawaban identifikasi.', 'error');
      return;
    }

    try {
      await saveIdentificationAnswer(user.uid, _comicId, 0, {
        selectedAnswer: JSON.stringify(selectedShapes),
        note: '',
        reason: '',
      });
      showSnackbar('Jawaban identifikasi tersimpan.', 'success');
    } catch (error) {
      console.error('[IdentificationContext] save answers failed', error);
      showSnackbar('Gagal menyimpan jawaban identifikasi.', 'error');
    }
  }, [user?.uid, _comicId, showSnackbar]);

  const handleCheckAnswers = useCallback(async () => {
    const selectedShapes = identification.state.selectedShapes;
    identification.evaluate();
    if (selectedShapes.length === 0) return;
    await saveAnswers(selectedShapes);
  }, [identification, saveAnswers]);

  const [currentStep] = useState<IdentificationStep>('IDENTIFY');

  const value = useMemo<IdentificationContextValue>(() => ({
    state: {
      ...identification.state,
      isComplete: identification.state.completed,
      items: [],
      observedCount: 0,
      observe: { note: '' },
    },
    selectShape: identification.toggleShape,
    checkAnswers: handleCheckAnswers,
    reset: identification.reset,
    lokasi,
    cover,
    title,
    currentStep,
    nextStep: nextStage,
    previousStep: () => {},
    advance: nextStage,
    selectOption: () => {},
    setObserveNote: () => {},
  }), [identification, lokasi, cover, title, currentStep, handleCheckAnswers, nextStage]);

  useEffect(() => {
    onCompleteChange?.(identification.state.completed);
  }, [identification.state.completed, onCompleteChange]);

  return (
    <IdentificationContext.Provider value={value}>
      {children}
    </IdentificationContext.Provider>
  );
}
