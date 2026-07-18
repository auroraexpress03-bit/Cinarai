'use client';

type ActivityItem = {
  id: string;
  title: string;
  time: string;
  detail: string;
};

export function GuruRecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <section className="rounded-md border border-neutral-100 bg-white p-3 shadow-sm shadow-neutral-200/40 sm:p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">Aktivitas</p>
          <h2 className="mt-1 text-base font-black text-neutral-900">Aktivitas Terbaru</h2>
        </div>
        <div className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600">Hari ini</div>
      </div>

      <div className="mt-3 space-y-2">
        {activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-3 text-center text-sm text-neutral-500">
            <div className="flex items-center justify-center gap-2">
              <svg className="h-6 w-6 text-neutral-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="text-xs text-neutral-500">Belum ada aktivitas terbaru</span>
            </div>
          </div>
        ) : (
          <>
            {activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start gap-2 rounded-md border border-neutral-100 bg-neutral-50 p-2">
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary-500" />
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{activity.title}</p>
                  <p className="mt-1 text-xs text-neutral-600">{activity.detail}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{activity.time}</p>
                </div>
              </div>
            ))}
            {activities.length > 3 && (
              <div className="flex justify-center">
                <a href="/dashboard/guru/aktivitas" className="text-sm font-semibold text-primary-700">Lihat Semua ({activities.length})</a>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
