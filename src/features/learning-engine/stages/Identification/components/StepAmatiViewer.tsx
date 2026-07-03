'use client';

import Image from 'next/image';

interface StepAmatiViewerProps {
  cover: string;
  title: string;
}

export default function StepAmatiViewer({ cover, title }: StepAmatiViewerProps) {
  return (
    <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
      <div className="bg-neutral-50 border-b border-neutral-100 px-4 py-2.5 flex items-center gap-2">
        <span className="text-sm">🖼️</span>
        <span className="text-xs font-bold text-neutral-500">Halaman Komik</span>
      </div>
      <div className="relative w-full aspect-[3/4] bg-neutral-100">
        <Image
          src={cover}
          alt={`Cover komik: ${title}`}
          fill
          className="object-contain"
          sizes="(max-width: 672px) 100vw, 672px"
          priority
        />
      </div>
    </div>
  );
}
