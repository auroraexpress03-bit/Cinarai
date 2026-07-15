import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  ActivityDocument,
  ComicDocument,
  ComicProgressDocument,
  ReflectionDocument,
  UserDocument,
} from '@/types/firestore';
import {
  subscribeToAllProgressDocuments,
  subscribeToComics,
  subscribeToRecentActivities,
  subscribeToReflections,
  subscribeToUsers,
} from '@/app/dashboard/guru/services/teacher/dashboard/teacherDashboardFirestore';

export type TeacherDashboardSourceState = {
  students: UserDocument[];
  comics: ComicDocument[];
  progressDocuments: ComicProgressDocument[];
  progressByStudent: Map<string, ComicProgressDocument[]>;
  activities: ActivityDocument[];
  reflections: ReflectionDocument[];
  loading: boolean;
  error: string | null;
};

const initialSourceState: TeacherDashboardSourceState = {
  students: [],
  comics: [],
  progressDocuments: [],
  progressByStudent: new Map(),
  activities: [],
  reflections: [],
  loading: true,
  error: null,
};

export function useTeacherDashboardSource(): TeacherDashboardSourceState {
  const [state, setState] = useState(initialSourceState);
  const loaded = useRef({ users: false, comics: false, progress: false, activities: false, reflections: false });

  const setError = (error: Error) => {
    setState((current) => ({ ...current, loading: false, error: error.message || 'Terjadi kesalahan saat mengambil data.' }));
  };

  useEffect(() => {
    let active = true;

    const markLoaded = (key: keyof typeof loaded.current) => {
      if (!active) return;
      if (!loaded.current[key]) {
        loaded.current[key] = true;
      }

      if (Object.values(loaded.current).every(Boolean)) {
        setState((current) => ({ ...current, loading: false }));
      }
    };

    const usersUnsubscribe = subscribeToUsers(
      (users) => {
        if (!active) return;
        setState((current) => ({ ...current, students: users.filter((user) => user.role === 'student') }));
        markLoaded('users');
      },
      (error) => {
        if (!active) return;
        setError(error);
      }
    );

    const comicsUnsubscribe = subscribeToComics(
      (comics) => {
        if (!active) return;
        setState((current) => ({ ...current, comics }));
        markLoaded('comics');
      },
      (error) => {
        if (!active) return;
        setError(error);
      }
    );

    const progressUnsubscribe = subscribeToAllProgressDocuments(
      (progressDocuments) => {
        if (!active) return;
        setState((current) => ({ ...current, progressDocuments }));
        markLoaded('progress');
      },
      (error) => {
        if (!active) return;
        setError(error);
      }
    );

    const activitiesUnsubscribe = subscribeToRecentActivities(
      (activities) => {
        if (!active) return;
        setState((current) => ({ ...current, activities }));
        markLoaded('activities');
      },
      (error) => {
        if (!active) return;
        setError(error);
      }
    );

    const reflectionsUnsubscribe = subscribeToReflections(
      (reflections) => {
        if (!active) return;
        setState((current) => ({ ...current, reflections }));
        markLoaded('reflections');
      },
      (error) => {
        if (!active) return;
        setError(error);
      }
    );

    return () => {
      active = false;
      usersUnsubscribe();
      comicsUnsubscribe();
      progressUnsubscribe();
      activitiesUnsubscribe();
      reflectionsUnsubscribe();
    };
  }, []);

  const progressByStudent = useMemo(() => {
    const map = new Map<string, ComicProgressDocument[]>();
    state.progressDocuments.forEach((document) => {
      const userId = (document as unknown as { userId?: string }).userId ?? '';
      if (!userId) return;
      const existing = map.get(userId) ?? [];
      existing.push(document);
      map.set(userId, existing);
    });
    return map;
  }, [state.progressDocuments]);

  return {
    ...state,
    progressByStudent,
  };
}
