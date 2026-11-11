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

test("wide desktop header is one balanced row with a prominent logo", async ({ page }, testInfo) => {
  for (const width of [1220, 1280, 1440, 1675, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const d = await page.evaluate(() => {
      const rect = (sel: string) => document.querySelector<HTMLElement>(sel)!.getBoundingClientRect();
      const box = (r: DOMRect) => ({ left: r.left, right: r.right, top: r.top, bottom: r.bottom, midY: (r.top + r.bottom)/2, height: r.height });
      const logo = box(rect(".site-header .heritage-logo"));
      const brand = box(rect(".site-header .brand"));
      const nav = box(rect(".site-header .desk-nav"));
      const contact = box(rect(".site-header-row .quick-toggle"));
      const account = box(rect(".site-header .customer-login"));
      const links = [...document.querySelectorAll<HTMLElement>(".site-header .desk-nav .nav-link")].map(el => box(el.getBoundingClientRect()));
      return { logo, brand, nav, contact, account, links,
        menuDisplay: getComputedStyle(document.querySelector(".site-header .menu-toggle")!).display,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    expect(d.logo.height, `wordmark remains prominent at ${width}px`).toBeGreaterThanOrEqual(78);
    expect(d.links, `all primary links at ${width}px`).toHaveLength(8);
    expect(d.nav.left, `nav clears logo at ${width}px`).toBeGreaterThanOrEqual(d.brand.right + 4);
    expect(d.contact.left, `contact follows nav at ${width}px`).toBeGreaterThanOrEqual(d.nav.right + 2);
    expect(d.account.left, `account follows contact at ${width}px`).toBeGreaterThanOrEqual(d.contact.right + 2);
    for (const link of d.links) {
      expect(Math.abs(link.midY - d.nav.midY), `nav link shares a row at ${width}px`).toBeLessThanOrEqual(2);
      expect(Math.abs(link.midY - d.logo.midY), `nav aligned with logo at ${width}px`).toBeLessThanOrEqual(14);
    }
    expect(d.menuDisplay).toBe("none");
    expect(d.overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    if (width === 1440 || width === 1675) {
      await page.locator(".sticky-stack").screenshot({
        path: testInfo.outputPath(`desktop-header-single-row-${width}.png`), animations: "disabled"
      });
    }
  }
});

test("compact tablet and laptop widths use the accessible menu without cramming links", async ({ page }, testInfo) => {
  for (const width of [768, 1024, 1100, 1199]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const toggle = page.locator(".site-header .menu-toggle");
    await expect(toggle).toBeVisible();
    await expect(page.locator(".site-header .desk-nav")).toBeHidden();
    await expect(page.locator(".site-header .heritage-logo")).toBeVisible();
    const d = await page.evaluate(() => {
      const logo = document.querySelector<HTMLElement>(".site-header .heritage-logo")!.getBoundingClientRect();
      const menu = document.querySelector<HTMLElement>(".site-header .menu-toggle")!.getBoundingClientRect();
      const contact = document.querySelector<HTMLElement>(".site-header-row .quick-toggle")!.getBoundingClientRect();
      return { logoRight: logo.right, contactLeft: contact.left, menuLeft: menu.left,
        logoHeight: logo.height, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    expect(d.contactLeft, `contact does not overlap logo at ${width}px`).toBeGreaterThan(d.logoRight + 5);
    expect(d.menuLeft, `menu follows Contact at ${width}px`).toBeGreaterThan(d.contactLeft + 40);
    expect(d.logoHeight).toBeGreaterThanOrEqual(68);
    expect(d.overflow).toBeLessThanOrEqual(1);
    await toggle.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await expect(page.locator("#mobile-menu").getByRole("link", { name: "Request a quote" })).toBeVisible();
    await toggle.click();
    await expect(page.locator("#mobile-menu")).toBeHidden();
    if (width === 1199) {
      await page.locator(".sticky-stack").screenshot({
        path: testInfo.outputPath("compact-laptop-header-1199.png"), animations: "disabled"
      });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".site-header .heritage-logo")).toBeVisible();
  await page.locator(".sticky-stack").screenshot({
    path: testInfo.outputPath("mobile-header-390-unchanged.png"), animations: "disabled"
  });
});
