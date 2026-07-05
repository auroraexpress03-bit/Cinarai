import fs from 'fs';
import { createCanvas } from 'canvas';
import * as pdfjsLib from '/workspaces/Cinarai/node_modules/pdfjs-dist/legacy/build/pdf.mjs';

async function extractCover(pdfPath, outPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true,
    disableWorker: true,
  }).promise;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('OK:', outPath, canvas.width + 'x' + canvas.height);
}

for (const i of [1, 2, 3]) {
  await extractCover(
    `/workspaces/Cinarai/public/comics/komik-${i}/comic.pdf`,
    `/workspaces/Cinarai/public/comics/komik-${i}/cover.png`
  );
}
console.log('Done');
