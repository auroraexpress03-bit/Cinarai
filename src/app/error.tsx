"use client";

import Link from 'next/link';

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-lg px-4 py-10">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-2xl">⚠️</div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-black text-rose-900">Terjadi Kesalahan</h1>
                <p className="mt-2 text-sm text-neutral-600">Maaf, terjadi masalah saat memuat halaman.</p>
                <details className="mt-3 text-xs text-neutral-500">
                  <summary className="cursor-pointer">Detail error (dev)</summary>
                  <pre className="whitespace-pre-wrap mt-2 text-[12px] text-neutral-600">{String(error?.message ?? '')}</pre>
                </details>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <RetryButton />
                  <Link href="/" className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-center text-sm font-semibold text-neutral-700 shadow-sm">
                    Kembali ke Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

function RetryButton() {
  'use client';
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      // prefer to revalidate/refresh the route instead of alert
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleRetry}
      className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-700"
    >
      Coba Lagi
    </button>
  );
}
