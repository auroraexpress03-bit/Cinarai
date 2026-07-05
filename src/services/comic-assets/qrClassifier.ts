import type { QrClassifier, QrClassifierResult, QrTargetKind, QrCategory, ClassifiedQr } from './types';
import type { ExtractedQrMetadata } from './comicAssetPipeline';

/**
 * QR payload format: `cinarai:{comicId}:{targetKind}:{targetId}`
 * Example: `cinarai:1:model:candi-jawi-kubus`
 */
const QR_PREFIX = 'cinarai';
const QR_SEPARATOR = ':';

// ── URL pattern matchers ───────────────────────────────────────────────────────

const MODEL_3D_PATTERNS = ['sketchfab.com', 'skfb.ly', 'assemblrworld.com', 'app.assemblrworld.com', 'edu.assemblrworld.com', 'asblr.com'];
const QUIZ_PATTERNS = ['quizizz.com', 'forms.google.com', 'wordwall.net', 'kahoot.com'];
const VIDEO_PATTERNS = ['youtube.com', 'youtu.be'];

function categorize(value: string): QrCategory {
  if (!value) return 'UNKNOWN';

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return 'UNKNOWN';
  }

  const host = url.hostname.toLowerCase();

  if (MODEL_3D_PATTERNS.some((p) => host === p || host.endsWith(`.${p}`))) return 'MODEL_3D';
  if (QUIZ_PATTERNS.some((p) => host === p || host.endsWith(`.${p}`))) return 'QUIZ';
  if (VIDEO_PATTERNS.some((p) => host === p || host.endsWith(`.${p}`))) return 'VIDEO';

  return 'WEBSITE';
}

// ── Public functions ───────────────────────────────────────────────────────────

export function classifyQR(qr: ExtractedQrMetadata): ClassifiedQr {
  return {
    page: qr.page,
    value: qr.value,
    image: qr.image,
    category: categorize(qr.value),
  };
}

export function classifyComic(qrList: ExtractedQrMetadata[]): ClassifiedQr[] {
  return qrList.map(classifyQR);
}

// ── QrClassifierImpl (legacy contract — unchanged) ────────────────────────────

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
