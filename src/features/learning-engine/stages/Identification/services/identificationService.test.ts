import assert from 'node:assert/strict';
import test from 'node:test';

import { createIdentificationState, resolveSelectedOptionId } from './identificationService';

test('identification questions use local assets and keep the correct answer intact', () => {
  const state = createIdentificationState(1, 'Candi Jawi', [], '/images/identification/komik1-soal1.jpg', 'Candi Jawi');
  const firstItem = state.items[0];

  assert.match(firstItem.image, /^\/images\/identification\//);
  assert.match(firstItem.imageAlt, /^Foto lokal/i);
  assert.match(firstItem.overlayType ?? '', /^\/images\/identification\//);
  assert.match(firstItem.crop ?? '', /^\/images\/identification\//);
  assert.match(firstItem.highlight ?? '', /^\/images\/identification\//);

  const correctOption = firstItem.options.find((option) => option.correct);
  assert.equal(firstItem.correctOptionId, correctOption?.id);
});

test('stored answer text resolves to the shuffled option id', () => {
  const state = createIdentificationState(1, 'Candi Jawi', [], '/images/identification/komik1-soal1.jpg', 'Candi Jawi');
  const firstItem = state.items[0];
  const correctOption = firstItem.options.find((option) => option.correct);

  assert.ok(correctOption);
  assert.equal(resolveSelectedOptionId(firstItem, correctOption?.text ?? null), correctOption?.id);
});
