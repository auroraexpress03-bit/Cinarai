import test from 'node:test';
import assert from 'node:assert/strict';
import { generateComicMetadata } from './metadataGenerator';
import type { ClassifiedQr } from './types';

test('infers embed viewer metadata for Sketchfab entries', () => {
  const qr: ClassifiedQr = {
    page: 5,
    category: 'MODEL_3D',
    value: 'https://sketchfab.com/models/abc123',
    image: '',
    title: 'Candi Jawi',
    description: 'Model utuh',
    previewImage: '/preview.png',
    qrImage: '/qr.png',
    qrUrl: 'https://sketchfab.com/models/abc123',
  };

  const metadata = generateComicMetadata(1, 10, [qr]);
  const entry = metadata.assets.model3D[0];

  assert.equal(entry.viewerType, 'embed');
  assert.equal(entry.embedUrl, 'https://sketchfab.com/models/abc123/embed');
  assert.equal(entry.arUrl, 'https://sketchfab.com/models/abc123');
  assert.equal(entry.qrImage, '/qr.png');
  assert.equal(entry.previewImage, '/preview.png');
});

test('infers assemblr viewer metadata for Assemblr entries', () => {
  const qr: ClassifiedQr = {
    page: 13,
    category: 'MODEL_3D',
    value: 'https://asblr.com/abc123',
    image: '',
    title: 'Kubus',
    description: 'Bangun ruang',
    previewImage: '/preview.png',
    qrImage: '/qr.png',
    qrUrl: 'https://asblr.com/abc123',
  };

  const metadata = generateComicMetadata(1, 10, [qr]);
  const entry = metadata.assets.model3D[0];

  assert.equal(entry.viewerType, 'assemblr');
  assert.equal(entry.embedUrl, '');
  assert.equal(entry.arUrl, 'https://asblr.com/abc123');
  assert.equal(entry.qrImage, '/qr.png');
  assert.equal(entry.previewImage, '/preview.png');
});
