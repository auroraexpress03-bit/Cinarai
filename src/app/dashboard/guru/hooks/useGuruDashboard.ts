import { useEffect, useState } from 'react';
import { fetchGuruDashboardData, type GuruDashboardData } from '../services/guruDashboardService';

export function useGuruDashboard() {
  const [data, setData] = useState<GuruDashboardData>({
    summary: null,
    comicProgress: [],
    stageProgress: [],
    valueDistribution: [],
    completionStatuses: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const nextData = await fetchGuruDashboardData();
        if (!active) return;
        setData(nextData);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat data dashboard guru.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  return { ...data, loading, error };
}
