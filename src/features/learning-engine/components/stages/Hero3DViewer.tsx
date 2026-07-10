'use client';

import { useState } from 'react';
import type { ComicAssetEntry } from '@/services/comic-assets/types';

interface Hero3DViewerProps {
  entry: ComicAssetEntry | null;
  isExplored: boolean;
}

export function Hero3DViewer({ entry, isExplored }: Hero3DViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!entry || entry.viewerType !== 'embed' || !entry.embedUrl) {
    return null;
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Header with Status */}
      <div className="flex items-start justify-between gap-3 px-1">
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-600">Eksplorasi Utama</p>
          <h2 className="mt-2 text-2xl font-black text-neutral-900 sm:text-3xl">{entry.title}</h2>
          {entry.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-700 sm:mt-3">{entry.description}</p>
          )}
        </div>
        {isExplored && (
          <div className="flex flex-col items-center gap-1 rounded-[12px] bg-accent-100 px-3 py-2">
            <span className="text-xl">✓</span>
            <span className="text-[9px] font-bold text-accent-700">Selesai</span>
          </div>
        )}
      </div>

      {/* Hero Viewer - Google Arts & Culture style */}
      <div className="relative overflow-hidden rounded-[20px] bg-white shadow-lg">
        <div className="relative aspect-video w-full bg-gradient-to-br from-primary-50 to-secondary-50">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-primary-500 animate-bounce" />
                <div className="h-3 w-3 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="h-3 w-3 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
          <iframe
            src={entry.embedUrl}
            title={`Model 3D ${entry.title}`}
            className="h-full w-full border-0"
            allow="fullscreen"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-md transition hover:bg-white hover:shadow-lg active:scale-95 backdrop-blur-sm"
          title="Fullscreen"
        >
          {isFullscreen ? '✕' : '⛶'}
        </button>
      </div>
    </div>
  );
}
