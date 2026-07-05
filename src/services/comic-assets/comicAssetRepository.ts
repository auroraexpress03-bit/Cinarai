import type {
  ComicAsset,
  ComicAssetKind,
  ComicAssetRepository,
  QrLink,
  QrLinkRepository,
  QrTargetKind,
} from './types';

// ── ComicAssetRepository placeholder ─────────────────────────────────────────

export class ComicAssetRepositoryImpl implements ComicAssetRepository {
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
