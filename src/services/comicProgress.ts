'use client';

import { serverTimestamp } from 'firebase/firestore';
import { getAllComics } from '@/lib/comicRepository';
import { createInitialProgressState, restoreProgressState } from '@/lib/progressEngine';
import {
  setFirestoreDocument,
  updateFirestoreDocument,
  subscribeToFirestoreDocument,
  subscribeToFirestoreCollection,
  getFirestoreDocument,
} from '@/services/firestore';
import type { ComicProgressDocument } from '@/types/firestore';
import type { ComicProgressState } from '@/types/progress';
import type { Unsubscribe } from 'firebase/firestore';

/** Deterministic doc ID: {userId}_{comicId} */
function docId(userId: string, comicId: number): string {
  return `${userId}_${comicId}`;
}

function currentStage(state: ComicProgressState): string {
  return state.sintaksList.find((s) => s.status === 'CURRENT')?.sintaks ?? 'Cover';
}

function deriveStatus(state: ComicProgressState): ComicProgressDocument['status'] {
  if (state.isCompleted) return 'completed';
  if (state.completedCount > 0) return 'in_progress';
  return 'not_started';
}

function toDocument(
  userId: string,
  state: ComicProgressState
): Omit<ComicProgressDocument, 'id'> {
  return {
    userId,
    comicId: state.comicId,
    stage: currentStage(state),
    percentage: state.percentage,
    status: deriveStatus(state),
    sintaksList: state.sintaksList,
    updatedAt: serverTimestamp() as ComicProgressDocument['updatedAt'],
  };
}

function fromDocument(comicId: number, data: ComicProgressDocument): ComicProgressState {
  if (data.sintaksList?.length) {
    return restoreProgressState(comicId, data.sintaksList);
  }
  return createInitialProgressState(comicId);
}

// ─── Create ──────────────────────────────────────────────────────────────────

/** Create initial progress documents for all comics when user first logs in. */
export async function initializeUserProgress(userId: string): Promise<void> {
  const comics = getAllComics();

  await Promise.all(
    comics.map(async (comic) => {
      const existing = await getFirestoreDocument('comic_progress', docId(userId, comic.id));
      if (existing) return;

      const state = createInitialProgressState(comic.id);
      await setFirestoreDocument('comic_progress', docId(userId, comic.id), toDocument(userId, state));
    })
  );
}

// ─── Update ──────────────────────────────────────────────────────────────────

/** Persist updated progress state to Firestore. */
export async function saveComicProgress(
  userId: string,
  state: ComicProgressState
): Promise<void> {
  await updateFirestoreDocument('comic_progress', docId(userId, state.comicId), {
    stage: currentStage(state),
    percentage: state.percentage,
    status: deriveStatus(state),
    sintaksList: state.sintaksList,
    updatedAt: serverTimestamp(),
    ...(state.isCompleted ? { completedAt: serverTimestamp() } : {}),
  });
}

// ─── Subscribe ───────────────────────────────────────────────────────────────

/** Subscribe to a single comic's progress in realtime. */
export function subscribeToComicProgress(
  userId: string,
  comicId: number,
  callback: (state: ComicProgressState) => void
): Unsubscribe {
  return subscribeToFirestoreDocument('comic_progress', docId(userId, comicId), (data) => {
    callback(data ? fromDocument(comicId, data) : createInitialProgressState(comicId));
  });
}

/** Subscribe to all comics' progress for a user in realtime. */
export function subscribeToAllComicProgress(
  userId: string,
  callback: (states: ComicProgressState[]) => void
): Unsubscribe {
  return subscribeToFirestoreCollection(
    'comic_progress',
    (docs) => {
      callback(docs.map((d) => fromDocument(d.comicId, d)));
    },
    { filters: [{ field: 'userId', operator: '==', value: userId }] }
  );
}
