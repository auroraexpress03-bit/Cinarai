'use client';

const items = [
  { label: 'Beranda', active: true },
  { label: 'Kelas', active: false },
  { label: 'Modul', active: false },
  { label: 'Laporan', active: false },
];

export function TeacherSidebar() {
  return (
    <aside className="hidden rounded-[28px] border border-neutral-100 bg-white p-4 shadow-sm shadow-neutral-200/70 lg:block">
      <div className="rounded-[24px] bg-primary-50 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-600">Navigasi</p>
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-semibold transition ${
                item.active ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-neutral-600 hover:bg-white/80'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs">→</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
