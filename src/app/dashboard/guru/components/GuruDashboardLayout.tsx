'use client';

import type { ReactNode } from 'react';

type GuruDashboardLayoutProps = {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
};

export function GuruDashboardLayout({ header, sidebar, children }: GuruDashboardLayoutProps) {
  return (
    <div className="space-y-3">
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-5">
        <div className="mb-3 lg:sticky lg:top-4 lg:mb-0 lg:self-start">{sidebar}</div>
        <div className="space-y-3">
          {header}
          {children}
        </div>
      </div>
      <div className="fixed bottom-6 right-4 z-20 rounded-full bg-primary-600 p-2 text-xs font-semibold text-white shadow-lg shadow-primary-600/25 pointer-events-auto">
        <button aria-label="Tambah" className="px-3 py-1 text-xs">+ Baru</button>
      </div>
    </div>
  );
}
