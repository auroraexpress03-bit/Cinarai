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

test('comic 2 identification questions do not include Komik 1 specific distractors and use simetri bangun datar options', () => {
  const packageContent = getLearningContentPackage(2);
  const question1 = packageContent.identification.questions[0];
  const question2 = packageContent.identification.questions[1];
  const question3 = packageContent.identification.questions[2];
  const question4 = packageContent.identification.questions[3];
  const question5 = packageContent.identification.questions[4];
  const question6 = packageContent.identification.questions[5];

  assert.equal(question1.question.includes('alas Umpang'), true);
  assert.ok(question1.options.every((option) => ['Persegi', 'Persegi Panjang', 'Lingkaran', 'Belah Ketupat'].includes(option.text)));
  assert.equal(question1.options.some((option) => option.text === 'Garis Simetri'), false);

  assert.ok(question2.options.every((option) => ['Persegi Panjang', 'Belah Ketupat', 'Segitiga Sama Sisi', 'Persegi'].includes(option.text)));
  assert.ok(question3.options.every((option) => option.text !== 'Garis Simetri'));
  assert.ok(question4.options.every((option) => ['Segitiga Sama Kaki', 'Segitiga Sama Sisi', 'Belah Ketupat', 'Persegi'].includes(option.text)));
  assert.ok(question5.options.every((option) => ['Lingkaran', 'Persegi', 'Belah Ketupat', 'Persegi Panjang'].includes(option.text)));
  assert.ok(question6.options.every((option) => ['Belah Ketupat', 'Persegi', 'Persegi Panjang', 'Lingkaran'].includes(option.text)));
});
