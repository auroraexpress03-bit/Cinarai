'use client';

interface IdentificationTitleProps {
  lokasi: string;
}

export default function IdentificationTitle({ lokasi }: IdentificationTitleProps) {
  return (
    <div>
      <h3 className="text-lg font-black text-neutral-950 leading-snug">
        Identifikasi Masalah
      </h3>
      <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
        Temukan konsep matematika yang tersembunyi di{' '}
        <span className="font-semibold text-neutral-700">{lokasi}</span>.
      </p>
    </div>
  );
}
