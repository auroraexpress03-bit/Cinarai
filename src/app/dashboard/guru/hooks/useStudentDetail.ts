'use client';

import { useEffect, useState } from 'react';
import { fetchStudentProgress, fetchStudentReflections, fetchStudentActivities, fetchStudentDoc } from '../services/firestoreService';
import type { ComicDocument, ComicProgressDocument, UserDocument } from '@/types/firestore';

interface StudentDetailState {
  student: UserDocument | null;
  progressList: ComicProgressDocument[];
  reflections: unknown[];
  activities: unknown[];
  loading: boolean;
  error: string | null;
}

export function useStudentDetail(uid: string, comics: ComicDocument[]) {
  const [state, setState] = useState<StudentDetailState>({
    student: null,
    progressList: [],
    reflections: [],
    activities: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!uid) return;
    let active = true;
    setState((p) => ({ ...p, loading: true, error: null }));

    Promise.all([
      fetchStudentDoc(uid),
      fetchStudentProgress(uid),
      fetchStudentReflections(uid),
      fetchStudentActivities(uid),
    ])
      .then(([student, progressList, reflections, activities]) => {
        if (!active) return;
        setState({ student, progressList, reflections, activities, loading: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        setState((p) => ({
          ...p,
          loading: false,
          error: err instanceof Error ? err.message : 'Gagal memuat data siswa',
        }));
      });

    return () => { active = false; };
  }, [uid]);

  const comicProgress = comics.map((c) => ({
    comic: c,
    progress: state.progressList.find((p) => p.comicId === c.comicId) ?? null,
  }));

  return { ...state, comicProgress };
}
