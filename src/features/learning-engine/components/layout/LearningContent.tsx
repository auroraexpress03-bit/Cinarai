'use client';

import type { ReactNode } from 'react';

interface LearningContentProps {
  children: ReactNode;
}

export default function LearningContent({ children }: LearningContentProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-[#f0f7ff]">
      <div className="mx-auto max-w-2xl px-3 py-3 sm:px-6 sm:py-5 animate-fade-in">
        {children}
      </div>
    </main>
  );
}
