import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
const email = process.env.TEST_EMAIL || 'demo@example.com';
const password = process.env.TEST_PASSWORD || 'password123';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const logs = [];

page.on('console', (msg) => {
  const text = msg.text();
  if (text.includes('[progress-write]') || text.includes('[reading-progress]') || text.includes('[learning-engine]') || text.includes('[pdf-reader]') || text.includes('[contextualization-stage]') || text.includes('[use-identification]')) {
    logs.push(`[console] ${msg.type()}: ${text}`);
  }
});

page.on('pageerror', (error) => {
  logs.push(`[pageerror] ${error.message}`);
});

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

console.log('Opened', baseUrl);

const debugReady = await page.evaluate(() => Boolean(window.__cinaraiDebug?.resetComicProgress));
console.log('Debug hooks ready', debugReady);

if (debugReady) {
  await page.evaluate(async () => {
    const reset = window.__cinaraiDebug.resetComicProgress;
    if (reset) {
      await reset('debug-user', 1);
    }
  });
  await page.waitForTimeout(3000);
}

await page.goto(`${baseUrl}/comic/1/learn`, { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);

console.log('Captured logs:');
for (const entry of logs) {
  console.log(entry);
}

await browser.close();
