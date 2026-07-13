import { createIdentificationState } from '../src/features/learning-engine/stages/Identification/services/identificationService';

function run() {
  const comicId = 2;
  const lokasi = 'Candi Penataran, Blitar';
  const learningTargets: readonly string[] = [];
  const cover = '/comics/komik-2/cover.png';
  const title = 'Petualangan Simetri Candi Penataran';
  const comicSlug = 'komik-2';
  const sourcePage = 1;
  const pdfPath = null;

  const state = createIdentificationState(comicId, lokasi, learningTargets, cover, title, comicSlug, sourcePage, pdfPath);

  const firstItem = state.items[0];

  process.stdout.write('---- Identification State Snapshot ----\n');
  process.stdout.write(`package.id: ${comicId}\n`);
  process.stdout.write(`item.question: ${firstItem.question}\n`);
  process.stdout.write(`renderedQuestion (component would render): ${firstItem.question}\n`);
  process.stdout.write(`all options: ${JSON.stringify(firstItem.options.map((o) => ({ id: o.id, text: o.text, correct: o.correct })), null, 2)}\n`);
  process.stdout.write(`image: ${firstItem.image}\n`);
  process.stdout.write(`--- JSON item ---\n${JSON.stringify(firstItem, null, 2)}\n`);
}

run();
