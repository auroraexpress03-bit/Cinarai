'use client';

import type { IdentificationItem } from '../types';
import QuestionCard from './QuestionCard';
import AnswerOptions from './AnswerOptions';
import NoteArea from './NoteArea';
import SaveButton from './SaveButton';

interface ActivityItemProps {
  item: IdentificationItem;
  onSelectOption: (itemId: string, optionId: string) => void;
  onNoteChange: (itemId: string, note: string) => void;
  onSave: (itemId: string) => void;
}

export default function ActivityItem({
  item,
  onSelectOption,
  onNoteChange,
  onSave,
}: ActivityItemProps) {
  const isSaved = item.answerStatus === 'SAVED';
  const canSave = item.selectedOptionId !== null && !isSaved;

  return (
    <li
      className={[
        'flex flex-col gap-4 rounded-2xl border p-4 sm:p-5 transition-colors',
        isSaved
          ? 'border-accent-200 bg-accent-50'
          : 'border-neutral-100 bg-white shadow-sm',
      ].join(' ')}
    >
      {/* Pertanyaan */}
      <QuestionCard
        index={item.targetIndex}
        question={item.question}
        isSaved={isSaved}
      />

      {/* Pilihan Jawaban */}
      <AnswerOptions
        options={item.options}
        selectedOptionId={item.selectedOptionId}
        isSaved={isSaved}
        onSelect={(optionId) => onSelectOption(item.id, optionId)}
      />

      {/* Area Catatan */}
      <NoteArea
        itemId={item.id}
        value={item.note}
        isSaved={isSaved}
        onChange={onNoteChange}
      />

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <SaveButton
          itemId={item.id}
          canSave={canSave}
          isSaved={isSaved}
          onSave={onSave}
        />
      </div>
    </li>
  );
}
