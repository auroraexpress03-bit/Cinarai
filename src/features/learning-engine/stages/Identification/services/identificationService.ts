import type {
  AnswerOption,
  IdentificationItem,
  IdentificationState,
} from '../types';

/**
 * Generate pilihan jawaban untuk satu learning target.
 * Opsi pertama selalu "Ya, saya menemukannya" (jawaban benar).
 * Opsi lain adalah distraktor generik — belum ada validasi.
 */
function buildOptions(itemId: string): AnswerOption[] {
  return [
    { id: `${itemId}-opt-0`, text: 'Ya, saya menemukannya di cerita' },
    { id: `${itemId}-opt-1`, text: 'Belum, saya perlu membaca ulang' },
    { id: `${itemId}-opt-2`, text: 'Tidak yakin, perlu bantuan' },
  ];
}

/**
 * Buat IdentificationState awal dari data komik.
 * Setiap learning target menjadi satu IdentificationItem dengan status PENDING.
 */
export function createIdentificationState(
  comicId: number,
  lokasi: string,
  learningTargets: readonly string[],
  cover: string,
  title: string,
): IdentificationState {
  const items: IdentificationItem[] = learningTargets.map((targetText, index) => {
    const id = `${comicId}-identification-${index}`;
    return {
      id,
      targetIndex: index,
      targetText,
      question: `Apakah kamu menemukan konsep "${targetText}" di ${lokasi}?`,
      options: buildOptions(id),
      status: 'PENDING',
      selectedOptionId: null,
      note: '',
      answerStatus: 'UNANSWERED',
      reason: '',
      reasonStatus: 'EMPTY',
    };
  });

  return {
    comicId,
    lokasi,
    cover,
    title,
    observe: { note: '', isDone: false },
    items,
    observedCount: 0,
    isComplete: false,
  };
}

/**
 * Tandai satu item sebagai OBSERVED.
 * Idempoten — memanggil ulang pada item yang sudah OBSERVED tidak mengubah apapun.
 */
export function markItemObserved(
  state: IdentificationState,
  itemId: string
): IdentificationState {
  const alreadyObserved = state.items.find(
    (item) => item.id === itemId && item.status === 'OBSERVED'
  );
  if (alreadyObserved) return state;

  const updatedItems: IdentificationItem[] = state.items.map((item) =>
    item.id === itemId ? { ...item, status: 'OBSERVED' } : item
  );

  const observedCount = updatedItems.filter((item) => item.status === 'OBSERVED').length;

  return {
    ...state,
    items: updatedItems,
    observedCount,
    isComplete: observedCount === updatedItems.length,
  };
}

/** Update catatan observasi Step Amati. */
export function setObserveNote(
  state: IdentificationState,
  note: string,
): IdentificationState {
  return { ...state, observe: { ...state.observe, note } };
}

/** Selesaikan Step Amati — tandai isDone = true. */
export function completeObserve(
  state: IdentificationState,
): IdentificationState {
  return { ...state, observe: { ...state.observe, isDone: true } };
}

/** Pilih satu opsi jawaban untuk item tertentu. */
export function selectAnswer(
  state: IdentificationState,
  itemId: string,
  optionId: string
): IdentificationState {
  return {
    ...state,
    items: state.items.map((item) =>
      item.id === itemId
        ? { ...item, selectedOptionId: optionId, answerStatus: 'ANSWERED' }
        : item
    ),
  };
}

/** Update teks catatan untuk item tertentu. */
export function updateNote(
  state: IdentificationState,
  itemId: string,
  note: string
): IdentificationState {
  return {
    ...state,
    items: state.items.map((item) =>
      item.id === itemId ? { ...item, note } : item
    ),
  };
}

/**
 * Simpan jawaban item — tandai sebagai ANSWERED + SAVED.
 * isComplete true jika semua item sudah reasonStatus SAVED.
 */
export function saveAnswer(
  state: IdentificationState,
  itemId: string
): IdentificationState {
  const updatedItems: IdentificationItem[] = state.items.map((item) =>
    item.id === itemId
      ? { ...item, answerStatus: 'SAVED' }
      : item
  );

  return {
    ...state,
    items: updatedItems,
  };
}

/** Update teks alasan untuk item tertentu. */
export function updateReason(
  state: IdentificationState,
  itemId: string,
  reason: string,
): IdentificationState {
  return {
    ...state,
    items: state.items.map((item) =>
      item.id === itemId
        ? { ...item, reason, reasonStatus: reason.trim().length > 0 ? 'DRAFT' : 'EMPTY' }
        : item
    ),
  };
}

/** Simpan alasan item — tandai reasonStatus = SAVED dan status = OBSERVED. */
export function saveReason(
  state: IdentificationState,
  itemId: string,
): IdentificationState {
  const updatedItems: IdentificationItem[] = state.items.map((item) =>
    item.id === itemId ? { ...item, status: 'OBSERVED', reasonStatus: 'SAVED' } : item
  );

  const observedCount = updatedItems.filter((item) => item.status === 'OBSERVED').length;
  const isComplete = updatedItems.every((item) => item.reasonStatus === 'SAVED');

  return {
    ...state,
    items: updatedItems,
    observedCount,
    isComplete,
  };
}

/**
 * Reset semua item ke PENDING.
 */
export function resetIdentificationState(
  state: IdentificationState
): IdentificationState {
  return {
    ...state,
    items: state.items.map((item) => ({
      ...item,
      status: 'PENDING',
      selectedOptionId: null,
      note: '',
      answerStatus: 'UNANSWERED',
    })),
    observedCount: 0,
    isComplete: false,
  };
}
