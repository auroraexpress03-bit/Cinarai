'use client';

/* eslint-disable @next/next/no-img-element */

import type { ComicAssetEntry } from '@/services/comic-assets/types';

interface AssemblrCardProps {
  entry: ComicAssetEntry;
  index: number;
  isActive: boolean;
  isExplored: boolean;
  onSelect: () => void;
  onOpenAr: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenQr: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isValidUrl: boolean;
}

export function AssemblrCard({
  entry,
  index,
  isActive,
  isExplored,
  onSelect,
  onOpenAr,
  onOpenQr,
  isValidUrl,
}: AssemblrCardProps) {
  if (entry.viewerType === 'embed') {
    return null;
  }

  return (
    <div
      onClick={onSelect}
      className={`overflow-hidden rounded-[16px] bg-white transition-all duration-200 cursor-pointer ${
        isActive ? 'shadow-lg ring-2 ring-primary-300' : 'shadow-md hover:shadow-lg'
      }`}
    >
      {/* Screenshot - Duolingo style */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
        <img
          src={entry.previewImage || '/images/navigation/default.svg'}
          alt={entry.title || `Objek ${index + 1}`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isExplored && (
          <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-700 shadow-md">
            ✓
          </div>
        )}
      </div>

      {/* Content - Better spacing */}
      <div className="space-y-3 p-4 sm:p-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">{`Objek ${index + 1}`}</p>
          <h3 className="mt-1.5 text-lg font-black text-neutral-900 line-clamp-2">{entry.title || 'Model 3D'}</h3>
        </div>

        {entry.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-neutral-700">{entry.description}</p>
        )}

        {/* Buttons - Larger touch targets */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onOpenAr}
            disabled={!isValidUrl}
            className="flex items-center justify-center gap-2 rounded-[12px] bg-primary-600 px-3 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
          >
            <span className="text-base">📦</span>
            <span className="hidden sm:inline">Model 3D</span>
            <span className="sm:hidden">3D</span>
          </button>

          <button
            type="button"
            onClick={onOpenQr}
            className="flex items-center justify-center gap-2 rounded-[12px] bg-neutral-100 px-3 py-3 text-sm font-bold text-neutral-800 shadow-md transition hover:bg-neutral-200 active:scale-95 min-h-[44px]"
          >
            <span className="text-base">📱</span>
            <span className="hidden sm:inline">QR</span>
          </button>
        </div>
      </div>
    </div>
  );
}
