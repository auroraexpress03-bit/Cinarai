'use client';

import { useState } from 'react';
import type { ComicAssetEntry } from '@/services/comic-assets/types';

interface ChatMessage {
  id: number;
  role: 'assistant' | 'user';
  content: string;
}

interface AssemblrCardProps {
  entry: ComicAssetEntry;
  isActive: boolean;
  onSelect: () => void;
  onOpenAr: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenQr: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isValidUrl: boolean;
  messages: ChatMessage[];
  draft: string;
  isResponding: boolean;
  aiError: string | null;
  quickQuestions: string[];
  onSendMessage: (text?: string) => Promise<void>;
  onDraftChange: (text: string) => void;
}

export function AssemblrCard({
  entry,
  isActive,
  onSelect,
  onOpenAr,
  onOpenQr,
  isValidUrl,
  messages,
  draft,
  isResponding,
  aiError,
  quickQuestions,
  onSendMessage,
  onDraftChange,
}: AssemblrCardProps) {
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const objectSubtitle = [
    entry.page ? `Halaman ${entry.page}` : null,
    entry.provider ? `Provider: ${entry.provider}` : null,
    entry.description ? entry.description : null,
  ].filter(Boolean).join(' • ');

  return (
    <div
      data-object-id={`${entry.page}-${entry.arUrl}`}
      onClick={onSelect}
      className={`rounded-[20px] bg-white px-4 py-4 transition duration-200 ${
        isActive ? 'shadow-[0_18px_50px_rgba(15,23,42,0.12)]' : 'shadow-sm hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]'
      } cursor-pointer`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-black text-neutral-900">{entry.title || 'Model 3D'}</h3>
          <p className="mt-1 text-sm text-neutral-500">Komik {entry.page} • Halaman {entry.page}</p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setIsTutorOpen((prev) => !prev);
          }}
          className="shrink-0 rounded-full border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700 transition hover:bg-primary-100 active:scale-95"
        >
          Tanya AI
        </button>
      </div>

      {entry.description ? (
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{entry.description}</p>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenAr(event);
          }}
          disabled={!isValidUrl}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[20px] bg-primary-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lihat Model 3D
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenQr(event);
          }}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[20px] border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-neutral-900 transition hover:bg-neutral-50 active:scale-95"
        >
          Tampilkan QR
        </button>
      </div>

      {isTutorOpen ? (
        <div className="mt-4 rounded-[16px] border border-primary-100 bg-primary-50/70 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-700">AI Tutor</p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsTutorOpen(false);
              }}
              className="text-xs font-semibold text-neutral-600 transition hover:text-neutral-800"
            >
              Tutup
            </button>
          </div>
          <p className="mt-2 text-sm font-medium text-neutral-700">{objectSubtitle || 'Amati bentuk, pola, dan hubungan matematikanya.'}</p>

          <div className="mt-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] rounded-[16px] px-3 py-2 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isResponding && (
              <div className="flex items-center gap-2 px-1">
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-400 animate-bounce" />
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            )}

            {quickQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 2).map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void onSendMessage(question);
                    }}
                    disabled={isResponding}
                    className="rounded-full border border-primary-200 bg-white px-3 py-2 text-xs font-semibold text-primary-700 transition hover:bg-primary-50 disabled:opacity-50 active:scale-95"
                  >
                    {question.length > 18 ? `${question.slice(0, 15)}…` : question}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(event) => onDraftChange(event.target.value)}
                placeholder="Tanya AI Tutor..."
                rows={2}
                className="flex-1 resize-none rounded-[20px] border-2 border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  void onSendMessage();
                }}
                disabled={isResponding || !draft.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-50 active:scale-95"
              >
                ➤
              </button>
            </div>

            {aiError && <p className="rounded-[12px] bg-error-50 px-3 py-2 text-xs text-error-600">{aiError}</p>}
          </div>
        </div>
      ) : null}
    </div>
  );
}
