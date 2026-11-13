import { expect, test } from "@playwright/test";

test("contact page provides clear working links without a misleading preview form", async ({ page }) => {
  const posted: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") posted.push(`${request.method()} ${request.url()}`);
  });
  await page.goto("/contact/");
  const main = page.locator("main");
  await expect(main.getByRole("heading", { level: 1, name: "Let's talk bakery." })).toBeVisible();
  await expect(main.locator('a[href="tel:+13032981100"]')).toHaveCount(1);
  await expect(main.locator('a[href="mailto:sales@bluepointbakery.com"]')).toHaveCount(1);
  await expect(main).toContainText("Monday–Friday");
  await expect(main.locator('a[href*="bakery.software"]')).toBeVisible();
  await expect(main.locator('a[href*="paywholesail.com"]')).toBeVisible();
  await expect(main.getByRole("link", { name: /Start a wholesale inquiry/ })).toHaveAttribute("href", "/wholesale/");
  await expect(main.getByRole("link", { name: /Explore delivery areas/ })).toHaveAttribute("href", "/delivery/");
  await expect(main.getByRole("link", { name: /Get directions/ })).toHaveAttribute("href", /google\.com\/maps/);
  await expect(main.locator("form, input, textarea")).toHaveCount(0);
  await expect(main).not.toContainText("Preview only");
  expect(posted).toEqual([]);
});
