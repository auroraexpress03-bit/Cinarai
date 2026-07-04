"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ComicCoverProps {
  comicId: number;
}

export default function ComicCover({ comicId }: ComicCoverProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to learning journey
    router.replace(`/comic/${comicId}/learn`);
  }, [comicId, router]);

  // Show loading state while redirecting
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f7ff]">
      <div className="text-center px-6">
        <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto" />
        <p className="mt-3 text-sm font-semibold text-primary-600">Memuat pembelajaran...</p>
      </div>
    </main>
  );
}
