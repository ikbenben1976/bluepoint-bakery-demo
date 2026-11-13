import { expect, test } from "@playwright/test";

test("all published cities have map markers that reveal city and route days on hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/delivery/");

  const markers = page.locator('circle[data-city]');
  await expect(markers).toHaveCount(22);

  for (const city of ["Cheyenne", "Fort Collins", "Denver", "Colorado Springs", "Breckenridge", "Fountain"]) {
    const circle = page.locator(`circle[data-city="${city}"]`);
    await circle.scrollIntoViewIfNeeded();
    const box = await circle.boundingBox();
    expect(box, `marker exists for ${city}`).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect(page.getByTestId("map-hover-tooltip")).toContainText(city);
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("map bubble can be selected by tap-sized click on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/delivery/");
  const circle = page.locator('circle[data-city="Denver"]');
  await circle.scrollIntoViewIfNeeded();
  const box = await circle.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect(page.getByTestId("map-hover-tooltip")).toContainText("Denver");
});
