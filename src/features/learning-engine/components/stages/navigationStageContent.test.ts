import test from 'node:test';
import assert from 'node:assert/strict';
import { packageContent } from '@/features/comics/comic-2/content/packageContent';
import { resolveNavigationStageContent } from './navigationStageContent';

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

test('comic 2 navigation stage resolves hero content from the comic 2 dataset only', () => {
  const content = resolveNavigationStageContent(2);
  const objectTitles = content.objects.map((object) => object.title);

  assert.deepEqual(objectTitles, [
    'Umpang',
    'Bale Agung',
    'Candi Angka',
    'Mensir',
    'Relief Lingkaran',
    'Ornamen Belah Ketupat',
  ]);
  assert.equal(content.heroModelEntry?.title, 'Umpang');
  assert.equal(content.heroQrImage, '/assets/qr/komik-2/15-objek-2.jpeg');
  assert.equal(content.heroIllustration, '/assets/images/komik-2/umpang.png');
  assert.ok(content.objects.every((object) => object.id.startsWith('komik2-')));
});
