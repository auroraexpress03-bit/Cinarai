"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const SWIPE_THRESHOLD = 50;
const SWIPE_VERTICAL_LIMIT = 80;

interface PdfReaderProps {
  pdfPath: string;
  onComplete?: () => void;
  showCompleteButton?: boolean;
  completeButtonLabel?: string;
  completeButtonDisabled?: boolean;
  onPageChange?: (page: number, numPages: number) => void;
}

export default function PdfReader({
  pdfPath,
  onComplete,
  showCompleteButton = false,
  completeButtonLabel = "🎉 Selesai Membaca",
  completeButtonDisabled = false,
  onPageChange,
}: PdfReaderProps) {
  const [workerReady, setWorkerReady] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // ── Worker ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    setWorkerReady(true);
  }, []);

  // ── ResizeObserver: measure container width ─────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.floor(entry.contentRect.width));
    });
    ro.observe(el);
    // Seed immediately so first render has a width
    setContainerWidth(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  // ── Notify parent ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (numPages > 0) onPageChange?.(page, numPages);
  }, [page, numPages, onPageChange]);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goTo = useCallback(
    (next: number) => setPage(Math.min(Math.max(1, next), numPages)),
    [numPages]
  );

  // ── Swipe ───────────────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartX.current = null;
      touchStartY.current = null;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 1) {
      touchStartX.current = null;
      touchStartY.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    if (e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dy) > SWIPE_VERTICAL_LIMIT) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) goTo(page + 1);
    else goTo(page - 1);
  }, [goTo, page]);

  // ── Document load ───────────────────────────────────────────────────────────
  const onDocumentLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
    setPage(1);
  }, []);

  const isFirstPage = page <= 1;
  const isLastPage = numPages > 0 && page === numPages;
  const progressPct = numPages > 0 ? Math.round((page / numPages) * 100) : 0;

  // Fit-width: PDF fills 100% of container, aspect ratio preserved by react-pdf
  const pageWidth = containerWidth > 0 ? containerWidth : undefined;

  if (!workerReady) {
    return (
      <div className="flex flex-col h-full bg-neutral-900 items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-primary-300">Memuat komik...</p>
      </div>
    );
  }

  const completeButton = isLastPage && showCompleteButton && onComplete ? (
    <button
      onClick={() => onCompleteRef.current?.()}
      disabled={completeButtonDisabled}
      className="w-full min-h-[52px] rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-base font-black text-white shadow-md hover:from-green-600 hover:to-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {completeButtonDisabled
        ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Menyimpan...</>
        : completeButtonLabel
      }
    </button>
  ) : null;

  return (
    <div className="flex flex-col h-full bg-neutral-900">

      {/* ── Progress bar + page indicator ──────────────────────────────────── */}
      <div className="flex-shrink-0 bg-neutral-800 px-3 py-2 flex items-center gap-3">
        <span className="text-xs font-bold text-neutral-300 flex-shrink-0 tabular-nums">
          {numPages > 0 ? `${page} / ${numPages}` : "…"}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-neutral-600 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-primary-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── PDF viewport ────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-neutral-900 select-none"
        style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Document
          file={pdfPath}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<PdfLoadingSpinner />}
          error={<PdfErrorMessage />}
        >
          <Page
            key={`page_${page}`}
            pageNumber={page}
            width={pageWidth}
            loading={pageWidth ? <PageSkeleton width={pageWidth} /> : null}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </div>

      {/* ── Bottom nav ──────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 bg-neutral-800 border-t border-neutral-700 px-3 pt-2.5"
        style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
      >
        {completeButton ?? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(page - 1)}
              disabled={isFirstPage}
              aria-label="Halaman sebelumnya"
              className="flex items-center justify-center gap-1.5 min-h-[48px] flex-1 rounded-xl bg-neutral-700 text-neutral-200 font-black text-sm hover:bg-neutral-600 active:bg-neutral-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Sebelumnya
            </button>
            <button
              onClick={() => goTo(page + 1)}
              disabled={isLastPage}
              aria-label="Halaman berikutnya"
              className="flex items-center justify-center gap-1.5 min-h-[48px] flex-1 rounded-xl bg-primary-600 text-white font-black text-sm hover:bg-primary-700 active:bg-primary-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Selanjutnya
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────────

function PdfLoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 gap-3">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm font-semibold text-neutral-400">Memuat halaman...</p>
    </div>
  );
}

function PageSkeleton({ width }: { width: number }) {
  return (
    <div
      className="bg-neutral-700 animate-pulse"
      style={{ width, height: Math.round(width * 1.414) }}
    />
  );
}

function PdfErrorMessage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 gap-3 px-6 text-center">
      <span className="text-5xl">😕</span>
      <p className="text-base font-black text-neutral-200">Komik tidak bisa dimuat</p>
      <p className="text-sm text-neutral-400 leading-relaxed">
        Periksa koneksi internet kamu, lalu coba lagi ya!
      </p>
    </div>
  );
}
