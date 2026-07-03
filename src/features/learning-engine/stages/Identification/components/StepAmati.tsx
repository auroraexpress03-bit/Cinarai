'use client';

import { useIdentificationContext } from '../context/IdentificationContext';
import StepAmatiTitle from './StepAmatiTitle';
import StepAmatiViewer from './StepAmatiViewer';
import StepAmatiNoteBox from './StepAmatiNoteBox';

export default function StepAmati() {
  const { lokasi, cover, title, state, setObserveNote, nextStep } = useIdentificationContext();
  const canProceed = state.observe.note.trim().length > 0;

  return (
    <div className="flex flex-col gap-5">
      <StepAmatiTitle lokasi={lokasi} />
      <StepAmatiViewer cover={cover} title={title} />
      <StepAmatiNoteBox
        value={state.observe.note}
        onChange={setObserveNote}
      />
      {!canProceed && (
        <p className="text-sm font-semibold text-error-600 bg-error-50 border border-error-200 rounded-xl px-4 py-3">
          ✏️ Tulis catatan pengamatanmu terlebih dahulu sebelum melanjutkan.
        </p>
      )}
      <button
        type="button"
        onClick={nextStep}
        disabled={!canProceed}
        className="flex w-full items-center justify-center gap-2 min-h-[48px] rounded-2xl bg-primary-600 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-primary-700 transition-all active:scale-[0.97] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
      >
        Lanjut ke Identifikasi
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
