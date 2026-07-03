'use client';

const MAX_CHARS = 500;

const PLACEHOLDERS = [
  'Contoh: Karena saya melihat bentuk kubus pada bangunan candi di halaman 5…',
  'Contoh: Saya memilih jawaban ini karena cerita menyebutkan simetri pada ukiran…',
  'Contoh: Di halaman 3, tokoh menghitung sisi-sisi bangun datar yang berbentuk…',
];

interface ReasonAreaProps {
  itemId: string;
  targetIndex: number;
  value: string;
  isSaved: boolean;
  onChange: (itemId: string, reason: string) => void;
  onSave: (itemId: string) => void;
}

export default function ReasonArea({
  itemId,
  targetIndex,
  value,
  isSaved,
  onChange,
  onSave,
}: ReasonAreaProps) {
  const placeholder = PLACEHOLDERS[targetIndex % PLACEHOLDERS.length];
  const charCount = value.length;
  const canSave = value.trim().length > 0 && !isSaved;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-primary-100 bg-primary-50 p-4">
      {/* Label pertanyaan */}
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-[10px] font-black text-white">
          3
        </span>
        <label
          htmlFor={`reason-${itemId}`}
          className="text-sm font-bold text-primary-800"
        >
          Mengapa kamu memilih jawaban tersebut?
        </label>
      </div>

      {/* Textarea */}
      <textarea
        id={`reason-${itemId}`}
        value={value}
        disabled={isSaved}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CHARS) {
            onChange(itemId, e.target.value);
          }
        }}
        placeholder={placeholder}
        rows={3}
        className={[
          'w-full resize-none rounded-xl border px-4 py-3 text-sm leading-relaxed outline-none transition-colors',
          isSaved
            ? 'border-neutral-100 bg-neutral-50 text-neutral-500 cursor-default'
            : 'border-primary-200 bg-white text-neutral-800 placeholder:text-neutral-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-100',
        ].join(' ')}
      />

      {/* Counter + tombol */}
      <div className="flex items-center justify-between gap-3">
        <span
          className={[
            'text-xs tabular-nums',
            charCount >= MAX_CHARS
              ? 'text-error-500 font-bold'
              : 'text-neutral-400',
          ].join(' ')}
        >
          {charCount}/{MAX_CHARS}
        </span>

        {isSaved ? (
          <div className="flex items-center gap-2 text-accent-600">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-white text-xs font-black">
              ✓
            </span>
            <span className="text-sm font-bold">Alasan tersimpan</span>
          </div>
        ) : (
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(itemId)}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-black text-white shadow-sm transition-all hover:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed active:scale-[0.97] min-h-[44px]"
          >
            Simpan Alasan
          </button>
        )}
      </div>
    </div>
  );
}
