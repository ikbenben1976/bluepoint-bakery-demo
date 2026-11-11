import { expect, test } from "@playwright/test";

test("menu application actions share one horizontal baseline per desktop row", async ({ page }, testInfo) => {
  for (const width of [768, 1024, 1440, 1675]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const cards = [...document.querySelectorAll<HTMLElement>(".application-section .making-visual-link")];
      return cards.map(card => {
        const photo = card.querySelector<HTMLElement>(".making-photo")!.getBoundingClientRect();
        const cta = card.querySelector<HTMLElement>(".making-explore")!.getBoundingClientRect();
        const bounds = card.getBoundingClientRect();
        return {
          ctaTop: cta.top,
          ctaBottom: cta.bottom,
          photoTop: photo.top,
          photoBottom: photo.bottom,
          cardBottom: bounds.bottom,
          cardHeight: bounds.height,
        };
      });
    });
    expect(result).toHaveLength(4);
    for (const [left, right] of [[result[0], result[1]], [result[2], result[3]]]) {
      expect(Math.abs(left.ctaTop - right.ctaTop), `CTA baseline at ${width}px`).toBeLessThanOrEqual(1);
      expect(Math.abs(left.ctaBottom - right.ctaBottom), `CTA bottoms at ${width}px`).toBeLessThanOrEqual(1);
      expect(Math.abs(left.photoTop - right.photoTop), `image row tops at ${width}px`).toBeLessThanOrEqual(1);
      expect(Math.abs(left.photoBottom - right.photoBottom), `image row bottoms at ${width}px`).toBeLessThanOrEqual(1);
      expect(Math.abs(left.cardHeight - right.cardHeight), `equal-height cards at ${width}px`).toBeLessThanOrEqual(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
      `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    if (width === 1675) {
      await page.locator(".application-block").screenshot({
        path: testInfo.outputPath("menu-application-desktop-1675.png"),
        animations: "disabled",
      });
    }
  }
});

test("single-column phone application cards remain legible and not clipped", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const section = page.locator(".application-block");
  const positions = await section.locator(".making-visual-link").evaluateAll((cards) => cards.map(card => {
    const r = card.getBoundingClientRect();
    const cta = card.querySelector(".making-explore")!.getBoundingClientRect();
    return { left:r.left, right:r.right, ctaLeft:cta.left, ctaRight:cta.right, ctaBottom:cta.bottom, cardBottom:r.bottom };
  }));
  expect(positions).toHaveLength(4);
  for (const p of positions) {
    expect(p.ctaLeft).toBeGreaterThanOrEqual(p.left);
    expect(p.ctaRight).toBeLessThanOrEqual(p.right + 1);
    expect(p.ctaBottom).toBeLessThanOrEqual(p.cardBottom + 1);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await section.screenshot({ path: testInfo.outputPath("menu-application-mobile-390.png"), animations: "disabled" });
});
