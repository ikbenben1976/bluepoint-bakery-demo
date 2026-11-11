import { expect, test } from "@playwright/test";

test("homepage discovery sections have intentional desktop and mobile spacing", async ({ page }, testInfo) => {
  for (const [width, height] of [[1440, 900], [1024, 768], [768, 900], [390, 844], [375, 800]] as const) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const report = await page.evaluate(() => {
      const buttons = document.querySelector(".assortment-section .assortment-actions")!;
      const intro = document.querySelector(".application-block .section-intro")!;
      const actionRect = buttons.getBoundingClientRect();
      const introRect = intro.getBoundingClientRect();
      const assortment = document.querySelector<HTMLElement>(".assortment-section")!;
      const application = document.querySelector<HTMLElement>(".application-block")!;
      return {
        gap: introRect.top - actionRect.bottom,
        lowerPadding: getComputedStyle(assortment).paddingBottom,
        upperPadding: getComputedStyle(application).paddingTop,
        actionBottom: actionRect.bottom + window.scrollY,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    const expected = width >= 768 ? { min: 45, max: 65 } : { min: 30, max: 46 };
    expect(report.gap, `space between assortment and menu at ${width}px`).toBeGreaterThanOrEqual(expected.min);
    expect(report.gap, `space between assortment and menu at ${width}px`).toBeLessThanOrEqual(expected.max);
    expect(report.overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);

    if (width === 1440 || width === 390) {
      await page.evaluate((y) => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, y);
      }, Math.max(0, report.actionBottom - height * 0.46));
      await page.screenshot({
        path: testInfo.outputPath(`home-section-transition-${width}.png`),
        animations: "disabled",
      });
    }
  }
});
