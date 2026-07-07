'use client';

import { useCallback, useEffect } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';
import { IdentificationProvider, useIdentificationContext } from '../../stages/Identification/context/IdentificationContext';
import StepIdentifikasi from '../../stages/Identification/components/StepIdentifikasi';

/**
 * Bridges IdentificationContext slides into LearningEngineContext slideNav.
 *
 * Flat slide layout:
 *   0 → OBSERVE
 *   1 → IDENTIFY (with inline feedback)
 */
function SlideNavBridge() {
  const { state } = useIdentificationContext();
  const { registerSlideNav, unregisterSlideNav } = useLearningEngine();

  // Single-slide identification flow in the new blueprint.
  const slideIndex = 0;
  const totalSlides = 1;

  const canGoNext = !!state.completed;

  const canGoPrev = false;

  const goNext = useCallback(() => {}, []);

  const goPrev = useCallback(() => {}, []);

  useEffect(() => {
    registerSlideNav({ slideIndex, totalSlides, canGoNext, canGoPrev, goNext, goPrev });
  }, [slideIndex, totalSlides, canGoNext, canGoPrev, goNext, goPrev, registerSlideNav]);

  useEffect(() => () => unregisterSlideNav(), [unregisterSlideNav]);

  return null;
}

function StepRouter() {
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
