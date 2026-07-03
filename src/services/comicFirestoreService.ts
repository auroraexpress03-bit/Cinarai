'use client';

import {
  getFirestoreDocument,
  queryFirestoreCollection,
} from '@/services/firestore';
import type { ComicDocument } from '@/types/firestore';
import type { Comic } from '@/types/comic';

/** Map Firestore ComicDocument → app Comic type */
function toComic(doc: ComicDocument): Comic {
  return {
    id: doc.comicId,
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle,
    kelas: doc.kelas,
    lokasi: doc.lokasi,
    synopsis: doc.synopsis,
    characters: doc.characters.map((c) => ({
      name: c.name,
      description: c.description,
      avatar: c.avatar,
    })),
    learningTargets: doc.learningTargets,
    estimatedMinutes: doc.estimatedMinutes,
    pdfPath: doc.pdfUrl,
    cover: doc.coverUrl,
    thumbnail: doc.thumbnailUrl,
    stages: ['comic', 'quiz', 'ar', 'reflection'],
    availability: doc.availability,
  };
}

/** Fetch one comic by numeric ID (doc ID: "comic-{id}"). */
export async function fetchComicById(comicId: number): Promise<Comic | null> {
  const doc = await getFirestoreDocument('comics', `comic-${comicId}`);
  return doc ? toComic(doc) : null;
}

/** Fetch all comics ordered by `order` field. */
export async function fetchAllComics(): Promise<Comic[]> {
  const docs = await queryFirestoreCollection('comics', {
    orderByField: 'order',
    orderDirection: 'asc',
  });
  return docs.map(toComic);
}
