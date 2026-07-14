'use client';

import Image from 'next/image';
import kubusIcon from '@/features/comics/comic-1/assets/identification/Kubus.png';
import balokIcon from '@/features/comics/comic-1/assets/identification/Balok.png';
import prismaIcon from '@/features/comics/comic-1/assets/identification/Prismasegiempat.png';
import limasIcon from '@/features/comics/comic-1/assets/identification/Limassegiempat.png';
import kerucutIcon from '@/features/comics/comic-1/assets/identification/Kerucut.png';

interface ShapeOptionCardProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export default function ShapeOptionCard({ label, selected, disabled = false, onToggle }: ShapeOptionCardProps) {
  const iconMap: Record<string, typeof kubusIcon> = {
    Kubus: kubusIcon,
    'Prisma Segi Empat': prismaIcon,
    Balok: balokIcon,
    'Limas Segi Empat': limasIcon,
    Kerucut: kerucutIcon,
  };

  const iconSrc = iconMap[label] ?? kubusIcon;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={[
        'flex w-full min-h-[80px] items-center gap-4 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-200 active:scale-[0.98]',
        selected
          ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-200'
          : 'border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50',
        disabled ? 'cursor-default opacity-85' : 'cursor-pointer',
      ].join(' ')}
    >
      {/* Icon */}
      <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center overflow-hidden">
        <Image src={iconSrc} alt={label} width={52} height={52} className="h-[52px] w-[52px] object-contain" />
      </div>

      {/* Label */}
      <span className="flex-1 text-sm font-black uppercase tracking-[0.16em] text-neutral-800 sm:text-base">
        {label}
      </span>

      {/* Checkbox */}
      <span
        className={[
          'flex flex-shrink-0 h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-200',
          selected
            ? 'border-primary-600 bg-primary-600'
            : 'border-neutral-300 bg-white hover:border-primary-400',
        ].join(' ')}
      >
        {selected && (
          <svg
            className="w-4 h-4 text-white"
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

