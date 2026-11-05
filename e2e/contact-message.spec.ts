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
  await expect(page.getByTestId("contact-demo-notice")).toHaveText("This concept site does not send contact messages.");

  await page.getByRole("button", { name: "Preview message" }).click();
  const alert = page.getByTestId("contact-message-form").getByRole("alert");
  await expect(alert).toContainText("Enter a first name.");
  await expect(alert).toContainText("Enter a last name.");
  await expect(alert).toContainText("Enter an email address.");
  await expect(alert).toContainText("Enter a message.");
  await expect(alert).toContainText("does not send the message");

  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Baker");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Phone").fill("3035550100");
  await page.getByRole("textbox", { name: "Message", exact: true }).fill("We need brioche buns for a cafe.");
  await page.getByRole("checkbox", { name: /does not send this message/i }).check();
  await page.getByRole("button", { name: "Preview message" }).click();

  const confirmation = page.getByTestId("contact-message-confirmation");
  await expect(confirmation).toContainText("This message was not sent");
  await expect(confirmation).toContainText("No message has been sent to Bluepoint Bakery.");
  await expect(confirmation).toContainText("This concept site does not send contact messages.");
  await expect(confirmation).toContainText("(303) 298-1100");
  await expect(confirmation).toContainText("sales@bluepointbakery.com");
  await expect(confirmation).toContainText("We need brioche buns for a cafe.");
  await expect(confirmation).toContainText("(303) 555-0100");
  await expect(page).toHaveURL(/\/contact\/?$/);
  await expect(page.getByTestId("contact-message-form")).toHaveCount(0);
  expect(posted).toEqual([]);

  await page.getByRole("button", { name: "Write another message" }).click();
  await expect(page.getByTestId("contact-message-form")).toBeVisible();
  await expect(page.getByLabel("First name")).toHaveValue("Ada");
  await expect(page.getByTestId("contact-demo-notice")).toBeVisible();
});
