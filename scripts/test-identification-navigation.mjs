import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = '/workspaces/Cinarai/test-screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runTest() {
  console.log('\n🚀 Identification Stage Navigation Test\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const networkRequests = [];

  page.on('request', (request) => {
    networkRequests.push({
      url: request.url(),
      resourceType: request.resourceType(),
    });
  });

  try {
    // ═══════════════════════════════════════════════════════════════════
    // STEP 1: Navigate to Comic 1 Learning Flow
    // ═══════════════════════════════════════════════════════════════════
    console.log('📍 STEP 1: Navigate to Comic 1 Learning Flow');
    console.log(`   URL: ${BASE_URL}/comic/1/learn`);
    
    await page.goto(`${BASE_URL}/comic/1/learn`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}\n`);

    // ═══════════════════════════════════════════════════════════════════
    // STEP 2: Detect current stage and navigate to Identification
    // ═══════════════════════════════════════════════════════════════════
    console.log('📍 STEP 2: Detect current stage and navigate');

    let stageNavigationAttempts = 0;
    let currentStage = '';

    while (stageNavigationAttempts < 10) {
      // Check page heading or content to identify stage
      const stageHeading = await page.textContent('h1, h2, [class*="stage"], [class*="title"]').catch(() => '');
      console.log(`   Attempt ${stageNavigationAttempts + 1}: Current content: "${stageHeading?.substring(0, 60)}..."`);

      if (stageHeading?.includes('Identifikasi') || stageHeading?.includes('Identification')) {
        console.log('   ✅ Found Identification stage!');
        currentStage = 'Identification';
        break;
      }

      if (stageHeading?.includes('Baca') || stageHeading?.includes('Read')) {
        console.log('   Reading stage detected, moving forward...');
      } else if (stageHeading?.includes('Navigasi')) {
        console.log('   Navigation stage detected, moving backward...');
        // Try to go back to find Identification
        const backButton = await page.$('button:has-text("←"), button:has-text("Back"), [aria-label*="back"]').catch(() => null);
        if (backButton) {
          await backButton.click();
          await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
          await page.waitForTimeout(1500);
          stageNavigationAttempts++;
          continue;
        }
      }

      // Find and click the next/continue button
      const buttons = await page.$$('button, a[role="button"]');
      let foundNext = false;

      for (const btn of buttons) {
        const text = await btn.textContent();
        const ariaLabel = await btn.getAttribute('aria-label');
        
        if (
          (text && (text.includes('Lanjut') || text.includes('Next') || text.includes('→'))) ||
          (ariaLabel && ariaLabel.toLowerCase().includes('next'))
        ) {
          console.log(`   Clicking: "${text?.substring(0, 40)}..."`);
          await btn.click();
          foundNext = true;
          break;
        }
      }

      if (!foundNext) {
        console.log('   ⚠️  No next button found');
        break;
      }

      await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
      await page.waitForTimeout(1500);
      stageNavigationAttempts++;
    }

    if (currentStage !== 'Identification') {
      // Try direct navigation via stage nav if available
      console.log('\n   🔍 Looking for stage navigation menu...');
      const stageButtons = await page.$$('[class*="stage"], [class*="Stage"], button[class*="nav"]');
      
      for (const btn of stageButtons) {
        const text = await btn.textContent();
        if (text?.includes('Identifikasi') || text?.includes('3')) {
          console.log(`   Found stage button: "${text?.substring(0, 40)}"`);
          await btn.click();
          await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
          await page.waitForTimeout(2000);
          currentStage = 'Identification';
          break;
        }
      }
    }

    console.log(`   Current stage: ${currentStage || 'Unknown'}\n`);

    // ═══════════════════════════════════════════════════════════════════
    // STEP 3: Scroll to ensure images load
    // ═══════════════════════════════════════════════════════════════════
    console.log('📍 STEP 3: Scroll page to ensure images load');
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(1000);
    
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, 400);
      });
      await page.waitForTimeout(300);
    }
    console.log('   ✅ Scrolled\n');

    // ═══════════════════════════════════════════════════════════════════
    // STEP 4: Capture screenshot
    // ═══════════════════════════════════════════════════════════════════
    console.log('📍 STEP 4: Capture page screenshot');
    const screenshot = path.join(SCREENSHOTS_DIR, 'identification-page.png');
    await page.screenshot({ path: screenshot, fullPage: true });
    console.log(`   📸 Screenshot: ${screenshot}\n`);

    // ═══════════════════════════════════════════════════════════════════
    // STEP 5: Analyze images
    // ═══════════════════════════════════════════════════════════════════
    console.log('📍 STEP 5: Analyze images on page\n');

    const images = await page.$$eval('img', (imgs) =>
      imgs
        .filter((img) => img.naturalWidth > 0 && img.naturalHeight > 0) // Only loaded images
        .map((img) => ({
          src: img.src || img.getAttribute('src') || '(no src)',
          alt: img.alt || '(no alt)',
          width: img.width,
          height: img.height,
        }))
    );

    console.log(`   Found ${images.length} loaded images`);

    if (images.length === 0) {
      console.log('   ⚠️  No images found on page');
      console.log('   Trying to find img elements (even if not loaded)...');
      
      const allImages = await page.$$('img');
      console.log(`   Total img elements: ${allImages.length}`);
      
      for (let i = 0; i < Math.min(5, allImages.length); i++) {
        const src = await allImages[i].getAttribute('src');
        const alt = await allImages[i].getAttribute('alt');
        console.log(`      ${i + 1}. src: ${src?.substring(0, 80) || '(empty)'}`);
        console.log(`         alt: ${alt || '(empty)'}`);
      }
    } else {
      images.forEach((img, idx) => {
        const srcDisplay = img.src.length > 80 ? img.src.substring(0, 80) + '...' : img.src;
        console.log(`\n   ${idx + 1}. ${srcDisplay}`);
        console.log(`      alt: ${img.alt}`);
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // STEP 6: Categorize image sources
    // ═══════════════════════════════════════════════════════════════════
    console.log('\n📍 STEP 6: Categorize image sources\n');

    const blobImages = images.filter((img) => img.src.startsWith('blob:'));
    const generatedImages = images.filter((img) => img.src.includes('/comics/generated/'));
    const nextImageImages = images.filter((img) => img.src.includes('_next/image'));
    const oldAssetImages = images.filter(
      (img) => img.src.includes('/images/identification/') || img.src.includes('/images/assets/')
    );

    console.log(`   Image Source Breakdown:`);
    console.log(`   • Blob URLs (Runtime PDF): ${blobImages.length}`);
    console.log(`   • Generated PNGs: ${generatedImages.length}`);
    console.log(`   • Next Image URLs: ${nextImageImages.length}`);
    console.log(`   • Old Static Assets: ${oldAssetImages.length}`);

    if (generatedImages.length > 0) {
      console.log(`\n   ✅ Generated images found:`);
      generatedImages.forEach((img) => {
        console.log(`   - ${img.src.substring(0, 100)}`);
      });
    }

    if (blobImages.length > 0) {
      console.log(`\n   ✅ Blob URLs found (runtime PDF rendering):`);
      blobImages.slice(0, 2).forEach((img) => {
        console.log(`   - ${img.src.substring(0, 60)}...`);
      });
    }

    if (oldAssetImages.length > 0) {
      console.log(`\n   ❌ OLD STATIC ASSETS FOUND (SHOULD NOT EXIST!):`);
      oldAssetImages.forEach((img) => {
        console.log(`   - ${img.src}`);
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // STEP 7: Analyze network requests
    // ═══════════════════════════════════════════════════════════════════
    console.log('\n📍 STEP 7: Analyze network requests\n');

    const imageRequests = networkRequests.filter(
      (req) =>
        req.resourceType === 'image' ||
        req.url.includes('.png') ||
        req.url.includes('.jpg') ||
        req.url.includes('.jpeg')
    );

    const generatedRequests = imageRequests.filter((req) => req.url.includes('/comics/generated/'));
    const oldAssetRequests = imageRequests.filter(
      (req) => req.url.includes('/images/identification/') || req.url.includes('/assets/identification/')
    );

    console.log(`   Network Image Requests:`);
    console.log(`   • Total: ${imageRequests.length}`);
    console.log(`   • Generated PNGs: ${generatedRequests.length}`);
    console.log(`   • Old Assets: ${oldAssetRequests.length}`);

    if (generatedRequests.length > 0) {
      console.log(`\n   ✅ Generated PNG requests:`);
      generatedRequests.slice(0, 3).forEach((req) => {
        console.log(`   - ${req.url.substring(0, 100)}`);
      });
    }

    if (oldAssetRequests.length > 0) {
      console.log(`\n   ❌ OLD ASSET REQUESTS (SHOULD NOT EXIST!):`);
      oldAssetRequests.forEach((req) => {
        console.log(`   - ${req.url}`);
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // STEP 8: Test Result
    // ═══════════════════════════════════════════════════════════════════
    console.log('\n📍 STEP 8: Test Result\n');

    const hasNewAssets = blobImages.length > 0 || generatedImages.length > 0;
    const hasOldAssets = oldAssetImages.length > 0;
    const hasOldNetworkRequests = oldAssetRequests.length > 0;

    let testPassed = hasNewAssets && !hasOldAssets && !hasOldNetworkRequests;

    console.log('   Verification Criteria:');
    console.log(`   ${hasNewAssets ? '✅' : '❌'} Using new assets (blob OR /comics/generated/)`);
    console.log(`   ${!hasOldAssets ? '✅' : '❌'} No old /images/identification/ in page`);
    console.log(`   ${!hasOldNetworkRequests ? '✅' : '❌'} No old asset network requests`);

    console.log(`\n   ${testPassed ? '✅ TEST PASSED' : '❌ TEST FAILED'}\n`);

    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      currentStage,
      testPassed,
      images: {
        blob: blobImages.length,
        generated: generatedImages.length,
        nextImage: nextImageImages.length,
        oldAssets: oldAssetImages.length,
      },
      networkRequests: {
        total: imageRequests.length,
        generated: generatedRequests.length,
        oldAssets: oldAssetRequests.length,
      },
      generatedImageUrls: generatedImages.map((img) => img.src),
      blobImageUrls: blobImages.map((img) => img.src),
      oldAssetUrls: oldAssetImages.map((img) => img.src),
      screenshots: { identification: screenshot },
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
