'use client';

import { useIdentificationContext } from '../context/IdentificationContext';
import StepKonfirmasiItem from './StepKonfirmasiItem';

export default function StepKonfirmasi() {
  const { state, previousStep, reset, advance, validationErrors } = useIdentificationContext();
  const canAdvance = validationErrors.length === 0;

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">

      {/* Hero card */}
      <div className="rounded-2xl bg-white shadow-sm px-5 py-8 text-center">
        <div className="text-xl md:text-8xl mb-5">✅</div>
        <h2 className="text-xl md:text-3xl font-black text-neutral-900 leading-snug">Periksa Jawabanmu</h2>
        <p className="mt-3 text-base md:text-xl text-neutral-500 leading-relaxed">
          Pastikan semua jawaban sudah benar sebelum lanjut.
        </p>
      </div>

      {/* Daftar ringkasan */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h3 className="text-lg md:text-xl font-black text-neutral-700">📋 Ringkasan Jawabanmu</h3>
        </div>
        <ul className="px-4 py-4 flex flex-col gap-4">
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
      </div>

      {/* Pesan validasi */}
      {!canAdvance && (
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-error-100 bg-error-50">
            <h3 className="text-xl font-black text-error-700">⚠️ Belum bisa lanjut</h3>
          </div>
          <ul className="px-4 py-4 flex flex-col gap-3">
            {validationErrors.map((err) => (
              <li key={err} className="flex items-start gap-3 rounded-2xl bg-error-50 p-4">
                <span className="text-error-500 flex-shrink-0 mt-1 text-lg">•</span>
                <span className="text-base md:text-lg text-error-700 leading-relaxed">{err}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tombol lanjut */}
      <button
        type="button"
        onClick={advance}
        disabled={!canAdvance}
        className="flex w-full items-center justify-center gap-3 min-h-[72px] rounded-2xl bg-primary-600 px-5 py-4 text-xl md:text-2xl font-black text-white shadow-md hover:bg-primary-700 transition-all active:scale-[0.97] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
      >
        {canAdvance ? (
          <>
            Lanjut ke Tahap Berikutnya 🚀
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </>
        ) : (
          'Lengkapi semua jawaban dulu ya!'
        )}
      </button>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex flex-1 items-center justify-center gap-2 min-h-[60px] rounded-2xl border-2 border-warning-300 bg-warning-50 px-4 py-3 text-xl font-black text-warning-700 hover:bg-warning-100 transition-colors active:scale-[0.97]"
        >
          ✏️ Ubah Jawaban
        </button>
        <button
          type="button"
          onClick={previousStep}
          className="flex flex-1 items-center justify-center gap-2 min-h-[60px] rounded-2xl border-2 border-neutral-200 bg-white px-4 py-3 text-base md:text-lg font-black text-neutral-600 hover:bg-neutral-50 transition-colors active:scale-[0.97]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
      </div>

    </div>
  );
}
