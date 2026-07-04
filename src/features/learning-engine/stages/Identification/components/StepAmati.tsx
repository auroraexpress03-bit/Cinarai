'use client';

import { useIdentificationContext } from '../context/IdentificationContext';

export default function StepAmati() {
  const { lokasi, state, setObserveNote, nextStep } = useIdentificationContext();
  const canProceed = state.observe.note.trim().length > 0;

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">

      {/* Hero card */}
      <div className="rounded-2xl bg-white shadow-sm px-5 py-8 text-center">
        <div className="text-8xl mb-5">🔍</div>
        <h2 className="text-3xl font-black text-neutral-900 leading-snug">Yuk, Amati Komiknya!</h2>
        <p className="mt-3 text-xl text-neutral-500 leading-relaxed">
          Ingat-ingat cerita di <span className="font-black text-primary-600">{lokasi}</span>.
          Apa saja yang kamu lihat?
        </p>
      </div>

      {/* Petunjuk */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h3 className="text-xl font-black text-neutral-700">📌 Petunjuk</h3>
        </div>
        <ol className="px-4 py-4 flex flex-col gap-3">
          {[
            { emoji: '📖', text: 'Ingat kembali cerita komik yang sudah kamu baca.' },
            { emoji: '👀', text: 'Cari bentuk atau angka matematika di dalam cerita.' },
            { emoji: '✏️', text: 'Tulis apa yang kamu temukan di kotak di bawah ini.' },
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-4 rounded-2xl bg-primary-50 p-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-base font-black text-white mt-0.5">
                {i + 1}
              </span>
              <span className="text-xl text-neutral-700 leading-relaxed pt-1">
                {step.emoji} {step.text}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Kotak catatan */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h3 className="text-xl font-black text-neutral-700">📝 Apa yang Kamu Temukan?</h3>
        </div>
        <div className="px-4 py-4 flex flex-col gap-3">
          <textarea
            id="amati-note"
            value={state.observe.note}
            onChange={(e) => setObserveNote(e.target.value)}
            placeholder="Contoh: Saya melihat bentuk kubus pada bangunan candi…"
            rows={4}
            className="w-full resize-none rounded-2xl border-2 border-neutral-200 bg-neutral-50 px-5 py-4 text-xl leading-relaxed text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-colors"
          />
          {!canProceed && (
            <p className="text-lg font-bold text-warning-700 bg-warning-50 border-2 border-warning-200 rounded-2xl px-5 py-4">
              ✏️ Tulis dulu apa yang kamu temukan, baru bisa lanjut ya!
            </p>
          )}
        </div>
      </div>

      {/* Tombol lanjut */}
      <button
        type="button"
        onClick={nextStep}
        disabled={!canProceed}
        className="flex w-full items-center justify-center gap-3 min-h-[72px] rounded-2xl bg-primary-600 px-5 py-4 text-2xl font-black text-white shadow-md hover:bg-primary-700 transition-all active:scale-[0.97] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
      >
        {canProceed ? (
          <>
            Lanjut ke Soal
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
