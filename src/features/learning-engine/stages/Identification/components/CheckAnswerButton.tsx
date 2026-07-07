'use client';

interface Props {
  onCheck: () => void;
  disabled?: boolean;
}

export default function CheckAnswerButton({ onCheck, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onCheck}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-semibold transition-opacity duration-150 ${
        disabled ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      CEK JAWABAN
    </button>
  );
}
