"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { getComicById } from "@/lib/comicRepository";
import { useComicProgress } from "@/hooks/useComicProgress";

const PdfReader = dynamic(() => import("./PdfReader"), { ssr: false });

interface ComicPageClientProps {
  comicId: number;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function ComicPageClient({ comicId }: ComicPageClientProps) {
  const comic = getComicById(comicId);
  const router = useRouter();
  const { state, complete } = useComicProgress(comicId);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  // Prevent double-tap / double-fire
  const savingRef = useRef(false);

  const handleComplete = useCallback(async () => {
    // Already saved or in-flight — do nothing
    if (savingRef.current || state.isCompleted) return;

    // Contextualization is already completed — skip save, go straight to learn
    const contextualizationDone = state.sintaksList.some(
      (s) => s.sintaks === "Contextualization" && s.status === "COMPLETED"
    );
    if (contextualizationDone) {
      router.push(`/comic/${comicId}/learn`);
      return;
    }

    savingRef.current = true;
    setSaveStatus("saving");

    try {
      await complete("Contextualization");
      setSaveStatus("saved");
      router.push(`/comic/${comicId}/learn`);
    } catch {
      setSaveStatus("error");
      savingRef.current = false;
    }
  }, [state, complete, comicId, router]);

  if (!comic || comic.availability === "COMING_SOON") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-neutral-500">Komik belum tersedia.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm text-primary-600 hover:underline"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-900">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white flex-shrink-0 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Link
          href="/dashboard"
          className="text-sm text-gray-300 hover:text-white"
          aria-label="Kembali ke dashboard"
        >
          ← Kembali
        </Link>
        <span className="text-gray-500">|</span>
        <span className="text-sm font-medium truncate">{comic.title}</span>
      </div>

      {/* Reader */}
      <div className="flex-1 min-h-0">
        {comic.pdfPath ? (
          <PdfReader
            pdfPath={comic.pdfPath}
            onComplete={handleComplete}
            showCompleteButton
            completeButtonLabel={
              saveStatus === "saving"
                ? "Menyimpan..."
                : saveStatus === "error"
                  ? "Gagal — Coba Lagi"
                  : "Selesaikan Komik"
            }
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-white py-20">
            <p className="text-lg font-semibold">Coming Soon</p>
            <p className="text-sm text-gray-400">{comic.subtitle}</p>
          </div>
        )}
      </div>
    </main>
  );
}
