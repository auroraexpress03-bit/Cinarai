/** Status satu item identifikasi */
export type IdentificationItemStatus = 'PENDING' | 'OBSERVED';

/** Satu item identifikasi — merepresentasikan satu learning target */
export interface IdentificationItem {
  readonly id: string;
  readonly targetIndex: number;
  readonly targetText: string;
  status: IdentificationItemStatus;
}

/** State keseluruhan Identification Engine */
export interface IdentificationState {
  readonly comicId: number;
  readonly lokasi: string;
  items: IdentificationItem[];
  /** Jumlah item yang sudah OBSERVED */
  observedCount: number;
  /** true jika semua item sudah OBSERVED */
  isComplete: boolean;
}

/** Payload untuk aksi mark-observed */
export interface MarkObservedPayload {
  itemId: string;
}
