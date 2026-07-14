"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { packageContent } from '@/features/comics/comic-1/content/packageContent';

type Obj = {
  id: string;
  title: string;
  page?: number;
  navImage?: string;
  qrImage?: string;
  modelUrl?: string;
  embedUrl?: string;
  aiPrompt?: string;
};

export default function ObjectDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const decoded = decodeURIComponent(id);
  const obj = packageContent.learningObjects.find((o) => o.id === decoded) as Obj | undefined;
  const [isQrOpen, setIsQrOpen] = useState(false);

  if (!obj) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg font-black">Objek tidak ditemukan</p>
          <button onClick={() => router.back()} className="mt-4 inline-flex rounded-lg bg-primary-600 px-4 py-2 text-white">Kembali</button>
        </div>
      </div>
    );
  }

  const handleOpenModel = () => {
    const url = obj.modelUrl || obj.embedUrl || '';
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-black text-neutral-900">{obj.title}</h1>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {obj.navImage ? (
            <div className="mb-4 text-center">
              <Image src={obj.navImage} alt={obj.title} width={800} height={480} className="mx-auto object-contain" />
            </div>
          ) : null}

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">AI Tutor</p>
            <p className="mt-2 text-lg font-black text-neutral-900">{obj.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{obj.aiPrompt}</p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button onClick={handleOpenModel} className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary-600 px-4 py-3 text-sm font-bold text-white">Lihat Model 3D</button>
            <button onClick={() => setIsQrOpen(true)} className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-neutral-900">Lihat QR</button>
            <button onClick={() => router.push('/comic/1/learn')} className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-neutral-900">Tutup Viewer</button>
          </div>
        </div>
      </div>

      {isQrOpen && obj.qrImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">QR Code</p>
                <h2 className="mt-1 text-xl font-black text-neutral-900">{obj.title}</h2>
              </div>
              <button onClick={() => setIsQrOpen(false)} className="rounded-full border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700">Tutup</button>
            </div>

            <div className="mt-5 flex flex-col items-center gap-4">
              <Image src={obj.qrImage} alt={`QR ${obj.title}`} width={360} height={360} className="rounded-2xl bg-white p-3 object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
