'use client';

import { useCallback, useEffect } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';
import { IdentificationProvider, useIdentificationContext } from '../../stages/Identification/context/IdentificationContext';
import StepAmati from '../../stages/Identification/components/StepAmati';
import StepIdentifikasi from '../../stages/Identification/components/StepIdentifikasi';
import StepKonfirmasi from '../../stages/Identification/components/StepKonfirmasi';

const STEP_ORDER = ['OBSERVE', 'IDENTIFY', 'CONFIRM'] as const;

/** Bridges IdentificationContext slides into LearningEngineContext slideNav. */
function SlideNavBridge() {
  const { currentStep, nextStep, previousStep, state, validationErrors } = useIdentificationContext();
  const { registerSlideNav, unregisterSlideNav } = useLearningEngine();

  const slideIndex = STEP_ORDER.indexOf(currentStep);
  const totalSlides = STEP_ORDER.length;
  const canGoNext =
    currentStep === 'OBSERVE'
      ? state.observe.note.trim().length > 0
      : currentStep === 'IDENTIFY'
        ? state.isComplete
        : validationErrors.length === 0;

  const goNext = useCallback(() => nextStep(), [nextStep]);
  const goPrev = useCallback(() => previousStep(), [previousStep]);

  useEffect(() => {
    registerSlideNav({
      slideIndex,
      totalSlides,
      canGoNext,
      canGoPrev: slideIndex > 0,
      goNext,
      goPrev,
    });
  }, [slideIndex, totalSlides, canGoNext, goNext, goPrev, registerSlideNav]);

  useEffect(() => () => unregisterSlideNav(), [unregisterSlideNav]);

  return null;
}

function StepRouter() {
  const { currentStep } = useIdentificationContext();
  if (currentStep === 'OBSERVE') return <StepAmati />;
  if (currentStep === 'CONFIRM') return <StepKonfirmasi />;
  return <StepIdentifikasi />;
}

export default function IdentificationStage() {
  const { comic, setCanAdvance } = useLearningEngine();

  useEffect(() => {
    setCanAdvance(false);
  }, [setCanAdvance]);

  const handleCompleteChange = useCallback(
    (isComplete: boolean) => setCanAdvance(isComplete),
    [setCanAdvance]
  );

  return (
    <IdentificationProvider
      comicId={comic.id}
      lokasi={comic.lokasi}
      subtitle={comic.subtitle}
      kelas={comic.kelas}
      cover={comic.cover}
      title={comic.title}
      learningTargets={comic.learningTargets}
      onCompleteChange={handleCompleteChange}
    >
      <SlideNavBridge />
      <StepRouter />
    </IdentificationProvider>
  );
}
