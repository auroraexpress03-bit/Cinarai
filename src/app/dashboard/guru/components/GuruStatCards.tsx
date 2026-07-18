'use client';

import { MenuBookIcon, PeopleIcon, SchoolIcon, TrendingUpIcon } from './GuruIcons';

type GuruStatCardProps = {
  title: string;
  value: string;
  icon: 'people' | 'school' | 'menuBook' | 'trendingUp';
  accent: string;
};

function renderIcon(icon: GuruStatCardProps['icon'], className: string) {
  switch (icon) {
    case 'people':
      return <PeopleIcon className={className} />;
    case 'school':
      return <SchoolIcon className={className} />;
    case 'menuBook':
      return <MenuBookIcon className={className} />;
    case 'trendingUp':
      return <TrendingUpIcon className={className} />;
    default:
      return null;
  }
}

export function GuruStatCards({ stats }: { stats: GuruStatCardProps[] }) {
  return (
    <section className="grid grid-cols-2 gap-2 xl:grid-cols-4">
      {stats.length === 0 ? (
        <div className="col-span-full rounded-md border border-dashed border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-500">
          Belum ada data ringkasan untuk ditampilkan.
        </div>
      ) : (
        stats.map((stat) => (
          <div key={stat.title} className="rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm shadow-neutral-200/20 h-[90px] transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex items-center justify-between">
              <div className={`inline-flex rounded-lg p-2 ${stat.accent}`}>
                {renderIcon(stat.icon, 'h-4 w-4')}
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-neutral-500">{stat.title}</p>
                <p className="mt-1 text-2xl font-extrabold text-neutral-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
