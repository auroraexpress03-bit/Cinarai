import assert from 'node:assert/strict';
import test from 'node:test';

import { getComic1QrAssetForObject } from './qrAssetRegistry';

test('comic 1 maps objects to the latest QR assets from the assets/qr folder', () => {
  assert.match(getComic1QrAssetForObject('Candi Jawi') ?? '', /candi-jawi\.png$/);
  assert.match(getComic1QrAssetForObject('Kubus') ?? '', /kubus\.png$/);
  assert.match(getComic1QrAssetForObject('Balok') ?? '', /balok\.png$/);
  assert.match(getComic1QrAssetForObject('Prisma Segi Empat') ?? '', /prisma-segi-empat\.png$/);
  assert.match(getComic1QrAssetForObject('Limas Segi Empat') ?? '', /limas-segi-empat\.png$/);
  assert.match(getComic1QrAssetForObject('Kerucut') ?? '', /kerucut\.png$/);
});
