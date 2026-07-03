import { COMICS } from "@/data/comics";
import type { Comic, ComicAvailability } from "@/types/comic";

export function getAllComics(): Comic[] {
  return COMICS;
}

export function getComicById(id: number): Comic | undefined {
  return COMICS.find((c) => c.id === id);
}

export function getComicBySlug(slug: string): Comic | undefined {
  return COMICS.find((c) => c.slug === slug);
}

export function getTotalComics(): number {
  return COMICS.length;
}

export function getAvailability(id: number): ComicAvailability | undefined {
  return getComicById(id)?.availability;
}

export function isActive(id: number): boolean {
  return getComicById(id)?.availability === "ACTIVE";
}

export function isComingSoon(id: number): boolean {
  return getComicById(id)?.availability === "COMING_SOON";
}
