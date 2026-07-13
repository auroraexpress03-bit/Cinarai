'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useLearningEngine } from '../../hooks/useLearningEngine';
import { loadIdentificationAnswers } from '../../stages/Identification/services/identificationAnswerService';
import { getArgumentationLearningObject } from '../../stages/Argumentation/data/argumentationQuestions';
import type { Comic1ArgumentationQuestion } from '@/features/comics/comic-1/content/types';

/* eslint-disable @next/next/no-img-element */

type FeedbackLevel = 'SANGAT_BAIK' | 'HAMPIR_BENAR' | 'PERLU_PERBAIKAN';

interface AiFeedback {
  level: FeedbackLevel;
  score: number;
  feedback: string;
  strength?: string;
  improvement?: string;
  suggestion?: string;
}

function ShapeIcon({ solid, className }: { solid: string; className?: string }) {
  const normalized = solid.toLowerCase();

  if (normalized.includes('kerucut')) {
    return (
      <div className={className} aria-label={solid}>
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <path d="M60 12 L92 96 L28 96 Z" fill="none" stroke="#1875cc" strokeWidth="6" strokeLinejoin="round" />
          <path d="M60 12 L72 42 L48 42 Z" fill="none" stroke="#1875cc" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('kubus')) {
    return (
      <div className={className} aria-label={solid}>
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <rect x="28" y="34" width="64" height="64" rx="12" fill="none" stroke="#1875cc" strokeWidth="6" />
          <path d="M28 34 L60 18 L92 34" fill="none" stroke="#1875cc" strokeWidth="6" />
          <path d="M92 34 L92 98" fill="none" stroke="#1875cc" strokeWidth="6" />
          <path d="M28 34 L28 98" fill="none" stroke="#1875cc" strokeWidth="6" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('balok')) {
    return (
      <div className={className} aria-label={solid}>
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <rect x="26" y="34" width="68" height="58" rx="8" fill="none" stroke="#1875cc" strokeWidth="6" />
          <path d="M26 34 L56 18 L124 18" fill="none" stroke="#1875cc" strokeWidth="6" />
          <path d="M94 34 L124 18" fill="none" stroke="#1875cc" strokeWidth="6" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('limas')) {
    return (
      <div className={className} aria-label={solid}>
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <path d="M20 90 L60 20 L100 90 Z" fill="none" stroke="#1875cc" strokeWidth="6" />
          <path d="M20 90 L60 60 L100 90" fill="none" stroke="#1875cc" strokeWidth="6" />
          <path d="M60 20 L60 60" fill="none" stroke="#1875cc" strokeWidth="6" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('prisma')) {
    return (
      <div className={className} aria-label={solid}>
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <path d="M24 36 L60 20 L96 36 L96 86 L60 102 L24 86 Z" fill="none" stroke="#1875cc" strokeWidth="6" />
          <path d="M24 36 L60 52 L96 36" fill="none" stroke="#1875cc" strokeWidth="6" />
          <path d="M60 52 L60 102" fill="none" stroke="#1875cc" strokeWidth="6" />
        </svg>
      </div>
    );
  }

  return (
    <div className={className} aria-label={solid}>
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <circle cx="60" cy="60" r="32" fill="none" stroke="#1875cc" strokeWidth="6" />
      </svg>
    </div>
  );
}

function FeedbackCard({ feedback, studentAnswer }: { feedback: AiFeedback; studentAnswer: string }) {
  const badge =
    feedback.level === 'SANGAT_BAIK'
      ? { label: 'Sangat Baik', emoji: '✅' }
      : feedback.level === 'PERLU_PERBAIKAN'
        ? { label: 'Perlu Perbaikan', emoji: '🔎' }
        : { label: 'Hampir Benar', emoji: '✨' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-[24px] border border-emerald-200 bg-emerald-50 shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-emerald-100 bg-white/90 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-lg">
          🤖
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-700">AI Feedback</p>
          <p className="mt-0.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">
            {badge.emoji} {badge.label}
          </p>
        </div>
      </div>
      <div className="space-y-4 px-4 py-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Jawabanmu</p>
          <p className="mt-2 text-sm italic leading-relaxed text-neutral-600">“{studentAnswer}”</p>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-neutral-800">
          <p>{feedback.feedback}</p>
          {feedback.strength ? (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Kekuatan</p>
              <p className="mt-1 text-sm text-neutral-700">{feedback.strength}</p>
            </div>
          ) : null}
          {feedback.improvement ? (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Perbaikan</p>
              <p className="mt-1 text-sm text-neutral-700">{feedback.improvement}</p>
            </div>
          ) : null}
          {feedback.suggestion ? (
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Saran</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-700">{feedback.suggestion}</p>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

function isComic1ArgumentationQuestion(question: unknown): question is Comic1ArgumentationQuestion {
  return (
    typeof question === 'object' &&
    question !== null &&
    'argumentationPhoto' in question &&
    'argumentationHighlight' in question &&
    'argumentationPrompt' in question &&
    'argumentationQuestion' in question &&
    'argumentationTitle' in question
  );
}

export default function ArgumentationStage() {
  const { comic, comicModule, setCanAdvance, nextStage } = useLearningEngine();
  const { user } = useAuth();
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!user?.uid || !comic.id) return;

    let active = true;

    void loadIdentificationAnswers(user.uid, comic.id).then((items) => {
      if (!active) return;
      const shapes = items.flatMap((item) => item.selectedShapes ?? []);
      setSelectedShapes(shapes);
    });

    return () => {
      active = false;
    };
  }, [comic.id, user?.uid]);

  const learningObject = useMemo(
    () => getArgumentationLearningObject(selectedShapes, comicModule.argumentation),
    [selectedShapes, comicModule.argumentation],
  );
  const question = learningObject ? learningObject.question : 'Mengapa bagian candi ini dapat dimodelkan sebagai bangun ruang?';
  const charCount = answer.trim().length;
  const canSubmit = charCount >= 20 && !isSubmitting && !feedback;

  const adjustTextareaHeight = useCallback(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, []);

  useEffect(() => {
    setCanAdvance(Boolean(feedback));
  }, [feedback, setCanAdvance]);

  const handleSubmit = useCallback(async () => {
    if (!learningObject || !canSubmit) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ai/argumentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          studentAnswer: answer,
          shapeName: learningObject.solid,
          templePart: learningObject.objectName,
          comicTitle: comic.title,
          lokasi: comic.lokasi,
          classLevel: comic.kelas,
        }),
      });

      const data = (await response.json()) as {
        feedback?: string;
        strength?: string;
        improvement?: string;
        suggestion?: string;
        level?: FeedbackLevel;
        score?: number;
      };

      setFeedback({
        level: data.level ?? 'HAMPIR_BENAR',
        score: Math.min(5, Math.max(1, Number(data.score) || 4)),
        feedback: data.feedback ?? learningObject.aiFeedback,
        strength: data.strength,
        improvement: data.improvement,
        suggestion: data.suggestion,
      });
    } catch {
      setFeedback({
        level: 'HAMPIR_BENAR',
        score: 4,
        feedback: learningObject.aiFeedback,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [answer, canSubmit, comic.kelas, comic.lokasi, comic.title, learningObject, question]);

  useEffect(() => {
    setAnswer('');
    setFeedback(null);
  }, [learningObject?.id]);

  if (!learningObject) {
    return (
      <div className="rounded-[24px] bg-white p-5 text-sm text-neutral-600 shadow-sm">
        Memuat objek belajar dari hasil identifikasi...
      </div>
    );
  }

  // If this is Comic 1, render the new CINARAI Blueprint UI
  if (comic.id === 1) {
    const argObjs = comicModule.argumentation?.questions ?? [];
    const argObj = learningObject && argObjs.length > 0
      ? argObjs.find((q) => q.shapeName === learningObject.solid || q.shapeKey === learningObject.solid?.toLowerCase()) ?? argObjs[0]
      : argObjs[0] ?? null;

    const isComic1ArgObj = isComic1ArgumentationQuestion(argObj);
    const questionText = isComic1ArgObj ? argObj.argumentationQuestion : argObj?.question ?? question;
    const photoSrc = isComic1ArgObj ? argObj.argumentationPhoto : argObj?.image ?? argObj?.photoSrc ?? '';
    const shapeImage = isComic1ArgObj ? argObj.image ?? argObj.photoSrc ?? '' : argObj?.image ?? argObj?.photoSrc ?? '';
    const promptText = isComic1ArgObj ? argObj.argumentationPrompt : argObj?.question ?? '';

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-4"
      >
        <header className="rounded-[24px] bg-gradient-to-br from-secondary-400 to-secondary-600 px-4 py-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/80">ARGUMENTATION</p>
        </header>

        <div className="rounded-[24px] bg-white p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-secondary-600">Pertanyaan Argumentasi</p>
          <p className="mt-3 text-base font-black leading-relaxed text-neutral-900">{questionText}</p>
        </div>

        <div className="grid gap-4 rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm lg:grid-cols-[1.3fr_1fr]">
          <div className="overflow-hidden rounded-[24px] bg-neutral-100">
            <img
              src={photoSrc}
              alt={argObj?.photoAlt ?? 'Foto bagian candi'}
              className="h-full w-full object-cover"
              style={{ minHeight: 320 }}
            />
          </div>
          <div className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Bangun Ruang</p>
                <p className="mt-3 text-3xl font-black text-neutral-900">{argObj?.shapeName}</p>
              </div>
              <div className="rounded-[20px] border border-secondary-100 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-700">Ilustrasi Bangun Ruang</p>
                {shapeImage ? (
                  <img src={shapeImage} alt={`Ilustrasi ${argObj?.shapeName}`} className="mt-4 h-48 w-full object-contain" />
                ) : (
                  <p className="mt-4 text-sm text-neutral-500">Ilustrasi tidak tersedia.</p>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Bagian Candi</p>
                  <p className="mt-2 text-lg font-black text-neutral-900">{argObj?.templePart}</p>
                </div>
                <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Judul</p>
                  <p className="mt-2 text-lg font-black text-neutral-900">{isComic1ArgObj ? argObj.argumentationTitle : argObj?.title ?? argObj?.templePart}</p>
                </div>
              </div>
              {promptText ? (
                <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Petunjuk Jawaban</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">{promptText}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {!feedback ? (
          <div className="rounded-[24px] bg-white p-4 shadow-sm">
            <label htmlFor="argumentation-answer" className="mb-2 block text-sm font-black text-neutral-700">Jawabanmu</label>
            <textarea
              id="argumentation-answer"
              ref={textareaRef}
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
                requestAnimationFrame(adjustTextareaHeight);
              }}
              placeholder="Tuliskan alasanmu di sini..."
              className="min-h-[160px] w-full resize-none rounded-[20px] border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm leading-relaxed text-neutral-800 outline-none transition focus:border-secondary-400 focus:bg-white"
              style={{ minHeight: 160 }}
            />
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className={charCount < 20 ? 'font-semibold text-warning-600' : 'font-semibold text-accent-600'}>
                {charCount < 20 ? `Minimal 20 karakter (${charCount}/20)` : `${charCount} karakter ✓`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!canSubmit}
              className="mt-4 w-full rounded-[20px] bg-secondary-500 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-secondary-600 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {isSubmitting ? 'Sedang menganalisis...' : 'Kirim Jawaban'}
            </button>
          </div>
        ) : (
          <FeedbackCard feedback={feedback} studentAnswer={answer} />
        )}

        {feedback && (
          <button
            type="button"
            onClick={() => void nextStage()}
            className="w-full rounded-[20px] bg-accent-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-accent-700"
          >
            Lanjut
          </button>
        )}
      </motion.div>
    );
  }

  // Fallback: existing behavior for other comics
  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">{/* original UI preserved for non-comic1 */}
      <header className="rounded-[24px] bg-gradient-to-br from-secondary-400 to-secondary-600 px-4 py-5 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/80">Argumentation</p>
        <h2 className="mt-1 text-lg font-black text-white">Jelaskan alasanmu berdasarkan objek yang kamu pilih.</h2>
      </header>
      {/* reuse previous UI sections for non-comic1 */}
      <div className="rounded-[24px] bg-white p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-secondary-600">Pertanyaan Argumentasi</p>
        <p className="mt-3 text-base font-black leading-relaxed text-neutral-900">{question}</p>
      </div>
      <div className="grid gap-4 rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-[240px_1fr]">
        <div className="overflow-hidden rounded-[24px] bg-neutral-50">
          <img src={learningObject.image} alt={learningObject.objectName} className="h-64 w-full object-cover" />
          {learningObject.overlaySrc ? (
            <img
              src={learningObject.overlaySrc}
              alt={`${learningObject.objectName} overlay`}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-90"
            />
          ) : null}
        </div>
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="rounded-[20px] border border-secondary-100 bg-secondary-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-700">Bagian</p>
              <p className="mt-2 text-lg font-black text-neutral-900">{learningObject.objectName}</p>
            </div>
            <div className="rounded-[20px] border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Bangun ruang</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white shadow-sm">
                  <ShapeIcon solid={learningObject.solid} className="h-11 w-11" />
                </div>
                <div>
                  <p className="text-sm font-black text-neutral-900">{learningObject.solid}</p>
                  <p className="text-sm text-neutral-500">Modelkan bagian ini sebagai bangun ruang.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[20px] border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Panduan singkat</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">Gunakan jawabanmu untuk menjelaskan ciri bagian candi dan alasan mengapa itu cocok digambarkan sebagai {learningObject.solid.toLowerCase()}.</p>
          </div>
        </div>
      </div>

      {!feedback ? (
        <div className="rounded-[24px] bg-white p-4 shadow-sm">
          <label htmlFor="argumentation-answer" className="mb-2 block text-sm font-black text-neutral-700">
            Jawabanmu
          </label>
          <textarea
            id="argumentation-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            rows={6}
            placeholder="Tuliskan alasanmu di sini..."
            className="w-full resize-none rounded-[20px] border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-800 outline-none transition focus:border-secondary-400 focus:bg-white"
          />
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className={charCount < 20 ? 'font-semibold text-warning-600' : 'font-semibold text-accent-600'}>
              {charCount < 20 ? `Minimal 20 karakter (${charCount}/20)` : `${charCount} karakter ✓`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit}
            className="mt-4 w-full rounded-[20px] bg-secondary-500 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-secondary-600 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isSubmitting ? 'Sedang menganalisis...' : 'Kirim Jawaban'}
          </button>
        </div>
      ) : (
        <FeedbackCard feedback={feedback} studentAnswer={answer} />
      )}

      {feedback && (
        <button
          type="button"
          onClick={() => void nextStage()}
          className="w-full rounded-[20px] bg-accent-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-accent-700"
        >
          Lanjut
        </button>
      )}
    </div>
  );
}
