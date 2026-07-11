import { serverTimestamp } from 'firebase/firestore';
import {
  getFirestoreDocument,
  mergeFirestoreDocument,
  subscribeToFirestoreCollection,
  queryFirestoreCollection,
} from '@/services/firestore';
import type { IdentificationAnswerDocument } from '@/types/firestore';
import type { Unsubscribe } from 'firebase/firestore';

interface PendingIdentificationWrite {
  userId: string;
  comicId: number;
  step: number;
  data: {
    selectedAnswer: string | null;
    selectedAnswerIds?: string[];
    correctAnswer?: string | null;
    selectedShapes?: string[];
    aiTutorUsed?: boolean;
    attemptCount?: number;
    note: string;
    reason: string;
  };
}

const PENDING_STORAGE_KEY = 'cinarai:identification-pending';

const pendingWrites = new Map<string, PendingIdentificationWrite>();
let flushTimer: number | null = null;
let isFlushing = false;

/** Doc ID: {userId}_{comicId}_{step} */
function docId(userId: string, comicId: number, step: number): string {
  return `${userId}_${comicId}_${step}`;
}

function getPendingStorage(): PendingIdentificationWrite[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(PENDING_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingIdentificationWrite[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistPendingStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(Array.from(pendingWrites.values())));
  } catch {
    // Ignore storage failures; the in-memory queue remains available.
  }
}

function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

function scheduleFlush(delay = 250): void {
  if (typeof window === 'undefined') return;

  if (flushTimer) {
    window.clearTimeout(flushTimer);
  }

  flushTimer = window.setTimeout(() => {
    void flushPendingWrites();
  }, delay);
}

async function persistToFirestore(entry: PendingIdentificationWrite): Promise<void> {
  const id = docId(entry.userId, entry.comicId, entry.step);
  const existing = await getFirestoreDocument('identification_answers', id);
  await mergeFirestoreDocument('identification_answers', id, {
    userId: entry.userId,
    comicId: entry.comicId,
    step: entry.step,
    selectedAnswer: entry.data.selectedAnswer,
    selectedAnswerIds: entry.data.selectedAnswerIds ?? [],
    correctAnswer: entry.data.correctAnswer ?? null,
    selectedShapes: entry.data.selectedShapes ?? [],
    aiTutorUsed: entry.data.aiTutorUsed ?? false,
    attemptCount: entry.data.attemptCount ?? 0,
    note: entry.data.note,
    reason: entry.data.reason,
    ...(existing ? {} : { createdAt: serverTimestamp() as IdentificationAnswerDocument['createdAt'] }),
    updatedAt: serverTimestamp() as IdentificationAnswerDocument['updatedAt'],
  });
}

async function flushPendingWrites(): Promise<void> {
  if (isFlushing || !isOnline() || pendingWrites.size === 0) return;

  isFlushing = true;

  try {
    const entries = Array.from(pendingWrites.values());
    pendingWrites.clear();
    persistPendingStorage();

    for (const entry of entries) {
      try {
        await persistToFirestore(entry);
      } catch (error) {
        console.warn(
          `[IdentificationAnswerService] queued write failed — userId: ${entry.userId}, comicId: ${entry.comicId}, step: ${entry.step}`,
          error
        );
        pendingWrites.set(docId(entry.userId, entry.comicId, entry.step), entry);
        persistPendingStorage();
      }
    }
  } finally {
    isFlushing = false;
    if (pendingWrites.size > 0 && isOnline()) {
      scheduleFlush(1000);
    }
  }
}

function registerSyncListeners(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    scheduleFlush(250);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      scheduleFlush(250);
    }
  });
}

const storedPendingWrites = getPendingStorage();
storedPendingWrites.forEach((entry) => {
  pendingWrites.set(docId(entry.userId, entry.comicId, entry.step), entry);
});
registerSyncListeners();

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Simpan atau update jawaban satu item identifikasi.
 * Jika Firestore tidak tersedia, barang tetap disimpan ke queue lokal dan disinkronkan saat koneksi kembali.
 */
export async function saveIdentificationAnswer(
  userId: string,
  comicId: number,
  step: number,
  data: {
    selectedAnswer: string | null;
    selectedAnswerIds?: string[];
    correctAnswer?: string | null;
    selectedShapes?: string[];
    aiTutorUsed?: boolean;
    attemptCount?: number;
    note: string;
    reason: string;
  }
): Promise<void> {
  const key = docId(userId, comicId, step);
  const pendingEntry: PendingIdentificationWrite = { userId, comicId, step, data };

  pendingWrites.set(key, pendingEntry);
  persistPendingStorage();

  if (!isOnline()) {
    return;
  }

  try {
    await persistToFirestore(pendingEntry);
    pendingWrites.delete(key);
    persistPendingStorage();
  } catch (error) {
    console.warn(
      `[IdentificationAnswerService] saveIdentificationAnswer queued for retry — userId: ${userId}, comicId: ${comicId}, step: ${step}`,
      error
    );
    scheduleFlush(500);
  }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Ambil semua jawaban identifikasi untuk satu user + komik (one-time fetch).
 */
export async function loadIdentificationAnswers(
  userId: string,
  comicId: number
): Promise<IdentificationAnswerDocument[]> {
  try {
    return await queryFirestoreCollection('identification_answers', {
      filters: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'comicId', operator: '==', value: comicId },
      ],
      orderByField: 'step',
      orderDirection: 'asc',
    });
  } catch (error) {
    console.error(
      `[IdentificationAnswerService] loadIdentificationAnswers error — userId: ${userId}, comicId: ${comicId}`,
      error
    );
    return [];
  }
}

// ─── Subscribe ────────────────────────────────────────────────────────────────

/**
 * Subscribe realtime ke semua jawaban identifikasi untuk satu user + komik.
 */
export function subscribeToIdentificationAnswers(
  userId: string,
  comicId: number,
  callback: (answers: IdentificationAnswerDocument[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return subscribeToFirestoreCollection(
    'identification_answers',
    callback,
    {
      filters: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'comicId', operator: '==', value: comicId },
      ],
      orderByField: 'step',
      orderDirection: 'asc',
    },
    (error) => {
      console.error(
        `[IdentificationAnswerService] subscribeToIdentificationAnswers error — userId: ${userId}, comicId: ${comicId}`,
        error
      );
      onError?.(error);
    }
  );
}
