'use client';

import { useState } from 'react';
import type { ComicAssetEntry } from '@/services/comic-assets/types';

interface Hero3DViewerProps {
  entry: ComicAssetEntry | null;
  isExplored: boolean;
}

export function Hero3DViewer({ entry, isExplored }: Hero3DViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!entry || entry.viewerType !== 'embed' || !entry.embedUrl) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden rounded-[20px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] animate-fade-in-up">
      <div className="relative h-[44vh] min-h-[320px] w-full sm:h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />

        <iframe
          src={entry.embedUrl}
          title={`Model 3D ${entry.title}`}
          className="relative h-full w-full border-0"
          allow="fullscreen"
          onLoad={() => setIsLoading(false)}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-primary-500 animate-pulse" />
              <div className="h-3 w-3 rounded-full bg-primary-500 animate-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="h-3 w-3 rounded-full bg-primary-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 max-w-[68%] rounded-[18px] bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary-600">Eksplorasi Utama</p>
          <h2 className="mt-2 text-xl font-black text-neutral-900 sm:text-2xl line-clamp-2">{entry.title}</h2>
          {entry.description && (
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 line-clamp-2">{entry.description}</p>
          )}
        </div>

        {isExplored && (
          <div className="absolute right-4 top-4 rounded-[18px] bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
            Selesai
          </div>
        )}
      </div>
    </section>
  );
}
