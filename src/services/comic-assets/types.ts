// ── Asset kinds ───────────────────────────────────────────────────────────────

export type ComicAssetKind = 'pdf' | 'cover' | 'thumbnail' | 'marker' | 'model';

export type QrTargetKind = 'model' | 'quiz';

// ── Core asset metadata ───────────────────────────────────────────────────────

export interface ComicAsset {
  /** Unique asset identifier: `{comicId}_{kind}` */
  id: string;
  comicId: number;
  kind: ComicAssetKind;
  /** Public URL or storage path */
  path: string;
  /** File name with extension */
  filename: string;
  /** MIME type, e.g. "application/pdf", "image/png" */
  mimeType: string;
  /** File size in bytes; null if unknown */
  sizeBytes: number | null;
  uploadedAt: Date | null;
  updatedAt: Date | null;
}

// ── QR link ───────────────────────────────────────────────────────────────────

export interface QrLink {
  /** Unique QR link identifier: `{comicId}_{targetKind}_{targetId}` */
  id: string;
  comicId: number;
  targetKind: QrTargetKind;
  /** ID of the linked model or quiz */
  targetId: string;
  /** Encoded QR payload */
  payload: string;
  createdAt: Date | null;
}

// ── Pipeline result ───────────────────────────────────────────────────────────

export type PipelineStatus = 'idle' | 'processing' | 'done' | 'error';

export interface PipelineResult<T> {
  status: PipelineStatus;
  data: T | null;
  error: string | null;
}

// ── Repository contracts ──────────────────────────────────────────────────────

export interface ComicAssetRepository {
  getAsset(comicId: number, kind: ComicAssetKind): Promise<ComicAsset | null>;
  listAssets(comicId: number): Promise<ComicAsset[]>;
  saveAsset(asset: ComicAsset): Promise<void>;
  deleteAsset(comicId: number, kind: ComicAssetKind): Promise<void>;
}

export interface QrLinkRepository {
  getQrLink(comicId: number, targetKind: QrTargetKind, targetId: string): Promise<QrLink | null>;
  listQrLinks(comicId: number): Promise<QrLink[]>;
  saveQrLink(link: QrLink): Promise<void>;
  deleteQrLink(id: string): Promise<void>;
}

// ── Pipeline contracts ────────────────────────────────────────────────────────

export interface ComicAssetPipeline {
  readAssets(comicId: number): Promise<PipelineResult<ComicAsset[]>>;
  saveMetadata(asset: ComicAsset): Promise<PipelineResult<void>>;
  linkQrModel(comicId: number, modelId: string): Promise<PipelineResult<QrLink>>;
  linkQrQuiz(comicId: number, quizId: string): Promise<PipelineResult<QrLink>>;
}

// ── QR classifier contracts ───────────────────────────────────────────────────

export interface QrClassifierResult {
  targetKind: QrTargetKind;
  targetId: string;
  comicId: number;
}

export interface QrClassifier {
  classify(payload: string): QrClassifierResult | null;
  buildPayload(comicId: number, targetKind: QrTargetKind, targetId: string): string;
}
