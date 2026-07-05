import type { QrClassifier, QrClassifierResult, QrTargetKind } from './types';

/**
 * QR payload format: `cinarai:{comicId}:{targetKind}:{targetId}`
 * Example: `cinarai:1:model:candi-jawi-kubus`
 */
const QR_PREFIX = 'cinarai';
const QR_SEPARATOR = ':';

// ── QrClassifier placeholder ──────────────────────────────────────────────────

export class QrClassifierImpl implements QrClassifier {
  classify(payload: string): QrClassifierResult | null {
    const parts = payload.split(QR_SEPARATOR);
    if (parts.length !== 4 || parts[0] !== QR_PREFIX) return null;

    const comicId = Number(parts[1]);
    const targetKind = parts[2] as QrTargetKind;
    const targetId = parts[3];

    if (!Number.isFinite(comicId) || comicId <= 0) return null;
    if (targetKind !== 'model' && targetKind !== 'quiz') return null;
    if (!targetId) return null;

    return { comicId, targetKind, targetId };
  }

  buildPayload(comicId: number, targetKind: QrTargetKind, targetId: string): string {
    return [QR_PREFIX, comicId, targetKind, targetId].join(QR_SEPARATOR);
  }
}
