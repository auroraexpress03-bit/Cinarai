'use client';

interface StepAmatiTitleProps {
  lokasi: string;
}

export default function StepAmatiTitle({ lokasi }: StepAmatiTitleProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-black text-primary-700">
          1
        </span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-primary-600">
          Langkah 1 — Amati
        </span>
      </div>
      <h3 className="text-lg font-black text-neutral-950 leading-snug">
        Amati Komik dengan Seksama
      </h3>
      <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
        Perhatikan gambar dan cerita di komik. Temukan konsep matematika yang
        tersembunyi di{' '}
        <span className="font-semibold text-neutral-700">{lokasi}</span>.
      </p>
    </div>
  );
}
