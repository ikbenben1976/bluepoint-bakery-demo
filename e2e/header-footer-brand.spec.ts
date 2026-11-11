import { expect, test } from "@playwright/test";

test("mobile footer ends near the legal text with no blank navy tail", async ({ page }, testInfo) => {
  for (const width of [375, 390, 430, 767]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const sizes = await page.evaluate(() => {
      const footer = document.querySelector<HTMLElement>(".site-footer")!;
      const last = document.querySelector<HTMLElement>(".footer-base .shell p:last-child")!;
      const foot = footer.getBoundingClientRect();
      const legal = last.getBoundingClientRect();
      return {
        blankTail: foot.bottom - legal.bottom,
        padding: parseFloat(getComputedStyle(footer).paddingBottom),
        scrollOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(sizes.padding, `no footer padding at ${width}px`).toBe(0);
    expect(sizes.blankTail, `legal text to footer bottom at ${width}px`).toBeGreaterThanOrEqual(8);
    expect(sizes.blankTail, `no oversized footer at ${width}px`).toBeLessThanOrEqual(38);
    expect(sizes.scrollOverflow).toBeLessThanOrEqual(1);

    if (width === 390) {
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
      await page.screenshot({ path: testInfo.outputPath("mobile-footer-390.png"), animations: "disabled" });
    }
  }
});

test("favicon uses SVG with transparent rounded corners, not old opaque PNG", async ({ page }) => {
  await page.goto("/");
  const icon = page.locator('link[rel="icon"][href*="icon.svg"]');
  await expect(icon.first()).toHaveCount(1);
  const response = await page.request.get("/icon.svg");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");
  const content = await response.text();
  expect(content).toContain('viewBox="0 0 64 64"');
  expect(content).toContain('rx="10" fill="#080c2b"');
  expect(content).not.toContain("rect fill=\"#fff\"");
});

test("desktop Bluepoint wordmark gets primary visual emphasis with balanced navigation", async ({ page }, testInfo) => {
  for (const width of [1100, 1180, 1280, 1440, 1675]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const dimensions = await page.evaluate(() => {
      const brand = document.querySelector<HTMLElement>(".site-header .brand")!.getBoundingClientRect();
      const logo = document.querySelector<HTMLElement>(".site-header .heritage-logo")!.getBoundingClientRect();
      const nav = document.querySelector<HTMLElement>(".site-header .desk-nav")!.getBoundingClientRect();
      const quick = document.querySelector<HTMLElement>(".site-header .quick-actions")!.getBoundingClientRect();
      const header = document.querySelector<HTMLElement>(".site-header")!.getBoundingClientRect();
      return {
        brandRight: brand.right, navLeft: nav.left, navRight: nav.right,
        logoHeight: logo.height, logoWidth: logo.width,
        headerLeft: header.left, headerRight: header.right,
        quickWidth: quick.width,
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(dimensions.logoHeight, `logo height at ${width}px`).toBeGreaterThanOrEqual(84);
    expect(dimensions.logoWidth, `logo width at ${width}px`).toBeGreaterThanOrEqual(205);
    expect(dimensions.navLeft, `brand / nav separation at ${width}px`).toBeGreaterThanOrEqual(dimensions.brandRight + 2);
    expect(dimensions.navRight, `nav within viewport at ${width}px`).toBeLessThanOrEqual(dimensions.headerRight + 1);
    expect(dimensions.quickWidth).toBeGreaterThanOrEqual(44);
    expect(dimensions.horizontalOverflow, `page overflow at ${width}px`).toBeLessThanOrEqual(1);
    if (width === 1675) {
      await page.screenshot({ path: testInfo.outputPath("desktop-brand-header-1675.png"), animations: "disabled" });
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".site-header .heritage-logo")).toBeVisible();
  const mobileWidth = await page.locator(".site-header .heritage-logo").evaluate(el => el.getBoundingClientRect().width);
  expect(mobileWidth).toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath("mobile-brand-header-390.png"), animations: "disabled" });
});
