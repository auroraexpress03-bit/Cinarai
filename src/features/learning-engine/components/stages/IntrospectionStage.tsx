'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { serverTimestamp } from 'firebase/firestore';
import { useLearningEngine } from '../../hooks/useLearningEngine';

const REFLECTION_PROMPTS = [
  'Saya bisa menjelaskan pelajaran ini dengan kata sendiri.',
  'Saya memahami hubungan antara cerita dan konsep pembelajaran.',
  'Saya tahu hal apa yang perlu saya latih lagi.',
  'Saya merasa lebih percaya diri setelah belajar.'
] as const;

const STAR_LABELS = ['Sangat kurang', 'Kurang', 'Cukup', 'Paham', 'Sangat paham'] as const;
const MIN_REFLECTION_LENGTH = 10;

export default function IntrospectionStage() {
  const router = useRouter();
  const { comic, progress, completeCurrentStage } = useLearningEngine();
  const [checked, setChecked] = useState<boolean[]>(REFLECTION_PROMPTS.map(() => false));
  const [rating, setRating] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{
    appreciation: string;
    summary: string;
    strength: string;
    suggestion: string;
  } | null>(null);
  const [displayedResult, setDisplayedResult] = useState<{
    appreciation: string;
    summary: string;
    strength: string;
    suggestion: string;
  }>({
    appreciation: '',
    summary: '',
    strength: '',
    suggestion: '',
  });
  const [typingSectionIndex, setTypingSectionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const checkedCount = checked.filter(Boolean).length;
  const hasAtLeastOneCheck = checkedCount >= 1;
  const hasRating = rating !== null;
  const hasMinimumReflection = reflection.trim().length >= MIN_REFLECTION_LENGTH;
  const canSave = hasAtLeastOneCheck && hasRating && hasMinimumReflection;

  const handleToggle = (index: number) => {
    setChecked((current) => current.map((value, idx) => (idx === index ? !value : value)));
    setSaved(false);
  };

  const formatStageResult = (sintaks: 'Identification' | 'Argumentation' | 'Resolution' | 'Application'): string => {
    const stage = progress.sintaksList.find((item) => item.sintaks === sintaks);
    if (!stage) {
      return `Hasil ${sintaks} tidak tersedia.`;
    }

    if (stage.status === 'COMPLETED') {
      return `${sintaks} sudah selesai.`;
    }

    if (stage.status === 'CURRENT') {
      return `${sintaks} sedang dikerjakan.`;
    }

    return `${sintaks} belum dimulai.`;
  };

  const fetchAiReflection = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    setDisplayedResult({ appreciation: '', summary: '', strength: '', suggestion: '' });
    setTypingSectionIndex(0);
    setIsTyping(false);

    try {
      const response = await fetch('/api/ai/introspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identificationResult: formatStageResult('Identification'),
          argumentationResult: formatStageResult('Argumentation'),
          resolutionResult: formatStageResult('Resolution'),
          applicationResult: formatStageResult('Application'),
          confidence: rating,
          reflectionText: reflection.trim(),
          comicTitle: comic.title,
          lokasi: comic.lokasi,
          classLevel: comic.kelas,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error ?? 'AI tidak responsif.');
      }

      const result = {
        appreciation: data.appreciation ?? 'Kamu sudah melakukan refleksi yang baik.',
        summary: data.summary ?? 'Kamu sudah menunjukkan kemajuan dari belajar tadi.',
        strength: data.strength ?? 'Kamu punya kekuatan untuk terus berusaha.',
        suggestion: data.suggestion ?? 'Tetap latihan dan ajukan pertanyaan jika perlu.',
      };

      setAiResult(result);
      setDisplayedResult({ appreciation: '', summary: '', strength: '', suggestion: '' });
      setTypingSectionIndex(0);
      setIsTyping(true);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Terjadi kesalahan AI.');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (!aiResult || !isTyping) return;

    const sections: Array<keyof typeof aiResult> = ['appreciation', 'summary', 'strength', 'suggestion'];
    const sectionKey = sections[typingSectionIndex];
    if (!sectionKey) {
      setIsTyping(false);
      return;
    }

    const fullText = aiResult[sectionKey];
    const currentText = displayedResult[sectionKey] || '';

    if (currentText.length >= fullText.length) {
      if (typingSectionIndex < sections.length - 1) {
        const delay = window.setTimeout(() => setTypingSectionIndex((value) => value + 1), 300);
        return () => window.clearTimeout(delay);
      }

      setIsTyping(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setDisplayedResult((current) => ({
        ...current,
        [sectionKey]: fullText.slice(0, currentText.length + 1),
      }));
    }, 30);

    return () => window.clearTimeout(timeout);
  }, [aiResult, displayedResult, isTyping, typingSectionIndex]);

  const handleSave = async () => {
    setAttemptedSave(true);
    if (!canSave) return;

    const metadata = {
      introspection: {
        completed: true,
        checklist: REFLECTION_PROMPTS.map((prompt, index) => ({ prompt, checked: checked[index] })),
        confidence: rating,
        reflectionText: reflection.trim(),
        completedAt: serverTimestamp(),
      },
    };

    const savedSuccessfully = await completeCurrentStage(metadata);
    if (savedSuccessfully) {
      setSaved(true);
      await fetchAiReflection();
    }
  };

  const handleViewReport = () => {
    const comicId = comic.id;
    router.push(`/report?comicId=${comicId}`);
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      <section className="rounded-[24px] bg-white px-5 py-6 shadow-sm sm:px-6 sm:py-8">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-primary-700">Introspection</p>
        <h1 className="mt-4 text-3xl font-black text-neutral-950 sm:text-4xl">Refleksi Diri</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:text-base">
          Isi refleksi ini untuk menutup pembelajaranmu di <span className="font-black text-primary-600">{comic.lokasi}</span>.
        </p>
      </section>

      <section className="rounded-[24px] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-neutral-900">Refleksi Diri</h2>
            <p className="mt-2 text-sm text-neutral-500">Pilih pernyataan yang sesuai dengan pengalamanmu.</p>
          </div>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-primary-700">
            {checkedCount}/4 tercentang
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {REFLECTION_PROMPTS.map((prompt, index) => (
            <label
              key={prompt}
              className="flex cursor-pointer items-start gap-3 rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-4 transition hover:border-primary-200 hover:bg-white"
            >
              <input
                type="checkbox"
                checked={checked[index]}
                onChange={() => handleToggle(index)}
                className="mt-[0.35rem] h-5 w-5 rounded-md border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm leading-relaxed text-neutral-700">{prompt}</span>
            </label>
          ))}
        </div>

        {attemptedSave && !hasAtLeastOneCheck && (
          <p className="mt-3 text-sm font-semibold text-red-600">Pilih minimal satu pernyataan refleksi.</p>
        )}
      </section>

      <section className="rounded-[24px] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-neutral-900">Penilaian Bintang</h2>
            <p className="mt-2 text-sm text-neutral-500">Pilih nilai 1–5 berdasarkan perasaanmu saat ini.</p>
          </div>
          <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-neutral-500">
            {hasRating ? STAR_LABELS[rating - 1] : 'Belum memilih'}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            const selected = rating === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setRating(value);
                  setSaved(false);
                }}
                aria-pressed={selected}
                aria-label={`Berikan nilai ${value}`}
                className={[
                  'flex h-12 w-full items-center justify-center gap-2 rounded-3xl border text-sm font-black transition duration-200',
                  selected
                    ? 'border-primary-600 bg-primary-600 text-white shadow-sm scale-105 animate-pulse'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-200 hover:bg-primary-50',
                ].join(' ')}
              >
                {selected && <span className="text-base leading-none">★</span>}
                {value}
              </button>
            );
          })}
        </div>

        {attemptedSave && !hasRating && (
          <p className="mt-3 text-sm font-semibold text-red-600">Pilih rating untuk mencerminkan pemahamanmu.</p>
        )}
      </section>

      <section className="rounded-[24px] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-neutral-900">Wawasan Pribadi</h2>
            <p className="mt-2 text-sm text-neutral-500">Tulis refleksi singkat tentang apa yang kamu pelajari.</p>
          </div>
          <span className="text-sm font-bold text-neutral-500">{reflection.trim().length} karakter</span>
        </div>

        <textarea
          value={reflection}
          onChange={(event) => {
            setReflection(event.target.value);
            setSaved(false);
          }}
          rows={6}
          placeholder="Tuliskan kesan, pelajaran penting, atau pertanyaan yang masih ingin kamu jawab..."
          className="mt-4 min-h-[160px] w-full resize-none rounded-[28px] border border-neutral-200 bg-neutral-50 px-5 py-4 text-base leading-relaxed text-neutral-900 outline-none transition focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
        />

        {attemptedSave && !hasMinimumReflection && (
          <p className="mt-3 text-sm font-semibold text-red-600">Tulisan harus minimal {MIN_REFLECTION_LENGTH} karakter.</p>
        )}
      </section>

      <section className="rounded-[24px] bg-white p-5 shadow-sm">
        <button
          type="button"
          onClick={saved ? handleViewReport : handleSave}
          disabled={(!canSave && !saved) || aiLoading}
          className={['inline-flex w-full items-center justify-center rounded-3xl px-5 py-4 text-sm font-black transition',
            (canSave && !aiLoading) || saved
              ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-700'
              : 'cursor-not-allowed bg-neutral-200 text-neutral-500'
          ].join(' ')}
        >
          {aiLoading ? 'Membuat refleksi...' : saved ? 'Lihat Laporan Belajar' : 'Simpan'}
        </button>

        {saved && !aiLoading && !aiResult && (
          <div className="mt-3 rounded-3xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm animate-stage-in">
            <p className="flex items-center gap-2 font-semibold">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white animate-bounce">✓</span>
              Refleksi berhasil disimpan.
            </p>
            <button
              type="button"
              onClick={handleViewReport}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-green-600 px-4 py-3 font-black text-white transition hover:bg-green-700"
            >
              Lihat Laporan Belajar
            </button>
          </div>
        )}

        {aiError && (
          <div className="mt-3 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-fade-in">
            <p className="font-semibold">AI Reflection gagal dibuat.</p>
            <p>{aiError}</p>
          </div>
        )}

        {aiLoading && (
          <div className="mt-4 space-y-4 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 animate-fade-in">
            <div className="flex items-center gap-3 text-sm font-black text-neutral-700">
              <span className="h-3 w-3 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
              Membuat refleksi AI...
            </div>
            <div className="space-y-3">
              <div className="h-16 rounded-3xl skeleton" />
              <div className="h-14 rounded-3xl skeleton" />
              <div className="h-14 rounded-3xl skeleton" />
              <div className="h-14 rounded-3xl skeleton" />
            </div>
          </div>
        )}

        {aiResult && (
          <div className="mt-4 space-y-4 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 animate-fade-in stagger-children">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-primary-700">Refleksi AI</p>
            <button
              type="button"
              onClick={handleViewReport}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-primary-600 px-4 py-3 text-sm font-black text-white transition hover:bg-primary-700"
            >
              Lihat Laporan Belajar
            </button>
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Apresiasi</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
                {isTyping ? displayedResult.appreciation : aiResult.appreciation}
              </p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Ringkasan kemampuan</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
                {isTyping ? displayedResult.summary : aiResult.summary}
              </p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Kekuatan</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
                {isTyping ? displayedResult.strength : aiResult.strength}
              </p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Saran belajar</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
                {isTyping ? displayedResult.suggestion : aiResult.suggestion}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
