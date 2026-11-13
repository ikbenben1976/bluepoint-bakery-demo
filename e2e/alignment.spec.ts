import { expect, test } from "@playwright/test";

const pages = [
  "/", "/about/", "/breads/", "/pastries/", "/wholesale/", "/delivery/",
  "/community/", "/faq/", "/contact/",
  "/breads/?making=burgers#catalog", "/breads/?making=sandwiches#catalog",
  "/pastries/?making=breakfast#catalog", "/breads/?making=dinner#catalog",
  "/sectors/restaurants/", "/sectors/cafes/", "/sectors/hotels/", "/sectors/institutions/",
];

// A regression guard for the old 6.75rem right-padding workaround: the shell
// itself was centered, but its content was shifted left on every desktop page.
test("all page shells have balanced desktop gutters", async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const path of pages) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const viewportMid = document.documentElement.clientWidth / 2;
      return [...document.querySelectorAll<HTMLElement>("main .shell, main .ticket-hero")]
        .filter((element) => {
          const style = getComputedStyle(element);
          return style.display !== "none" && element.getBoundingClientRect().width > 0;
        })
        .map((element) => {
          const r = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            label: element.className,
            offset: (r.left + r.right) / 2 - viewportMid,
            leftPadding: parseFloat(style.paddingLeft),
            rightPadding: parseFloat(style.paddingRight),
          };
        });
    });
    expect(geometry.length, `No shell on ${path}`).toBeGreaterThan(0);
    for (const g of geometry) {
      expect(Math.abs(g.offset), `${path} ${g.label} should be centered`).toBeLessThanOrEqual(2);
      expect(Math.abs(g.leftPadding - g.rightPadding), `${path} ${g.label} has asymmetric inner gutters`).toBeLessThanOrEqual(2);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
      `${path} desktop horizontal overflow`).toBeLessThanOrEqual(1);
    if (["/", "/wholesale/", "/delivery/", "/community/", "/about/"].includes(path)) {
      await page.screenshot({
        path: testInfo.outputPath(`desktop-${path === "/" ? "home" : path.split("/")[1]}.png`),
        animations: "disabled",
      });
    }
  }
});

test("customer tabs fill the centered panel and logo wells match", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const section = page.locator("#customers");
  await section.scrollIntoViewIfNeeded();
  const first = await page.evaluate(() => {
    const shell = document.querySelector("#customers .shell")!.getBoundingClientRect();
    const strip = document.querySelector("#customers .verified-client-strip")!.getBoundingClientRect();
    const wells = [...document.querySelectorAll<HTMLElement>("#customers .verified-client-well")].slice(0, 3);
    return {
      left: strip.left - shell.left,
      right: shell.right - strip.right,
      heights: wells.map(w => w.getBoundingClientRect().height),
      backgrounds: wells.map(w => getComputedStyle(w).backgroundColor),
      imgFit: wells.map(w => getComputedStyle(w.querySelector("img")!).objectFit),
    };
  });
  expect(Math.abs(first.left - first.right)).toBeLessThanOrEqual(2);
  expect(new Set(first.heights).size).toBe(1);
  expect(first.backgrounds).toEqual(["rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(255, 255, 255)"]);
  expect(first.imgFit).toEqual(["contain", "contain", "contain"]);
  await section.screenshot({ path: testInfo.outputPath("customer-section-desktop.png"), animations: "disabled" });

  for (const name of ["Cafés & coffee shops", "Hotels & catering", "Institutions", "Restaurants & pubs"]) {
    await section.getByRole("tab", { name }).click();
    await expect(section.getByRole("tab", { name })).toHaveAttribute("aria-selected", "true");
    const dimensions = await page.locator("#customers .verified-client-strip").evaluate((strip) => {
      const panel = document.querySelector("#customers .buyer-proof-panel")!.getBoundingClientRect();
      const r = strip.getBoundingClientRect();
      return [r.left - panel.left, panel.right - r.right];
    });
    expect(Math.abs(dimensions[0] - dimensions[1]), `${name} cards should have even margins`).toBeLessThanOrEqual(2);
  }
});

test("mobile layouts retain full-width navigation, cards and no overflow", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  for (const width of [375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ["/", "/wholesale/", "/sectors/restaurants/", "/community/"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(1);
    }
    await page.goto("/");
    const section = page.locator("#customers");
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({
      path: testInfo.outputPath(`customer-section-mobile-${width}.png`),
      animations: "disabled",
    });
  }
});


test("desktop Contact launcher stays inside the sticky header, not over page content", async ({ page }) => {
  for (const width of [768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/wholesale/");
    const launcher = page.locator(".site-header-row .quick-actions");
    await expect(launcher).toBeVisible();
    const geometry = await page.evaluate(() => {
      const header = document.querySelector(".site-header")!.getBoundingClientRect();
      const button = document.querySelector<HTMLElement>(".site-header-row .quick-toggle")!;
      const rect = button.getBoundingClientRect();
      return {
        position: getComputedStyle(button.closest(".quick-actions")!).position,
        left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
        headerLeft: header.left, headerRight: header.right,
        headerTop: header.top, headerBottom: header.bottom,
        width: rect.width, height: rect.height,
      };
    });
    expect(geometry.position, `Contact is in flow at ${width}px`).not.toBe("fixed");
    expect(geometry.left, `Contact inside header at ${width}px`).toBeGreaterThanOrEqual(geometry.headerLeft);
    expect(geometry.right, `Contact inside header at ${width}px`).toBeLessThanOrEqual(geometry.headerRight + 1);
    expect(geometry.top, `Contact inside header at ${width}px`).toBeGreaterThanOrEqual(geometry.headerTop - 1);
    expect(geometry.bottom, `Contact inside header at ${width}px`).toBeLessThanOrEqual(geometry.headerBottom + 1);
    expect(geometry.width).toBeGreaterThanOrEqual(44);
    expect(geometry.height).toBeGreaterThanOrEqual(44);
  }
});
