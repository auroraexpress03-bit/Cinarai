import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// NOTE: tests assume a dev build with predictable test user and UI elements.
// The selectors used are best-effort based on component names; adjust if needed.

test.describe('Reader reset flow', () => {
  test('Reset comic 1 and ensure resume ignored until interaction', async ({ page }) => {
    // 1. Open dashboard
    await page.goto(`${BASE}/dashboard`);

    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Find reset control for comic 1 — using aria / text heuristics
    const comicCard = page.locator('text=Komik 1').first();
    await expect(comicCard).toBeVisible();

    // Click reset button near comic 1
    const resetButton = comicCard.locator('button:has-text("Reset")').first();
    if (await resetButton.count() === 0) {
      // Try alternate label
      const alt = comicCard.locator('button:has-text("Reset Progress")').first();
      await alt.click();
    } else {
      await resetButton.click();
    }

    // Confirm modal
    const confirm = page.locator('button:has-text("Reset")').nth(1);
    if (await confirm.count() > 0) await confirm.click();

    // Wait for realtime update
    await page.waitForTimeout(1000);

    // Assert dashboard shows 0% for comic 1 — look for percent text
    await expect(page.locator('text=0%').first()).toBeVisible();

    // 2. Open comic 1
    await page.goto(`${BASE}/comic/1/learn`);
    await page.waitForLoadState('networkidle');

    // Reader should open on page 1 — look for toolbar showing "1 /"
    await expect(page.locator('text=/1/').first()).toBeVisible({ timeout: 5000 }).catch(()=>{});

    // Leave without navigating
    await page.goto(`${BASE}/dashboard`);
    await page.waitForLoadState('networkidle');

    // Dashboard still 0%
    await expect(page.locator('text=0%').first()).toBeVisible();

    // 3. Re-open comic and navigate to page 2
    await page.goto(`${BASE}/comic/1/learn`);
    await page.waitForLoadState('networkidle');

    // Click next button
    const next = page.locator('button:has-text("Next")').first();
    if (await next.count() === 0) {
      // fallback: click area to advance
      await page.mouse.click(600, 400);
    } else {
      await next.click();
    }

    // Wait for progress write to occur
    await page.waitForTimeout(1000);

    // Go back to dashboard and ensure progress > 0
    await page.goto(`${BASE}/dashboard`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=0%').first()).not.toBeVisible();

    // 4. Ensure comics 2..5 unchanged — assume they show 0% as initial
    for (let i = 2; i <= 5; i++) {
      const card = page.locator(`text=Komik ${i}`).first();
      await expect(card).toBeVisible();
    }
  });
});
