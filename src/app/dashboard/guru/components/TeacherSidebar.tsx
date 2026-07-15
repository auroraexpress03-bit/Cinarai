'use client';

const items = [
  { label: 'Dashboard', active: true },
  { label: 'Siswa', active: false },
  { label: 'Statistik', active: false },
  { label: 'Analisis AI', active: false },
  { label: 'Laporan', active: false },
  { label: 'Pengaturan', active: false },
];

export function TeacherSidebar() {
  return (
    <aside className="hidden rounded-[28px] border border-neutral-100 bg-white p-4 shadow-sm shadow-neutral-200/70 lg:block">
      <div className="rounded-[24px] bg-primary-50 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-600">Menu Guru</p>
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={!item.active}
              className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-semibold transition ${
                item.active
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                  : 'text-neutral-600 hover:bg-white/80 cursor-not-allowed opacity-80'
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
