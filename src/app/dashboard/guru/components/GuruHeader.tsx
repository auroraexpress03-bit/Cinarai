'use client';

import { useAuth } from '@/hooks/useAuth';

export function GuruHeader() {
  const { user, logout } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Guru';

  return (
    <header className="rounded-md bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-3 text-white shadow-md shadow-primary-800/20">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-wide text-primary-100">Halo,</p>
          <h1 className="mt-0.5 text-lg font-extrabold leading-tight">{firstName}</h1>
          <p className="mt-0.5 text-xs text-primary-100">Dashboard Guru</p>
        </div>
        <button
          type="button"
          onClick={() => void logout().catch(() => undefined)}
          className="flex items-center gap-2 rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
}
