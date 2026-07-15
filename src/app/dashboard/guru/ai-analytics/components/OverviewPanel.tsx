 'use client';
import type { AiAnalyticsOverview } from '../types';
import ChartPlaceholder from './ChartPlaceholder';

export const OverviewPanel: React.FC<{ data: AiAnalyticsOverview | null }> = ({ data }) => {
  if (!data) return <div className="p-4">No analytics data available.</div>;

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border p-4 bg-white">
          <div className="text-sm text-gray-500">Total Students</div>
          <div className="text-2xl font-semibold">{data.totalStudents}</div>
        </div>
        <div className="rounded-lg border p-4 bg-white">
          <div className="text-sm text-gray-500">Average Score</div>
          <div className="text-2xl font-semibold">{data.averageScore ?? '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ChartPlaceholder title="Sintaks Difficulty" />
        <ChartPlaceholder title="Activity" />
        <ChartPlaceholder title="AI Tutor Uses" />
      </div>
    </div>
  );
};

export default OverviewPanel;
