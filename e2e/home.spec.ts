import { test, expect } from '@playwright/test';

test('third section is module-work and visible', async ({ page }) => {
  // Assumes app is running locally at default CRA port
  await page.goto('http://localhost:3000/');

  // Gather sections under main content (exclude header/footer)
  const sections = await page.locator('main section').all();
  expect(sections.length).toBeGreaterThan(4); // hero, problem, keyhole, ... , work

  // Find work section by ID instead of fixed index
  const work = await page.locator('main section#work');
  await expect(work).toBeVisible();
  await expect(work.locator('.module-work__grid')).toBeVisible();
  await expect(work.locator('.work-card')).toHaveCount(3);
});

