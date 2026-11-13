import { expect, test } from "@playwright/test";

test("Community redesign is readable and fits desktop, tablet, and phone widths", async ({ page }, testInfo) => {
  for (const width of [375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/community/");
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole("heading", { level: 1, name: "Good baking. Good neighbors." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Project Angel Heart" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "2016 Outstanding Small Business" })).toHaveCount(1);
    const cards = page.locator('ul[class*="community_partnerGrid"] > li');
    await expect(cards).toHaveCount(4);

    const metrics = await page.evaluate(() => {
      const grid = document.querySelector<HTMLElement>('ul[class*="community_partnerGrid"]')!;
      const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
      const photo = document.querySelector<HTMLImageElement>('figure[class*="community_featurePhoto"] img')!;
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        columns: cols,
        photoDisplayedWidth: photo.getBoundingClientRect().width,
        photoNaturalWidth: photo.naturalWidth,
      };
    });

    expect(metrics.overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    expect(metrics.columns, `partner grid columns at ${width}px`).toBe(width <= 690 ? 1 : 2);
    expect(metrics.photoDisplayedWidth, `photo not blown up at ${width}px`).toBeLessThanOrEqual(440);

    if (width === 390 || width === 1440) {
      await page.screenshot({
        path: testInfo.outputPath(`community-${width}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }
  }
});
