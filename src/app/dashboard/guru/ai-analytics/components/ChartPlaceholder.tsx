 'use client';

export const ChartPlaceholder: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-white">
      <div className="text-sm font-medium text-gray-700">{title ?? 'Chart'}</div>
      <div className="mt-4 h-40 flex items-center justify-center text-gray-400">Chart placeholder</div>
    </div>
  );
};

export default ChartPlaceholder;
