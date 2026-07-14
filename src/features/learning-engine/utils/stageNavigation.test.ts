import test from 'node:test';
import assert from 'node:assert/strict';
import { getStagePageNavigationState } from './stageNavigation';

test('stage page navigation marks first and last slides correctly', () => {
  const first = getStagePageNavigationState(0, 5);
  assert.equal(first.onFirstSlide, true);
  assert.equal(first.onLastSlide, false);
  assert.equal(first.canGoPrev, false);
  assert.equal(first.canGoNext, true);

  const middle = getStagePageNavigationState(2, 5);
  assert.equal(middle.onFirstSlide, false);
  assert.equal(middle.onLastSlide, false);
  assert.equal(middle.canGoPrev, true);
  assert.equal(middle.canGoNext, true);

  const last = getStagePageNavigationState(4, 5);
  assert.equal(last.onFirstSlide, false);
  assert.equal(last.onLastSlide, true);
  assert.equal(last.canGoPrev, true);
  assert.equal(last.canGoNext, false);
});
