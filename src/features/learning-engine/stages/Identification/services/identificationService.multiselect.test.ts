import assert from 'node:assert/strict';
import test from 'node:test';

import { createIdentificationState, selectAnswer } from './identificationService';

test('selectAnswer keeps previously selected options and toggles only the clicked option', () => {
  const state = createIdentificationState(
    {
      questions: [
        {
          id: 'comic-1-1',
          question: 'Apa saja bangun ruang yang kamu temukan di Candi Jawi?',
          image: '/images/identification/komik1-soal1.jpg',
          imageAlt: 'Foto keseluruhan Candi Jawi',
          options: [
            { text: 'Kubus', correct: true },
            { text: 'Balok', correct: true },
            { text: 'Kerucut', correct: false },
          ],
          explanation: 'Contoh',
        },
      ],
      feedback: {
        complete: 'Selesai',
        partial: 'Sebagian',
        incomplete: 'Belum',
      },
    },
    { comicId: 1, lokasi: 'Candi Jawi', cover: '/comics/komik-1/cover.png', title: 'Identification' },
  );
  const itemId = state.items[0].id;

  const afterKubus = selectAnswer(state, itemId, state.items[0].options[0].id);
  const afterBalok = selectAnswer(afterKubus, itemId, state.items[0].options[1].id);
  const afterBalokAgain = selectAnswer(afterBalok, itemId, state.items[0].options[1].id);

  const selectedIds = afterBalokAgain.items.find((item) => item.id === itemId)?.selectedOptionIds ?? [];

  assert.deepEqual(selectedIds, [state.items[0].options[0].id]);
});
