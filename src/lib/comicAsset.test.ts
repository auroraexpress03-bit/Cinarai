import test from 'node:test';
import assert from 'node:assert/strict';
import { createComicAssetSkeleton } from './comicAsset';

test('createComicAssetSkeleton initializes empty pages and preserves metadata', () => {
  const asset = createComicAssetSkeleton({
    id: 1,
    sourcePdfPath: '/comics/komik-1/comic.pdf',
    thumbnail: '/comics/komik-1/thumbnail.png',
    qrMetadata: [{ id: 'qr-1', target: 'model-1', label: 'Bangun Ruang' }],
    stageMetadata: [{ stage: 'Contextualization', title: 'Membaca Komik' }],
  });

  assert.equal(asset.id, 1);
  assert.equal(asset.sourcePdfPath, '/comics/komik-1/comic.pdf');
  assert.equal(asset.pageCount, 0);
  assert.deepEqual(asset.pages, []);
  assert.equal(asset.thumbnail, '/comics/komik-1/thumbnail.png');
  assert.equal(asset.qrMetadata?.[0]?.target, 'model-1');
  assert.equal(asset.stageMetadata?.[0]?.stage, 'Contextualization');
});
