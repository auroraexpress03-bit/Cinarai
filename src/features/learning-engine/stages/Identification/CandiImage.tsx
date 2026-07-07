'use client';

import Image from 'next/image';
import React from 'react';

interface Props {
  src: string;
  alt?: string;
  children?: React.ReactNode;
}

export default function CandiImage({ src, alt = 'Objek budaya', children }: Props) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-neutral-100">
      <Image src={src} alt={alt} width={1200} height={800} className="w-full h-auto block" />
      {/* overlay container for highlights */}
      <div className="absolute inset-0 pointer-events-none">{children}</div>
    </div>
  );
}
