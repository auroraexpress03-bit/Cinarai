'use client';

import Image from 'next/image';
import persegiIcon from '@/features/comics/comic-2/assets/identification/icons/persegi.svg';
import persegiPanjangIcon from '@/features/comics/comic-2/assets/identification/icons/persegi-panjang.svg';
import segitigaSisiIcon from '@/features/comics/comic-2/assets/identification/icons/segitiga-sama-sisi.svg';
import segitigaKakiIcon from '@/features/comics/comic-2/assets/identification/icons/segitiga-sama-kaki.svg';
import lingkaranIcon from '@/features/comics/comic-2/assets/identification/icons/lingkaran.svg';
import belahKetupatIcon from '@/features/comics/comic-2/assets/identification/icons/belah-ketupat.svg';

interface ShapeOptionCardProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export default function ShapeOptionCard({ label, selected, disabled = false, onToggle }: ShapeOptionCardProps) {
  const iconMap: Record<string, string> = {
    Persegi: persegiIcon,
    'Persegi Panjang': persegiPanjangIcon,
    'Segitiga Sama Sisi': segitigaSisiIcon,
    'Segitiga Sama Kaki': segitigaKakiIcon,
    Lingkaran: lingkaranIcon,
    'Belah Ketupat': belahKetupatIcon,
  };

  const iconSrc = iconMap[label] ?? persegiIcon;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={[
        'flex w-full min-h-[84px] items-center gap-3 rounded-2xl border-2 px-3 py-3 text-left transition-all duration-200 active:scale-[0.98] sm:gap-4 sm:px-4',
        selected
          ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-200'
          : 'border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50',
        disabled ? 'cursor-default opacity-85' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-50/70 p-1">
        <Image src={iconSrc} alt={label} width={56} height={56} className="h-[56px] w-[56px] object-contain" />
      </div>

      <span className="flex-1 text-sm font-black uppercase tracking-[0.16em] text-neutral-800 sm:text-base">
        {label}
      </span>

      <span
        className={[
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
          selected
            ? 'border-primary-600 bg-primary-600'
            : 'border-neutral-300 bg-white hover:border-primary-400',
        ].join(' ')}
      >
        {selected && (
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </button>
  );
}

