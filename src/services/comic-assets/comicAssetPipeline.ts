import type {
  ComicAsset,
  ComicAssetPipeline,
  PipelineResult,
  QrLink,
  QrTargetKind,
} from './types';

// ── ComicAssetPipeline placeholder ───────────────────────────────────────────

export class ComicAssetPipelineImpl implements ComicAssetPipeline {
  async readAssets(_comicId: number): Promise<PipelineResult<ComicAsset[]>> {
    throw new Error('Not implemented');
  }

  async saveMetadata(_asset: ComicAsset): Promise<PipelineResult<void>> {
    throw new Error('Not implemented');
  }

  async linkQrModel(_comicId: number, _modelId: string): Promise<PipelineResult<QrLink>> {
    throw new Error('Not implemented');
  }

  async linkQrQuiz(_comicId: number, _quizId: string): Promise<PipelineResult<QrLink>> {
    throw new Error('Not implemented');
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function makePipelineResult<T>(
  status: 'done',
  data: T
): PipelineResult<T>;
export function makePipelineResult<T>(
  status: 'error',
  data: null,
  error: string
): PipelineResult<T>;
export function makePipelineResult<T>(
  status: 'idle' | 'processing' | 'done' | 'error',
  data: T | null,
  error: string | null = null
): PipelineResult<T> {
  return { status, data, error };
}

export function makeQrLink(
  comicId: number,
  targetKind: QrTargetKind,
  targetId: string,
  payload: string
): QrLink {
  return {
    id: `${comicId}_${targetKind}_${targetId}`,
    comicId,
    targetKind,
    targetId,
    payload,
    createdAt: null,
  };
}
