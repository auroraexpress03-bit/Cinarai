'use client';

import { useCallback, useEffect } from 'react';
import { useLearningEngine } from '../../../hooks/useLearningEngine';
import { useIdentificationContext } from '../context/IdentificationContext';

export default function IdentificationNavigation() {
  const { state } = useIdentificationContext();
  const { registerSlideNav, unregisterSlideNav } = useLearningEngine();

  const canGoNext = state.isComplete;
  const canGoPrev = false;

  const goNext = useCallback(() => {}, []);
  const goPrev = useCallback(() => {}, []);

  useEffect(() => {
    registerSlideNav({
      slideIndex: 0,
      totalSlides: 1,
      canGoNext,
      canGoPrev,
      goNext,
      goPrev,
    });
  }, [canGoNext, canGoPrev, goNext, goPrev, registerSlideNav]);

  useEffect(() => () => unregisterSlideNav(), [unregisterSlideNav]);

  return null;
}
