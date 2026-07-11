import assert from 'node:assert/strict';
import test from 'node:test';

import { createIdentificationState, selectAnswer } from './identificationService';

test('selectAnswer keeps previously selected options and toggles only the clicked option', () => {
  const state = createIdentificationState(1, 'Candi Jawi', [], '/comics/komik-1/cover.png', 'Identification');
  const itemId = state.items[0].id;

  const afterKubus = selectAnswer(state, itemId, state.items[0].options[0].id);
  const afterBalok = selectAnswer(afterKubus, itemId, state.items[0].options[1].id);
  const afterBalokAgain = selectAnswer(afterBalok, itemId, state.items[0].options[1].id);

  const selectedIds = afterBalokAgain.items.find((item) => item.id === itemId)?.selectedOptionIds ?? [];

  assert.deepEqual(selectedIds, [state.items[0].options[0].id]);
});
