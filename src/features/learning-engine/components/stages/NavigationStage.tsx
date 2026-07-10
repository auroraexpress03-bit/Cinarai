'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';
import { useComicMetadata } from '@/services/comic-assets/useComicMetadata';
import { useSnackbar } from '@/context/SnackbarContext';
import type { ComicAssetEntry } from '@/services/comic-assets/types';
import { Hero3DViewer } from './Hero3DViewer';
import { AssemblrCard } from './AssemblrCard';
import { QrModal } from './QrModal';
import { FloatingAITutor } from './FloatingAITutor';

/* eslint-disable @next/next/no-img-element */

function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function getObjectDisplayName(entry: ComicAssetEntry | null | undefined): string {
  const rawName = entry?.title?.trim();
  if (rawName) return rawName;
  return 'Kubus';
}

function getQuickQuestions(objectName: string): string[] {
  const normalized = objectName.toLowerCase();
  if (normalized.includes('kubus')) {
    return [
      'Apa nama bangun ruang ini?',
      'Berapa jumlah sisinya?',
      'Berapa jumlah rusuknya?',
      'Berapa titik sudutnya?',
      'Mengapa bagian bawah Candi Jawi berbentuk kubus?',
    ];
  }
  if (normalized.includes('balok')) {
    return [
      'Apa nama bangun ruang ini?',
      'Berapa jumlah sisi balok ini?',
      'Apa perbedaan balok dan kubus?',
      'Bagaimana bentuk rusuk pada balok?',
    ];
  }
  if (normalized.includes('kerucut')) {
    return [
      'Apa nama bangun ruang ini?',
      'Apa ciri khas alas kerucut?',
      'Apa perbedaan kerucut dan tabung?',
      'Mengapa bentuk atap candi mirip kerucut?',
    ];
  }
  if (normalized.includes('tabung')) {
    return [
      'Apa nama bangun ruang ini?',
      'Apa bentuk alas dan tutup tabung?',
      'Berapa jumlah rusuk tabung?',
      'Mengapa struktur ini sering muncul pada bangunan?',
    ];
  }
  return [
    'Apa nama bangun ruang ini?',
    'Berapa jumlah rusuknya?',
    'Bagaimana bentuk sisi-sisinya?',
    'Apa kaitannya dengan Candi Jawi?',
  ];
}

interface ChatMessage {
  id: number;
  role: 'assistant' | 'user';
  content: string;
}

const starterMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'Halo! Aku siap membantu kamu mengamati objek ini dan mengaitkannya dengan bangun ruang di Candi Jawi.',
  },
];

/* eslint-disable @next/next/no-img-element */

export default function NavigationStage() {
  const { comic, setCanAdvance, unregisterSlideNav, nextStage } = useLearningEngine();
  const { showSnackbar } = useSnackbar();
  const metadata = useComicMetadata(comic.id);
  const { model3D } = metadata.assets;
  const primaryEntry = model3D[0] ?? null;
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);
  const activeEntry = useMemo(() => {
    if (!model3D.length) return null;
    if (activeObjectId) {
      const matched = model3D.find((entry) => `${entry.page}-${entry.arUrl}` === activeObjectId);
      if (matched) return matched;
    }
    return primaryEntry;
  }, [activeObjectId, model3D, primaryEntry]);
  const activeObjectName = useMemo(() => getObjectDisplayName(activeEntry), [activeEntry]);
  const quickQuestions = useMemo(() => getQuickQuestions(activeObjectName), [activeObjectName]);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [draft, setDraft] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());
  const [aiError, setAiError] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrModalSrc, setQrModalSrc] = useState<string>('');

  const requiredIds = useMemo(
    () => model3D.filter((e) => isValidUrl(e.arUrl)).map((e) => `${e.page}-${e.arUrl}`),
    [model3D],
  );
  const allObjectsExplored = requiredIds.length > 0 && requiredIds.every((id) => exploredIds.has(id));
  const canAdvanceToArgumentation = allObjectsExplored;

  useEffect(() => {
    setCanAdvance(canAdvanceToArgumentation);
  }, [canAdvanceToArgumentation, setCanAdvance]);

  useEffect(() => {
    if (!primaryEntry) {
      setActiveObjectId(null);
      return;
    }
    const nextActiveId = `${primaryEntry.page}-${primaryEntry.arUrl}`;
    setActiveObjectId((current) => (current ? current : nextActiveId));
  }, [primaryEntry]);

  useEffect(() => {
    if (!activeEntry || activeEntry.viewerType !== 'embed' || !activeEntry.embedUrl) return;
    const entryId = `${activeEntry.page}-${activeEntry.arUrl}`;
    setExploredIds((prev) => {
      if (prev.has(entryId)) return prev;
      const next = new Set(prev);
      next.add(entryId);
      return next;
    });
  }, [activeEntry]);

  useEffect(() => {
    return () => {
      unregisterSlideNav();
    };
  }, [unregisterSlideNav]);

  const handleSend = useCallback(
    async (rawText?: string) => {
      const trimmed = (rawText ?? draft).trim();
      if (!trimmed || isResponding || !comic) return;

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
              pageLabel: activeEntry ? `Halaman ${activeEntry.page}` : undefined,
              objectName: activeObjectName,
              learningStage: 'Navigation',
            },
          }),
        });

        const payload = await response.json() as { answer?: string; provider?: string; error?: string };

        if (!response.ok || !payload.answer) {
          throw new Error(payload.error ?? 'AI response was not available.');
        }

        const assistantMessage: ChatMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: payload.answer,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        setAiError(msg);
        const fallbackMessage: ChatMessage = {
          id: Date.now() + 2,
          role: 'assistant',
          content: `Maaf, terjadi kesalahan saat menghubungi layanan AI: ${msg}`,
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      } finally {
        setIsResponding(false);
      }
    },
    [activeObjectName, comic, draft, isResponding, messages, activeEntry],
  );

  function handleOpenAr(entry: ComicAssetEntry) {
    if (!isValidUrl(entry.arUrl)) {
      showSnackbar('Link AR belum tersedia.', 'info');
      return;
    }

    const entryId = `${entry.page}-${entry.arUrl}`;
    setExploredIds((prev) => {
      if (prev.has(entryId)) return prev;
      const next = new Set(prev);
      next.add(entryId);
      return next;
    });

    if (entry.viewerType === 'embed' && entry.embedUrl) {
      window.open(entry.embedUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    window.open(entry.arUrl, '_blank', 'noopener,noreferrer');
  }

  function handleOpenQr(entry: ComicAssetEntry, event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const entryId = `${entry.page}-${entry.arUrl}`;
    setQrModalSrc(entry.qrImage?.trim() || '');
    setQrModalOpen(true);
    setExploredIds((prev) => new Set(prev).add(entryId));
  }

  function handleContinueToArgumentation() {
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

  const featuredEntry = primaryEntry?.viewerType === 'embed' ? primaryEntry : null;
  const isFeatureExplored = featuredEntry ? exploredIds.has(`${featuredEntry.page}-${featuredEntry.arUrl}`) : false;

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-x-hidden px-2 py-2 animate-fade-in-up sm:gap-5">
      {/* Header */}
      <header className="rounded-[20px] bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-4 shadow-sm sm:px-5 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-2xl text-white shadow-sm">
            🧭
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary-600">Navigation (AR + AI)</p>
            <h2 className="mt-1 text-lg font-black text-neutral-900 sm:text-xl">
              Mari jelajahi 3D dan tanya AI!
            </h2>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="flex min-h-[60vh] flex-col gap-6 rounded-[20px] bg-white p-4 shadow-lg sm:p-6 lg:p-8">
        {/* Hero 3D Viewer */}
        {featuredEntry && (
          <Hero3DViewer entry={featuredEntry} isExplored={isFeatureExplored} />
        )}

        {/* Object List */}
        <div className="space-y-4">
          {activeEntry && !featuredEntry && (
            <div className="space-y-2 px-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-600">Objek Aktif</p>
              <h2 className="text-2xl font-black text-neutral-900">{activeEntry.title}</h2>
              {activeEntry.description && (
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">{activeEntry.description}</p>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {model3D.length > 0 ? (
              model3D.map((entry, idx) => {
                const entryId = `${entry.page}-${entry.arUrl}`;
                const isActive = activeEntry ? `${activeEntry.page}-${activeEntry.arUrl}` === entryId : idx === 0;
                const isExplored = exploredIds.has(entryId);
                const isValid = isValidUrl(entry.arUrl);

                return (
                  <AssemblrCard
                    key={entryId}
                    entry={entry}
                    index={idx}
                    isActive={isActive}
                    isExplored={isExplored}
                    onSelect={() => setActiveObjectId(entryId)}
                    onOpenAr={(e) => {
                      e.stopPropagation();
                      setActiveObjectId(entryId);
                      handleOpenAr(entry);
                    }}
                    onOpenQr={(e) => handleOpenQr(entry, e)}
                    isValidUrl={isValid}
                  />
                );
              })
            ) : (
              <div className="col-span-full rounded-[12px] border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
                Tidak ada objek AR untuk komik ini.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions - Prominent CTA */}
        <div className="mt-8 space-y-3 border-t border-neutral-100 pt-6">
          <button
            type="button"
            onClick={handleContinueToArgumentation}
            disabled={!canAdvanceToArgumentation}
            className="w-full rounded-[14px] bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-base font-black text-white shadow-lg transition hover:shadow-xl hover:from-primary-700 hover:to-primary-800 disabled:bg-neutral-300 disabled:cursor-not-allowed active:scale-95 min-h-[48px]"
          >
            Lanjut ke Argumentasi
          </button>

          {!canAdvanceToArgumentation && (
            <div className="rounded-[12px] bg-primary-50 p-3 text-center">
              <p className="text-xs font-semibold text-primary-700">
                {requiredIds.length > 1
                  ? `Eksplorasi ${requiredIds.length - exploredIds.size} objek lagi untuk melanjutkan`
                  : 'Buka viewer AR untuk melanjutkan'}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => showSnackbar(comic.synopsis || 'Tidak ada info lebih lanjut.', 'info')}
            className="w-full rounded-[12px] border-2 border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 active:scale-95 min-h-[44px]"
          >
            ℹ️ Info Komik
          </button>
        </div>
      </section>

      {/* QR Modal */}
      <QrModal isOpen={qrModalOpen} qrSrc={qrModalSrc} onClose={() => setQrModalOpen(false)} />

      {/* Floating AI Tutor */}
      <FloatingAITutor
        messages={messages}
        draft={draft}
        isResponding={isResponding}
        aiError={aiError}
        quickQuestions={quickQuestions}
        activeEntry={activeEntry}
        onSendMessage={handleSend}
        onDraftChange={setDraft}
      />
    </div>
  );
}
