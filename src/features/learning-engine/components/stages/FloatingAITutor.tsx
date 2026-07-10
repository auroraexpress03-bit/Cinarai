'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import type { ComicAssetEntry } from '@/services/comic-assets/types';

interface ChatMessage {
  id: number;
  role: 'assistant' | 'user';
  content: string;
}

interface FloatingAITutorProps {
  messages: ChatMessage[];
  draft: string;
  isResponding: boolean;
  aiError: string | null;
  quickQuestions: string[];
  activeEntry: ComicAssetEntry | null;
  onSendMessage: (text?: string) => Promise<void>;
  onDraftChange: (text: string) => void;
}

export function FloatingAITutor({
  messages,
  draft,
  isResponding,
  aiError,
  quickQuestions,
  activeEntry,
  onSendMessage,
  onDraftChange,
}: FloatingAITutorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating FAB - Intercom style */}
      <div className="fixed bottom-24 right-3 z-50 touch-manipulation sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ring-4 ring-primary-100"
          title="AI Tutor"
        >
          <img src="/images/ai/robot.svg" alt="AI" className="h-9 w-9" />
        </button>
      </div>

      {/* Chat Panel - Intercom style */}
      {isOpen && (
        <div className="fixed bottom-40 right-3 z-40 w-[calc(100vw-24px)] max-w-[380px] animate-slide-up rounded-[20px] bg-white shadow-2xl sm:bottom-24 sm:right-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <div className="flex h-full flex-col overflow-hidden rounded-[20px]">
            {/* Header */}
            <div className="border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-white px-4 py-4 sm:px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/images/ai/robot.svg" alt="AI" className="h-9 w-9" />
                  <div>
                    <p className="text-base font-black text-neutral-900">AI Tutor</p>
                    <p className="mt-0.5 text-xs text-neutral-600">Siap membantu Anda</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition hover:bg-neutral-200 active:scale-95"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 sm:p-5">
              {activeEntry ? (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-[14px] px-4 py-2 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'rounded-br-none bg-primary-600 text-white shadow-md'
                            : 'rounded-bl-none border border-neutral-200 bg-neutral-50 text-neutral-800'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isResponding && (
                    <div className="flex gap-2 px-1">
                      <div className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-center">
                  <p className="text-sm text-neutral-600">Pilih objek untuk mulai bertanya</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            {activeEntry && (
              <div className="border-t border-neutral-100 bg-white p-4 sm:p-5">
                <div className="space-y-3">
                  {/* Quick Questions */}
                  {quickQuestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.slice(0, 2).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => void onSendMessage(q)}
                          disabled={isResponding}
                          className="rounded-full border-2 border-primary-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 transition hover:bg-primary-50 disabled:opacity-50 active:scale-95"
                        >
                          {q.length > 18 ? `${q.slice(0, 15)}…` : q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex items-end gap-2">
                    <textarea
                      value={draft}
                      onChange={(e) => onDraftChange(e.target.value)}
                      placeholder="Tanya sesuatu..."
                      rows={2}
                      className="flex-1 resize-none rounded-[12px] border-2 border-neutral-200 bg-white px-4 py-2.5 text-sm placeholder:text-neutral-500 focus:border-primary-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => void onSendMessage()}
                      disabled={isResponding || !draft.trim()}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-50 active:scale-95 min-h-[44px]"
                    >
                      ➤
                    </button>
                  </div>

                  {aiError && (
                    <p className="text-xs text-error-600 bg-error-50 rounded-[8px] p-2">{aiError}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
