import { collectionGroup, getDocs, onSnapshot, query, where, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';
import { safeGetDocs, safeOnSnapshot } from '@/app/dashboard/guru/services/guru/firestoreAudit';
import type { ComicProgressDocument } from '@/types/firestore';
import type { Unsubscribe } from 'firebase/firestore';

function normalizeProgressDocument(documentSnapshot: QueryDocumentSnapshot<DocumentData>): ComicProgressDocument {
  const data = documentSnapshot.data() as Partial<ComicProgressDocument>;
  return {
    id: documentSnapshot.id,
    ...data,
    comicId: data.comicId ?? Number(documentSnapshot.id.replace('comic-', '')),
  } as ComicProgressDocument;
}

export async function loadStudentProgress(studentId: string): Promise<ComicProgressDocument[]> {
  const snapshot = await safeGetDocs(
    'users/{uid}/progress (collectionGroup progress)',
    `users/{${studentId}}/progress (collectionGroup progress)`,
    () => query(collectionGroup(firestore, 'progress'), where('userId', '==', studentId))
  );
  return snapshot.docs.map(normalizeProgressDocument);
}

export function subscribeToStudentProgress(
  studentId: string,
  callback: (progress: ComicProgressDocument[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return safeOnSnapshot(
    query(collectionGroup(firestore, 'progress'), where('userId', '==', studentId)),
    (snapshot) => callback(snapshot.docs.map(normalizeProgressDocument)),
    onError,
    'users/{uid}/progress (collectionGroup progress)',
    `users/{${studentId}}/progress (collectionGroup progress)`
  );
}
