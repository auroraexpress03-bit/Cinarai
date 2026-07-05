import { promises as fs } from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import jsQR from 'jsqr';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { ComicAssetRepositoryImpl } from './comicAssetRepository';
import type {
  ComicAsset,
  ComicAssetPipeline,
  PipelineResult,
  QrLink,
  QrTargetKind,
} from './types';

export interface ExtractedQrMetadata {
  page: number;
  value: string;
  image: string;
  type: 'UNCLASSIFIED';
}

const PDF_WORKER_PATH = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs');
GlobalWorkerOptions.workerSrc = PDF_WORKER_PATH;

export class ComicAssetPipelineImpl implements ComicAssetPipeline {
  constructor(private readonly repository: ComicAssetRepositoryImpl = new ComicAssetRepositoryImpl()) {}

  async readAssets(comicId: number): Promise<PipelineResult<ComicAsset[]>> {
    try {
      const assets = await this.repository.getComicAsset(comicId);
      return makePipelineResult('done', assets);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to read comic assets';
      return makePipelineResult('error', null, message);
    }
  }

  async saveMetadata(asset: ComicAsset): Promise<PipelineResult<void>> {
    try {
      void asset;
      return makePipelineResult('done', undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save asset metadata';
      return makePipelineResult('error', null, message);
    }
  }

  async linkQrModel(comicId: number, modelId: string): Promise<PipelineResult<QrLink>> {
    try {
      const payload = `cinarai:${comicId}:model:${modelId}`;
      return makePipelineResult('done', makeQrLink(comicId, 'model', modelId, payload));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create QR link';
      return makePipelineResult('error', null, message);
    }
  }

  async linkQrQuiz(comicId: number, quizId: string): Promise<PipelineResult<QrLink>> {
    try {
      const payload = `cinarai:${comicId}:quiz:${quizId}`;
      return makePipelineResult('done', makeQrLink(comicId, 'quiz', quizId, payload));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create QR link';
      return makePipelineResult('error', null, message);
    }
  }

  async extractQrMetadata(comicId: number): Promise<PipelineResult<ExtractedQrMetadata[]>> {
    try {
      const assets = await this.repository.getComicAsset(comicId);
      const pdfAsset = assets.find((asset) => asset.kind === 'pdf' && asset.path);
      if (!pdfAsset?.path) {
        return makePipelineResult('done', []);
      }

      const pdfPath = this.resolveAssetPath(pdfAsset.path);
      const qrMetadata = await this.extractQrCodesFromPdf(pdfPath);
      return makePipelineResult('done', qrMetadata);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to extract QR metadata';
      return makePipelineResult('error', null, message);
    }
  }

  private resolveAssetPath(assetPath: string): string {
    if (!assetPath) return '';
    if (/^https?:\/\//i.test(assetPath)) {
      throw new Error('Remote asset paths are not supported by the local pipeline');
    }

    const normalizedPath = assetPath.replace(/^\/+/, '');
    const candidate = path.isAbsolute(assetPath)
      ? assetPath
      : path.join(process.cwd(), 'public', normalizedPath);

    return candidate;
  }

  private async extractQrCodesFromPdf(pdfPath: string): Promise<ExtractedQrMetadata[]> {
    const data = await fs.readFile(pdfPath);
    const pdf = await getDocument({ data }).promise;
    const results: ExtractedQrMetadata[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');

      await page.render({
        canvasContext: context as unknown as CanvasRenderingContext2D,
        viewport,
      }).promise;

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qr = jsQR(imageData.data, imageData.width, imageData.height);

      if (qr) {
        results.push({
          page: pageNumber,
          value: qr.data,
          image: canvas.toDataURL('image/png'),
          type: 'UNCLASSIFIED',
        });
      }
    }

    return results;
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
