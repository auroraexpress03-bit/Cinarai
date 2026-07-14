export interface StagePageNavigationState {
  onFirstSlide: boolean;
  onLastSlide: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export function getStagePageNavigationState(currentIndex: number, totalSlides: number): StagePageNavigationState {
  const safeTotalSlides = Math.max(1, totalSlides);

  return {
    onFirstSlide: currentIndex <= 0,
    onLastSlide: currentIndex >= safeTotalSlides - 1,
    canGoPrev: currentIndex > 0,
    canGoNext: currentIndex < safeTotalSlides - 1,
  };
}
