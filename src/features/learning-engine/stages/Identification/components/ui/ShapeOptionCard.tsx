'use client';

interface ShapeOptionCardProps {
  label: string;
  icon: string;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export default function ShapeOptionCard({ label, icon, selected, disabled = false, onToggle }: ShapeOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={[
        'flex min-h-[76px] items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 active:scale-[0.98]',
        selected
          ? 'border-primary-500 bg-primary-50 shadow-sm shadow-primary-100'
          : 'border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50',
        disabled ? 'cursor-default opacity-90' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-2xl shadow-inner">
          {icon}
        </span>
        <span className="text-sm font-black uppercase tracking-[0.16em] text-neutral-700 sm:text-base">
          {label}
        </span>
      </div>
      <span
        className={[
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-black',
          selected ? 'border-primary-600 bg-primary-600 text-white' : 'border-neutral-300 bg-white text-transparent',
        ].join(' ')}
      >
        {selected ? '✓' : null}
      </span>
    </button>
  );
}
