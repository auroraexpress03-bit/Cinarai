'use client';

import { useEffect, useState } from 'react';
import type { AiAnalyticsOverview } from '../types';
import { getUsers, getRecentActivities, getAiTutorUsage } from '../services/analyticsService';
import { calculateAverageScore, aggregateSintaksDifficulty } from '../utils/aggregation';
import { queryFirestoreCollection } from '@/services/firestore';
import type { ProgressDocument } from '@/types/firestore';

export const useAiAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AiAnalyticsOverview | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [users, activities, aiUses] = await Promise.all([
          getUsers(),
          getRecentActivities(200),
          getAiTutorUsage(),
        ] as const);

        // gather progress for recent students (limited)
        const progressAll = await queryFirestoreCollection('progress', { limitCount: 1000 }) as ProgressDocument[];

        const averageScore = calculateAverageScore(progressAll);
        const sintaksDifficulty = aggregateSintaksDifficulty(progressAll);

        const overview: AiAnalyticsOverview = {
          totalStudents: users.filter((u) => u.role === 'student').length,
          averageScore,
          sintaksDifficulty,
          recentActivitiesCount: activities.length,
          aiTutorUses: aiUses.length,
          recentReflectionsCount: 0,
        };

        if (mounted) setData(overview);
      } catch (err) {
        if (mounted) setError(err as Error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, []);

  return { loading, data, error } as const;
};
