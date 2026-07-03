'use client';

interface IdentificationHeaderProps {
  lokasi: string;
  subtitle: string;
  kelas: string;
}

export default function IdentificationHeader({
  lokasi,
  subtitle,
  kelas,
}: IdentificationHeaderProps) {
  return (
    <div className="rounded-3xl bg-white shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">🔍</span>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-white leading-tight">
              Tahap Identifikasi
            </h2>
            <p className="text-[11px] text-primary-200 mt-0.5 truncate">
              {subtitle} · Kelas {kelas} · {lokasi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
