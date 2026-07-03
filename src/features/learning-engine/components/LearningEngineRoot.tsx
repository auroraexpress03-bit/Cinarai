'use client';

import { useEffect, useState } from 'react';
import { fetchComicById } from '@/services/comicFirestoreService';
import LearningEngine from './LearningEngine';
import type { Comic } from '@/types/comic';

interface LearningEngineRootProps {
  comicId: number;
}

export default function LearningEngineRoot({ comicId }: LearningEngineRootProps) {
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchComicById(comicId)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError(`Komik dengan ID ${comicId} tidak ditemukan.`);
        } else {
          setComic(data);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Gagal memuat data komik. Periksa koneksi internet kamu.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [comicId]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-neutral-50">
        <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-neutral-50 px-6 gap-4 text-center">
        <span className="text-5xl">📭</span>
        <div>
          <p className="text-base font-black text-neutral-800">Komik Tidak Ditemukan</p>
          <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
            {error ?? 'Data komik tidak tersedia.'}
          </p>
        </div>
      </div>
    );
  }

  return <LearningEngine comic={comic} />;
}
