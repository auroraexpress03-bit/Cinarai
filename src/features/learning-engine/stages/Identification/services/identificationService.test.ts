import assert from 'node:assert/strict';
import test from 'node:test';

import { createIdentificationState, resolveSelectedOptionId } from './identificationService';

test('identification questions for comic 2 use local assets and symmetry-focused content', () => {
  const state = createIdentificationState(
    2,
    'Candi Penataran',
    [],
    '/comics/komik-2/cover.png',
    'Petualangan Simetri Candi Penataran',
  );
  const firstItem = state.items[0];

  assert.match(firstItem.image, /^\/assets\/qr\/komik-2\//);
  assert.match(firstItem.imageAlt, /Candi Penataran|simetri|relief/i);
  assert.match(firstItem.question, /simetri|persegi|persegi panjang|segitiga|trapesium/i);
  assert.match(firstItem.overlayType ?? '', /^\/assets\/qr\/komik-2\//);
  assert.match(firstItem.crop ?? '', /^\/assets\/qr\/komik-2\//);
  assert.match(firstItem.highlight ?? '', /^\/assets\/qr\/komik-2\//);

  const correctOption = firstItem.options.find((option) => option.correct);
  assert.equal(firstItem.correctOptionId, correctOption?.id);
});

test('identification state derives its image source from the comic slug and observation page', () => {
  const state = createIdentificationState(
    2,
    'Candi Penataran',
    [],
    '/comics/komik-2/cover.png',
    'Petualangan Simetri Candi Penataran',
    'komik-2',
    7,
  );
  const firstItem = state.items[0];

  assert.equal(firstItem.image, '/comics/generated/komik-2/page-7.png');
  assert.equal(firstItem.sourcePdfPath, '/comics/komik-2/comic.pdf');
  assert.equal(firstItem.sourcePage, 7);
});

test('stored answer text resolves to the shuffled option id', () => {
  const state = createIdentificationState(
    2,
    'Candi Penataran',
    [],
    '/comics/komik-2/cover.png',
    'Petualangan Simetri Candi Penataran',
    'komik-2',
    1,
  );
  const firstItem = state.items[0];
  const correctOption = firstItem.options.find((option) => option.correct);

  assert.ok(correctOption);
  assert.equal(resolveSelectedOptionId(firstItem, correctOption?.text ?? null), correctOption?.id);
});
