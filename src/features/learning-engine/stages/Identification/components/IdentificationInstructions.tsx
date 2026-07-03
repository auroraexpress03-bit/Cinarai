'use client';

const STEPS = [
  { emoji: '📖', text: 'Baca kembali komik yang sudah kamu pelajari.' },
  { emoji: '🔍', text: 'Cari konsep matematika yang ada di cerita.' },
  { emoji: '✅', text: 'Tekan tombol pada setiap target yang sudah kamu temukan.' },
] as const;

export default function IdentificationInstructions() {
  return (
    <div className="rounded-2xl bg-secondary-50 border border-secondary-100 px-4 py-3.5 sm:px-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-secondary-600 mb-2.5">
        Petunjuk
      </p>
      <ol className="flex flex-col gap-2">
        {STEPS.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary-200 text-[10px] font-black text-secondary-700 mt-0.5">
              {i + 1}
            </span>
            <span className="text-xs text-secondary-800 leading-relaxed">
              {step.emoji} {step.text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
