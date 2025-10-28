import { test, expect } from '@playwright/test';

test('third section is module-work and visible', async ({ page }) => {
  // Assumes app is running locally at default CRA port
  await page.goto('http://localhost:3000/');

  // Gather sections under main content (exclude header/footer)
  const sections = await page.locator('main section').all();
  expect(sections.length).toBeGreaterThan(2);

  // Third section (index 2) should be the module-work-section
  const third = sections[2];
  await expect(third).toHaveAttribute('id', 'work');
  await expect(third.locator('.module-work__grid')).toBeVisible();
  await expect(third.locator('.work-card')).toHaveCount(3);
});

