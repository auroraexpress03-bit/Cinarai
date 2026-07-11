/**
 * Menghapus semua property dengan nilai undefined dari object.
 * Diperlukan karena Firestore tidak bisa menyimpan field dengan nilai undefined.
 *
 * @param obj - Object yang akan dibersihkan
 * @returns Object baru tanpa property yang bernilai undefined
 */
export function removeUndefinedFields<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }

  return cleaned as Partial<T>;
}

/**
 * Alias untuk removeUndefinedFields dengan nama yang lebih ringkas.
 */
export const cleanObject = removeUndefinedFields;
