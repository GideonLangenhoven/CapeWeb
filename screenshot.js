const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Wait for animations

    await page.screenshot({
      path: 'homepage-layout.png',
      fullPage: true
    });

    console.log('Screenshot saved as homepage-layout.png');

    // Also capture just the hero section
    const hero = await page.locator('section').first();
    if (hero) {
      await hero.screenshot({ path: 'hero-section.png' });
      console.log('Hero section screenshot saved as hero-section.png');
    }

  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
})();