import test from 'node:test';
import assert from 'node:assert/strict';
import { RESOLUTION_MISSIONS, buildResolutionTutorExplanation, getMissionHint, isCorrectSelection } from './resolutionStage.helpers';

test('resolution missions include five sequential numeracy missions', () => {
  assert.equal(RESOLUTION_MISSIONS.length, 5);
  assert.equal(RESOLUTION_MISSIONS[0].shape, 'Kubus');
  assert.equal(RESOLUTION_MISSIONS[4].shape, 'Kerucut');
});

test('correct selection is validated per mission', () => {
  assert.equal(isCorrectSelection(RESOLUTION_MISSIONS[0], 'C'), true);
  assert.equal(isCorrectSelection(RESOLUTION_MISSIONS[1], 'C'), true);
  assert.equal(isCorrectSelection(RESOLUTION_MISSIONS[2], 'B'), true);
  assert.equal(isCorrectSelection(RESOLUTION_MISSIONS[3], 'B'), true);
  assert.equal(isCorrectSelection(RESOLUTION_MISSIONS[4], 'B'), true);
});

test('wrong-answer guidance stays scaffolded and avoids revealing the final result', () => {
  const explanation = buildResolutionTutorExplanation(RESOLUTION_MISSIONS[1], false);

  assert.match(explanation, /Bangun ruang: Balok/i);
  assert.match(explanation, /Rumus Volume:/i);
  assert.match(explanation, /p = Panjang/i);
  assert.match(explanation, /l = Lebar/i);
  assert.match(explanation, /t = Tinggi/i);
  assert.doesNotMatch(explanation, /360 cm³/i);
  assert.doesNotMatch(explanation, /12 × 6/i);
  assert.doesNotMatch(explanation, /72 × 5/i);
});

test('mission hints use the scaffolded tutor guidance', () => {
  const hint = getMissionHint(RESOLUTION_MISSIONS[0], 3);

  assert.match(hint, /Bangun ruang:/i);
  assert.match(hint, /Masukkan nilai yang ada pada soal/i);
});
