import { expect, test } from "@playwright/test";

const FIRST_SIX = [
  "The Cherry Cricket",
  "Mountain Sun Pub & Brewery",
  "Oskar Blues Fooderies",
  "Red Cedar Bistro",
  "Revolver Kitchen",
  "The Lobby Denver",
];

test("phones cap restaurant logos and wider screens keep the full grid", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const panel = page.getByRole("tabpanel");
  const marks = panel.locator(".verified-client-mark");
  await expect(marks).toHaveCount(17);
  for (const [index, name] of FIRST_SIX.entries()) {
    await expect(marks.nth(index)).toBeVisible();
    await expect(marks.nth(index)).toContainText(name);
  }
  for (let index = 6; index < 17; index += 1) {
    await expect(marks.nth(index)).toBeHidden();
  }

  const reveal = page.getByRole("button", { name: "Show all 17 restaurants" });
  await expect(reveal).toBeVisible();
  await expect(reveal).toHaveAttribute("aria-expanded", "false");
  await expect(reveal).toHaveAttribute("aria-controls", "audience-logo-grid");
  const order = await page.evaluate(() => {
    const grid = document.getElementById("audience-logo-grid");
    const button = document.querySelector(".logo-reveal");
    const quotes = document.querySelector(".buyer-proof-panel > .proof-quotes");
    if (!grid || !button || !quotes) return null;
    const following = Node.DOCUMENT_POSITION_FOLLOWING;
    return {
      buttonAfterGrid: (grid.compareDocumentPosition(button) & following) !== 0,
      quotesAfterButton: (button.compareDocumentPosition(quotes) & following) !== 0,
      hiddenFromTree: marksHiddenFromTree(),
    };

    function marksHiddenFromTree() {
      return [...document.querySelectorAll(".verified-client-mark")].slice(6).every((card) => {
        const style = getComputedStyle(card);
        return style.display === "none" && card.getClientRects().length === 0;
      });
    }
  });
  expect(order).toEqual({ buttonAfterGrid: true, quotesAfterButton: true, hiddenFromTree: true });
  await expect(panel.locator(".proof-quotes blockquote")).toHaveCount(2);
  await expect(panel.locator(".proof-quotes")).toBeVisible();

  await page.getByRole("tab", { name: "Cafés & coffee shops" }).click();
  await expect(page.getByRole("button", { name: /Show all|Show fewer/ })).toHaveCount(0);
  await expect(panel.locator(".verified-client-mark")).toHaveCount(4);
  for (let index = 0; index < 4; index += 1) {
    await expect(panel.locator(".verified-client-mark").nth(index)).toBeVisible();
  }
  await expect(panel.locator(".cafe-pull")).toBeVisible();

  await page.getByRole("tab", { name: "Restaurants & pubs" }).click();
  await page.getByRole("button", { name: "Show all 17 restaurants" }).click();
  const fewer = page.getByRole("button", { name: "Show fewer" });
  await expect(fewer).toHaveAttribute("aria-expanded", "true");
  await expect(panel.locator("#audience-logo-grid")).not.toHaveAttribute("data-collapsed", /.+/);
  for (let index = 0; index < 17; index += 1) {
    await expect(marks.nth(index)).toBeVisible();
  }
  await expect(panel.locator(".proof-quotes blockquote")).toHaveCount(2);

  await marks.nth(16).scrollIntoViewIfNeeded();
  const buried = await page.locator("#audience-logo-grid").evaluate((grid) => {
    const headerBottom = document.querySelector(".sticky-stack")?.getBoundingClientRect().bottom ?? 0;
    return grid.getBoundingClientRect().top < headerBottom - 1;
  });
  expect(buried).toBe(true);
  await fewer.click();
  await expect(page.getByRole("button", { name: "Show all 17 restaurants" })).toHaveAttribute("aria-expanded", "false");
  await expect.poll(async () => page.locator("#audience-logo-grid").evaluate((grid) => {
    const headerBottom = document.querySelector(".sticky-stack")?.getBoundingClientRect().bottom ?? 0;
    return grid.getBoundingClientRect().top - headerBottom;
  })).toBeGreaterThanOrEqual(-2);
  await expect.poll(async () => page.locator("#audience-logo-grid").evaluate((grid) => {
    const headerBottom = document.querySelector(".sticky-stack")?.getBoundingClientRect().bottom ?? 0;
    return grid.getBoundingClientRect().top - headerBottom;
  })).toBeLessThanOrEqual(24);
  await expect(marks.nth(6)).toBeHidden();
  await expect(panel.locator(".proof-quotes")).toBeVisible();

  for (const width of [768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: /Show all|Show fewer/ })).toHaveCount(0);
    await expect(page.locator(".logo-reveal")).toBeHidden();
    const wideMarks = page.getByRole("tabpanel").locator(".verified-client-mark");
    await expect(wideMarks).toHaveCount(17);
    for (let index = 0; index < 17; index += 1) {
      await expect(wideMarks.nth(index)).toBeVisible();
    }
    await expect(page.locator("#audience-logo-grid")).toHaveAttribute("data-collapsed", "true");
  }
});
