'use client';

import type { AnswerOption } from '../types';

interface AnswerOptionsProps {
  options: AnswerOption[];
  selectedOptionId: string | null;
  isSaved: boolean;
  onSelect: (optionId: string) => void;
}

export default function AnswerOptions({
  options,
  selectedOptionId,
  isSaved,
  onSelect,
}: AnswerOptionsProps) {
  return (
    <ul className="flex flex-col gap-3" role="radiogroup">
      {options.map((option) => {
        const isSelected = option.id === selectedOptionId;
        return (
          <li key={option.id}>
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isSaved}
              onClick={() => onSelect(option.id)}
              className={[
                'w-full flex items-center gap-4 rounded-2xl px-5 py-5 text-left transition-all min-h-[72px] active:scale-[0.98]',
                isSaved && isSelected
                  ? 'bg-accent-50 border-2 border-accent-400 cursor-default'
                  : isSaved
                    ? 'bg-neutral-50 border-2 border-neutral-100 cursor-default'
                    : isSelected
                      ? 'bg-primary-50 border-2 border-primary-500 shadow-sm'
                      : 'bg-white border-2 border-neutral-200 hover:border-primary-300 hover:bg-primary-50',
              ].join(' ')}
            >
              {/* Radio indicator */}
              <span className={[
                'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-[3px] transition-colors',
                isSelected && isSaved
                  ? 'border-accent-500 bg-accent-500'
                  : isSelected
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-neutral-300 bg-white',
              ].join(' ')}>
                {isSelected && <span className="h-3 w-3 rounded-full bg-white" />}
              </span>
              <span className={[
                'flex-1 text-xl font-bold leading-snug',
                isSaved && isSelected ? 'text-accent-800' : isSaved ? 'text-neutral-400' : isSelected ? 'text-primary-800' : 'text-neutral-700',
              ].join(' ')}>
                {option.text}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
