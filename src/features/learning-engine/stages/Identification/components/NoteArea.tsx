'use client';

interface NoteAreaProps {
  itemId: string;
  value: string;
  isSaved: boolean;
  onChange: (itemId: string, note: string) => void;
}

export default function NoteArea({ itemId, value, isSaved, onChange }: NoteAreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={`note-${itemId}`}
        className="text-[11px] font-bold uppercase tracking-widest text-neutral-400"
      >
        Catatan Kamu
      </label>
      <textarea
        id={`note-${itemId}`}
        value={value}
        disabled={isSaved}
        onChange={(e) => onChange(itemId, e.target.value)}
        placeholder="Tulis di mana kamu menemukan konsep ini dalam cerita…"
        rows={3}
        className={[
          'w-full resize-none rounded-xl border px-4 py-3 text-sm leading-relaxed outline-none transition-colors',
          isSaved
            ? 'border-neutral-100 bg-neutral-50 text-neutral-500 cursor-default'
            : 'border-neutral-200 bg-white text-neutral-800 placeholder:text-neutral-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-100',
        ].join(' ')}
      />
    </div>
  );
}
