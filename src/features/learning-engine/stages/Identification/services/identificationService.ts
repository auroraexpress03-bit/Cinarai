import type {
  IdentificationItem,
  IdentificationState,
} from '../types';

/**
 * Buat IdentificationState awal dari data komik.
 * Setiap learning target menjadi satu IdentificationItem dengan status PENDING.
 */
export function createIdentificationState(
  comicId: number,
  lokasi: string,
  learningTargets: readonly string[]
): IdentificationState {
  const items: IdentificationItem[] = learningTargets.map((targetText, index) => ({
    id: `${comicId}-identification-${index}`,
    targetIndex: index,
    targetText,
    status: 'PENDING',
  }));

  return {
    comicId,
    lokasi,
    items,
    observedCount: 0,
    isComplete: false,
  };
}

/**
 * Tandai satu item sebagai OBSERVED.
 * Mengembalikan state baru (immutable update).
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
  const isComplete = observedCount === updatedItems.length;

  return {
    ...state,
    items: updatedItems,
    observedCount,
    isComplete,
  };
}

/**
 * Reset semua item ke PENDING.
 * Berguna jika user ingin mengulang tahap identifikasi.
 */
export function resetIdentificationState(
  state: IdentificationState
): IdentificationState {
  const resetItems: IdentificationItem[] = state.items.map((item) => ({
    ...item,
    status: 'PENDING',
  }));

  return {
    ...state,
    items: resetItems,
    observedCount: 0,
    isComplete: false,
  };
}
