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
      className={`overflow-hidden rounded-[20px] bg-white transition-all duration-200 cursor-pointer ${
        isActive ? 'shadow-[0_22px_50px_rgba(15,23,42,0.12)]' : 'shadow-[0_16px_38px_rgba(15,23,42,0.08)] hover:shadow-[0_22px_50px_rgba(15,23,42,0.12)]'
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
        <img
          src={entry.previewImage || '/images/navigation/default.svg'}
          alt={entry.title || `Objek ${index + 1}`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isExplored && (
          <div className="absolute right-3 top-3 rounded-[16px] bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
            Selesai
          </div>
        )}
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        <div>
          <h3 className="text-lg font-black text-neutral-900 line-clamp-2">{entry.title || 'Model 3D'}</h3>
          {entry.description && (
            <p className="mt-1 text-sm leading-relaxed text-neutral-600 line-clamp-2">{entry.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenAr(event);
            }}
            disabled={!isValidUrl}
            className="flex items-center justify-center rounded-[20px] bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            Model 3D
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenQr(event);
            }}
            className="flex items-center justify-center rounded-[20px] bg-neutral-100 px-4 py-3 text-sm font-bold text-neutral-800 shadow-sm transition hover:bg-neutral-200 active:scale-95 min-h-[48px]"
          >
            QR
          </button>
        </div>
      </div>
    </div>
  );
}
