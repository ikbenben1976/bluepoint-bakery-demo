import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  ["/", "Bluepoint Bakery"],
  ["/breads/", "Breads"],
  ["/pastries/", "Pastries"],
  ["/wholesale/", "Become a wholesale customer"],
  ["/delivery/", "Delivery Area"],
  ["/about/", "About"],
  ["/community/", "Community"],
  ["/faq/", "FAQ"],
  ["/contact/", "Contact"],
  ["/making/burgers/", "Burgers & Sliders"],
  ["/making/sandwiches/", "Sandwiches & Subs"],
  ["/making/breakfast/", "Coffee & Breakfast"],
  ["/making/dinner/", "Dinner & Catering"],
  ["/sectors/restaurants/", "Restaurants and pubs"],
  ["/sectors/cafes/", "Cafés and coffee shops"],
  ["/sectors/hotels/", "Hotels and catering"],
  ["/sectors/institutions/", "Institutions"],
];

async function overflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test("search finds a partial name and shows an empty state", async ({ page }) => {
  await page.goto("/pastries/");
  await page.locator("#product-search").fill("bear");
  await expect(page.getByRole("heading", { name: "Bear Claw" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Apple" })).toHaveCount(0);
  await page.locator("#product-search").fill("zzzznotaproduct");
  await expect(page.getByText("No products match that search.")).toBeVisible();
});

test("category filter selects and clears", async ({ page }) => {
  await page.goto("/pastries/");
  await page.getByRole("button", { name: "Danishes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Danishes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Croissants" })).toHaveCount(0);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Croissants" })).toBeVisible();
});

test("request builder adds, edits, removes, and persists", async ({ page }) => {
  await page.goto("/breads/");
  const card = page.locator(".product-card", { hasText: 'Brioche Bun 4"' });
  await card.getByRole("button", { name: "Add to request" }).click();
  await expect(card.getByText("In your request")).toBeVisible();
  await page.goto("/wholesale/");
  await expect(page.getByTestId("inquiry-form").locator(".line-name", { hasText: 'Brioche Bun 4"' })).toBeVisible();
  const qty = page.getByRole("spinbutton", { name: 'Quantity for Brioche Bun 4"' });
  await qty.fill("4");
  await page.goto("/pastries/");
  await page.goto("/wholesale/");
  await expect(qty).toHaveValue("4");
  await page.getByRole("button", { name: 'Remove Brioche Bun 4"' }).click();
  await expect(page.locator("#inquiry-products")).toBeVisible();
});

test("wholesale form validates, then confirms, empty and prefilled", async ({ page }) => {
  await page.goto("/wholesale/");
  await expect(page.getByTestId("inquiry-form")).toBeVisible();
  await expect(page.locator("#inquiry-products")).toBeVisible();
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(page.getByTestId("inquiry-form").getByRole("alert")).toContainText("Enter the business name.");

  await page.locator("#inquiry-business").fill("Key Cafe");
  await page.locator("#inquiry-type").selectOption("cafe");
  await page.locator("#inquiry-delivery").fill("Denver");
  await page.locator("#inquiry-contact").fill("Ada Baker");
  await page.locator("#inquiry-email").fill("ada@example.com");
  await page.locator("#inquiry-phone").fill("3035550100");
  await page.locator("#inquiry-products").fill("Sesame kaiser rolls");
  await page.locator("#inquiry-quantity").fill("about 20 dozen");
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(page.getByTestId("inquiry-confirmation")).toContainText(
    "This is a preview only. No message has been sent to Bluepoint Bakery.",
  );
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Sesame kaiser rolls");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("sales@bluepointbakery.com");

  await page.goto("/breads/");
  await page.locator(".product-card", { hasText: 'Potato Bun 4"' }).getByRole("button", { name: "Add to request" }).click();
  await page.goto("/wholesale/");
  await expect(page.getByTestId("inquiry-form").locator(".line-name", { hasText: 'Potato Bun 4"' })).toBeVisible();
  await page.locator("#inquiry-business").fill("Key Cafe");
  await page.locator("#inquiry-type").selectOption("restaurant");
  await page.locator("#inquiry-delivery").fill("Boulder");
  await page.locator("#inquiry-contact").fill("Ada Baker");
  await page.locator("#inquiry-email").fill("ada@example.com");
  await page.locator("#inquiry-phone").fill("3035550100");
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(page.getByTestId("inquiry-confirmation")).toContainText('Potato Bun 4"');
});

test("keyboard can complete the wholesale form", async ({ page }) => {
  await page.goto("/wholesale/");
  await page.locator("#inquiry-business").focus();
  await page.keyboard.type("Keyboard Cafe");
  await page.keyboard.press("Tab");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Tab");
  await page.keyboard.type("Denver");
  await page.keyboard.press("Tab");
  await page.keyboard.type("Ada Baker");
  await page.keyboard.press("Tab");
  await page.keyboard.type("ada@example.com");
  await page.keyboard.press("Tab");
  await page.keyboard.type("3035550199");
  await page.keyboard.press("Tab");
  await page.keyboard.type("10 dozen");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.type("Kaiser rolls");
  await page.keyboard.press("Tab");
  await page.keyboard.type("Please call mornings.");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Keyboard Cafe");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Kaiser rolls");
});

for (const width of [375, 390]) {
  test(`mobile nav and no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const [path] of PAGES) {
      await page.goto(path);
      expect(await overflow(page), path).toBeLessThanOrEqual(1);
    }
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.locator("#mobile-menu").getByRole("link", { name: "Request pricing" })).toBeVisible();
    await expect(page.locator("#mobile-menu").getByRole("link", { name: "Order online (existing customers)" })).toBeVisible();
    expect(await overflow(page)).toBeLessThanOrEqual(1);
  });
}

test("what are you making filters the catalog and the spec card uses published fields", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Burgers & Sliders/ }).click();
  await expect(page.getByRole("heading", { name: 'Brioche Bun 4"' })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Curved Butter Croissant 3 oz" })).toHaveCount(0);
  await expect(page.getByText(/Published sizes on the bun list/)).toBeVisible();
  const card = page.locator(".product-card", { hasText: 'Brioche Bun 4"' });
  await card.locator("summary").click();
  await expect(card.getByText("24 hour notice for orders on all breads").first()).toBeVisible();
  await expect(card.getByText("Confirm with bakery").first()).toBeVisible();
  await expect(card.getByText("Individually wrapped")).toHaveCount(0);

  await page.goto("/pastries/");
  const black = page.locator(".product-card", { hasText: "Black and Whites" });
  await expect(black.getByText("Individually wrapped")).toHaveCount(0);
  const seasonal = page.locator("#muffin-tops .product-card", {
    has: page.getByRole("heading", { name: "Seasonal", exact: true }),
  });
  await expect(seasonal.getByText("Individually wrapped")).toHaveCount(0);
  await expect(page.getByText("Unit: each")).toHaveCount(0);
});

test("links and buttons go somewhere, including tel and mailto", async ({ page }) => {
  await page.goto("/");
  const dead = await page.locator("a").evaluateAll((links) =>
    links
      .filter((link) => {
        const href = link.getAttribute("href");
        return !href || href === "#" || href.startsWith("javascript:");
      })
      .map((link) => link.textContent?.trim() || "(blank)"),
  );
  expect(dead).toEqual([]);
  expect(await page.locator('a[href="tel:+13032981100"]').count()).toBeGreaterThan(0);
  expect(await page.locator('a[href="mailto:sales@bluepointbakery.com"]').count()).toBeGreaterThan(0);
});

test("the call notice dismisses and stays dismissed", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("call-notice")).toBeVisible({ timeout: 8000 });
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
  await page.goto("/about/");
  await page.waitForTimeout(1200);
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
});

test("the contact control does not cover the request button", async ({ page }) => {
  for (const width of [375, 390, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/breads/");
    if (width < 800) {
      await page.getByRole("button", { name: "Contact" }).click();
    }
    const widget = await page.getByTestId("quick-actions").boundingBox();
    const request = await page.getByRole("link", { name: "Open your request" }).boundingBox();
    expect(widget && request).toBeTruthy();
    if (!widget || !request) continue;
    const overlaps = !(
      widget.x + widget.width < request.x ||
      request.x + request.width < widget.x ||
      widget.y + widget.height < request.y ||
      request.y + request.height < widget.y
    );
    expect(overlaps, String(width)).toBeFalsy();
  }
});

test("every page has a unique title, a description, noindex, and no serious axe violations", async ({ page }) => {
  const titles = new Set<string>();
  for (const [path, name] of PAGES) {
    await page.goto(path);
    const title = await page.title();
    expect(title.toLowerCase()).toContain(name.toLowerCase());
    expect(titles.has(title), title).toBeFalsy();
    titles.add(title);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description && description.length > 20, path).toBeTruthy();
    const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
    expect(robots).toContain("noindex");
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((item) => item.impact === "serious" || item.impact === "critical");
    expect(serious, `${path} ${JSON.stringify(serious.map((item) => item.id))}`).toEqual([]);
  }
});


test("buyer-first homepage has photographed application links and sourced segment proof", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".making-visual-link");
  await expect(cards).toHaveCount(4);
  for (const path of ["burgers", "sandwiches", "breakfast", "dinner"]) {
    await expect(page.locator(`.making-visual-link[href^="/making/${path}"] img`)).toBeVisible();
  }

  await expect(page.getByRole("tab", { name: "Restaurants & pubs" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Cherry Cricket");
  await page.getByRole("tab", { name: "Cafés & coffee shops" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Restaurantji");
  await page.getByRole("tab", { name: "Hotels & catering" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Named endorsements for this category have not been provided");
});

test("home delivery lookup qualifies city and does not promise a specific route", async ({ page }) => {
  await page.goto("/");
  await page.locator("#home-delivery-city").fill("Denver");
  await expect(page.getByRole("status").filter({ hasText: "Denver" }).first()).toBeVisible();
  await expect(page.locator(".home-delivery-check")).toContainText("confirm the exact address");
});
