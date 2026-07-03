import { serverTimestamp } from 'firebase/firestore';
import {
  getFirestoreDocument,
  mergeFirestoreDocument,
  subscribeToFirestoreCollection,
  queryFirestoreCollection,
} from '@/services/firestore';
import type { IdentificationAnswerDocument } from '@/types/firestore';
import type { Unsubscribe } from 'firebase/firestore';

/** Doc ID: {userId}_{comicId}_{step} */
function docId(userId: string, comicId: number, step: number): string {
  return `${userId}_${comicId}_${step}`;
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Simpan atau update jawaban satu item identifikasi.
 * Menggunakan merge agar aman untuk dokumen baru maupun yang sudah ada.
 */
export async function saveIdentificationAnswer(
  userId: string,
  comicId: number,
  step: number,
  data: {
    selectedAnswer: string | null;
    note: string;
    reason: string;
  }
): Promise<void> {
  const id = docId(userId, comicId, step);
  try {
    const existing = await getFirestoreDocument('identification_answers', id);
    await mergeFirestoreDocument('identification_answers', id, {
      userId,
      comicId,
      step,
      selectedAnswer: data.selectedAnswer,
      note: data.note,
      reason: data.reason,
      ...(existing ? {} : { createdAt: serverTimestamp() as IdentificationAnswerDocument['createdAt'] }),
      updatedAt: serverTimestamp() as IdentificationAnswerDocument['updatedAt'],
    });
  } catch (error) {
    console.error(
      `[IdentificationAnswerService] saveIdentificationAnswer error — userId: ${userId}, comicId: ${comicId}, step: ${step}`,
      error
    );
    throw error;
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
