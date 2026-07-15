import type { ProgressDocument } from '@/types/firestore';
import type { SintaksProgress } from '@/types/progress';

export const calculateAverageScore = (progressList: ProgressDocument[]): number | null => {
  if (!progressList || progressList.length === 0) return null;
  const scores = progressList.map((p) => (typeof p.score === 'number' ? p.score : 0));
  const sum = scores.reduce((a, b) => a + b, 0);
  return sum / scores.length;
};

export const aggregateSintaksDifficulty = (progressList: ProgressDocument[]) => {
  const counts: Record<string, number> = {};
  progressList.forEach((p) => {
    const sintaksList = (p as unknown as { sintaksList?: SintaksProgress[] }).sintaksList;
    if (sintaksList && Array.isArray(sintaksList)) {
      sintaksList.forEach((s) => {
        const key = s?.sintaks ?? 'unknown';
        if (!counts[key]) counts[key] = 0;
        if (s?.status !== 'COMPLETED') counts[key] += 1;
      });
    }
  });
  return counts;
};
