import test from 'node:test';
import assert from 'node:assert/strict';
import { getArgumentationLearningObject, getOrderedArgumentationLearningObjects } from './argumentationQuestions';

test('maps a selected kerucut to the atap learning object', () => {
  const object = getArgumentationLearningObject(['Kerucut']);

  assert.ok(object);
  assert.equal(object?.objectName, 'Bagian Atap');
  assert.equal(object?.solid, 'Kerucut');
});

test('maps a selected kubus to the tubuh learning object', () => {
  const object = getArgumentationLearningObject(['Kubus']);

  assert.ok(object);
  assert.equal(object?.objectName, 'Bagian Tubuh');
  assert.equal(object?.solid, 'Kubus');
});

test('maps a selected prisma to the tangga learning object', () => {
  const object = getArgumentationLearningObject(['Prisma Segitiga']);

  assert.ok(object);
  assert.equal(object?.objectName, 'Bagian Tangga');
  assert.equal(object?.solid, 'Prisma Segitiga');
});

test('falls back to the first object when no shape is selected', () => {
  const object = getArgumentationLearningObject([]);

  assert.ok(object);
  assert.equal(object?.id, 'atap');
});

test('returns all argumentation objects in package order', () => {
  const objects = getOrderedArgumentationLearningObjects({
    questions: [
      {
        id: 'kubus',
        title: 'Kubus',
        templePart: 'Badan Candi',
        question: 'Mengapa kubus?',
        photoSrc: '/img/kubus.png',
        photoAlt: 'Kubus',
        shapeName: 'Kubus',
        shapeKey: 'kubus',
        shapeSrc: '/img/kubus.png',
        highlightColor: 'border-primary-500',
      },
      {
        id: 'balok',
        title: 'Balok',
        templePart: 'Tangga Candi',
        question: 'Mengapa balok?',
        photoSrc: '/img/balok.png',
        photoAlt: 'Balok',
        shapeName: 'Balok',
        shapeKey: 'balok',
        shapeSrc: '/img/balok.png',
        highlightColor: 'border-amber-500',
      },
      {
        id: 'prisma',
        title: 'Prisma Segi Empat',
        templePart: 'Ornamen Candi',
        question: 'Mengapa prisma?',
        photoSrc: '/img/prisma.png',
        photoAlt: 'Prisma',
        shapeName: 'Prisma Segi Empat',
        shapeKey: 'prisma',
        shapeSrc: '/img/prisma.png',
        highlightColor: 'border-cyan-500',
      },
      {
        id: 'limas',
        title: 'Limas Segi Empat',
        templePart: 'Puncak Candi',
        question: 'Mengapa limas?',
        photoSrc: '/img/limas.png',
        photoAlt: 'Limas',
        shapeName: 'Limas Segi Empat',
        shapeKey: 'limas',
        shapeSrc: '/img/limas.png',
        highlightColor: 'border-secondary-500',
      },
      {
        id: 'kerucut',
        title: 'Kerucut',
        templePart: 'Ornamen Puncak',
        question: 'Mengapa kerucut?',
        photoSrc: '/img/kerucut.png',
        photoAlt: 'Kerucut',
        shapeName: 'Kerucut',
        shapeKey: 'kerucut',
        shapeSrc: '/img/kerucut.png',
        highlightColor: 'border-secondary-500',
      },
    ],
  });

  assert.equal(objects.length, 5);
  assert.deepEqual(objects.map((item) => item.solid), ['Kubus', 'Balok', 'Prisma Segi Empat', 'Limas Segi Empat', 'Kerucut']);
});
