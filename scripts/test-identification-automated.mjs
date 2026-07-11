import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = '/workspaces/Cinarai/test-screenshots';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runTest() {
  console.log('\n🚀 Starting Automated Identification Verification Test\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const networkRequests = [];
  const networkErrors = [];

  // Track all network requests
  page.on('request', (request) => {
    const url = request.url();
    networkRequests.push({
      url,
      method: request.method(),
      resourceType: request.resourceType(),
      timestamp: new Date().toISOString(),
    });
  });

  page.on('requestfailed', (request) => {
    networkErrors.push({
      url: request.url(),
      error: request.failure().errorText,
      timestamp: new Date().toISOString(),
    });
  });

  try {
    // ═══════════════════════════════════════════════════════════════════════════════
    // STEP 1: Navigate to home page
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log('📍 STEP 1: Navigate to home page');
    console.log(`   URL: ${BASE_URL}`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    console.log('   ✅ Loaded\n');

    // Handle authentication redirect
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);

    if (currentUrl.includes('/auth/login')) {
      console.log('   🔐 Redirected to login page');
      console.log('   📝 Filling login form...');

      // Wait for login form
      await page.waitForSelector('input[type="email"]', { timeout: 5000 }).catch(() => null);
      await page.waitForSelector('input[type="password"]', { timeout: 5000 }).catch(() => null);

      // Try to fill and submit
      const emailFields = await page.$$('input[type="email"]');
      const passwordFields = await page.$$('input[type="password"]');

      if (emailFields.length > 0) {
        await emailFields[0].fill('test@example.com');
      }

      if (passwordFields.length > 0) {
        await passwordFields[0].fill('password123');
      }

      // Look for login button
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await button.textContent();
        if (text && (text.includes('Login') || text.includes('Masuk') || text.includes('Sign In'))) {
          await button.click();
          break;
        }
      }

      // Wait for navigation or dashboard
      await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
      await page.waitForTimeout(2000);
    }

    console.log(`   ✅ Authentication handled\n`);

    // ═══════════════════════════════════════════════════════════════════════════════
    // STEP 2: Navigate to Comic 1
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log('📍 STEP 2: Navigate to Comic 1');
    console.log(`   URL: ${BASE_URL}/comic/1`);
    await page.goto(`${BASE_URL}/comic/1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Take screenshot of comic cover/page
    const comicPageScreenshot = path.join(SCREENSHOTS_DIR, '01-comic-page.png');
    await page.screenshot({ path: comicPageScreenshot, fullPage: true });
    console.log(`   📸 Screenshot: ${comicPageScreenshot}`);
    console.log('   ✅ Loaded\n');

    // ═══════════════════════════════════════════════════════════════════════════════
    // STEP 3: Enter "Baca Komik" stage from learning journey
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log('📍 STEP 3: Find and click "Baca Komik" stage');

    // On learning journey page, click the "Baca Komik" stage
    let foundBacaKomik = false;
    const stageButtons = await page.$$('button, a, [role="button"]');

    for (const btn of stageButtons) {
      const text = await btn.textContent();
      if (text && text.toLowerCase().includes('baca komik')) {
        console.log(`   Found: "${text?.trim()}"`);
        await btn.click();
        foundBacaKomik = true;
        break;
      }
    }

    if (!foundBacaKomik) {
      // Try clicking on the "2" or "Baca Komik" sidebar item
      const numberTwo = await page.$('text=2');
      if (numberTwo) {
        console.log('   Found stage 2 button');
        await numberTwo.click();
        foundBacaKomik = true;
      }
    }

    if (foundBacaKomik) {
      await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
      await page.waitForTimeout(3000);
    } else {
      console.log('   ⚠️  Could not find Baca Komik button, continuing...');
    }

    console.log('   ✅ Entered reading mode\n');

    // ═══════════════════════════════════════════════════════════════════════════════
    // STEP 4: Scroll through comic PDF and finish
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log('📍 STEP 4: Scroll through comic and find "Selesai Membaca" button');

    // Wait for PDF or comic content to load
    await page.waitForTimeout(2000);

    // Look for PDF viewer or comic container
    const pdfContainer = await page.$('.react-pdf__Page, [class*="pdf"], [class*="viewer"], canvas').catch(() => null);

    if (pdfContainer) {
      console.log('   Found PDF/comic container, scrolling...');
      // Scroll down to load more pages
      for (let i = 0; i < 8; i++) {
        await page.evaluate(() => {
          window.scrollBy(0, 600);
        });
        await page.waitForTimeout(300);
      }
    }

    console.log('   Scrolled through comic pages');

    // Find "Selesai Membaca" or "Finished Reading" or "Lanjut" button
    let finishButton = null;
    const allButtons = await page.$$('button, a[role="button"]');

    for (const btn of allButtons) {
      const text = await btn.textContent();
      if (
        text &&
        (text.toLowerCase().includes('selesai') ||
          text.toLowerCase().includes('finished') ||
          text.toLowerCase().includes('done') ||
          text.toLowerCase().includes('lanjut'))
      ) {
        finishButton = btn;
        console.log(`   Found button: "${text?.trim()}"`);
        break;
      }
    }

    if (finishButton) {
      console.log('   Clicking button to continue...');
      await finishButton.click();
      await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
      await page.waitForTimeout(2000);
    } else {
      console.log('   ⚠️  Continue button not found, waiting for page transition');
      await page.waitForTimeout(3000);
    }

    console.log('   ✅ Finished reading/stage transition\n');

    // ═══════════════════════════════════════════════════════════════════════════════
    // STEP 5: Navigate to Identification stage
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log('📍 STEP 5: Navigate to Identification stage');
    console.log(`   Current URL: ${page.url()}`);

    // If not in identification, find and click the "Identifikasi" stage button
    if (!page.url().includes('identification') && !page.url().includes('observasi')) {
      console.log('   🔍 Looking for Identifikasi stage button...');

      // Try to find stage number 3 or "Identifikasi" button
      const stageButtons = await page.$$('button, a, [role="button"], li');
      let foundIdentifikasi = false;

      for (const btn of stageButtons) {
        const text = await btn.textContent();
        if (text && (text.toLowerCase().includes('identifikasi') || text.includes('3'))) {
          console.log(`   Found: "${text?.trim()}"`);
          await btn.click();
          foundIdentifikasi = true;
          break;
        }
      }

      if (foundIdentifikasi) {
        await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
        await page.waitForTimeout(2000);
      } else {
        console.log('   ⚠️  Could not find Identifikasi button');
      }
    }

    console.log(`   Final URL: ${page.url()}`);
    console.log('   ✅ Navigated to Identification\n');

    // ═══════════════════════════════════════════════════════════════════════════════
    // STEP 6: Take screenshot of Identification page
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log('📍 STEP 6: Capture Identification page screenshot');
    await page.waitForTimeout(2000);

    const identPageScreenshot = path.join(SCREENSHOTS_DIR, '02-identification-page.png');
    await page.screenshot({ path: identPageScreenshot, fullPage: true });
    console.log(`   📸 Screenshot: ${identPageScreenshot}`);
    console.log('   ✅ Captured\n');

    // ═══════════════════════════════════════════════════════════════════════════════
    // STEP 7: Analyze image sources
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log('📍 STEP 7: Analyze image sources on Identification page\n');

    const images = await page.$$eval('img', (imgs) =>
      imgs.map((img) => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }))
    );

    console.log('   Images found on Identification page:');
    images.forEach((img, idx) => {
      console.log(`   ${idx + 1}. src: ${img.src.substring(0, 100)}${img.src.length > 100 ? '...' : ''}`);
      console.log(`      alt: ${img.alt}`);
      if (img.width > 0 && img.height > 0) {
        console.log(`      dimensions: ${img.width}x${img.height}`);
      }
    });

    // Check for blob URLs or generated images
    const blobImages = images.filter((img) => img.src.startsWith('blob:'));
    const generatedImages = images.filter((img) => img.src.includes('/comics/generated/'));
    const oldAssetImages = images.filter(
      (img) =>
        img.src.includes('/images/identification/') ||
        img.src.includes('/images/assets/identification/')
    );

    console.log(`\n   📊 Image Source Breakdown:`);
    console.log(`      Blob URLs (Runtime PDF): ${blobImages.length}`);
    console.log(`      Generated PNGs: ${generatedImages.length}`);
    console.log(`      Old Static Assets: ${oldAssetImages.length}`);

    if (oldAssetImages.length > 0) {
      console.log(`\n   ❌ ERROR: Found old static assets!`);
      oldAssetImages.forEach((img) => {
        console.log(`      - ${img.src}`);
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // STEP 8: Analyze network requests
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log('\n📍 STEP 8: Analyze network requests\n');

    const imageRequests = networkRequests.filter(
      (req) =>
        req.resourceType === 'image' ||
        req.url.includes('.png') ||
        req.url.includes('.jpg') ||
        req.url.includes('.jpeg')
    );

    const invalidAssetRequests = imageRequests.filter(
      (req) =>
        req.url.includes('/images/identification/') ||
        req.url.includes('/images/assets/identification/')
    );

    const generatedAssetRequests = imageRequests.filter(
      (req) =>
        req.url.includes('/comics/generated/') ||
        req.url.startsWith('blob:')
    );

    console.log(`   📡 Image Network Requests:`);
    console.log(`      Total: ${imageRequests.length}`);
    console.log(`      Generated/Blob: ${generatedAssetRequests.length}`);
    console.log(`      Old Assets: ${invalidAssetRequests.length}`);

    if (generatedAssetRequests.length > 0) {
      console.log(`\n   ✅ Correct sources found:`);
      generatedAssetRequests.slice(0, 5).forEach((req) => {
        console.log(`      - ${req.url.substring(0, 80)}${req.url.length > 80 ? '...' : ''}`);
      });
    }

    if (invalidAssetRequests.length > 0) {
      console.log(`\n   ❌ Invalid old assets requested:`);
      invalidAssetRequests.forEach((req) => {
        console.log(`      - ${req.url}`);
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // STEP 9: Determine test result
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log('\n📍 STEP 9: Test Result\n');

    const hasNewAssets = blobImages.length > 0 || generatedImages.length > 0;
    const hasOldAssets = oldAssetImages.length > 0;
    const hasOldNetworkRequests = invalidAssetRequests.length > 0;

    let testPassed = hasNewAssets && !hasOldAssets && !hasOldNetworkRequests;

    console.log('   Criteria:');
    console.log(`      ${hasNewAssets ? '✅' : '❌'} Using new assets (blob URL or /comics/generated/)`);
    console.log(`      ${!hasOldAssets ? '✅' : '❌'} NOT using old /images/identification/ assets`);
    console.log(`      ${!hasOldNetworkRequests ? '✅' : '❌'} No old asset network requests`);
    console.log(`      ${blobImages.length > 0 ? '✅' : '⚠️ '} Blob URLs present (runtime rendering)`);
    console.log(`      ${generatedImages.length > 0 ? '✅' : '⚠️ '} Generated PNGs present (build-time fallback)`);

    console.log(`\n   Result: ${testPassed ? '✅ PASSED' : '❌ FAILED'}\n`);

    // ═══════════════════════════════════════════════════════════════════════════════
    // Generate test report
    // ═══════════════════════════════════════════════════════════════════════════════
    const reportPath = path.join(SCREENSHOTS_DIR, 'test-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      testUrl: BASE_URL,
      currentUrl: page.url(),
      passed: testPassed,
      details: {
        images: {
          total: images.length,
          blobUrls: blobImages.length,
          generatedPngs: generatedImages.length,
          oldAssets: oldAssetImages.length,
        },
        networkRequests: {
          totalImageRequests: imageRequests.length,
          correctSources: generatedAssetRequests.length,
          invalidOldAssets: invalidAssetRequests.length,
        },
        screenshots: {
          comic: comicPageScreenshot,
          identification: identPageScreenshot,
        },
      },
      errors: networkErrors,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Test report saved: ${reportPath}\n`);

    // Exit with code based on test result
    process.exit(testPassed ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Test Error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
