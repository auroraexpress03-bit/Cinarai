'use client';

import type { AnswerOption } from '../types';
import IdentificationOptionCard from './IdentificationOptionCard';

interface IdentificationOptionGridProps {
  options: AnswerOption[];
  selectedOptionIds: string[];
  correctOptionIds: string[] | null;
  isAnswered: boolean;
  disabled: boolean;
  onSelect: (optionId: string) => void;
}

export default function IdentificationOptionGrid({
  options,
  selectedOptionIds,
  correctOptionIds,
  isAnswered,
  disabled,
  onSelect,
}: IdentificationOptionGridProps) {
  return (
    <ul className="flex flex-col gap-2" role="radiogroup">
      {options.map((option) => (
        <IdentificationOptionCard
          key={option.id}
          option={option}
          selectedOptionIds={selectedOptionIds}
          correctOptionIds={correctOptionIds}
          isAnswered={isAnswered}
          disabled={disabled}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
