import test from 'node:test';
import assert from 'node:assert/strict';
import { packageContent } from '@/features/comics/comic-2/content/packageContent';

test('comic 2 navigation content uses story objects and bangun datar language', () => {
  const titles = packageContent.learningObjects.map((object) => object.title);

  assert.ok(titles.includes('Umpang'));
  assert.ok(titles.includes('Bale Agung'));
  assert.ok(titles.includes('Candi Angka'));
  assert.ok(titles.includes('Mensir'));
  assert.ok(titles.includes('Relief Lingkaran'));
  assert.ok(titles.includes('Ornamen Belah Ketupat'));
  assert.ok(packageContent.learningObjects.every((object) => object.description.toLowerCase().includes('candi') || object.description.toLowerCase().includes('simetri') || object.description.toLowerCase().includes('bangun datar')));
});

test('comic 2 navigation content uses only bangun datar terminology', () => {
  const objectNames = packageContent.learningObjects.map((object) => object.shapeName).filter(Boolean);

  assert.deepEqual(objectNames, ['Persegi Panjang', 'Persegi Panjang', 'Segitiga Sama Kaki', 'Persegi', 'Lingkaran', 'Belah Ketupat']);
  assert.ok(packageContent.aiPrompt.navigation.includes('bangun datar'));
});
