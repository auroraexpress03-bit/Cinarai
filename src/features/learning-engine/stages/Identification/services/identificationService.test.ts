import assert from 'node:assert/strict';
import test from 'node:test';

import { getComicModule } from '@/features/comics';
import { getShapeIcon } from '../components/ui/ShapeIcons';
import { buildIdentificationFeedback, buildIdentificationTutorExplanations, buildIdentificationTutorExplanation, createIdentificationState, resolveSelectedOptionId } from './identificationService';

test('createIdentificationState builds state from explicit identification data without comicId branching', () => {
  const state = createIdentificationState(
    {
      questions: [
        {
          id: 'custom-1',
          question: 'Bangun apa yang paling terlihat?',
          image: '/images/custom.png',
          imageAlt: 'Custom illustration',
          options: [{ text: 'Balok', correct: true }],
          explanation: 'Custom explanation',
        },
      ],
      feedback: {
        complete: 'Selesai',
        partial: 'Sebagian',
        incomplete: 'Belum',
      },
    },
    {
      comicId: 42,
      lokasi: 'Lokasi khusus',
      cover: '/cover.png',
      title: 'Custom Comic',
      comicSlug: 'custom-comic',
      sourcePage: 3,
      pdfPath: null,
    },
  );

  assert.equal(state.items.length, 1);
  assert.equal(state.items[0]?.question, 'Bangun apa yang paling terlihat?');
  assert.equal(state.items[0]?.image, '/images/custom.png');
  assert.equal(state.lokasi, 'Lokasi khusus');
});

test('identification questions for comic 1 use dedicated Candi Jawi photo assets', () => {
  const state = createIdentificationState(
    {
      questions: [
        {
          id: 'comic-1-1',
          question: 'Apa saja bangun ruang yang kamu temukan di Candi Jawi?',
          image: '/images/identification/komik1-soal1.jpg',
          imageAlt: 'Foto keseluruhan Candi Jawi dengan overlay bangun ruang dominan.',
          highlight: '/images/identification/komik1-soal1-tubuh-candi.svg',
          options: [
            { text: 'Kubus', correct: true },
            { text: 'Balok', correct: true },
            { text: 'Prisma Segi Empat', correct: true },
            { text: 'Limas Segi Empat', correct: true },
            { text: 'Kerucut', correct: true },
          ],
          explanation: 'Pada Candi Jawi, bangun ruang utama terlihat pada keseluruhan komik.',
        },
      ],
      feedback: {
        complete: 'Selesai',
        partial: 'Sebagian',
        incomplete: 'Belum',
      },
    },
    {
      comicId: 1,
      lokasi: 'Candi Jawi',
      cover: '/comics/komik-1/cover.png',
      title: 'Candi Jawi Identification',
    },
  );
  const firstItem = state.items[0];

  assert.equal(firstItem.image, '/images/identification/komik1-soal1.jpg');
  assert.match(firstItem.imageAlt, /Candi Jawi|keseluruhan|overlay/i);
  assert.match(firstItem.question, /keseluruhan Candi Jawi|bangun ruang|tubuh utama/i);
  assert.equal(firstItem.highlight, '/images/identification/komik1-soal1-tubuh-candi.svg');
  assert.equal(firstItem.sourcePdfPath, null);
  assert.equal(firstItem.sourcePage, undefined);

  const correctOption = firstItem.options.find((option) => option.correct);
  assert.equal(firstItem.correctOptionId, correctOption?.id);
});

test('identification state preserves per-question images and nulls PDF fallback for dedicated identification assets', () => {
  const state = createIdentificationState(
    {
      questions: [
        {
          id: 'comic-1-1',
          question: 'Apa saja bangun ruang yang kamu temukan di Candi Jawi?',
          image: '/images/identification/komik1-soal1.jpg',
          imageAlt: 'Foto keseluruhan Candi Jawi dengan overlay bangun ruang dominan.',
          highlight: '/images/identification/komik1-soal1-tubuh-candi.svg',
          options: [
            { text: 'Kubus', correct: true },
            { text: 'Balok', correct: true },
            { text: 'Prisma Segi Empat', correct: true },
            { text: 'Limas Segi Empat', correct: true },
            { text: 'Kerucut', correct: true },
          ],
          explanation: 'Pada Candi Jawi, bangun ruang utama terlihat pada keseluruhan komik.',
        },
        {
          id: 'comic-1-2',
          question: 'Bangun ruang mana yang paling cocok untuk menggambarkan pilar utama?',
          image: '/images/identification/komik1-soal2.jpg',
          imageAlt: 'Zoom bagian kaki Candi Jawi.',
          highlight: '/images/identification/komik1-soal2-kaki-candi.svg',
          options: [
            { text: 'Kubus', correct: true },
            { text: 'Balok', correct: false },
            { text: 'Prisma Segi Empat', correct: false },
            { text: 'Limas Segi Empat', correct: false },
            { text: 'Kerucut', correct: false },
          ],
          explanation: 'Pilar utama candi sering tersusun dari bentuk kotak.',
        },
        {
          id: 'comic-1-3',
          question: 'Bagian badan candi paling mirip dengan bangun ruang apa?',
          image: '/images/identification/komik1-soal3.jpg',
          imageAlt: 'Zoom badan tengah Candi Jawi.',
          highlight: '/images/identification/komik1-soal3-puncak-candi.svg',
          options: [
            { text: 'Balok', correct: true },
            { text: 'Kubus', correct: false },
            { text: 'Prisma Segi Empat', correct: false },
            { text: 'Limas Segi Empat', correct: false },
            { text: 'Kerucut', correct: false },
          ],
          explanation: 'Badan candi menyerupai bangun ruang balok.',
        },
        {
          id: 'comic-1-4',
          question: 'Struktur puncak yang meruncing bisa diterangkan dengan bangun ruang apa?',
          image: '/images/identification/komik1-soal4.jpg',
          imageAlt: 'Zoom atap Candi Jawi.',
          highlight: '/images/identification/komik1-soal4-atap-candi.svg',
          options: [
            { text: 'Limas Segi Empat', correct: true },
            { text: 'Kerucut', correct: true },
            { text: 'Kubus', correct: false },
            { text: 'Balok', correct: false },
            { text: 'Prisma Segi Empat', correct: false },
          ],
          explanation: 'Puncak candi meniru limas dan kerucut karena meruncing ke satu titik.',
        },
        {
          id: 'comic-1-5',
          question: 'Bagian mana yang paling cocok disebut kerucut?',
          image: '/images/identification/komik1-soal5.jpg',
          imageAlt: 'Zoom bagian puncak Candi Jawi.',
          highlight: '/images/identification/komik1-soal5-puncak-candi.svg',
          options: [
            { text: 'Kerucut', correct: true },
            { text: 'Kubus', correct: false },
            { text: 'Balok', correct: false },
            { text: 'Prisma Segi Empat', correct: false },
            { text: 'Limas Segi Empat', correct: false },
          ],
          explanation: 'Puncak candi meruncing seperti kerucut.',
        },
      ],
      feedback: {
        complete: 'Selesai',
        partial: 'Sebagian',
        incomplete: 'Belum',
      },
    },
    {
      comicId: 1,
      lokasi: 'Candi Jawi',
      cover: '/comics/komik-1/cover.png',
      title: 'Candi Jawi Identification',
      comicSlug: 'komik-1',
      sourcePage: 7,
    },
  );
  const firstItem = state.items[0];

  assert.equal(firstItem.image, '/images/identification/komik1-soal1.jpg');
  assert.equal(firstItem.sourcePdfPath, null);
  assert.equal(firstItem.sourcePage, undefined);
  assert.equal(state.items[1].image, '/images/identification/komik1-soal2.jpg');
  assert.equal(state.items[4].image, '/images/identification/komik1-soal5.jpg');
});

test('stored answer text resolves to the shuffled option id', () => {
  const state = createIdentificationState(
    {
      questions: [
        {
          id: 'comic-2-1',
          question: 'Perhatikan pola relief pada bagian ini. Bangun datar apa yang paling terlihat berulang?',
          image: '/assets/qr/komik-2/13-objek-1.jpeg',
          imageAlt: 'Relief Candi Penataran.',
          options: [
            { text: 'Persegi', correct: true },
            { text: 'Segitiga', correct: false },
          ],
          explanation: 'Relief yang teratur menunjukkan bentuk persegi.',
        },
      ],
      feedback: {
        complete: 'Selesai',
        partial: 'Sebagian',
        incomplete: 'Belum',
      },
    },
    {
      comicId: 2,
      lokasi: 'Candi Penataran',
      cover: '/comics/komik-2/cover.png',
      title: 'Petualangan Simetri Candi Penataran',
      comicSlug: 'komik-2',
      sourcePage: 1,
    },
  );
  const firstItem = state.items[0];
  const correctOption = firstItem.options.find((option) => option.correct);

  assert.ok(correctOption);
  assert.equal(resolveSelectedOptionId(firstItem, correctOption?.text ?? null), correctOption?.id);
});

test('comic 1 identification options are built from comic knowledge and include kerucut as a correct shape', () => {
  const state = createIdentificationState(
    {
      questions: [
        {
          id: 'comic-1-1',
          question: 'Apa saja bangun ruang yang kamu temukan di Candi Jawi?',
          image: '/images/identification/komik1-soal1.jpg',
          imageAlt: 'Foto keseluruhan Candi Jawi dengan overlay bangun ruang dominan.',
          highlight: '/images/identification/komik1-soal1-tubuh-candi.svg',
          options: [
            { text: 'Kubus', correct: true },
            { text: 'Balok', correct: true },
            { text: 'Prisma Segi Empat', correct: true },
            { text: 'Limas Segi Empat', correct: true },
            { text: 'Kerucut', correct: true },
          ],
          explanation: 'Pada Candi Jawi, bangun ruang utama terlihat pada keseluruhan komik.',
        },
      ],
      feedback: {
        complete: 'Selesai',
        partial: 'Sebagian',
        incomplete: 'Belum',
      },
    },
    {
      comicId: 1,
      lokasi: 'Candi Jawi',
      cover: '/comics/komik-1/cover.png',
      title: 'Candi Jawi Identification',
    },
  );
  const firstItem = state.items[0];
  const correctLabels = firstItem.options.filter((option) => option.correct).map((option) => option.text).sort();

  assert.deepEqual(correctLabels, ['Balok', 'Kerucut', 'Kubus', 'Limas Segi Empat', 'Prisma Segi Empat']);
  assert.ok(!firstItem.options.some((option) => option.text === 'Bola'));
  assert.ok(!firstItem.options.some((option) => option.text === 'Tabung'));
});

test('comic 1 identification options only use shapes present in Candi Jawi content', () => {
  const comicModule = getComicModule(1);
  const optionLabels = comicModule.identification.questions.flatMap((question) => question.options.map((option) => option.text));
  const disallowedShapes = ['Tabung', 'Bola'];

  for (const shape of disallowedShapes) {
    assert.ok(!optionLabels.includes(shape), `expected ${shape} to be removed from comic 1 identification options`);
  }

  assert.ok(optionLabels.includes('Kubus'));
  assert.ok(optionLabels.includes('Balok'));
  assert.ok(optionLabels.includes('Prisma Segi Empat'));
  assert.ok(optionLabels.includes('Limas Segi Empat'));
  assert.ok(optionLabels.includes('Kerucut'));
});

test('getShapeIcon maps comic 1 shape names to the correct icon component', () => {
  assert.equal(getShapeIcon('Prisma Segi Empat').name, 'PrismaIcon');
  assert.equal(getShapeIcon('Limas Segi Empat').name, 'LimasIcon');
  assert.equal(getShapeIcon('Kerucut').name, 'KerucutIcon');
});

test('buildIdentificationTutorExplanation explains selected shapes in child-friendly language', () => {
  const explanation = buildIdentificationTutorExplanation(['Kubus', 'Bola']);

  assert.match(explanation, /Kubus/i);
  assert.match(explanation, /Bola/i);
  assert.match(explanation, /tidak ditemukan/i);
});

test('buildIdentificationTutorExplanations returns structured sections for every selected shape', () => {
  const explanations = buildIdentificationTutorExplanations(['Kubus', 'Bola']);

  assert.equal(explanations.length, 2);
  assert.match(explanations[0].name, /Kubus/i);
  assert.equal(explanations[0].icon, '🧊');
  assert.equal(explanations[0].badgeLabel, '✅ Ditemukan');
  assert.match(explanations[0].statusLabel, /ditemukan/i);
  assert.match(explanations[0].definition, /kubus/i);
  assert.match(explanations[0].explanation, /panel komik/i);
  assert.match(explanations[0].reflectionQuestion, /mengapa/i);
  assert.equal(explanations[1].badgeLabel, '❌ Tidak ditemukan');
  assert.match(explanations[1].statusLabel, /tidak ditemukan/i);
  assert.match(explanations[1].comicReference, /panel komik/i);
});

test('buildIdentificationFeedback praises complete identification and flags distractors', () => {
  const praise = buildIdentificationFeedback(['Balok', 'Kubus', 'Limas', 'Prisma'], ['Balok', 'Kubus', 'Limas', 'Prisma']);
  const corrective = buildIdentificationFeedback(['Balok', 'Bola'], ['Balok', 'Kubus', 'Limas', 'Prisma']);

  assert.match(praise, /Hebat/i);
  assert.match(corrective, /tidak sesuai/i);
});
