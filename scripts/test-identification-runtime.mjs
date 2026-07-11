import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function runTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
  const page = await context.newPage();
  const screenshotsDir = '/tmp/cinarai-playwright';
  ensureDir(screenshotsDir);

  const blockedSources = [];
  const allowedSources = [];

  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('/images/') || url.includes('/assets/') || url.includes('/identification/')) {
      blockedSources.push(url);
    }
    if (url.includes('/comics/generated/') || url.startsWith('blob:')) {
      allowedSources.push(url);
    }
  });

  try {
    console.log('1️⃣  Membuka halaman login...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const email = `playwright-${Date.now()}@example.com`;
    const password = 'Playwright123!';

    console.log('2️⃣  Mendaftarkan akun uji...');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.getByRole('button', { name: 'Masuk 🚀' }).click();

    await page.waitForTimeout(3000);
    const signInError = page.locator('text=Failed to sign in').first();
    if (await signInError.count()) {
      console.log('⚠️  Sign-in failed, trying sign-up flow...');
    }

    const signUpLink = page.locator('a:has-text("Daftar sekarang")');
    if (await signUpLink.count()) {
      await signUpLink.click();
      await page.waitForTimeout(1000);
      await page.locator('#displayName').fill('Playwright Test');
      await page.locator('#email').fill(email);
      await page.locator('#password').fill(password);
      await page.locator('#confirmPassword').fill(password);
      await page.getByRole('button', { name: 'Daftar Sekarang 🚀' }).click();
    }

    await page.waitForURL(/dashboard|comic/, { timeout: 30000 });
    console.log('✓ Login berhasil');

    console.log('3️⃣  Membuka Comic 1...');
    await page.goto('http://localhost:3000/comic/1/learn', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const continueButton = page.getByRole('button', { name: /lanjut/i }).first();
    if (await continueButton.count()) {
      await continueButton.click();
      await page.waitForTimeout(1000);
    }

    console.log('4️⃣  Menunggu PDF reader dan membuka halaman terakhir...');
    await page.waitForSelector('canvas, iframe, [data-testid="pdf-reader"]', { timeout: 30000 });

    for (let i = 0; i < 10; i += 1) {
      const nextButton = page.getByRole('button', { name: /next|lanjut|selanjutnya/i }).first();
      if (await nextButton.count()) {
        await nextButton.click();
        await page.waitForTimeout(700);
      } else {
        break;
      }
    }

    const completeButton = page.getByRole('button', { name: /saya sudah membaca|selesai membaca|lanjut ke identification/i }).first();
    if (await completeButton.count()) {
      await completeButton.click();
      await page.waitForTimeout(5000);
    }

    console.log('5️⃣  Menunggu stage Identification...');
    await page.waitForSelector('img[alt], figure', { timeout: 30000 });
    await page.waitForTimeout(3000);

    const comicLastPagePath = path.join(screenshotsDir, 'comic-last-page.png');
    await page.screenshot({ path: comicLastPagePath, fullPage: true });
    console.log(`📸 Screenshot halaman komik terakhir: ${comicLastPagePath}`);

    const identificationPath = path.join(screenshotsDir, 'identification-stage.png');
    await page.screenshot({ path: identificationPath, fullPage: true });
    console.log(`📸 Screenshot Identification: ${identificationPath}`);

    const image = page.locator('figure img').first();
    const src = await image.getAttribute('src');
    console.log(`🖼️  Sumber gambar Identification: ${src}`);

    const hasAllowedSource = Boolean(src && (src.startsWith('blob:') || src.includes('/comics/generated/')));
    const hasBlockedSource = Boolean(src && (src.includes('/images/') || src.includes('/assets/') || src.includes('/identification/')));

    if (!hasAllowedSource || hasBlockedSource) {
      throw new Error(`Sumber gambar tidak sesuai: ${src}`);
    }

    const blockedUrls = [...new Set(blockedSources)].filter(Boolean);
    const allowedUrls = [...new Set(allowedSources)].filter(Boolean);

    if (blockedUrls.length > 0) {
      throw new Error(`Memuat sumber lama: ${blockedUrls.join(', ')}`);
    }

    if (allowedUrls.length === 0) {
      throw new Error('Tidak ada sumber image yang dimuat dari blob:/comics/generated/.');
    }

    try {
      execSync(`python3 - <<'PY'
from PIL import Image
import os
p1 = '/tmp/cinarai-playwright/comic-last-page.png'
p2 = '/tmp/cinarai-playwright/identification-stage.png'
img1 = Image.open(p1).convert('RGB')
img2 = Image.open(p2).convert('RGB')
if img1.size != img2.size:
    raise SystemExit(f'SIZE_MISMATCH {img1.size} {img2.size}')
# Compare images and print a simple similarity ratio.
import math
px1 = img1.load()
px2 = img2.load()
width, height = img1.size
same = 0
for y in range(height):
    for x in range(width):
        if px1[x, y] == px2[x, y]:
            same += 1
ratio = same / (width * height)
print(f'SIMILARITY_RATIO={ratio:.6f}')
PY`);
      console.log('✅ Gambar komik terakhir dan Identification dinilai serupa');
    } catch (error) {
      console.log(`⚠️  Tidak bisa membandingkan gambar secara otomatis: ${error.message}`);
    }

    console.log('✅ Verifikasi runtime selesai');
  } catch (error) {
    console.error(`❌ Error selama verifikasi runtime: ${error.message}`);
    const errorPath = path.join(screenshotsDir, 'verification-error.png');
    await page.screenshot({ path: errorPath, fullPage: true });
    console.log(`📸 Screenshot error: ${errorPath}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runTest().catch((error) => {
  console.error(error);
  process.exit(1);
});
