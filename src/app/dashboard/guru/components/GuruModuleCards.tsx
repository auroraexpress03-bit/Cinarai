'use client';

type ModuleItem = {
  title: string;
  description: string;
  completed: number;
  progress: number;
  badge: string;
  coverLabel: string;
};

export function GuruModuleCards({ modules }: { modules: ModuleItem[] }) {
  return (
    <section className="rounded-md border border-neutral-100 bg-white p-3 shadow-sm shadow-neutral-200/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Modul</p>
          <h2 className="mt-1 text-base font-black text-neutral-900">Modul CINARAI</h2>
        </div>
        <div className="rounded-full bg-secondary-50 px-2 py-0.5 text-xs font-semibold text-secondary-700">Preview</div>
      </div>

      {modules.length === 0 ? (
        <div className="mt-3 rounded-md border border-dashed border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
          Belum ada modul untuk ditampilkan.
        </div>
      ) : (
        <div className="mt-3 grid gap-3 lg:grid-cols-1">
          {modules.slice(0, 3).map((module) => (
            <div key={module.title} className="overflow-hidden rounded-md border border-neutral-100 bg-neutral-50 shadow-sm">
              <div className="relative h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white">
                <div className="absolute inset-0 opacity-8 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.5),_transparent_35%)]" />
                <div className="absolute inset-x-0 bottom-2 px-3">
                  <span className="inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold tracking-[0.08em] text-white shadow-sm">
                    {module.coverLabel}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-neutral-900">{module.title}</h3>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-primary-700 shadow-sm">
                    {module.badge}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-600">{module.description}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                  <span>{module.completed} siswa selesai</span>
                  <span className="font-semibold text-primary-700">{module.progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: `${module.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
          {modules.length > 3 && (
            <div className="mt-2 flex justify-center">
              <a href="/dashboard/guru/modul" className="text-sm font-semibold text-primary-700">Lihat Semua ({modules.length})</a>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
