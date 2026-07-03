'use client';

import { useIdentificationContext } from '../context/IdentificationContext';
import StepKonfirmasiItem from './StepKonfirmasiItem';

export default function StepKonfirmasi() {
  const { state, previousStep, reset, advance, validationErrors } = useIdentificationContext();
  const canAdvance = validationErrors.length === 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Judul */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-black text-primary-700">
            4
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary-600">
            Langkah 4 — Konfirmasi
          </span>
        </div>
        <h3 className="text-lg font-black text-neutral-950 leading-snug">
          Periksa Jawabanmu
        </h3>
        <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
          Pastikan semua jawaban, catatan, dan alasan sudah benar sebelum melanjutkan.
        </p>
      </div>

      {/* Daftar ringkasan per item */}
      <ul className="flex flex-col gap-3">
        {state.items.map((item) => {
          const selectedOptionText =
            item.options.find((o) => o.id === item.selectedOptionId)?.text ?? null;
          return (
            <StepKonfirmasiItem
              key={item.id}
              item={item}
              selectedOptionText={selectedOptionText}
            />
          );
        })}
      </ul>

      {/* Pesan validasi */}
      {!canAdvance && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-error-200 bg-error-50 px-4 py-3">
          <p className="text-sm font-black text-error-700">Belum bisa melanjutkan:</p>
          <ul className="flex flex-col gap-1">
            {validationErrors.map((err) => (
              <li key={err} className="flex items-start gap-2 text-sm text-error-600">
                <span className="mt-0.5 flex-shrink-0">•</span>
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tombol aksi */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={advance}
          disabled={!canAdvance}
          className="flex w-full items-center justify-center gap-2 min-h-[48px] rounded-2xl bg-primary-600 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-primary-700 transition-all active:scale-[0.97] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
        >
          Lanjut ke Navigation
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-1.5 min-h-[44px] rounded-2xl border border-warning-300 bg-warning-50 px-4 py-2.5 text-sm font-semibold text-warning-700 hover:bg-warning-100 transition-colors active:scale-[0.97]"
          >
            ✏️ Ubah Jawaban
          </button>

          <button
            type="button"
            onClick={previousStep}
            className="flex flex-1 items-center justify-center gap-1.5 min-h-[44px] rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors active:scale-[0.97]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
