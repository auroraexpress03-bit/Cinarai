'use client';

import { useIdentificationContext } from '../context/IdentificationContext';

export default function StepAmati() {
  const { lokasi, state, setObserveNote, nextStep } = useIdentificationContext();
  const canProceed = state.observe.note.trim().length > 0;

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">

      <div className="rounded-2xl bg-white border-2 border-neutral-100 p-5">
        <h2 className="text-xl font-black text-neutral-900">🔍 Yuk, Amati Komiknya!</h2>
        <p className="mt-1 text-base text-neutral-500">
          Ingat cerita di <span className="font-bold text-primary-600">{lokasi}</span>. Apa saja yang kamu lihat?
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amati-note" className="text-sm font-black text-neutral-700">
          📝 Apa yang kamu temukan?
        </label>
        <textarea
          id="amati-note"
          value={state.observe.note}
          onChange={(e) => setObserveNote(e.target.value)}
          placeholder="Contoh: Saya melihat bentuk kubus pada bangunan candi…"
          rows={4}
          className="w-full resize-none rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 text-base text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
        />
        {!canProceed && (
          <p className="text-sm font-bold text-warning-700">
            ✏️ Tulis dulu apa yang kamu temukan, baru bisa lanjut ya!
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={nextStep}
        disabled={!canProceed}
        className="flex w-full items-center justify-center gap-2 min-h-[56px] rounded-xl bg-primary-600 px-5 py-3 text-lg font-black text-white shadow-sm hover:bg-primary-700 transition-all active:scale-[0.97] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
      >
        {canProceed ? (
          <>
            Lanjut ke Soal
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </>
        ) : (
          'Tulis catatan dulu ya! ✏️'
        )}
      </button>

    </div>
  );
}
