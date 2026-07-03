'use client';

import type { IdentificationItem } from '../types';
import { useIdentificationContext } from '../context/IdentificationContext';
import QuestionCard from './QuestionCard';
import AnswerOptions from './AnswerOptions';
import NoteArea from './NoteArea';
import SaveButton from './SaveButton';
import ReasonArea from './ReasonArea';

interface ActivityItemProps {
  item: IdentificationItem;
}

export default function ActivityItem({ item }: ActivityItemProps) {
  const { selectOption, setNote, save, setReason, saveReason } = useIdentificationContext();

  const isSaved = item.answerStatus === 'SAVED';
  const isReasonSaved = item.reasonStatus === 'SAVED';
  const canSave = item.selectedOptionId !== null && !isSaved;

  return (
    <li
      className={[
        'flex flex-col gap-4 rounded-2xl border p-4 sm:p-5 transition-colors',
        isReasonSaved
          ? 'border-accent-200 bg-accent-50'
          : 'border-neutral-100 bg-white shadow-sm',
      ].join(' ')}
    >
      <QuestionCard
        index={item.targetIndex}
        question={item.question}
        isSaved={isReasonSaved}
      />

      <AnswerOptions
        options={item.options}
        selectedOptionId={item.selectedOptionId}
        isSaved={isSaved}
        onSelect={(optionId) => selectOption(item.id, optionId)}
      />

      <NoteArea
        itemId={item.id}
        value={item.note}
        isSaved={isSaved}
        onChange={setNote}
      />

      {!isSaved && (
        <div className="flex justify-end">
          <SaveButton
            itemId={item.id}
            canSave={canSave}
            isSaved={isSaved}
            onSave={save}
          />
        </div>
      )}

      {isSaved && (
        <ReasonArea
          itemId={item.id}
          targetIndex={item.targetIndex}
          value={item.reason}
          isSaved={isReasonSaved}
          onChange={setReason}
          onSave={saveReason}
        />
      )}
    </li>
  );
}
