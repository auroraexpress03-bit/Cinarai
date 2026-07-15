'use client';

import { useEffect, useMemo, useState } from 'react';
import { subscribeToUsers, subscribeToAllProgressDocuments } from '../services/teacher/dashboard/teacherDashboardFirestore';
import { buildStudentDirectoryRows } from '../services/teacher/students/students';
import type { ComicProgressDocument, UserDocument } from '@/types/firestore';

export function useStudents() {
  const [students, setStudents] = useState<UserDocument[]>([]);
  const [progressDocuments, setProgressDocuments] = useState<ComicProgressDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const usersUnsubscribe = subscribeToUsers(
      (nextUsers) => {
        setStudents(nextUsers);
      },
      (nextError) => {
        setError(nextError.message);
      }
    );

    const progressUnsubscribe = subscribeToAllProgressDocuments(
      (nextProgressDocuments) => {
        setProgressDocuments(nextProgressDocuments);
        setLoading(false);
      },
      (nextError) => {
        setError(nextError.message);
      }
    );

    return () => {
      usersUnsubscribe();
      progressUnsubscribe();
    };
  }, []);

  const rows = useMemo(() => buildStudentDirectoryRows(students, progressDocuments), [students, progressDocuments]);

  return { students, progressDocuments, rows, loading, error };
}
