'use client';

interface Props {
  selected: string[];
  correct: string[];
}

export default function SummaryPanel({ selected, correct }: Props) {
  const found = selected.filter((s) => correct.includes(s));
  const missing = correct.filter((c) => !selected.includes(c));

  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm font-semibold">Kamu berhasil menemukan:</div>
      <ul className="list-none ml-0 space-y-1">
        {found.map((f) => (
          <li key={f} className="text-sm text-neutral-700">✓ {f}</li>
        ))}
      </ul>

      <div className="text-sm font-semibold mt-2">Masih belum ditemukan:</div>
      <ul className="list-none ml-0 space-y-1">
        {missing.map((m) => (
          <li key={m} className="text-sm text-neutral-700">{m}</li>
        ))}
      </ul>
    </div>
  );
}
