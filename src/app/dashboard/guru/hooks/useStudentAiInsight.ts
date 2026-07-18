'use client';

import { useState } from 'react';
import { generateStudentInsight } from '@/lib/ai/service';
import type { AiInsight } from '../types';
import type { ComicProgressDocument } from '@/types/firestore';

export function useStudentAiInsight() {
  const [insight, setInsight] = useState<AiInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (
    studentName: string,
    email: string,
    progressList: ComicProgressDocument[],
    reflections: unknown[],
    activities: unknown[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateStudentInsight({
        studentName,
        email,
        progressDocuments: progressList.map((p) => ({
          comicId: p.comicId,
          percentage: p.percentage,
          status: p.status,
          completedStage: p.completedStage,
        })),
        reflections: (reflections as Array<Record<string, unknown>>).map((r) => ({
          rating: typeof r.rating === 'number' ? r.rating : null,
          stage: typeof r.stage === 'string' ? r.stage : undefined,
          response: typeof r.response === 'string' ? r.response : undefined,
          reflectionText: typeof r.reflectionText === 'string' ? r.reflectionText : undefined,
        })),
        activities: (activities as Array<Record<string, unknown>>).map((a) => ({
          title: typeof a.title === 'string' ? a.title : undefined,
          description: typeof a.description === 'string' ? a.description : undefined,
          occurredAt: a.occurredAt,
        })),
      });
      setInsight(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghasilkan analisis AI');
    } finally {
      setLoading(false);
    }
  };

  return { insight, loading, error, generate };
}
