import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { buildGuruDashboardSnapshot } from '@/app/dashboard/guru/services/guru/dashboard/dashboardModel';
import { fetchGuruDashboardFromApi } from '@/app/dashboard/guru/services/guru/dashboard/dashboardApi';
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

    const loadDashboard = async () => {
      console.log('[useGuruDashboardSource] loadDashboard started');
      console.log('[useGuruDashboardSource] User:', user?.uid, '- Role:', user?.role, '- Email:', user?.email);

      if (!user || user.role !== 'teacher') {
        console.warn('[useGuruDashboardSource] User is not teacher. Role:', user?.role);
        if (!active) return;
        setState((current) => ({
          ...current,
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
        }));
        return;
      }

      try {
        console.log('[useGuruDashboardSource] Calling fetchGuruDashboardFromApi...');
        const data = await fetchGuruDashboardFromApi();
        console.log('[useGuruDashboardSource] API call successful. Data received:', {
          students: data.students?.length ?? 0,
          comics: data.comics?.length ?? 0,
          progressDocuments: data.progressDocuments?.length ?? 0,
          activities: data.activities?.length ?? 0,
          reflections: data.reflections?.length ?? 0,
        });

        if (!active) return;
        setState((current) => ({
          ...current,
          students: data.students ?? [],
          comics: data.comics ?? [],
          progressDocuments: data.progressDocuments ?? [],
          activities: data.activities ?? [],
          reflections: data.reflections ?? [],
          loading: false,
          error: null,
          usersLoading: false,
          usersError: null,
          usersSuccess: true,
          comicsLoading: false,
          comicsError: null,
          comicsSuccess: true,
          progressLoading: false,
          progressError: null,
          progressSuccess: true,
          activitiesLoading: false,
          activitiesError: null,
          activitiesSuccess: true,
          reflectionsLoading: false,
          reflectionsError: null,
          reflectionsSuccess: true,
        }));
      } catch (error) {
        if (!active) return;

        const errorMessage = error instanceof Error ? error.message : 'Dashboard guru gagal dimuat';
        console.error('[useGuruDashboardSource] Error loading dashboard:', {
          message: errorMessage,
          name: error instanceof Error ? error.name : 'Unknown',
          stack: error instanceof Error ? error.stack : undefined,
        });

        // Set fallback data kosong agar dashboard tetap tampil
        setState((current) => ({
          ...current,
          loading: false,
          error: errorMessage,
          usersLoading: false,
          usersError: errorMessage,
          usersSuccess: false,
          comicsLoading: false,
          comicsError: errorMessage,
          comicsSuccess: false,
          progressLoading: false,
          progressError: errorMessage,
          progressSuccess: false,
          activitiesLoading: false,
          activitiesError: errorMessage,
          activitiesSuccess: false,
          reflectionsLoading: false,
          reflectionsError: errorMessage,
          reflectionsSuccess: false,
          // Set empty fallback data
          students: [],
          comics: [],
          progressDocuments: [],
          activities: [],
          reflections: [],
        }));
      }
    };

    void loadDashboard();
    const intervalId = window.setInterval(() => {
      void loadDashboard();
    }, 10000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
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
