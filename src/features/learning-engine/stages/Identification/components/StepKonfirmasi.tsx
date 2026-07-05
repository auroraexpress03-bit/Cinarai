'use client';

import { useIdentificationContext } from '../context/IdentificationContext';
import StepKonfirmasiItem from './StepKonfirmasiItem';

export default function StepKonfirmasi() {
  const { state, previousStep, reset, advance, validationErrors } = useIdentificationContext();
  const canAdvance = validationErrors.length === 0;

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">

      <div className="px-1">
        <h2 className="text-xl font-black text-neutral-900">✅ Periksa Jawabanmu</h2>
        <p className="text-sm text-neutral-500 mt-0.5">Pastikan semua jawaban sudah benar sebelum lanjut.</p>
      </div>

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

      {!canAdvance && (
        <ul className="flex flex-col gap-1 px-1">
          {validationErrors.map((err) => (
            <li key={err} className="text-sm font-bold text-error-600">⚠️ {err}</li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={advance}
        disabled={!canAdvance}
        className="flex w-full items-center justify-center gap-2 min-h-[56px] rounded-xl bg-primary-600 px-5 py-3 text-lg font-black text-white shadow-sm hover:bg-primary-700 transition-all active:scale-[0.97] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
      >
        {canAdvance ? (
          <>
            Lanjut ke Tahap Berikutnya 🚀
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
          className="flex flex-1 items-center justify-center gap-2 min-h-[48px] rounded-xl border-2 border-warning-300 bg-warning-50 px-4 py-2 text-base font-black text-warning-700 hover:bg-warning-100 transition-colors active:scale-[0.97]"
        >
          ✏️ Ubah Jawaban
        </button>
        <button
          type="button"
          onClick={previousStep}
          className="flex flex-1 items-center justify-center gap-2 min-h-[48px] rounded-xl border-2 border-neutral-200 bg-white px-4 py-2 text-base font-black text-neutral-600 hover:bg-neutral-50 transition-colors active:scale-[0.97]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
      </div>

    </div>
  );
}
