import type {
  ComicAsset,
  ComicAssetKind,
  ComicAssetRepository,
  IComicAssetRepository,
  QrLink,
  QrLinkRepository,
  QrTargetKind,
} from './types';
import { fetchComicById, fetchAllComics } from '@/services/comicFirestoreService';
import type { Comic } from '@/types/comic';

// ── Mapper: Comic → ComicAsset[] ──────────────────────────────────────────────

function makeAsset(
  comicId: number,
  kind: ComicAssetKind,
  path: string,
  mimeType: string
): ComicAsset {
  const filename = path.split('/').pop() ?? path;
  return {
    id: `${comicId}_${kind}`,
    comicId,
    kind,
    path,
    filename,
    mimeType,
    sizeBytes: null,
    uploadedAt: null,
    updatedAt: null,
  };
}

function comicToAssets(comic: Comic): ComicAsset[] {
  const assets: ComicAsset[] = [];
  if (comic.cover) {
    assets.push(makeAsset(comic.id, 'cover', comic.cover, 'image/webp'));
  }
  if (comic.thumbnail) {
    assets.push(makeAsset(comic.id, 'thumbnail', comic.thumbnail, 'image/webp'));
  }
  if (comic.pdfPath) {
    assets.push(makeAsset(comic.id, 'pdf', comic.pdfPath, 'application/pdf'));
  }
  return assets;
}

// ── IComicAssetRepository implementation ─────────────────────────────────────

export class ComicAssetRepositoryImpl implements IComicAssetRepository {
  async getComicAsset(comicId: number): Promise<ComicAsset[]> {
    const comic = await fetchComicById(comicId);
    if (!comic) return [];
    return comicToAssets(comic);
  }

  async getAllComicAssets(): Promise<ComicAsset[]> {
    const comics = await fetchAllComics();
    return comics.flatMap(comicToAssets);
  }
}

// ── Low-level storage repository (placeholder) ────────────────────────────────

export class ComicAssetStorageRepository implements ComicAssetRepository {
  async getAsset(_comicId: number, _kind: ComicAssetKind): Promise<ComicAsset | null> {
    throw new Error('Not implemented');
  }

  async listAssets(_comicId: number): Promise<ComicAsset[]> {
    throw new Error('Not implemented');
  }

  async saveAsset(_asset: ComicAsset): Promise<void> {
    throw new Error('Not implemented');
  }

  async deleteAsset(_comicId: number, _kind: ComicAssetKind): Promise<void> {
    throw new Error('Not implemented');
  }
}

// ── QrLinkRepository placeholder ─────────────────────────────────────────────

export class QrLinkRepositoryImpl implements QrLinkRepository {
  async getQrLink(
    _comicId: number,
    _targetKind: QrTargetKind,
    _targetId: string
  ): Promise<QrLink | null> {
    throw new Error('Not implemented');
  }

  async listQrLinks(_comicId: number): Promise<QrLink[]> {
    throw new Error('Not implemented');
  }

  async saveQrLink(_link: QrLink): Promise<void> {
    throw new Error('Not implemented');
  }

  async deleteQrLink(_id: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
