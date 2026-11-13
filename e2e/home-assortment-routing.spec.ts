import { expect, test } from "@playwright/test";

const collections = [
  { index: 0, id: "buns-rolls", family: "breads", name: "Buns & Rolls", groups: ["buns", "sandwich-rolls", "dinner-rolls"], shown: "Brioche Bun 4\"", hidden: "Sourdough Boule 8 oz" },
  { index: 1, id: "breads-loaves", family: "breads", name: "Breads & Loaves", groups: ["french-breads", "deli-loaves", "pan-loaves"], shown: "Sourdough", hidden: "Brioche Bun 4\"" },
  { index: 2, id: "pastries", family: "pastries", name: "Pastries", groups: ["croissants", "danishes", "mini-danish", "turnovers", "scones", "mini-scones", "quick-breads", "muffins", "half-size-muffins", "muffin-tops", "cinnamon-rolls", "biscotti"], shown: "Chocolate Croissant", hidden: "Dutch Apple Pie" },
  { index: 3, id: "specialty-breads", family: "breads", name: "Specialty Breads", groups: ["specialty-breads"], shown: "Sourdough Boule 8 oz", hidden: "Brioche Bun 4\"" },
  { index: 4, id: "desserts-treats", family: "pastries", name: "Desserts & Sweet Treats", groups: ["pies", "brownies", "cookies", "specialty-cookies", "muffins", "half-size-muffins", "muffin-tops"], shown: "Dutch Apple Pie", hidden: "Chocolate Croissant" },
] as const;

for (const entry of collections) {
  test(`homepage ${entry.name} shows only matching catalog groups`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    const card = page.locator(".assortment-card").nth(entry.index);
    await expect(card).toHaveAttribute("href", `/${entry.family}/?assortment=${entry.id}#catalog`);
    await card.click();
    await expect(page).toHaveURL(new RegExp(`/${entry.family}/\\?assortment=${entry.id}#catalog$`));
    await expect(page.getByTestId("assortment-filter")).toContainText(entry.name);
    const ids = await page.locator("main section.section-anchor").evaluateAll((sections) => sections.map((el) => el.id));
    expect(ids, `${entry.name} selected groups`).toEqual([...entry.groups]);
    await expect(page.locator("main .product-card").filter({ hasText: entry.shown }).first()).toBeVisible();
    await expect(page.locator("main .product-card").filter({ hasText: entry.hidden })).toHaveCount(0);

    await page.getByTestId("assortment-filter").getByRole("button", { name: /View all/ }).click();
    await expect(page.getByTestId("assortment-filter")).toHaveCount(0);
    await expect(page).not.toHaveURL(/assortment=/);
    await expect(page.locator("main section.section-anchor")).toHaveCount(entry.family === "breads" ? 7 : 16);
  });
}

test("assortment deep links also work when pasted directly on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pastries/?assortment=desserts-treats#catalog");
  await expect(page.getByTestId("assortment-filter")).toContainText("Desserts & Sweet Treats");
  await expect(page.locator("#pies")).toBeVisible();
  await expect(page.locator("#croissants")).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
