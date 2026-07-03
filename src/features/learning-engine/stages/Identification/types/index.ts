/** Status satu item identifikasi */
export type IdentificationItemStatus = 'PENDING' | 'OBSERVED';

/** Status jawaban satu item */
export type AnswerStatus = 'UNANSWERED' | 'ANSWERED' | 'SAVED';

/** Satu pilihan jawaban */
export interface AnswerOption {
  readonly id: string;
  readonly text: string;
}

/** Satu item identifikasi — merepresentasikan satu learning target */
export interface IdentificationItem {
  readonly id: string;
  readonly targetIndex: number;
  readonly targetText: string;
  readonly question: string;
  readonly options: AnswerOption[];
  status: IdentificationItemStatus;
  selectedOptionId: string | null;
  note: string;
  answerStatus: AnswerStatus;
}

/** State keseluruhan Identification Engine */
export interface IdentificationState {
  readonly comicId: number;
  readonly lokasi: string;
  items: IdentificationItem[];
  /** Jumlah item yang sudah SAVED */
  observedCount: number;
  /** true jika semua item sudah SAVED */
  isComplete: boolean;
}

/** Payload untuk aksi mark-observed */
export interface MarkObservedPayload {
  itemId: string;
}

/** Payload untuk memilih jawaban */
export interface SelectAnswerPayload {
  itemId: string;
  optionId: string;
}

/** Payload untuk update catatan */
export interface UpdateNotePayload {
  itemId: string;
  note: string;
}

/** Payload untuk simpan jawaban */
export interface SaveAnswerPayload {
  itemId: string;
}
