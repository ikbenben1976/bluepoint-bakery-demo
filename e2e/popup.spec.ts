import { expect, test } from "@playwright/test";

const APPEAR_MS = 9_000;
const STAY_HIDDEN_MS = 7_000;

test("the call popup is absent on first paint and then shows once", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
  await page.waitForTimeout(400);
  await expect(page.getByTestId("call-notice")).toHaveCount(0);

  const dialog = page.getByRole("dialog", { name: /call us today/i });
  await expect(dialog).toBeVisible({ timeout: APPEAR_MS });
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Tab");
  const inside = await page.evaluate(() =>
    Boolean(document.activeElement?.closest("[data-testid='call-notice']")),
  );
  expect(inside).toBeTruthy();

  const shown = await page.evaluate(() => localStorage.getItem("bluepoint-demo-notice-shown"));
  expect(shown).toBe("1");
  await page.reload();
  await page.waitForTimeout(STAY_HIDDEN_MS);
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
});

test("closing the call popup is remembered after reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("call-notice")).toBeVisible({ timeout: APPEAR_MS });
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
  const stored = await page.evaluate(() => localStorage.getItem("bluepoint-demo-notice"));
  expect(stored).toBe("1");
  await page.reload();
  await page.waitForTimeout(STAY_HIDDEN_MS);
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
});

test("escape and the backdrop dismiss the call popup for later visits", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("call-notice")).toBeVisible({ timeout: APPEAR_MS });
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("call-notice")).toHaveCount(0);

  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByTestId("call-notice")).toBeVisible({ timeout: APPEAR_MS });
  await page.locator(".call-notice-backdrop").click({ position: { x: 12, y: 12 } });
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
  await page.reload();
  await page.waitForTimeout(STAY_HIDDEN_MS);
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
});

test("dismissal falls back to sessionStorage when localStorage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("localStorage blocked");
      },
    });
  });
  await page.goto("/");
  await expect(page.getByTestId("call-notice")).toBeVisible({ timeout: APPEAR_MS });
  await page.getByRole("button", { name: "Close" }).click();
  const session = await page.evaluate(() => sessionStorage.getItem("bluepoint-demo-notice"));
  expect(session).toBe("1");
  await page.reload();
  await page.waitForTimeout(STAY_HIDDEN_MS);
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
});
