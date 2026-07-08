'use client';

import { useCallback, useEffect } from 'react';
import { useLearningEngine } from '../../../hooks/useLearningEngine';
import { useIdentificationContext } from '../context/IdentificationContext';

export default function IdentificationNavigation() {
  const {
    state,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    checkedItems,
  } = useIdentificationContext();
  const { registerSlideNav, unregisterSlideNav } = useLearningEngine();

  const { items, isComplete } = state;
  const totalQuestions = items.length;

  const currentItem = items[currentQuestionIndex];
  const currentChecked = currentItem
    ? currentItem.answerStatus === 'SAVED' || Boolean(checkedItems[currentItem.id])
    : false;

  const onFirstQuestion = currentQuestionIndex === 0;
  const onLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Pada soal terakhir: tombol Lanjut hanya aktif jika semua soal selesai
  // Pada soal lain: tombol Lanjut aktif jika soal saat ini sudah dicek
  const canGoNext = onLastQuestion ? isComplete : currentChecked;
  const canGoPrev = !onFirstQuestion;

  const goNext = useCallback(() => {
    if (!onLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [onLastQuestion, currentQuestionIndex, setCurrentQuestionIndex]);

  const goPrev = useCallback(() => {
    if (!onFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [onFirstQuestion, currentQuestionIndex, setCurrentQuestionIndex]);

  // Saat pindah soal via BottomNav, pastikan checkedItems tidak di-reset
  // (jawaban yang sudah dicek tetap tampil)

  useEffect(() => {
    registerSlideNav({
      slideIndex: currentQuestionIndex,
      totalSlides: totalQuestions,
      canGoNext,
      canGoPrev,
      goNext,
      goPrev,
    });
  }, [currentQuestionIndex, totalQuestions, canGoNext, canGoPrev, goNext, goPrev, registerSlideNav]);

  useEffect(() => () => unregisterSlideNav(), [unregisterSlideNav]);

  return null;
}
