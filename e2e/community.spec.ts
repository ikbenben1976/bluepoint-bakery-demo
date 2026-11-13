import { expect, test } from "@playwright/test";

test("Community layout is balanced, readable, and fits desktop, tablet, and phone widths", async ({ page }, testInfo) => {
  for (const width of [375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/community/");
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole("heading", { level: 1, name: "Good baking. Good neighbors." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Project Angel Heart" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "2016 Outstanding Small Business" })).toHaveCount(1);
    await expect(page.locator("#recognition")).toBeVisible();
    const cards = page.locator('ul[class*="community_partnerGrid"] > li');
    await expect(cards).toHaveCount(4);

    const metrics = await page.evaluate(() => {
      const grid = document.querySelector<HTMLElement>('ul[class*="community_partnerGrid"]')!;
      const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;
      const wells = [...document.querySelectorAll<HTMLElement>('[class*="community_partnerLogo"]')];
      const wellHeights = wells.map((well) => Math.round(well.getBoundingClientRect().height));
      const link = document.querySelector<HTMLElement>('a[class*="community_externalLink"]')!;
      const linkStyle = getComputedStyle(link);
      const photo = document.querySelector<HTMLImageElement>('figure[class*="community_featurePhoto"] img')!;
      const photoBox = photo.getBoundingClientRect();
      const body = document.querySelector<HTMLElement>('[class*="community_partnerBody"] p:not([class])')!;
      const bodyStyle = getComputedStyle(body);
      const headings = [...document.querySelectorAll<HTMLElement>("main h1, main h2, main h3, [class*='community_eyebrow'], [class*='community_partnerCategory']")];
      const headingAlign = headings.map((el) => getComputedStyle(el).textAlign);
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        columns: cols,
        wellHeights,
        linkBg: linkStyle.backgroundColor,
        linkDecoration: linkStyle.textDecorationLine,
        linkHeight: link.getBoundingClientRect().height,
        photoRatio: photoBox.width > 0 ? photoBox.height / photoBox.width : 0,
        naturalRatio: photo.naturalWidth > 0 ? photo.naturalHeight / photo.naturalWidth : 0,
        bodySize: parseFloat(bodyStyle.fontSize),
        bodyLine: parseFloat(bodyStyle.lineHeight),
        headingAlign,
      };
    });

    expect(metrics.overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    expect(metrics.columns, `partner columns at ${width}px`).toBe(width >= 1024 ? 2 : 1);
    expect(new Set(metrics.wellHeights).size, `even logo wells at ${width}px`).toBe(1);
    expect(metrics.wellHeights[0], `logo well height at ${width}px`).toBeGreaterThanOrEqual(120);
    expect(metrics.linkDecoration, `button links at ${width}px`).toBe("none");
    expect(metrics.linkBg, `button fill at ${width}px`).toBe("rgb(32, 53, 232)");
    expect(metrics.linkHeight, `button hit area at ${width}px`).toBeGreaterThanOrEqual(44);
    expect(metrics.naturalRatio, `pie photo loaded at ${width}px`).toBeGreaterThan(0);
    expect(
      Math.abs(metrics.photoRatio - metrics.naturalRatio) / metrics.naturalRatio,
      `full pie photo at ${width}px`,
    ).toBeLessThan(0.08);
    expect(metrics.bodySize, `body size at ${width}px`).toBeGreaterThanOrEqual(18);
    expect(metrics.bodyLine / metrics.bodySize, `body leading at ${width}px`).toBeGreaterThanOrEqual(1.6);
    if (width <= 430) {
      expect(metrics.headingAlign.every((align) => align === "center"), `centered headings at ${width}px`).toBe(true);
    }

    if (width === 390 || width === 768 || width === 1440) {
      await page.screenshot({
        path: testInfo.outputPath(`community-${width}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }
  }
});
