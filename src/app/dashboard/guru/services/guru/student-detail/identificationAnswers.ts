import { collection, getDocs, onSnapshot, orderBy, query, where, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';
import { safeGetDocs, safeOnSnapshot } from '@/app/dashboard/guru/services/guru/firestoreAudit';
import type { IdentificationAnswerDocument } from '@/types/firestore';
import type { Unsubscribe } from 'firebase/firestore';

function normalizeIdentificationAnswer(documentSnapshot: QueryDocumentSnapshot<DocumentData>): IdentificationAnswerDocument {
  return {
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as IdentificationAnswerDocument;
}

export async function loadStudentIdentificationAnswers(studentId: string): Promise<IdentificationAnswerDocument[]> {
  const snapshot = await safeGetDocs(
    'identification_answers',
    `identification_answers?userId=${studentId}`,
    () => query(collection(firestore, 'identification_answers'), where('userId', '==', studentId), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map(normalizeIdentificationAnswer);
}

export function subscribeToStudentIdentificationAnswers(
  studentId: string,
  callback: (answers: IdentificationAnswerDocument[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return safeOnSnapshot(
    query(collection(firestore, 'identification_answers'), where('userId', '==', studentId), orderBy('createdAt', 'desc')),
    (snapshot) => callback(snapshot.docs.map(normalizeIdentificationAnswer)),
    onError,
    'identification_answers',
    `identification_answers?userId=${studentId}`
  );
}
