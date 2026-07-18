'use client';

type ProgressItem = {
  label: string;
  value: number;
};

export function GuruProgressOverview({ items }: { items: ProgressItem[] }) {
  return (
    <section className="rounded-md border border-neutral-100 bg-white p-3 shadow-sm shadow-neutral-200/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">Progress</p>
          <h2 className="mt-1 text-base font-black text-neutral-900">Progress Pembelajaran</h2>
        </div>
        <div className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">Kelas</div>
      </div>

      {items.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-3 text-center text-sm text-neutral-500">
          <div className="flex items-center justify-center gap-2">
            <svg className="h-6 w-6 text-neutral-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs text-neutral-500">Belum ada data progress</span>
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {items.slice(0, 4).map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700">{item.label}</span>
                <span className="font-black text-primary-700">{item.value}%</span>
              </div>
              <div className="h-[4px] overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
