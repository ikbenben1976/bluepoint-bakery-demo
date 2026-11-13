import { expect, test } from "@playwright/test";

test("desktop header keeps original logo and distributes all navigation items", async ({ page }) => {
  for (const width of [1220, 1280, 1440, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const layout = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".site-header .desk-nav")!;
      const brand = document.querySelector<HTMLElement>(".site-header .heritage-logo")!;
      const links = [...nav.querySelectorAll<HTMLElement>(".nav-link")];
      const rects = links.map((el) => el.getBoundingClientRect());
      return {
        display: getComputedStyle(nav).display,
        justify: getComputedStyle(nav).justifyContent,
        logoHeight: brand.getBoundingClientRect().height,
        count: links.length,
        gaps: rects.slice(1).map((rect, i) => rect.left - rects[i].right),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(layout.display).toBe("flex");
    expect(layout.justify).toBe("space-between");
    expect(layout.logoHeight).toBeGreaterThanOrEqual(78);
    expect(layout.count).toBe(8);
    expect(layout.gaps.every((gap) => gap >= 0), `navigation link overlap at ${width}px`).toBeTruthy();
    expect(layout.overflow).toBeLessThanOrEqual(1);
  }
});

test("phone header remains compact with its existing contact and menu controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".site-header .header-call")).toBeVisible();
  await expect(page.locator(".site-header .heritage-logo")).toBeVisible();
  await expect(page.locator(".site-header .menu-toggle")).toBeVisible();
  await expect(page.locator(".site-header .desk-nav")).toBeHidden();
});
