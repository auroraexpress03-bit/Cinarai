'use client';

import { useState } from 'react';
import { AiRouter } from '@/lib/ai/router';
import { Card, Skeleton } from '../components/ui';
import type { StudentRow } from '../types';
import type { ComicDocument } from '@/types/firestore';

interface ClassInsight {
  summary: string;
  laggingStudents: string[];
  recommendations: string[];
  provider?: string;
}

interface Props {
  rows: StudentRow[];
  comics: ComicDocument[];
}

export function AiAssistantPanel({ rows, comics }: Props) {
  const [insight, setInsight] = useState<ClassInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const lagging = rows.filter((r) => r.averageProgress < 40);
      const avgProgress =
        rows.length > 0
          ? Math.round(rows.reduce((s, r) => s + r.averageProgress, 0) / rows.length)
          : 0;

      const prompt = [
        'Analisis kelas untuk guru CINARAI.',
        `Total siswa: ${rows.length}`,
        `Rata-rata progress: ${avgProgress}%`,
        `Siswa dengan progress < 40%: ${lagging.map((r) => r.displayName).join(', ') || 'tidak ada'}`,
        `Total komik tersedia: ${comics.length}`,
        '',
        'Berikan:',
        '1. Ringkasan kondisi kelas (2-3 kalimat)',
        '2. Daftar nama siswa yang perlu perhatian khusus',
        '3. 3 rekomendasi tindak lanjut untuk guru',
        '',
        'Format JSON: { "summary": "...", "laggingStudents": ["..."], "recommendations": ["..."] }',
      ].join('\n');

      const router = AiRouter.createDefault();
      const response = await router.generate({
        prompt,
        systemPrompt:
          'Kamu adalah asisten guru CINARAI. Jawab hanya tentang pembelajaran numerasi berbasis etnomatematika. Kembalikan JSON valid.',
        temperature: 0.5,
        maxTokens: 400,
      });

      const raw = response.content ?? '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Format respons AI tidak valid');
      const parsed = JSON.parse(jsonMatch[0]) as Partial<ClassInsight>;
      setInsight({
        summary: parsed.summary ?? '—',
        laggingStudents: Array.isArray(parsed.laggingStudents) ? parsed.laggingStudents : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        provider: response.provider,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menganalisis kelas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">AI Assistant</p>
          <h2 className="text-base font-black text-neutral-900">Analisis Kelas 🤖</h2>
        </div>
        {!insight && (
          <button
            onClick={analyze}
            disabled={loading || rows.length === 0}
            className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Menganalisis…' : 'Analisis Kelas'}
          </button>
        )}
        {insight && (
          <button
            onClick={() => setInsight(null)}
            className="rounded-xl bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-error-600 bg-error-50 rounded-xl px-4 py-3 mb-3">{error}</p>
      )}

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      )}

      {insight && !loading && (
        <div className="space-y-4 text-sm">
          <div className="rounded-xl bg-primary-50 px-4 py-3">
            <p className="text-xs font-bold text-primary-600 mb-1">Ringkasan Kelas</p>
            <p className="text-neutral-800 leading-relaxed">{insight.summary}</p>
          </div>

          {insight.laggingStudents.length > 0 && (
            <div className="rounded-xl bg-warning-50 px-4 py-3">
              <p className="text-xs font-bold text-warning-700 mb-2">⚠️ Perlu Perhatian</p>
              <ul className="space-y-1">
                {insight.laggingStudents.map((name, i) => (
                  <li key={i} className="text-neutral-700">• {name}</li>
                ))}
              </ul>
            </div>
          )}

          {insight.recommendations.length > 0 && (
            <div className="rounded-xl bg-accent-50 px-4 py-3">
              <p className="text-xs font-bold text-accent-700 mb-2">✅ Rekomendasi</p>
              <ol className="space-y-1.5">
                {insight.recommendations.map((rec, i) => (
                  <li key={i} className="text-neutral-700">{i + 1}. {rec}</li>
                ))}
              </ol>
            </div>
          )}

          {insight.provider && (
            <p className="text-xs text-neutral-400">Provider: {insight.provider}</p>
          )}
        </div>
      )}

      {!insight && !loading && !error && (
        <p className="text-sm text-neutral-400">
          Klik &ldquo;Analisis Kelas&rdquo; untuk mendapatkan insight AI tentang kondisi kelas secara keseluruhan.
        </p>
      )}
    </Card>
  );
}
