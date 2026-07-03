'use client';

interface StepAmatiNoteBoxProps {
  value: string;
  onChange: (note: string) => void;
}

export default function StepAmatiNoteBox({ value, onChange }: StepAmatiNoteBoxProps) {
  return (
    <div className="rounded-2xl bg-secondary-50 border border-secondary-100 px-4 py-4 sm:px-5 flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="text-base leading-none">📝</span>
        <label
          htmlFor="amati-note"
          className="text-sm font-black text-secondary-800"
        >
          Hal yang Saya Temukan
        </label>
      </div>
      <p className="text-xs text-secondary-600 leading-relaxed">
        Tuliskan apa saja yang kamu amati dari komik. Tidak perlu sempurna —
        tulis saja apa yang kamu lihat.
      </p>
      <textarea
        id="amati-note"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Contoh: Saya melihat bentuk kubus pada bangunan candi…"
        rows={4}
        className="w-full resize-none rounded-xl border border-secondary-200 bg-white px-4 py-3 text-sm leading-relaxed text-neutral-800 placeholder:text-neutral-300 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
      />
    </div>
  );
}
