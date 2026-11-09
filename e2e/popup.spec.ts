import { expect, test } from "@playwright/test";

const STAY_HIDDEN_MS = 7_000;

test("the call sheet stays closed until Contact opens it", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
  await page.waitForTimeout(STAY_HIDDEN_MS);
  await expect(page.getByTestId("call-notice")).toHaveCount(0);

  await page.getByRole("button", { name: "Contact" }).click();
  const dialog = page.getByRole("dialog", { name: /contact bluepoint/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await expect(dialog.getByRole("link", { name: /^Call / })).toHaveAttribute("href", "tel:+13032981100");
  await expect(dialog.getByRole("link", { name: "Email sales" })).toHaveAttribute("href", "mailto:sales@bluepointbakery.com");
  await expect(dialog.getByRole("link", { name: "Request a quote" })).toHaveAttribute("href", /\/wholesale\/#wholesale-request$/);

  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "Email sales" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("call-notice")).toHaveCount(0);

  await page.getByRole("button", { name: "Contact" }).click();
  await expect(dialog).toBeVisible();
  await page.locator(".call-notice-backdrop").click({ position: { x: 12, y: 12 } });
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
});

test("the call sheet can open again after it is closed", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForTimeout(STAY_HIDDEN_MS);
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
  await expect(page.getByTestId("quick-actions")).toBeHidden();
  await page.getByRole("button", { name: "Contact" }).click();
  await expect(page.getByTestId("call-notice")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close", exact: true })).toHaveCount(1);
  await page.getByTestId("call-notice").getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("button", { name: "Contact" })).toBeFocused();
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
  await expect(page.getByTestId("quick-actions")).toBeHidden();
  await page.getByRole("button", { name: "Contact" }).click();
  await expect(page.getByTestId("call-notice")).toBeVisible();
});
