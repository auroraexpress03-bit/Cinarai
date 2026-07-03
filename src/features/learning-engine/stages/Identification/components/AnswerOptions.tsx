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
    <ul className="flex flex-col gap-2" role="radiogroup">
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
                'w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors',
                isSaved && isSelected
                  ? 'bg-accent-50 border border-accent-300 text-accent-800 cursor-default'
                  : isSaved
                    ? 'bg-neutral-50 border border-neutral-100 text-neutral-400 cursor-default'
                    : isSelected
                      ? 'bg-primary-50 border border-primary-300 text-primary-800'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50',
              ].join(' ')}
            >
              {/* Radio indicator */}
              <span
                className={[
                  'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  isSelected && isSaved
                    ? 'border-accent-500 bg-accent-500'
                    : isSelected
                      ? 'border-primary-600 bg-primary-600'
                      : 'border-neutral-300 bg-white',
                ].join(' ')}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <span className="flex-1 leading-snug">{option.text}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
