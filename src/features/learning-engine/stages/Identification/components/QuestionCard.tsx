'use client';

interface QuestionCardProps {
  index: number;
  question: string;
  isSaved: boolean;
}

export default function QuestionCard({ index, question, isSaved }: QuestionCardProps) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={[
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black mt-0.5',
          isSaved
            ? 'bg-accent-500 text-white'
            : 'bg-primary-100 text-primary-700',
        ].join(' ')}
      >
        {isSaved ? '✓' : index + 1}
      </span>
      <p className="text-sm font-semibold text-neutral-800 leading-relaxed flex-1">
        {question}
      </p>
    </div>
  );
}
