"use client";

interface PdfToolbarProps {
  comicTitle?: string;
  currentPage: number;
  totalPages: number;
  progress: number;
  isLoading?: boolean;
}

export default function PdfToolbar({
  comicTitle = "Komik",
  currentPage,
  totalPages,
  progress,
  isLoading = false,
}: PdfToolbarProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-shrink-0 flex-col gap-2 bg-white px-3 py-3 shadow-sm">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <span className="truncate text-sm font-bold text-neutral-800 md:text-base">
          {comicTitle}
        </span>
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
              <span className="text-xs font-semibold text-primary-600">Memuat...</span>
            </div>
          )}
          <span className="text-xs font-semibold text-neutral-500">Fit Width</span>
        </div>
      </div>

      {/* Progress bar and page info */}
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 text-sm font-bold text-neutral-700 tabular-nums">
          {totalPages > 0 ? `${currentPage} / ${totalPages}` : "…"}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-1.5 rounded-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="flex-shrink-0 text-xs font-semibold text-neutral-500 tabular-nums">
          {progress}%
        </span>
      </div>
    </div>
  );
}

