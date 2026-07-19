import { createCanvas, loadImage } from 'canvas';
import jsQR from 'jsqr';
import fs from 'fs';

const dir = './src/features/comics/comic-2/assets/qr/';
const files = fs.readdirSync(dir).filter(f => /13-objek-1|15-objek-2|17-objek-3|18-objek-4/.test(f));

async function decode(file) {
  const img = await loadImage(dir + file);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  if (!code) {
    console.log(file + ': NO QR FOUND');
  } else {
    console.log(file + ':', code.data);
  }
}

(async () => {
  for (const f of files) {
    try {
      await decode(f);
    } catch (err) {
      console.error('ERROR', f, err.message);
    }
  }
})();
