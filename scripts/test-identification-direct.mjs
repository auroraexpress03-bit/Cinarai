import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = '/workspaces/Cinarai/test-screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runTest() {
  console.log('\n🚀 Direct Identification Stage Test\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const networkRequests = [];

  page.on('request', (request) => {
    const url = request.url();
    networkRequests.push({
      url,
      resourceType: request.resourceType(),
    });
  });

  try {
    // ═══════════════════════════════════════════════════════════════════
    // STEP 1: Navigate directly to observasi/1
    // ═══════════════════════════════════════════════════════════════════
    console.log('📍 STEP 1: Navigate directly to Observasi (Identification) Stage for Comic 1');
    console.log(`   URL: ${BASE_URL}/observasi/1`);
    
    await page.goto(`${BASE_URL}/observasi/1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Handle auth redirect if necessary
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);

    if (currentUrl.includes('/auth/login')) {
      console.log('   🔐 Redirected to login, filling form...');
      
      const emailFields = await page.$$('input[type="email"]');
      const passwordFields = await page.$$('input[type="password"]');

      if (emailFields.length > 0) await emailFields[0].fill('test@example.com');
      if (passwordFields.length > 0) await passwordFields[0].fill('password123');

      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await button.textContent();
        if (text && (text.includes('Login') || text.includes('Masuk'))) {
          await button.click();
          break;
        }
      }

      await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
      await page.waitForTimeout(2000);
    }

    console.log('   ✅ Loaded\n');

    // ═══════════════════════════════════════════════════════════════════
    // STEP 2: Capture screenshot
    // ═══════════════════════════════════════════════════════════════════
    console.log('📍 STEP 2: Capture Identification page screenshot');
    
    const screenshot = path.join(SCREENSHOTS_DIR, 'identification-page.png');
    await page.screenshot({ path: screenshot, fullPage: true });
    console.log(`   📸 Screenshot saved: ${screenshot}`);
    console.log('   ✅ Captured\n');

    // ═══════════════════════════════════════════════════════════════════
    // STEP 3: Analyze images on page
    // ═══════════════════════════════════════════════════════════════════
    console.log('📍 STEP 3: Analyze images on Identification page\n');

    const images = await page.$$eval('img', (imgs) =>
      imgs.map((img) => ({
        src: img.src || img.getAttribute('src') || '(no src)',
        alt: img.alt || '(no alt)',
        width: img.width,
        height: img.height,
      }))
    );

    console.log(`   Found ${images.length} images:`);
    images.forEach((img, idx) => {
      const srcDisplay = img.src.length > 80 ? img.src.substring(0, 80) + '...' : img.src;
      console.log(`\n   ${idx + 1}. src: ${srcDisplay}`);
      console.log(`      alt: ${img.alt}`);
      if (img.width > 0 && img.height > 0) {
        console.log(`      size: ${img.width}x${img.height}px`);
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // STEP 4: Analyze image sources
    // ═══════════════════════════════════════════════════════════════════
    console.log('\n📍 STEP 4: Analyze image source types\n');

    const blobImages = images.filter((img) => img.src.startsWith('blob:'));
    const generatedImages = images.filter((img) => img.src.includes('/comics/generated/'));
    const nextImageImages = images.filter((img) => img.src.includes('_next/image'));
    const oldAssetImages = images.filter(
      (img) => img.src.includes('/images/identification/') || img.src.includes('/assets/identification/')
    );

    console.log(`   Image Source Breakdown:`);
    console.log(`   • Blob URLs (Runtime PDF): ${blobImages.length}`);
    console.log(`   • Generated PNGs: ${generatedImages.length}`);
    console.log(`   • Next Image URLs: ${nextImageImages.length}`);
    console.log(`   • Old Static Assets: ${oldAssetImages.length}`);

    if (generatedImages.length > 0) {
      console.log(`\n   Generated images:`);
      generatedImages.forEach((img) => {
        const srcDisplay = img.src.length > 100 ? img.src.substring(0, 100) + '...' : img.src;
        console.log(`   - ${srcDisplay}`);
      });
    }

    if (blobImages.length > 0) {
      console.log(`\n   Blob images (runtime PDF rendering):`);
      blobImages.slice(0, 3).forEach((img) => {
        console.log(`   - ${img.src.substring(0, 60)}...`);
      });
    }

    if (oldAssetImages.length > 0) {
      console.log(`\n   ❌ OLD STATIC ASSETS (SHOULD NOT EXIST):`);
      oldAssetImages.forEach((img) => {
        console.log(`   - ${img.src}`);
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // STEP 5: Analyze network requests
    // ═══════════════════════════════════════════════════════════════════
    console.log('\n📍 STEP 5: Analyze network requests\n');

    const imageRequests = networkRequests.filter(
      (req) =>
        req.resourceType === 'image' ||
        req.url.includes('.png') ||
        req.url.includes('.jpg') ||
        req.url.includes('.jpeg') ||
        req.url.includes('.svg')
    );

    const identificationOldRequests = imageRequests.filter(
      (req) => req.url.includes('/images/identification/') || req.url.includes('/assets/identification/')
    );

    const generatedRequests = imageRequests.filter(
      (req) => req.url.includes('/comics/generated/')
    );

    console.log(`   Image Network Requests:`);
    console.log(`   • Total: ${imageRequests.length}`);
    console.log(`   • Generated PNGs: ${generatedRequests.length}`);
    console.log(`   • Old Assets: ${identificationOldRequests.length}`);

    if (identificationOldRequests.length > 0) {
      console.log(`\n   ❌ OLD ASSET REQUESTS (SHOULD NOT EXIST):`);
      identificationOldRequests.forEach((req) => {
        console.log(`   - ${req.url.substring(0, 100)}`);
      });
    }

    if (generatedRequests.length > 0) {
      console.log(`\n   ✅ GENERATED PNG REQUESTS:`);
      generatedRequests.slice(0, 5).forEach((req) => {
        console.log(`   - ${req.url.substring(0, 100)}`);
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // STEP 6: Test Result
    // ═══════════════════════════════════════════════════════════════════
    console.log('\n📍 STEP 6: Test Result\n');

    const hasNewAssets = blobImages.length > 0 || generatedImages.length > 0;
    const hasOldAssets = oldAssetImages.length > 0;
    const hasOldNetworkRequests = identificationOldRequests.length > 0;
    const hasGeneratedOrBlob = (blobImages.length > 0 || generatedRequests.length > 0);

    let testPassed = hasNewAssets && !hasOldAssets && !hasOldNetworkRequests;

    console.log('   Verification Criteria:');
    console.log(`   ${hasNewAssets ? '✅' : '❌'} Using new assets (blob OR /comics/generated/)`);
    console.log(`   ${!hasOldAssets ? '✅' : '❌'} No old /images/identification/ in page`);
    console.log(`   ${!hasOldNetworkRequests ? '✅' : '❌'} No old asset network requests`);
    console.log(`   ${hasGeneratedOrBlob ? '✅' : '❌'} Either blob URLs or generated PNGs loaded`);

    console.log(`\n   ${testPassed ? '✅ TEST PASSED' : '❌ TEST FAILED'}\n`);

    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      testUrl: `${BASE_URL}/observasi/1`,
      finalUrl: page.url(),
      testPassed,
      imageSources: {
        blob: blobImages.length,
        generated: generatedImages.length,
        nextImage: nextImageImages.length,
        oldAssets: oldAssetImages.length,
      },
      networkRequests: {
        total: imageRequests.length,
        generated: generatedRequests.length,
        oldAssets: identificationOldRequests.length,
      },
      generatedImageUrls: generatedImages.map((img) => img.src),
      blobImageUrls: blobImages.slice(0, 3).map((img) => img.src),
      oldAssetUrls: oldAssetImages.map((img) => img.src),
      screenshots: {
        identification: screenshot,
      },
    };

    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'test-report.json'),
      JSON.stringify(report, null, 2)
    );

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
