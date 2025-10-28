import { test, expect } from '@playwright/test';

test.describe('Navbar visual treatment', () => {
  test('navbar fills on scroll and highlights selected tabs', async ({ page }) => {
    await page.goto('/');

    const navbar = page.locator('.navbar-mainbg');
    await expect(navbar).toBeVisible();
    await expect(navbar).toHaveCSS('background-color', 'rgb(86, 100, 217)');

    await expect(page.locator('.nav-item.is-active')).toHaveCount(0);

    const selector = page.locator('.hori-selector');
    await expect(selector).toHaveCSS('opacity', '0');

    await page.locator('.navbar-nav .nav-link', { hasText: 'Services' }).first().click();
    await expect(page).toHaveURL(/\/services$/);

    const activeNavItem = page.locator('.nav-item.is-active .nav-link');
    await expect(activeNavItem).toHaveText(/Services/i);
    await expect(activeNavItem).toHaveCSS('color', 'rgb(86, 100, 217)');

    await expect(selector).toHaveCSS('opacity', '1');
    await expect(selector).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    const [selectorBox, activeBox] = await Promise.all([
      selector.boundingBox(),
      page.locator('.nav-item.is-active').boundingBox()
    ]);

    expect(selectorBox).not.toBeNull();
    expect(activeBox).not.toBeNull();

    if (selectorBox && activeBox) {
      expect(Math.abs(selectorBox.x - activeBox.x)).toBeLessThanOrEqual(2);
      expect(Math.abs(selectorBox.width - activeBox.width)).toBeLessThanOrEqual(10);
      expect(Math.abs(selectorBox.height - activeBox.height)).toBeLessThanOrEqual(16);
    }
  });
});
