import test from 'node:test';
import assert from 'node:assert/strict';
import { getLearningContentPackage } from './contentPackages';
import { createIdentificationState } from '../stages/Identification/services/identificationService';

test('getLearningContentPackage returns different content for different comic ids', () => {
  const comic1 = getLearningContentPackage(1);
  const comic2 = getLearningContentPackage(2);
  const comic3 = getLearningContentPackage(3);

  assert.equal(comic1.metadata.comicId, 1);
  assert.equal(comic2.metadata.comicId, 2);
  assert.equal(comic3.metadata.comicId, 3);
  assert.notEqual(comic1.metadata.title, comic2.metadata.title);
  assert.notEqual(comic1.learningObjects[0]?.id, comic2.learningObjects[0]?.id);
  assert.equal(comic1.learningObjects.length > 0, true);
  assert.equal(comic2.learningObjects.length > 0, true);
  assert.equal(comic3.learningObjects.length > 0, true);
});

test('getLearningContentPackage falls back to a reusable generic package for unknown comic ids', () => {
  const fallback = getLearningContentPackage(99);

  assert.equal(fallback.metadata.comicId, 99);
  assert.equal(fallback.learningObjects.length > 0, true);
  assert.equal(fallback.identification.questions.length > 0, true);
  assert.equal(fallback.application.prompt.length > 0, true);
});

test('identification state can be built from the content package content', () => {
  const packageContent = getLearningContentPackage(2);
  const state = createIdentificationState(packageContent.identification, {
    comicId: 2,
    lokasi: 'Candi Penataran',
    cover: 'cover',
    title: 'Penataran',
    comicSlug: 'komik-2',
    sourcePage: 1,
    pdfPath: null,
  });

  assert.equal(state.items.length, packageContent.identification.questions.length);
  assert.equal(state.items[0]?.question, packageContent.identification.questions[0]?.question);
  assert.equal(state.items[0]?.image, packageContent.identification.questions[0]?.image);
});

test('comic 2 identification questions reference actual comic 2 objects and use Candi Penataran language', () => {
  const packageContent = getLearningContentPackage(2);
  const question1 = packageContent.identification.questions[0];
  const question2 = packageContent.identification.questions[1];
  const question3 = packageContent.identification.questions[2];
  const question4 = packageContent.identification.questions[3];
  const question5 = packageContent.identification.questions[4];
  const question6 = packageContent.identification.questions[5];

  assert.match(question1.question.toLowerCase(), /motif|relief|candi penataran/);
  assert.match(question2.question.toLowerCase(), /umpang/);
  assert.match(question3.question.toLowerCase(), /candi angka|atap|runcing/);
  assert.match(question4.question.toLowerCase(), /mensir|ornamen|pola/);
  assert.match(question5.question.toLowerCase(), /relief lingkaran|lingkaran/);
  assert.match(question6.question.toLowerCase(), /belah ketupat|ornamen|wajik/);
});

test('comic 2 identification questions do not include Komik 1 specific distractors and use simetri bangun datar options', () => {
  const packageContent = getLearningContentPackage(2);
  const question1 = packageContent.identification.questions[0];
  const question2 = packageContent.identification.questions[1];
  const question3 = packageContent.identification.questions[2];
  const question4 = packageContent.identification.questions[3];
  const question5 = packageContent.identification.questions[4];
  const question6 = packageContent.identification.questions[5];

  assert.equal(question1.question.includes('motif relief persegi'), true);
  assert.ok(question1.options.every((option) => ['Persegi', 'Persegi Panjang', 'Segitiga Sama Sisi', 'Segitiga Sama Kaki', 'Lingkaran', 'Belah Ketupat'].includes(option.text)));
  assert.equal(question1.options.some((option) => option.text === 'Garis Simetri'), false);

  assert.ok(question2.options.every((option) => ['Persegi', 'Persegi Panjang', 'Segitiga Sama Sisi', 'Segitiga Sama Kaki', 'Lingkaran', 'Belah Ketupat'].includes(option.text)));
  assert.ok(question3.options.every((option) => option.text !== 'Garis Simetri'));
  assert.ok(question4.options.every((option) => ['Persegi', 'Persegi Panjang', 'Segitiga Sama Sisi', 'Segitiga Sama Kaki', 'Lingkaran', 'Belah Ketupat'].includes(option.text)));
  assert.ok(question5.options.every((option) => ['Persegi', 'Persegi Panjang', 'Segitiga Sama Sisi', 'Segitiga Sama Kaki', 'Lingkaran', 'Belah Ketupat'].includes(option.text)));
  assert.ok(question6.options.every((option) => ['Persegi', 'Persegi Panjang', 'Segitiga Sama Sisi', 'Segitiga Sama Kaki', 'Lingkaran', 'Belah Ketupat'].includes(option.text)));
});

test('comic 2 identification questions provide six allowed shape choices with one correct answer each', () => {
  const packageContent = getLearningContentPackage(2);
  const allowedShapes = ['Persegi', 'Persegi Panjang', 'Segitiga Sama Sisi', 'Segitiga Sama Kaki', 'Lingkaran', 'Belah Ketupat'];

  for (const question of packageContent.identification.questions) {
    assert.equal(question.options.length, 6);
    assert.ok(question.options.every((option) => allowedShapes.includes(option.text)));
    assert.equal(question.options.filter((option) => option.correct).length, 1);
  }
});

test('comic 2 resolution uses six missions aligned to Candi Penataran objects and shapes', () => {
  const packageContent = getLearningContentPackage(2);
  const missions = packageContent.resolution.missions;
  const expectedShapes = ['Persegi', 'Persegi Panjang', 'Segitiga Sama Kaki', 'Segitiga Sama Sisi', 'Lingkaran', 'Belah Ketupat'];

  assert.equal(missions.length, 6);
  assert.deepEqual(missions.map((mission) => mission.shape), expectedShapes);
  assert.ok(missions.every((mission) => mission.illustration.endsWith('.svg')));
  assert.match(missions[0].context.toLowerCase(), /umpang|candi penataran/);
  assert.match(missions[1].context.toLowerCase(), /balai agung|candi penataran/);
  assert.match(missions[2].context.toLowerCase(), /candi angka|candi penataran/);
  assert.match(missions[3].context.toLowerCase(), /candi induk|candi penataran/);
  assert.match(missions[4].context.toLowerCase(), /relief|candi penataran/);
  assert.match(missions[5].context.toLowerCase(), /pendopo|candi penataran/);
});

test('comic 2 application exposes per-card options and correct answers for each object', () => {
  const packageContent = getLearningContentPackage(2);
  const application = packageContent.application;

  assert.ok(Array.isArray(application.cards));
  assert.equal(application.cards.length, 6);
  assert.ok(application.cards.every((card) => Array.isArray(card.options)));
  assert.ok(application.cards.every((card) => typeof card.correctAnswer === 'string'));
  assert.equal(application.cards[0].correctAnswer, 'Lingkaran');
  assert.equal(application.cards[1].correctAnswer, 'Persegi Panjang');
  assert.equal(application.cards[2].correctAnswer, 'Segitiga Sama Kaki');
  assert.equal(application.cards[3].correctAnswer, 'Segitiga Sama Sisi');
  assert.equal(application.cards[4].correctAnswer, 'Persegi');
  assert.equal(application.cards[5].correctAnswer, 'Belah Ketupat');
  assert.ok(application.cards[0].options.includes('Lingkaran'));
});
