"use client";

interface PdfErrorProps {
  onRetry?: () => void;
  message?: string;
}

export default function PdfError({
  onRetry,
  message = "Gagal memuat PDF. Silakan periksa koneksi internet Anda dan coba lagi.",
}: PdfErrorProps) {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-4xl">⚠️</span>
        <p className="text-sm font-semibold text-red-700">Terjadi Kesalahan</p>
        <p className="text-xs text-red-600">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Muat Ulang
        </button>
      )}
    </div>
  );
}
