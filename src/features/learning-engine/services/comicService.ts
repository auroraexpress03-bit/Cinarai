import { COMICS } from "@/data/comics";
import type { Comic } from "@/types/comic";

export function getComicById(comicId: number): Comic | null {
  return COMICS.find((c) => c.id === comicId) ?? null;
}

export function getComicBySlug(slug: string): Comic | null {
  return COMICS.find((c) => c.slug === slug) ?? null;
}
