import { expect, test } from "@playwright/test";

test("contact message form previews locally and does not send", async ({ page }) => {
  const posted: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") posted.push(`${request.method()} ${request.url()}`);
  });

  await page.goto("/contact/");
  await expect(page.locator(".contact-facts a[href='tel:+13032981100']")).toBeVisible();
  await expect(page.locator(".contact-facts a[href='mailto:sales@bluepointbakery.com']")).toBeVisible();
  await expect(page.locator(".contact-facts")).toContainText("Monday–Friday");
  await expect(page.locator(".contact-facts a[href*='bakery.software']")).toBeVisible();
  await expect(page.locator(".contact-facts a[href*='paywholesail.com']")).toBeVisible();
  await expect(page.getByTestId("contact-demo-notice")).toHaveText("This demo prepares your message but does not send it.");

  await page.getByRole("button", { name: "Preview message" }).click();
  const alert = page.getByTestId("contact-message-form").getByRole("alert");
  await expect(alert).toContainText("Enter a first name.");
  await expect(alert).toContainText("Enter a last name.");
  await expect(alert).toContainText("Enter an email address.");
  await expect(alert).toContainText("Enter a message.");
  await expect(alert).toContainText("does not send your message");

  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Baker");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Phone").fill("3035550100");
  await page.getByRole("textbox", { name: "Message", exact: true }).fill("We need brioche buns for a cafe.");
  await page.getByRole("checkbox", { name: /my message will not be sent automatically/i }).check();
  await page.getByRole("button", { name: "Preview message" }).click();

  const confirmation = page.getByTestId("contact-message-confirmation");
  await expect(confirmation).toContainText("Your message has not been sent.");
  await expect(confirmation).toContainText("Preview only — not submitted");
  await expect(confirmation).toContainText("(303) 298-1100");
  await expect(confirmation).toContainText("sales@bluepointbakery.com");
  await expect(confirmation).toContainText("We need brioche buns for a cafe.");
  await expect(confirmation).toContainText("(303) 555-0100");
  await expect(page).toHaveURL(/\/contact\/?$/);
  await expect(page.getByTestId("contact-message-form")).toHaveCount(0);
  expect(posted).toEqual([]);

  await page.getByRole("button", { name: "Prepare another message" }).click();
  await expect(page.getByTestId("contact-message-form")).toBeVisible();
  await expect(page.getByLabel("First name")).toHaveValue("Ada");
  await expect(page.getByTestId("contact-demo-notice")).toBeVisible();
});
