'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';
import { useComicMetadata } from '@/services/comic-assets/useComicMetadata';
import { useSnackbar } from '@/context/SnackbarContext';
import type { ComicAssetEntry } from '@/services/comic-assets/types';
import type { Comic } from '@/types/comic';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isSketchfab(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes('sketchfab.com') || host.includes('skfb.ly');
  } catch {
    return false;
  }
}

function getQuickQuestions(objectName: string): string[] {
  const n = objectName.toLowerCase();
  if (n.includes('kubus'))
    return [
      'Apa nama bangun ruang ini?',
      'Berapa jumlah sisinya?',
      'Berapa jumlah rusuknya?',
      'Berapa titik sudutnya?',
      'Mengapa bagian bawah Candi Jawi berbentuk kubus?',
    ];
  if (n.includes('balok'))
    return [
      'Apa nama bangun ruang ini?',
      'Berapa jumlah sisi balok ini?',
      'Apa perbedaan balok dan kubus?',
      'Bagaimana bentuk rusuk pada balok?',
    ];
  if (n.includes('limas'))
    return [
      'Apa nama bangun ruang ini?',
      'Berapa jumlah sisi limas ini?',
      'Apa perbedaan limas dan prisma?',
      'Mengapa atap candi berbentuk limas?',
    ];
  if (n.includes('prisma'))
    return [
      'Apa nama bangun ruang ini?',
      'Berapa jumlah sisi prisma ini?',
      'Apa perbedaan prisma dan balok?',
      'Di mana kita bisa melihat bentuk prisma di Candi Jawi?',
    ];
  if (n.includes('kerucut'))
    return [
      'Apa nama bangun ruang ini?',
      'Apa ciri khas alas kerucut?',
      'Apa perbedaan kerucut dan tabung?',
      'Mengapa bentuk atap candi mirip kerucut?',
    ];
  if (n.includes('tabung'))
    return [
      'Apa nama bangun ruang ini?',
      'Apa bentuk alas dan tutup tabung?',
      'Berapa jumlah rusuk tabung?',
      'Mengapa struktur ini sering muncul pada bangunan?',
    ];
  return [
    'Apa nama bangun ruang ini?',
    'Berapa jumlah rusuknya?',
    'Bagaimana bentuk sisi-sisinya?',
    'Apa kaitannya dengan Candi Jawi?',
  ];
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: number;
  role: 'assistant' | 'user';
  content: string;
}

// ─── ObjectAiPanel ────────────────────────────────────────────────────────────
// Self-contained AI chat panel scoped to a single AR object.
// Has its own messages, draft, isResponding, aiError — fully isolated.

interface ObjectAiPanelProps {
  entry: ComicAssetEntry;
  comic: Comic;
}

/* eslint-disable @next/next/no-img-element */
function ObjectAiPanel({ entry, comic }: ObjectAiPanelProps) {
  const objectName = entry.title?.trim() || 'Bangun Ruang';
  const quickQuestions = useMemo(() => getQuickQuestions(objectName), [objectName]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: `Halo! Aku siap membantu kamu memahami ${objectName}. Silakan tanyakan apa saja!`,
    },
  ]);
  const [draft, setDraft] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isResponding]);

  const handleSend = useCallback(
    async (rawText?: string) => {
      const trimmed = (rawText ?? draft).trim();
      if (!trimmed || isResponding) return;

      console.info(`[Navigation][${objectName}] AI Request Start — question:`, trimmed);

      const userMessage: ChatMessage = { id: Date.now(), role: 'user', content: trimmed };
      const nextMessages = [...messages, userMessage];
      const historyForPrompt = nextMessages.map(({ role, content }) => ({ role, content }));

      setMessages(nextMessages);
      setDraft('');
      setIsResponding(true);
      setAiError(null);

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: trimmed,
            context: {
              moduleName: comic.title,
              identification: [],
              objectInfo: {
                location: comic.lokasi,
                classLevel: comic.kelas,
                synopsis: comic.synopsis,
                learningTargets: comic.learningTargets,
              },
              observationAnswers: {},
              sessionHistory: historyForPrompt,
              comicTitle: comic.title,
              pageLabel: `Halaman ${entry.page}`,
              objectName,
              learningStage: 'Navigation',
            },
          }),
        });

        const payload = (await response.json()) as {
          answer?: string;
          provider?: string;
          error?: string;
        };

        if (!response.ok || !payload.answer) {
          throw new Error(payload.error ?? 'AI response was not available.');
        }

        console.info(
          `[Navigation][${objectName}] AI Response Success — provider:`,
          payload.provider,
          'length:',
          payload.answer.length,
        );

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'assistant', content: payload.answer! },
        ]);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`[Navigation][${objectName}] AI Error:`, msg);
        setAiError(msg);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: 'assistant',
            content: `Maaf, terjadi kesalahan saat menghubungi layanan AI: ${msg}`,
          },
        ]);
      } finally {
        setIsResponding(false);
      }
    },
    [comic, draft, entry.page, isResponding, messages, objectName],
  );

  return (
    <div className="mt-3 flex flex-col gap-0 overflow-hidden rounded-[20px] border border-primary-100 bg-gradient-to-b from-[#F5FBFF] to-white shadow-[0_4px_16px_rgba(47,128,237,0.08)]">
      {/* Robot header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-[#EBF5FF] to-[#F5FBFF] px-4 py-3">
        <div
          className={[
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/80 shadow-[0_4px_12px_rgba(47,128,237,0.15)]',
            isResponding ? 'animate-ai-blink' : 'animate-ai-float',
          ].join(' ')}
        >
          <img
            src="/images/ai/robot.svg"
            alt="Robot AI"
            width={32}
            height={32}
            className="h-8 w-8 drop-shadow-sm"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-widest text-primary-600">
            AI Tutor
          </p>
          <p className="truncate text-sm font-bold text-neutral-700">{objectName}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={[
              'h-2 w-2 rounded-full',
              isResponding ? 'animate-pulse bg-secondary-500' : 'bg-accent-500',
            ].join(' ')}
          />
          <span className="text-xs font-semibold text-neutral-400">
            {isResponding ? 'Berpikir...' : 'Siap'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3">
        {/* Chat messages */}
        <div className="flex max-h-44 flex-col gap-2 overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={['flex', msg.role === 'user' ? 'justify-end' : 'justify-start'].join(' ')}
            >
              <div
                className={[
                  'max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'rounded-br-sm bg-primary-600 text-white'
                    : 'rounded-bl-sm border border-primary-100 bg-[#F5FBFF] text-neutral-800',
                ].join(' ')}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isResponding && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-primary-100 bg-[#F5FBFF] px-3 py-2.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick questions */}
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => void handleSend(q)}
              disabled={isResponding}
              className="rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 shadow-sm transition hover:border-primary-400 hover:bg-primary-50 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            rows={2}
            placeholder="Tulis pertanyaanmu..."
            className="flex-1 resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={isResponding || !draft.trim()}
            className="mb-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white shadow-[0_4px_12px_rgba(47,128,237,0.28)] transition hover:bg-primary-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none"
            aria-label="Kirim pertanyaan"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {aiError && (
          <div className="rounded-2xl border border-error-200 bg-error-50 px-3 py-2.5 text-xs font-semibold text-error-700">
            Terjadi error: {aiError}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ObjectExploreCard ────────────────────────────────────────────────────────
// One card per model3D entry: AR button + explored badge + per-object AI panel.

interface ObjectExploreCardProps {
  entry: ComicAssetEntry;
  index: number;
  explored: boolean;
  comic: Comic;
  onOpenAr: (entry: ComicAssetEntry) => void;
}

function ObjectExploreCard({ entry, index, explored, comic, onOpenAr }: ObjectExploreCardProps) {
  const [showAi, setShowAi] = useState(false);
  const objectName = entry.title?.trim() || 'Bangun Ruang';
  const valid = isValidUrl(entry.url);

  // Auto-open AI panel after AR is explored
  useEffect(() => {
    if (explored) setShowAi(true);
  }, [explored]);

  return (
    <div
      className={[
        'rounded-[20px] border p-4 transition-all duration-200',
        explored
          ? 'border-accent-200 bg-accent-50/40'
          : 'border-neutral-200 bg-white',
      ].join(' ')}
    >
      {/* Card header */}
      <div className="flex items-center gap-3">
        <div
          className={[
            'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-black',
            explored ? 'bg-accent-500 text-white' : 'bg-primary-100 text-primary-700',
          ].join(' ')}
        >
          {explored ? '✓' : index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Objek {index + 1}
          </p>
          <h3 className="truncate text-base font-black text-neutral-900">{objectName}</h3>
        </div>
        {explored && (
          <span className="rounded-full bg-accent-100 px-2.5 py-1 text-xs font-bold text-accent-700">
            Selesai
          </span>
        )}
      </div>

      {/* AR button */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpenAr(entry)}
          disabled={!valid}
          className={[
            'inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition',
            explored
              ? 'border-accent-300 bg-accent-50 text-accent-700 hover:bg-accent-100'
              : 'border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50',
          ].join(' ')}
        >
          <span>🔭</span>
          <span>{explored ? `Buka Lagi: ${objectName}` : `Lihat AR: ${objectName}`}</span>
        </button>

        {/* Toggle AI panel button */}
        {explored && (
          <button
            type="button"
            onClick={() => setShowAi((v) => !v)}
            className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-primary-200 bg-primary-50 text-lg transition hover:bg-primary-100"
            aria-label={showAi ? 'Tutup AI' : 'Buka AI'}
            title={showAi ? 'Tutup AI Tutor' : 'Tanya AI Tutor'}
          >
            🤖
          </button>
        )}
      </div>

      {/* Per-object AI panel — only shown after AR explored */}
      {explored && showAi && <ObjectAiPanel entry={entry} comic={comic} />}
    </div>
  );
}

// ─── NavigationStage ──────────────────────────────────────────────────────────

export default function NavigationStage() {
  const { comic, setCanAdvance, unregisterSlideNav, nextStage } = useLearningEngine();
  const { showSnackbar } = useSnackbar();
  const metadata = useComicMetadata(comic.id);
  const { model3D } = metadata.assets;

  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());
  const [embedEntryId, setEmbedEntryId] = useState<string | null>(null);

  // Progress gate: all valid model3D entries must be explored. AI is optional.
  const requiredIds = useMemo(
    () => model3D.filter((e) => isValidUrl(e.url)).map((e) => `${e.page}-${e.url}`),
    [model3D],
  );
  const canAdvanceToArgumentation =
    requiredIds.length > 0 && requiredIds.every((id) => exploredIds.has(id));

  useEffect(() => {
    setCanAdvance(canAdvanceToArgumentation);
    console.info(
      '[Navigation] canAdvance:', canAdvanceToArgumentation,
      'explored:', exploredIds.size, '/', requiredIds.length,
    );
  }, [canAdvanceToArgumentation, exploredIds.size, requiredIds.length, setCanAdvance]);

  useEffect(() => {
    return () => { unregisterSlideNav(); };
  }, [unregisterSlideNav]);

  function handleOpenAr(entry: ComicAssetEntry) {
    if (!isValidUrl(entry.url)) {
      showSnackbar('Link AR belum tersedia.', 'info');
      return;
    }

    const entryId = `${entry.page}-${entry.url}`;
    setExploredIds((prev) => {
      if (prev.has(entryId)) return prev;
      const next = new Set(prev);
      next.add(entryId);
      console.info('[Navigation] AR explored:', entry.title, '—', next.size, '/', requiredIds.length);
      return next;
    });

    if (isSketchfab(entry.url)) {
      setEmbedEntryId(entryId);
      return;
    }
    window.open(entry.url, '_blank', 'noopener,noreferrer');
  }

  function handleContinue() {
    if (!canAdvanceToArgumentation) {
      const remaining = requiredIds.length - exploredIds.size;
      showSnackbar(
        remaining === 1
          ? 'Silakan eksplorasi 1 objek AR lagi sebelum melanjutkan.'
          : `Silakan eksplorasi ${remaining} objek AR lagi sebelum melanjutkan.`,
        'info',
      );
      return;
    }
    void nextStage();
  }

  // Find the entry currently shown as Sketchfab embed
  const embedEntry = embedEntryId
    ? model3D.find((e) => `${e.page}-${e.url}` === embedEntryId) ?? null
    : null;

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-x-hidden px-1 py-1 animate-fade-in-up sm:gap-5 sm:px-2">
      {/* Stage header */}
      <header className="rounded-[24px] bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-4 shadow-sm sm:px-5 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-2xl text-white shadow-sm">
            🧭
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary-600">
              Navigation (AR + AI)
            </p>
            <h2 className="mt-1 text-lg font-black text-neutral-900 sm:text-xl">
              Eksplorasi objek 3D dan tanyakan hasil pengamatanmu kepada AI.
            </h2>
          </div>
        </div>
      </header>

      {/* Sketchfab inline embed — shown when a Sketchfab entry is opened */}
      {embedEntry && (
        <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <p className="text-sm font-bold text-neutral-700">
              Model 3D: {embedEntry.title}
            </p>
            <button
              type="button"
              onClick={() => setEmbedEntryId(null)}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
            >
              Tutup
            </button>
          </div>
          <div className="h-64 w-full sm:h-80">
            <iframe
              src={`${embedEntry.url.replace(/\/$/, '')}/embed`}
              title={`Model 3D ${embedEntry.title}`}
              className="h-full w-full border-0"
              allow="fullscreen"
            />
          </div>
        </div>
      )}

      {/* Object cards */}
      <div className="flex flex-col gap-3">
        {model3D.length > 0 ? (
          model3D.map((entry, index) => {
            const entryId = `${entry.page}-${entry.url}`;
            return (
              <ObjectExploreCard
                key={entryId}
                entry={entry}
                index={index}
                explored={exploredIds.has(entryId)}
                comic={comic}
                onOpenAr={handleOpenAr}
              />
            );
          })
        ) : (
          <div className="rounded-[20px] border border-neutral-200 bg-neutral-50 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-neutral-500">
              Objek AR belum tersedia untuk komik ini.
            </p>
          </div>
        )}
      </div>

      {/* Progress + continue */}
      <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-neutral-600">
            Progress eksplorasi
          </p>
          <span className="text-sm font-black text-primary-700">
            {exploredIds.size}/{requiredIds.length} objek
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
            style={{
              width: requiredIds.length > 0
                ? `${(exploredIds.size / requiredIds.length) * 100}%`
                : '0%',
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => showSnackbar(comic.synopsis || 'Tidak ada info lebih lanjut.', 'info')}
            className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Info
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canAdvanceToArgumentation}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Lanjut
          </button>
        </div>

        {!canAdvanceToArgumentation && (
          <p className="mt-3 text-sm text-neutral-500">
            {requiredIds.length > 1
              ? `Eksplorasi semua objek AR (${exploredIds.size}/${requiredIds.length}) untuk melanjutkan.`
              : 'Buka viewer AR untuk melanjutkan.'}
          </p>
        )}
      </div>
    </div>
  );
}
