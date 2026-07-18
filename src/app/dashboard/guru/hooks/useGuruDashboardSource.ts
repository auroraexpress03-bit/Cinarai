import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { buildGuruDashboardSnapshot } from '@/app/dashboard/guru/services/guru/dashboard/dashboardModel';
import {
  subscribeToAllProgressDocuments,
  subscribeToAllUsers,
  subscribeToComics,
  subscribeToRecentActivities,
  subscribeToReflections,
  subscribeToUsers,
} from '@/app/dashboard/guru/services/guru/dashboard/guruDashboardFirestore';
import type {
  ActivityDocument,
  ComicDocument,
  ComicProgressDocument,
  ReflectionDocument,
  UserDocument,
} from '@/types/firestore';

export type GuruDashboardSourceState = {
  students: UserDocument[];
  comics: ComicDocument[];
  progressDocuments: ComicProgressDocument[];
  progressByStudent: Map<string, ComicProgressDocument[]>;
  activities: ActivityDocument[];
  reflections: ReflectionDocument[];
  totalUsers: number;
  allUserRoles: Record<string, number>;
  comicsCount: number;
  progressCount: number;
  activityCount: number;
  reflectionCount: number;
  loading: boolean;
  error: string | null;
  usersLoading: boolean;
  usersError: string | null;
  usersSuccess: boolean;
  comicsLoading: boolean;
  comicsError: string | null;
  comicsSuccess: boolean;
  progressLoading: boolean;
  progressError: string | null;
  progressSuccess: boolean;
  activitiesLoading: boolean;
  activitiesError: string | null;
  activitiesSuccess: boolean;
  reflectionsLoading: boolean;
  reflectionsError: string | null;
  reflectionsSuccess: boolean;
};

const initialSourceState: GuruDashboardSourceState = {
  students: [],
  comics: [],
  progressDocuments: [],
  progressByStudent: new Map(),
  activities: [],
  reflections: [],
  totalUsers: 0,
  allUserRoles: {},
  comicsCount: 0,
  progressCount: 0,
  activityCount: 0,
  reflectionCount: 0,
  loading: true,
  error: null,
  usersLoading: true,
  usersError: null,
  usersSuccess: false,
  comicsLoading: true,
  comicsError: null,
  comicsSuccess: false,
  progressLoading: true,
  progressError: null,
  progressSuccess: false,
  activitiesLoading: true,
  activitiesError: null,
  activitiesSuccess: false,
  reflectionsLoading: true,
  reflectionsError: null,
  reflectionsSuccess: false,
};

export function useGuruDashboardSource() {
  const [state, setState] = useState(initialSourceState);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const listenersReady = {
      users: false,
      comics: false,
      progress: false,
      activities: false,
      reflections: false,
    };

    const requiredListeners: Array<keyof typeof listenersReady> = ['users', 'progress'];

    const debugState = {
      totalUsers: 0,
      students: 0,
      comics: 0,
      progress: 0,
      activities: 0,
      reflections: 0,
      roles: new Map<string, number>(),
    };

    const logStatus = (message: string) => {
      if (process.env.NODE_ENV !== 'development') return;
      /* eslint-disable no-console */
      console.info(`[GuruDashboard] ${message}`);
      /* eslint-enable no-console */
    };

    const logDebug = () => {
      if (process.env.NODE_ENV !== 'development') return;
      /* eslint-disable no-console */
      console.group('[GuruDashboard]');
      console.log('users:', debugState.totalUsers);
      console.log('students:', debugState.students);
      console.log('progress docs:', debugState.progress);
      console.log('activity docs:', debugState.activities);
      console.log('modules:', debugState.comics);
      if (debugState.totalUsers > 0 && debugState.students === 0) {
        console.log('role counts:');
        debugState.roles.forEach((count, role) => console.log(`${role}: ${count}`));
      }
      if (debugState.progress === 0) {
        console.warn('progress listener path: collectionGroup(progress)');
      }
      console.groupEnd();
      /* eslint-enable no-console */
    };

    const setLoadingState = (value: boolean) => {
      if (!active) return;
      setState((current) => ({
        ...current,
        loading: value,
      }));
      if (process.env.NODE_ENV === 'development' && !value) {
        logStatus('loading=false');
      }
    };

    const markListenerDone = (listener: keyof typeof listenersReady) => {
      listenersReady[listener] = true;
      logStatus(`${listener} listener ready`);
      logDebug();

      const allRequiredReady = requiredListeners.every((key) => listenersReady[key]);
      if (allRequiredReady) {
        setLoadingState(false);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      }
    };

    const handleListenerError = (listener: keyof typeof listenersReady, errorMessage: string, isRequired = false) => {
      if (!active) return;

      setState((current) => ({
        ...current,
        [`${listener}Loading`]: false,
        [`${listener}Error`]: errorMessage,
        [`${listener}Success`]: false,
        error: isRequired ? errorMessage : current.error,
      }));

      markListenerDone(listener);

      if (isRequired) {
        setLoadingState(false);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      }
    };

    const handleListenerSuccess = (listener: keyof typeof listenersReady) => {
      if (!active) return;
      markListenerDone(listener);
    };

    if (!user || user.role !== 'teacher') {
      setState({
        ...initialSourceState,
        loading: false,
        usersLoading: false,
        comicsLoading: false,
        progressLoading: false,
        activitiesLoading: false,
        reflectionsLoading: false,
        usersSuccess: false,
        comicsSuccess: false,
        progressSuccess: false,
        activitiesSuccess: false,
        reflectionsSuccess: false,
        error: user ? 'Akun ini bukan akun guru.' : 'Sesi tidak tersedia',
      });
      return;
    }

    timeoutId = setTimeout(() => {
      if (!active) return;

      const pendingListeners = Object.entries(listenersReady)
        .filter(([, ready]) => !ready)
        .map(([name]) => name)
        .join(', ');

      if (pendingListeners.length > 0) {
        /* eslint-disable no-console */
        console.warn(`[GuruDashboard] Loading timeout setelah 5 detik. Pending listeners: ${pendingListeners}`);
        /* eslint-enable no-console */
      }

      setState((current) => ({
        ...current,
        loading: false,
        usersLoading: false,
        comicsLoading: false,
        progressLoading: false,
        activitiesLoading: false,
        reflectionsLoading: false,
      }));
      logStatus('loading=false (timeout)');
      timeoutId = null;
    }, 5000);

    const usersUnsubscribe = subscribeToUsers(
      (nextStudents) => {
        if (!active) return;
        debugState.students = nextStudents.length;
        setState((current) => ({
          ...current,
          students: nextStudents,
          usersLoading: false,
          usersError: null,
          usersSuccess: true,
        }));
        handleListenerSuccess('users');
      },
      (nextError) => {
        if (!active) return;
        handleListenerError('users', nextError.message, true);
      }
    );

    let allUsersUnsubscribe = () => {};
    if (process.env.NODE_ENV === 'development') {
      allUsersUnsubscribe = subscribeToAllUsers(
        (nextUsers) => {
          if (!active) return;
          const roleCounts: Record<string, number> = {};
          nextUsers.forEach((userDoc) => {
            const role = typeof userDoc.role === 'string' ? userDoc.role : 'undefined';
            roleCounts[role] = (roleCounts[role] ?? 0) + 1;
          });
          debugState.totalUsers = nextUsers.length;
          debugState.roles = new Map(Object.entries(roleCounts));
          setState((current) => ({
            ...current,
            totalUsers: nextUsers.length,
            allUserRoles: roleCounts,
          }));
          logDebug();
        },
        (nextError) => {
          if (!active) return;
          /* eslint-disable no-console */
          console.warn('[GuruDashboard] subscribeToAllUsers failed:', nextError.message);
          /* eslint-enable no-console */
        }
      );
    }

    const comicsUnsubscribe = subscribeToComics(
      (nextComics) => {
        if (!active) return;
        debugState.comics = nextComics.length;
        setState((current) => ({
          ...current,
          comics: nextComics,
          comicsLoading: false,
          comicsError: null,
          comicsSuccess: true,
          comicsCount: nextComics.length,
        }));
        handleListenerSuccess('comics');
      },
      (nextError) => {
        if (!active) return;
        handleListenerError('comics', nextError.message, false);
      }
    );

    const progressUnsubscribe = subscribeToAllProgressDocuments(
      (nextProgressDocuments) => {
        if (!active) return;
        debugState.progress = nextProgressDocuments.length;
        setState((current) => ({
          ...current,
          progressDocuments: nextProgressDocuments,
          progressLoading: false,
          progressError: null,
          progressSuccess: true,
          progressCount: nextProgressDocuments.length,
        }));
        handleListenerSuccess('progress');
      },
      (nextError) => {
        if (!active) return;
        handleListenerError('progress', nextError.message, true);
      }
    );

    const activitiesUnsubscribe = subscribeToRecentActivities(
      (nextActivities) => {
        if (!active) return;
        debugState.activities = nextActivities.length;
        setState((current) => ({
          ...current,
          activities: nextActivities,
          activitiesLoading: false,
          activitiesError: null,
          activitiesSuccess: true,
          activityCount: nextActivities.length,
        }));
        handleListenerSuccess('activities');
      },
      (nextError) => {
        if (!active) return;
        handleListenerError('activities', nextError.message, false);
      }
    );

    const reflectionsUnsubscribe = subscribeToReflections(
      (nextReflections) => {
        if (!active) return;
        debugState.reflections = nextReflections.length;
        setState((current) => ({
          ...current,
          reflections: nextReflections,
          reflectionsLoading: false,
          reflectionsError: null,
          reflectionsSuccess: true,
          reflectionCount: nextReflections.length,
        }));
        handleListenerSuccess('reflections');
      },
      (nextError) => {
        if (!active) return;
        handleListenerError('reflections', nextError.message, false);
      }
    );

    return () => {
      active = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      usersUnsubscribe();
      allUsersUnsubscribe();
      comicsUnsubscribe();
      progressUnsubscribe();
      activitiesUnsubscribe();
      reflectionsUnsubscribe();
    };
  }, [user]);

  const progressByStudent = useMemo(() => {
    const map = new Map<string, ComicProgressDocument[]>();
    state.progressDocuments.forEach((document) => {
      const userId = document.userId ?? '';
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
    dashboardSnapshot: buildGuruDashboardSnapshot({
      students: state.students,
      comics: state.comics,
      progressDocuments: state.progressDocuments,
      activities: state.activities,
      reflections: state.reflections,
    }),
  };
}
