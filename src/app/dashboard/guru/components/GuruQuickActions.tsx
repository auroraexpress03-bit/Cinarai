'use client';

import Link from 'next/link';

export function GuruQuickActions() {
  return (
    <section className="rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm shadow-neutral-200/20 max-h-[100px] overflow-hidden transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">Aksi</p>
          <h2 className="mt-1 text-sm font-black text-neutral-900">Cepat</h2>
        </div>
        <div className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">Realtime</div>
      </div>

      <div className="mt-2 grid grid-cols-4 gap-2 items-center">
        <Link href="/dashboard/guru/siswa" className="flex flex-col items-center justify-center rounded-2xl bg-primary-50 p-2 text-xs font-semibold text-primary-700 transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]">
          <div className="h-6 w-6 rounded-md bg-white/30 mb-1" />
          <span className="text-[11px]">Siswa</span>
        </Link>
        <Link href="/dashboard/guru/statistik" className="flex flex-col items-center justify-center rounded-2xl bg-white p-2 text-xs font-semibold text-neutral-900 border border-neutral-100 transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]">
          <div className="h-6 w-6 rounded-md bg-neutral-100 mb-1" />
          <span className="text-[11px]">Analisis</span>
        </Link>
        <Link href="/dashboard/guru/analisis-ai" className="flex flex-col items-center justify-center rounded-2xl bg-white p-2 text-xs font-semibold text-neutral-900 border border-neutral-100 transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]">
          <div className="h-6 w-6 rounded-md bg-neutral-100 mb-1" />
          <span className="text-[11px]">AI</span>
        </Link>
        <Link href="/dashboard/guru/laporan" className="flex flex-col items-center justify-center rounded-2xl bg-white p-2 text-xs font-semibold text-neutral-900 border border-neutral-100 transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]">
          <div className="h-6 w-6 rounded-md bg-neutral-100 mb-1" />
          <span className="text-[11px]">Laporan</span>
        </Link>
      </div>
    </section>
  );
}
