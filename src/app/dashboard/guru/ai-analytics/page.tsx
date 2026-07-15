 'use client';
import { useAiAnalytics } from './hooks/useAiAnalytics';
import OverviewPanel from './components/OverviewPanel';

export default function AiAnalyticsPage() {
  const { loading, data, error } = useAiAnalytics();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Analytics (Guru)</h1>
      {loading && <div>Loading analytics…</div>}
      {error && <div className="text-red-600">Error loading analytics: {String(error.message ?? error)}</div>}
      {!loading && <OverviewPanel data={data} />}
    </div>
  );
}
