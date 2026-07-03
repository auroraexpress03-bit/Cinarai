'use client';

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';
import { getAllComics } from '@/lib/comicRepository';
import { createInitialProgressState, restoreProgressState } from '@/lib/progressEngine';
import type { ComicProgressDocument } from '@/types/firestore';
import type { ComicProgressState, SintaksProgress } from '@/types/progress';

const COLLECTION = 'comic_progress';

/** Deterministic doc ID: {userId}_{comicId} */
function docId(userId: string, comicId: number): string {
  return `${userId}_${comicId}`;
}

/** Serialize sintaksList to a plain string for the `stage` field (current sintaks name). */
function currentStage(state: ComicProgressState): string {
  return state.sintaksList.find((s) => s.status === 'CURRENT')?.sintaks ?? 'Cover';
}

function deriveStatus(state: ComicProgressState): ComicProgressDocument['status'] {
  if (state.isCompleted) return 'completed';
  if (state.completedCount > 0) return 'in_progress';
  return 'not_started';
}

// ─── Create ──────────────────────────────────────────────────────────────────

/** Create initial progress documents for all comics when user first logs in. */
export async function initializeUserProgress(userId: string): Promise<void> {
  const comics = getAllComics();

  await Promise.all(
    comics.map(async (comic) => {
      const ref = doc(firestore, COLLECTION, docId(userId, comic.id));
      const snap = await getDoc(ref);
      if (snap.exists()) return; // already initialized

      const state = createInitialProgressState(comic.id);

      const data: Omit<ComicProgressDocument, 'id'> = {
        userId,
        comicId: comic.id,
        stage: currentStage(state),
        percentage: state.percentage,
        status: deriveStatus(state),
        sintaksList: state.sintaksList,
        updatedAt: serverTimestamp() as ComicProgressDocument['updatedAt'],
      };

      await setDoc(ref, data);
    })
  );
}

// ─── Update ──────────────────────────────────────────────────────────────────

/** Persist updated progress state to Firestore. */
export async function saveComicProgress(
  userId: string,
  state: ComicProgressState
): Promise<void> {
  const ref = doc(firestore, COLLECTION, docId(userId, state.comicId));
  const isCompleted = state.isCompleted;

  await updateDoc(ref, {
    stage: currentStage(state),
    percentage: state.percentage,
    status: deriveStatus(state),
    sintaksList: state.sintaksList,
    updatedAt: serverTimestamp(),
    ...(isCompleted ? { completedAt: serverTimestamp() } : {}),
  });
}

// ─── Subscribe ───────────────────────────────────────────────────────────────

/** Subscribe to a single comic's progress in realtime. */
export function subscribeToComicProgress(
  userId: string,
  comicId: number,
  callback: (state: ComicProgressState) => void
): Unsubscribe {
  const ref = doc(firestore, COLLECTION, docId(userId, comicId));

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(createInitialProgressState(comicId));
      return;
    }

    const data = snap.data() as ComicProgressDocument & { sintaksList?: SintaksProgress[] };

    // If sintaksList is stored, restore from it; otherwise rebuild from stage/percentage
    if (data.sintaksList) {
      callback(restoreProgressState(comicId, data.sintaksList));
    } else {
      callback(createInitialProgressState(comicId));
    }
  });
}

/** Subscribe to all comics' progress for a user in realtime. */
export function subscribeToAllComicProgress(
  userId: string,
  callback: (states: ComicProgressState[]) => void
): Unsubscribe {
  const q = query(
    collection(firestore, COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snap) => {
    const states: ComicProgressState[] = snap.docs.map((d) => {
      const data = d.data() as ComicProgressDocument & { sintaksList?: SintaksProgress[] };
      const comicId = data.comicId;

      if (data.sintaksList) {
        return restoreProgressState(comicId, data.sintaksList);
      }
      return createInitialProgressState(comicId);
    });

    callback(states);
  });
}
