import { query, collection, getDocs, onSnapshot, where, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';
import { safeGetDocs, safeOnSnapshot } from '@/app/dashboard/guru/services/guru/firestoreAudit';
import type { ReflectionDocument } from '@/types/firestore';
import type { Unsubscribe } from 'firebase/firestore';

function normalizeReflection(documentSnapshot: QueryDocumentSnapshot<DocumentData>): ReflectionDocument {
  return {
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as ReflectionDocument;
}

export async function loadStudentReflections(studentId: string): Promise<ReflectionDocument[]> {
  const snapshot = await safeGetDocs('reflection', 'reflection', () => query(collection(firestore, 'reflection'), where('userId', '==', studentId)));
  return snapshot.docs.map(normalizeReflection);
}

export function subscribeToStudentReflections(
  studentId: string,
  callback: (reflections: ReflectionDocument[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return safeOnSnapshot(
    query(collection(firestore, 'reflection'), where('userId', '==', studentId)),
    (snapshot) => callback(snapshot.docs.map(normalizeReflection)),
    onError,
    'reflection',
    `reflection?userId=${studentId}`
  );
}
