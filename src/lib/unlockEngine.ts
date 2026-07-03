import { getAllComics, getComicById } from "@/lib/comicRepository";
import type { ComicProgressState } from "@/types/progress";

export type UnlockStatus = "UNLOCKED" | "LOCKED" | "COMING_SOON";

/**
 * Determine unlock status for a single comic given all progress states.
 *
 * Rules (read from repository, no hardcoded IDs):
 * - COMING_SOON comics → always COMING_SOON
 * - First ACTIVE comic (lowest id) → always UNLOCKED
 * - Subsequent ACTIVE comics → UNLOCKED only if the previous ACTIVE comic is 100% complete
 */
export function getUnlockStatus(
  comicId: number,
  allProgress: ComicProgressState[]
): UnlockStatus {
  const comic = getComicById(comicId);
  if (!comic) return "LOCKED";

  if (comic.availability === "COMING_SOON") return "COMING_SOON";

  // All ACTIVE comics sorted by id
  const activeComics = getAllComics()
    .filter((c) => c.availability === "ACTIVE")
    .sort((a, b) => a.id - b.id);

  const position = activeComics.findIndex((c) => c.id === comicId);

  // First ACTIVE comic is always unlocked
  if (position === 0) return "UNLOCKED";

  // Unlock if the previous ACTIVE comic is 100% complete
  const prevComic = activeComics[position - 1];
  const prevProgress = allProgress.find((p) => p.comicId === prevComic.id);
  return prevProgress?.isCompleted ? "UNLOCKED" : "LOCKED";
}

/**
 * Compute unlock status for all comics at once.
 */
export function getAllUnlockStatuses(
  allProgress: ComicProgressState[]
): Map<number, UnlockStatus> {
  const map = new Map<number, UnlockStatus>();
  for (const comic of getAllComics()) {
    map.set(comic.id, getUnlockStatus(comic.id, allProgress));
  }
  return map;
}
