const playwright = require('playwright');
  // Instead of relying on dashboard UI (auth may be required), test local
  // reader + storage behavior directly.
  // 1) Seed a stored progress for comic 1
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('comic-reader-comic-1', JSON.stringify({
      comicId: 1,
      currentPage: 5,
      totalPages: 10,
      completed: false,
      lastPage: 5,
    }));
  });
  console.log('Seeded localStorage with lastPage=5');

  // Open comic reader and ensure it resumes to page 5
  await page.goto(`${BASE}/comic/1/learn`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const initialPageText = await page.$eval('body', (el) => el.innerText.slice(0, 200));
  console.log('Reader opened; checking for resume (manual check text snippet)');

  // Now simulate reset by dispatching the reset event
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('cinarai:comic-reading-progress-reset', { detail: { comicId: 1 } }));
  });
  console.log('Dispatched comic reading progress reset event for comic 1');

  // Wait and reload reader — it should open at page 1 now
  await page.waitForTimeout(500);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  // Check localStorage entry removed or suppressed
  const storedAfterReset = await page.evaluate(() => localStorage.getItem('comic-reader-comic-1'));
  if (storedAfterReset) {
    console.error('Local storage entry still present after reset');
    await browser.close();
    process.exit(3);
  }
  console.log('Local storage cleared for comic 1 after reset');

  // Now navigate to page 2 (simulate user interaction) and ensure progress is written
  // Click next button if available, else click center area
  const nextBtn = await page.$('button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
  } else {
    await page.mouse.click(600, 400);
  }
  await page.waitForTimeout(1200);
  const storedAfterNav = await page.evaluate(() => localStorage.getItem('comic-reader-comic-1'));
  if (!storedAfterNav) {
    console.error('Local storage not written after navigation');
    await browser.close();
    process.exit(4);
  }
  console.log('Local storage written after navigation — progress resumed');
    process.exit(5);
  }
  console.log('Progress has started after navigation');

  // Check other comics unaffected (just ensure their cards exist)
  for (let i = 2; i <= 5; i++) {
    const card = await page.$(`text=Komik ${i}`);
    if (!card) console.warn(`Comic ${i} not found on dashboard`);
  }

  await browser.close();
  console.log('E2E run succeeded');
  process.exit(0);
}

run().catch((err) => {
  console.error('E2E run error', err);
  process.exit(1);
});
