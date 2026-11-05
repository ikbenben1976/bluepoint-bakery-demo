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
  await page.getByRole("button", { name: "Products", exact: true }).click();
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
  await page.getByRole("button", { name: "Continue to products" }).click();
  await expect(page.getByTestId("inquiry-form").getByRole("alert")).toContainText("Enter the business name.");

  await page.locator("#inquiry-business").fill("Key Cafe");
  await page.locator("#inquiry-type").selectOption("cafe");
  await page.locator("#inquiry-contact").fill("Ada Baker");
  await page.locator("#inquiry-email").fill("ada@example.com");
  await page.locator("#inquiry-phone").fill("3035550100");
  await page.locator("#inquiry-quantity").fill("about 20 dozen");
  await page.getByRole("button", { name: "Continue to products" }).click();
  await expect(page.locator("#inquiry-products")).toBeVisible();
  await page.getByRole("button", { name: "Continue to delivery" }).click();
  await expect(page.getByTestId("inquiry-form").getByRole("alert")).toContainText("Select or describe at least one product.");
  await page.locator("#inquiry-products").fill("Sesame kaiser rolls");
  await page.getByRole("button", { name: "Continue to delivery" }).click();
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(page.getByTestId("inquiry-form").getByRole("alert")).toContainText("Enter a delivery city.");
  await page.locator("#inquiry-delivery").fill("Denver");
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(page.getByTestId("inquiry-form").getByRole("alert")).toContainText("does not submit the request");
  await page.getByRole("checkbox", { name: /concept site does not submit this request/i }).check();
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(page.getByTestId("inquiry-confirmation")).toContainText(
    "This is a preview only. No message has been sent to Bluepoint Bakery.",
  );
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Sesame kaiser rolls");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("sales@bluepointbakery.com");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("This concept site does not submit wholesale requests.");

  await page.goto("/breads/");
  await page.locator(".product-card", { hasText: 'Potato Bun 4"' }).getByRole("button", { name: "Add to request" }).click();
  await page.goto("/wholesale/");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText('Potato Bun 4"');
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Sesame kaiser rolls");
});

test("keyboard can complete the wholesale form", async ({ page }) => {
  await page.goto("/wholesale/");
  const fillWithKeyboard = async (selector: string, value: string) => {
    await page.locator(selector).focus();
    await page.keyboard.type(value);
  };
  await fillWithKeyboard("#inquiry-business", "Keyboard Cafe");
  await page.locator("#inquiry-type").focus();
  await page.keyboard.press("ArrowDown");
  await fillWithKeyboard("#inquiry-contact", "Ada Baker");
  await fillWithKeyboard("#inquiry-email", "ada@example.com");
  await fillWithKeyboard("#inquiry-phone", "3035550199");
  await fillWithKeyboard("#inquiry-quantity", "10 dozen");
  await fillWithKeyboard("#inquiry-notes", "Please call mornings.");
  await page.getByRole("button", { name: "Continue to products" }).focus();
  await page.keyboard.press("Enter");
  await fillWithKeyboard("#inquiry-products", "Kaiser rolls");
  await page.getByRole("checkbox", { name: /Ask the bakery whether samples are available/i }).focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Continue to delivery" }).focus();
  await page.keyboard.press("Enter");
  await fillWithKeyboard("#inquiry-delivery", "Denver");
  await page.locator("#inquiry-consent").focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Preview request" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Keyboard Cafe");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Kaiser rolls");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Please advise whether samples are available");
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
  await expect(card.getByText(/confirm with bakery/i)).toHaveCount(0);
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

test("the call popup does not block the first paint", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
  await page.waitForTimeout(400);
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
});

test("the mobile catalog request CTA is unobstructed and contact is in navigation", async ({ page }) => {
  for (const width of [375, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/breads/");
    const action = page.getByRole("link", { name: "Open your request" });
    await expect(action).toBeVisible();
    await expect(page.getByTestId("quick-actions")).toBeVisible();
    const linkBox = await action.boundingBox();
    const pillBox = await page.getByTestId("quick-actions").boundingBox();
    const overlaps = Boolean(
      linkBox &&
        pillBox &&
        linkBox.x < pillBox.x + pillBox.width &&
        pillBox.x < linkBox.x + linkBox.width &&
        linkBox.y < pillBox.y + pillBox.height &&
        pillBox.y < linkBox.y + linkBox.height,
    );
    expect(overlaps, `contact pill covers the request link at ${width}px`).toBeFalsy();
    if (width < 800) {
      await page.getByRole("button", { name: "Menu" }).click();
      await expect(page.locator(".mobile-menu-actions").getByRole("link", { name: /Request pricing/ })).toBeVisible();
    }
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
  await expect(page.getByRole("tabpanel")).toContainText("dinner rolls");
});

test("home delivery lookup qualifies city and does not promise a specific route", async ({ page }) => {
  await page.goto("/");
  await page.locator("#home-delivery-city").fill("Denver");
  await expect(page.getByRole("status").filter({ hasText: "Denver" }).first()).toBeVisible();
  await expect(page.locator(".home-delivery-check")).toContainText("confirm the exact address");
});


test("wholesale details, weekly needs and sample question survive navigation and can be cleared", async ({ page }) => {
  await page.goto("/wholesale/");
  await page.locator("#inquiry-business").fill("A Test Kitchen");
  await page.locator("#inquiry-type").selectOption("restaurant");
  await page.locator("#inquiry-contact").fill("Jo Baker");
  await page.locator("#inquiry-email").fill("jo@example.com");
  await page.locator("#inquiry-phone").fill("3035550199");
  await page.locator("#inquiry-quantity").fill("40 dozen per week");
  await page.getByRole("button", { name: "Continue to products" }).click();
  await page.locator("#inquiry-products").fill("Hamburger buns");
  await page.getByRole("checkbox", { name: /Ask the bakery whether samples are available/i }).check();
  await page.locator("#inquiry-sample-products").fill("hamburger buns");
  await page.goto("/breads/");
  await page.goto("/wholesale/");
  await page.getByRole("button", { name: "Business", exact: true }).click();
  await expect(page.locator("#inquiry-business")).toHaveValue("A Test Kitchen");
  await expect(page.locator("#inquiry-quantity")).toHaveValue("40 dozen per week");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: /Ask the bakery whether samples are available/i })).toBeChecked();
  await expect(page.locator("#inquiry-products")).toHaveValue("Hamburger buns");
  await page.getByRole("button", { name: "Continue to delivery" }).click();
  await page.locator("#inquiry-delivery").fill("Denver");
  await page.getByRole("checkbox", { name: /concept site does not submit this request/i }).check();
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("40 dozen per week");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Please advise whether samples are available");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("hamburger buns");
  await page.getByRole("button", { name: "Clear request" }).click();
  await expect(page.locator("#inquiry-business")).toHaveValue("");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: /Ask the bakery whether samples are available/i })).not.toBeChecked();
});

test("homepage offers truthful commercial steps, sample question and published customer marks", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "From your menu to the right order." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ask about samples" })).toHaveAttribute("href", /wholesale.*sample-request/);
  await expect(page.locator(".verified-client-strip img")).toHaveCount(5);
  await expect(page.locator(".verified-client-wordmark")).toContainText("The Cherry Cricket");
  await expect(page.getByText("Customer listed on Bluepoint's community page")).toHaveCount(0);
  await expect(page.getByText("kicks ass")).toHaveCount(0);
});

test("public-mention logos sit inside the matching audience tabs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Named in public" })).toHaveCount(0);
  await expect(page.locator(".public-mentions, .public-mentions-block")).toHaveCount(0);
  const panel = page.getByRole("tabpanel");
  await expect(page.getByRole("tablist", { name: "Customer type" })).toBeVisible();
  const placedInside = await page.evaluate(() => {
    const tablist = document.querySelector(".buyer-proof-tabs");
    const proofPanel = document.querySelector("#audience-proof-panel");
    const strip = document.querySelector(".verified-client-strip");
    if (!tablist || !proofPanel || !strip) return false;
    const tabsBeforePanel = (tablist.compareDocumentPosition(proofPanel) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    const tabs = tablist.getBoundingClientRect();
    const cards = strip.getBoundingClientRect();
    return tabsBeforePanel && proofPanel.contains(strip) && cards.top >= tabs.bottom - 1;
  });
  expect(placedInside).toBe(true);

  await expect(panel).toContainText("The Cherry Cricket");
  await expect(panel).toContainText("West Main Taproom + Grill");
  await expect(panel.locator(".use-shots")).toHaveCount(0);
  await expect(panel).not.toContainText("Ask permission before using this product photo on a live site.");
  await expect(panel.getByRole("img", { name: "West Main burger on a bun, with fries" })).toHaveCount(0);
  await expect(panel.getByRole("img", { name: "West Main Reuben on marble rye, with fries" })).toHaveCount(0);
  await expect(panel).toContainText("Revolver Kitchen");
  await expect(panel).toContainText("Red Cedar Bistro");
  await expect(panel).not.toContainText("Public post");
  await expect(panel).not.toContainText("Cafe 180");
  await expect(panel).not.toContainText("Urban Egg");
  await expect(panel).not.toContainText("Meet the Makers");
  await expect(panel).not.toContainText("Stuffed French Toast");
  await expect(panel).not.toContainText("Windsor Lake");
  await expect(panel).not.toContainText("GrowHaus");
  await expect(panel).not.toContainText("FIRE Foundation");
  await expect(page.locator(".verified-client-strip img")).toHaveCount(5);

  await page.getByRole("tab", { name: "Restaurants & pubs" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Cafés & coffee shops" })).toHaveAttribute("aria-selected", "true");
  await expect(panel).toContainText("Cafe 180");
  await expect(panel.locator(".use-shots")).toHaveCount(0);
  await expect(panel.getByRole("img", { name: "Cafe 180 sandwiches on toasted bread" })).toHaveCount(0);
  await expect(panel).not.toContainText("Ask permission before using this product photo on a live site.");
  await expect(panel).toContainText("Urban Egg");
  await expect(panel).not.toContainText("Public post: Meet the Makers.");
  await expect(panel).toContainText("Urban Egg · Meet the Makers · October");
  await expect(panel).toContainText("they created the Stuffed French Toast Brioche specifically for Urban Egg");
  await expect(panel).toContainText("Public post, not a testimonial.");
  await expect(panel).not.toContainText("Blue Point Brewing");
  await expect(panel).toContainText("Windsor Lake Cafe & Marketplace");
  await expect(panel.getByText("Ordering for our coffee shop for over 10 years")).toHaveCount(1);
  await expect(panel).toContainText("Restaurantji");
  await expect(panel).not.toContainText("West Main");
  await expect(panel).not.toContainText("The Cherry Cricket");
  await expect(page.locator(".verified-client-strip img")).toHaveCount(3);

  await page.getByRole("tab", { name: "Hotels & catering" }).click();
  await expect(panel).toContainText("dinner rolls");
  await expect(panel).not.toContainText("Public post");
  await expect(page.locator(".verified-client-strip")).toHaveCount(0);

  await page.getByRole("tab", { name: "Institutions" }).click();
  await expect(panel).toContainText("hospitals, schools, universities, and airports");
  await expect(panel).not.toContainText("GrowHaus");
  await expect(panel).not.toContainText("Public post");
  await expect(page.locator(".verified-client-strip")).toHaveCount(0);

  await page.goto("/community/");
  await expect(page.locator(".community-page")).toContainText("The GrowHaus");
  await expect(page.locator(".community-page")).toContainText("food box program");
  await expect(page.locator(".community-page")).not.toContainText("CSA-style");
  await expect(page.locator(".community-page")).toContainText("FIRE Foundation");
  await expect(page.locator(".community-mention img")).toHaveAttribute("alt", "FIRE Foundation of Denver");

  for (const width of [390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 900 : 1100 });
    await page.goto("/");
    await page.addStyleTag({ content: ".sticky-stack, .quick-actions { position: static !important; }" });
    await page.getByRole("tab", { name: "Restaurants & pubs" }).click();
    await expect(page.getByRole("tabpanel").getByText("Red Cedar Bistro")).toBeVisible();
    await page.locator("#customers").screenshot({
      path: `test-results/buyer-proof-restaurants-${width}.png`,
      animations: "disabled",
    });
    await page.getByRole("tab", { name: "Cafés & coffee shops" }).click();
    await expect(page.getByRole("tabpanel").getByText("Windsor Lake Cafe & Marketplace")).toBeVisible();
    await page.locator("#customers").screenshot({
      path: `test-results/buyer-proof-cafes-${width}.png`,
      animations: "disabled",
    });
    expect(await overflow(page), String(width)).toBeLessThanOrEqual(1);
  }
});


test("capture homepage and buyer-request visual review at desktop and mobile widths", async ({ page }) => {
  for (const [name, width] of [["desktop", 1440], ["mobile", 390]] as const) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto("/");
    await expect.poll(async () => page.locator(".seamless-hero-photo").evaluate((img) => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0), { timeout: 18000 }).toBeTruthy();
    await page.screenshot({ path: `test-results/home-${name}.png`, fullPage: true, animations: "disabled" });
    await page.goto("/wholesale/");
    await page.getByTestId("inquiry-form").waitFor();
    await page.screenshot({ path: `test-results/wholesale-${name}.png`, fullPage: true, animations: "disabled" });
  }
});

test("approved refreshed hero shows recognizable brand, value propositions and functioning actions", async ({ page }) => {
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".approved-hero-logo")).toHaveCount(0); // one brand logo in header only
    await expect(page.locator(".hero .heritage-logo")).toHaveCount(0);
    await expect(page.locator(".site-header .heritage-logo")).toHaveAttribute("alt", /Bluepoint Bakery, established 1987/);
    await expect(page.getByRole("heading", { name: "Fresh, Scratch-Baked Breads, Rolls & Pastries" })).toBeVisible();
    await expect(page.locator(".approved-hero-benefits li")).toHaveCount(3);
    await expect(page.locator(".seamless-hero-media .hero-bread")).toHaveCount(0);
    const heroSrc = await page.locator(".seamless-hero-photo").evaluate((img) => (img as HTMLImageElement).currentSrc);
    expect(heroSrc).toMatch(width >= 1024 ? /hero-desktop/ : /hero-mobile/);
    await expect(page.locator(".seamless-hero-media .approved-product")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Explore Our Products/ })).toHaveAttribute("href", /breads/);
    await expect(page.getByRole("link", { name: "Request a Wholesale Account" })).toHaveAttribute("href", /wholesale/);
    await expect(page.locator(".hero-lead-times")).toContainText("Order breads at least 24 hours ahead.");
    await expect(page.locator(".hero-lead-times")).toContainText("Order pastries at least 48 hours ahead.");
    await expect(page.locator(".home-why")).toContainText("Using high-quality ingredients");
    await expect(page.locator(".home-why")).not.toContainText("sports venues");
    expect(await overflow(page), String(width)).toBeLessThanOrEqual(1);
  }
  await page.goto("/");
  const icon = await page.locator('link[rel="icon"][href*="icon.png"]').count();
  expect(icon).toBeGreaterThan(0);
});

test("wholesale preview keeps catalog selection AND additional requirements", async ({ page }) => {
  await page.goto("/breads/");
  await page.locator(".product-card", { hasText: 'Brioche Bun 4"' }).getByRole("button", { name: "Add to request" }).click();
  await page.goto("/wholesale/");
  await page.locator("#inquiry-business").fill("Menu Test");
  await page.locator("#inquiry-type").selectOption("restaurant");
  await page.locator("#inquiry-contact").fill("Alex Baker");
  await page.locator("#inquiry-email").fill("alex@example.com");
  await page.locator("#inquiry-phone").fill("3035550123");
  await page.getByRole("button", { name: "Continue to products" }).click();
  await expect(page.getByTestId("inquiry-form").locator(".line-name", { hasText: 'Brioche Bun 4"' })).toBeVisible();
  await page.locator("#inquiry-products").fill("Also interested in a custom sandwich roll.");
  await page.getByRole("button", { name: "Continue to delivery" }).click();
  await page.locator("#inquiry-delivery").fill("Denver");
  await page.getByRole("checkbox", { name: /concept site does not submit this request/i }).check();
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(page.getByTestId("inquiry-confirmation")).toContainText('Brioche Bun 4"');
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("custom sandwich roll");
});

test("sector pages show useful related catalog links; contact email is clickable", async ({ page }) => {
  await page.goto("/sectors/cafes/");
  await expect(page.getByRole("navigation", { name: /Explore more for Cafés and coffee shops/ })).toContainText("Coffee and breakfast");
  await expect(page.getByText("Urban Egg · Meet the Makers · October")).toBeVisible();
  await expect(page.getByText(/Stuffed French Toast Brioche specifically for Urban Egg/)).toBeVisible();
  await expect(page.locator(".use-shots")).toHaveCount(0);
  await expect(page.getByRole("img", { name: "Cafe 180 sandwiches on toasted bread" })).toHaveCount(0);
  await expect(page.getByText("Ordering for our coffee shop for over 10 years")).toHaveCount(1);
  await page.goto("/sectors/restaurants/");
  await expect(page.getByText("Meet the Makers")).toHaveCount(0);
  await expect(page.locator(".use-shots")).toHaveCount(0);
  await expect(page.getByRole("img", { name: "West Main burger on a bun, with fries" })).toHaveCount(0);
  await expect(page.getByRole("img", { name: "West Main Reuben on marble rye, with fries" })).toHaveCount(0);
  await expect(page.getByText("Since 1994 The Cherry Cricket")).toHaveCount(1);
  await page.goto("/sectors/hotels/");
  await expect(page.getByText("Meet the Makers")).toHaveCount(0);
  await page.goto("/sectors/institutions/");
  await expect(page.getByText("Meet the Makers")).toHaveCount(0);
  await page.goto("/contact/");
  await expect(page.locator('.contact-facts a[href="mailto:sales@bluepointbakery.com"]')).toBeVisible();
});

test("homepage separates illustrative menu applications from actual bakery product assortment", async ({ page }) => {
  await page.goto("/");
  const applications = page.locator(".application-section");
  const assortment = page.locator(".assortment");
  await expect(applications.getByRole("heading", { name: "What are you making?" })).toBeVisible();
  await expect(assortment.getByRole("heading", { name: "Our Product Assortment" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Product details at a glance" })).toHaveCount(0);
  const assortmentBounds = await assortment.boundingBox();
  const applicationsBounds = await applications.boundingBox();
  expect(assortmentBounds && applicationsBounds).toBeTruthy();
  expect(assortmentBounds!.y).toBeLessThan(applicationsBounds!.y);
  await expect(applications.locator(".making-visual-link")).toHaveCount(4);
  await expect(assortment.locator(".assortment-card")).toHaveCount(5);
  const burgers = applications.locator('.making-visual-link[href^="/making/burgers"]');
  const sandwiches = applications.locator('.making-visual-link[href^="/making/sandwiches"]');
  const breakfast = applications.locator('.making-visual-link[href^="/making/breakfast"]');
  const dinner = applications.locator('.making-visual-link[href^="/making/dinner"]');
  await expect(burgers.locator("img")).toHaveAttribute("src", /\/images\/use\/west-main-burger\.jpg/);
  await expect(sandwiches.locator("img")).toHaveAttribute("src", /\/images\/use\/cafe-180-sandwiches\.jpg/);
  await expect(breakfast.locator("img")).toHaveAttribute("src", /\/images\/illustrative\/app-breakfast/);
  await expect(dinner.locator("img")).toHaveAttribute("src", /\/images\/illustrative\/app-dinner/);
  await expect(burgers.locator(".illustrative-label")).toHaveCount(0);
  await expect(sandwiches.locator(".illustrative-label")).toHaveCount(0);
  await expect(breakfast.locator(".illustrative-label")).toHaveText("Illustrative image");
  await expect(dinner.locator(".illustrative-label")).toHaveText("Illustrative image");
  await expect(burgers.locator(".making-permission")).toContainText("Ask permission before using this product photo on a live site.");
  await expect(sandwiches.locator(".making-permission")).toContainText("Ask permission before using this product photo on a live site.");
  await expect(burgers.locator(".making-permission")).not.toContainText("Illustrative image");
  await expect(sandwiches.locator(".making-permission")).not.toContainText("Illustrative image");
  await expect(breakfast.locator(".making-permission")).toHaveCount(0);
  await expect(dinner.locator(".making-permission")).toHaveCount(0);
  await expect(applications.locator(".making-footnote")).toContainText("plated photos for this demo");
  await expect(applications.locator(".making-footnote")).toContainText("illustrative images");
  await expect(applications.locator(".making-footnote")).not.toContainText("Illustrative images, not photographs of Bluepoint products.");
  await expect(assortment.locator(".assortment-card img").first()).toHaveAttribute("src", /scenes\/sesame-buns-rack\.webp/);
  await expect(applications.getByRole("link", { name: /Burgers & Sliders/ })).toHaveAttribute("href", /making\/burgers/);
  await expect(assortment.getByRole("link", { name: /Buns & Rolls/ })).toHaveAttribute("href", /breads\/.*buns/);
  await page.goto("/breads/");
  await expect(page.locator(".featured-spec")).toBeVisible();
  await expect(page.locator(".featured-spec-facts")).toContainText("24 hour notice for orders on all breads");
  await expect(page.locator(".featured-spec-facts")).toContainText('4"');
  await expect(page.locator(".featured-spec-facts")).not.toContainText("Case quantity");
  await expect(page.locator(".featured-spec-facts")).not.toContainText(/confirm with bakery/i);
  await expect(page.locator(".application-section")).toHaveCount(0);
  await page.goto("/pastries/");
  await expect(page.locator(".application-section")).toHaveCount(0);
});


test("mobile opening screen visibly includes bakery photography and a clear action", async ({ page }) => {
  for (const width of [375, 390, 430, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const photograph = page.locator(".hero-figure");
    const image = photograph.locator("img");
    await expect(photograph).toBeVisible();
    await expect.poll(() => image.evaluate((el) => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0), { timeout: 18000 }).toBeTruthy();
    const bounds = await photograph.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.y, `photograph begins inside first screen at ${width}px`).toBeLessThan(720);
    await expect(page.getByRole("link", { name: /Explore Our Products/ })).toBeVisible();
    await expect(page.getByTestId("quick-actions")).toBeVisible();
    expect(await overflow(page), `overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".seamless-hero-media")).toBeVisible();
  await expect.poll(() => page.locator(".seamless-hero-photo").evaluate((img) => (img as HTMLImageElement).currentSrc)).toMatch(/hero-desktop/);
});

test("assortment thumbnails remain contained inside their own positioned cards", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const cards = page.locator(".assortment-card");
    await expect(cards).toHaveCount(5);
    const cardItems = await cards.all();
    for (let i = 0; i < cardItems.length; i++) {
      const card = cardItems[i];
      const wrapper = card.locator(".assortment-photo");
      const img = wrapper.locator("img");
      await expect(img).toBeVisible();
      const layout = await wrapper.evaluate((element) => {
        const outer = element.getBoundingClientRect();
        const image = element.querySelector("img")!.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          positioned: style.position === "relative",
          clipped: style.overflow === "hidden",
          aspect: outer.width / outer.height,
          inside: image.left >= outer.left - 1 && image.top >= outer.top - 1 &&
            image.right <= outer.right + 1 && image.bottom <= outer.bottom + 1,
        };
      });
      expect(layout.positioned, `positioned width=${width}`).toBeTruthy();
      expect(layout.clipped, `clipped width=${width}`).toBeTruthy();
      if (!(width <= 600 && i === cardItems.length - 1)) {
        expect(layout.aspect, `photo aspect width=${width}`).toBeGreaterThan(1.20);
        expect(layout.aspect, `photo aspect width=${width}`).toBeLessThan(1.30);
      } else {
        // The intentional full-width mobile editorial card uses a tall crop.
        expect(layout.aspect, "wide feature tile image has positive dimensions").toBeGreaterThan(.9);
      }
      expect(layout.inside, `image contained width=${width}`).toBeTruthy();
    }
    expect(await overflow(page), String(width)).toBeLessThanOrEqual(1);
  }
});


test("wholesale request uses a compact picker, not the entire catalog grid", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/wholesale/");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await expect(page.locator(".inquiry-catalog .product-card")).toHaveCount(0);
  await expect(page.locator("#inquiry-picker-product")).toBeVisible();
  await page.locator("#inquiry-picker-product").selectOption({ label: 'Brioche Bun 4"' });
  await page.getByRole("button", { name: "Add selected product" }).click();
  await expect(page.locator(".request-flow")).toContainText('Brioche Bun 4"');
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(pageHeight).toBeLessThan(8000);
});

test("homepage section order and trust strip match commercial hierarchy", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const positions = await page.evaluate(() => {
    const y = (selector: string) => document.querySelector(selector)?.getBoundingClientRect().top ?? 999999;
    return {
      hero: y(".seamless-hero"),
      trust: y(".brand-trust"),
      assortment: y(".assortment-section"),
      applications: y(".application-block"),
    };
  });
  expect(positions.hero).toBeLessThan(positions.trust);
  expect(positions.trust).toBeLessThan(positions.assortment);
  expect(positions.assortment).toBeLessThan(positions.applications);
  await expect(page.getByRole("heading", { name: "Product details at a glance" })).toHaveCount(0);
});


test("branded trust rail and real bakery scene photos visually fit at desktop and mobile", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const badges = page.locator(".trust-credential");
    await expect(badges).toHaveCount(3);
    await expect(badges.nth(0)).toContainText("Colorado Proud");
    await expect(badges.nth(1)).toContainText("Family-owned");
    await expect(badges.nth(2)).toContainText("Minority-owned");
    const photos = page.locator(".assortment-card .assortment-photo img");
    await expect(photos).toHaveCount(5);
    await expect.poll(() => photos.evaluateAll((imgs) => imgs.every((img) => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0)), { timeout: 18000 }).toBeTruthy();
    expect(await photos.evaluateAll((imgs) => imgs.every((img) => img.getAttribute("src")?.includes("/scenes/")))).toBeTruthy();
    expect(await overflow(page), String(width)).toBeLessThanOrEqual(1);
  }
});

test("bread and pastry catalog images stay within a consistent editorial photo frame", async ({ page }) => {
  for (const [name, path] of [["breads", "/breads/"], ["pastries", "/pastries/"]] as const) {
    for (const [screen, width] of [["mobile", 390], ["desktop", 1440]] as const) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto(path);
      const photos = page.locator(".section-anchor .group-photo");
      await expect(photos.first()).toBeVisible();
      const firstImage = photos.first().locator("img");
      await expect.poll(() => firstImage.evaluate((img) => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0), { timeout: 18000 }).toBeTruthy();
      const heights = await photos.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
      expect(heights.every((height) => height >= 200 && height <= 350), `${name} ${screen}: ${heights.join(",")}`).toBeTruthy();
      await page.screenshot({ path: `test-results/${name}-${screen}.png`, fullPage: true, animations: "disabled" });
      expect(await overflow(page), `${name} ${screen}`).toBeLessThanOrEqual(1);
    }
  }
});


test("fifth assortment photo tile spans both mobile columns without cropping outside", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const tiles = page.locator(".assortment-grid > li");
  await expect(tiles).toHaveCount(5);
  const gridBox = await page.locator(".assortment-grid").boundingBox();
  const lastBox = await tiles.last().boundingBox();
  const photo = await tiles.last().locator(".assortment-photo").boundingBox();
  expect(gridBox && lastBox && photo).toBeTruthy();
  expect(lastBox!.width).toBeGreaterThan(gridBox!.width * 0.95);
  expect(photo!.width).toBeGreaterThan(100);
  expect(photo!.height).toBeGreaterThan(120);
  expect(await overflow(page)).toBeLessThanOrEqual(1);
});

test("delivery labels do not overlap or clip, and the contact pill clears the desktop routes table", async ({ page }) => {
  const widths = [390, 768, 1280, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/delivery/");
    await page.evaluate(() => document.fonts.ready);

    const labelReport = await page.evaluate(() => {
      const stage = document.querySelector(".delivery-page .atlas-stage")!.getBoundingClientRect();
      const labels = [...document.querySelectorAll(".delivery-page .city-label")].map((el) => {
        const rect = el.getBoundingClientRect();
        return { text: el.textContent?.trim() ?? "", left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
      });
      const overlaps: string[] = [];
      for (let i = 0; i < labels.length; i++) {
        for (let j = i + 1; j < labels.length; j++) {
          const a = labels[i];
          const b = labels[j];
          const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (overlapX > 1 && overlapY > 1) overlaps.push(`${a.text} / ${b.text}`);
        }
      }
      const clipped = labels
        .filter(
          (label) =>
            label.left < stage.left - 1 ||
            label.top < stage.top - 1 ||
            label.right > stage.right + 1 ||
            label.bottom > stage.bottom + 1,
        )
        .map((label) => label.text);
      return { overlaps, clipped, count: labels.length, stageWidth: stage.width };
    });
    expect(labelReport.count, `labels at ${width}px`).toBeGreaterThan(20);
    expect(labelReport.overlaps, `label overlap at ${width}px`).toEqual([]);
    expect(labelReport.clipped, `clipped labels at ${width}px`).toEqual([]);
    expect(labelReport.clipped, `Fountain clipped at ${width}px`).not.toContain("Fountain");

    if (width >= 1280) {
      const content =
        ".delivery-page h1, .delivery-page h2, .delivery-page p, .route-table, .serve-list, .delivery-check, .atlas-card, .map-legend, .atlas-stage, .atlas-search";
      const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      for (let top = 0; top <= maxScroll; top += 220) {
        await page.evaluate((y) => window.scrollTo(0, y), top);
        const covered = await page.evaluate((selector) => {
          const pill = document.querySelector("[data-testid='quick-actions']")!.getBoundingClientRect();
          const hits: string[] = [];
          for (const el of document.querySelectorAll(selector)) {
            const rect = el.getBoundingClientRect();
            if (rect.width < 2 || rect.height < 2) continue;
            const overlapX = Math.min(rect.right, pill.right) - Math.max(rect.left, pill.left);
            const overlapY = Math.min(rect.bottom, pill.bottom) - Math.max(rect.top, pill.top);
            if (overlapX > 1 && overlapY > 1) hits.push(el.className?.toString() || el.tagName);
          }
          return { hits, pillVisible: pill.width > 40 && pill.bottom <= window.innerHeight + 1 && pill.top >= 0 };
        }, content);
        expect(covered.pillVisible, `contact pill visible at ${width}px`).toBeTruthy();
        expect(covered.hits, `contact pill covers content at ${width}px scroll ${top}`).toEqual([]);
      }
    }
    expect(await overflow(page), `overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
});

test("delivery content uses the full phone and tablet width without breaking table words", async ({ page }) => {
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/delivery/");
    await page.evaluate(() => document.fonts.ready);
    const fit = await page.evaluate(() => {
      const shell = document.querySelector(".delivery-page")!.getBoundingClientRect();
      const column = document.querySelector(".delivery-layout")!.getBoundingClientRect();
      const stage = document.querySelector(".delivery-page .atlas-stage")!.getBoundingClientRect();
      const available = window.innerWidth - shell.left * 2;
      const cells = [...document.querySelectorAll(".route-table th, .route-table td")].map((cell) => {
        const style = getComputedStyle(cell);
        return {
          text: (cell.textContent || "").replace(/\s+/g, " ").trim(),
          wordBreak: style.wordBreak,
          overflowWrap: style.overflowWrap,
          overflows: cell.scrollWidth > cell.clientWidth + 1,
        };
      });
      const pill = document.querySelector("[data-testid='quick-actions']")!.getBoundingClientRect();
      const padBottom = parseFloat(getComputedStyle(document.querySelector(".delivery-page")!).paddingBottom);
      return {
        columnWidth: column.width,
        available,
        stageWidth: stage.width,
        cells,
        padBottom,
        pillHeight: pill.height,
        pillVisible: pill.width > 40 && pill.top < window.innerHeight && pill.bottom > 0,
      };
    });
    expect(fit.columnWidth, `content column at ${width}px`).toBeGreaterThanOrEqual(fit.available * 0.9);
    if (width <= 420) {
      expect(fit.stageWidth, `map fills the content column at ${width}px`).toBeGreaterThanOrEqual(fit.columnWidth * 0.9);
    }
    expect(fit.pillVisible, `contact pill visible at ${width}px`).toBeTruthy();
    expect(fit.padBottom, `bottom clearance at ${width}px`).toBeGreaterThanOrEqual(fit.pillHeight);
    const broken = fit.cells.filter(
      (cell) => cell.wordBreak === "break-all" || cell.overflowWrap === "anywhere" || cell.overflows,
    );
    expect(broken, `table cells break words at ${width}px`).toEqual([]);
  }
});

test("route dots stay beside the first word of the route name", async ({ page }) => {
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/delivery/");
    await page.evaluate(() => document.fonts.ready);
    const rows = await page.evaluate(() => {
      return [...document.querySelectorAll(".route-table tbody th")].map((cell) => {
        const dot = cell.querySelector("i")!.getBoundingClientRect();
        const lead = cell.querySelector(".route-name-lead")!;
        const textNode = [...lead.childNodes].find(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        );
        const range = document.createRange();
        range.selectNodeContents(textNode!);
        const line = range.getClientRects()[0];
        return {
          name: (cell.textContent || "").replace(/\s+/g, " ").trim(),
          inline: dot.top >= line.top - 1 && dot.top <= line.bottom,
        };
      });
    });
    expect(rows.length, `route rows at ${width}px`).toBe(5);
    const missed = rows.filter((row) => !row.inline);
    expect(missed, `route dot leaves the first line at ${width}px`).toEqual([]);
  }
});

test("homepage sections use the shared container width on phone, tablet, and desktop", async ({ page }) => {
  const sections = [
    [".hero-figure", "hero"],
    [".approved-hero-benefits", "services"],
    [".trust-credential-list", "trust strip"],
    [".buyer-proof", "customer proof"],
    [".assortment", "assortment"],
    [".application-section", "making"],
    [".making-visual-grid", "application photos"],
    [".buyer-proof", "buyer proof"],
    ["footer .footer-grid", "footer"],
  ] as const;

  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const fit = await page.evaluate((selectors) => {
      const shell = document.querySelector(".assortment-section .shell")!.getBoundingClientRect();
      const available = window.innerWidth - shell.left * 2;
      return selectors.map(([selector, name]) => {
        const el = document.querySelector(selector)!;
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const content = rect.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        return { name, content, available, left: rect.left };
      });
    }, sections);
    for (const section of fit) {
      expect(section.content, `${section.name} width at ${width}px`).toBeGreaterThanOrEqual(section.available * 0.9);
    }
    if (width === 390) {
      const trust = await page.evaluate(() => {
        const list = document.querySelector(".trust-credential-list")!;
        const columns = getComputedStyle(list).gridTemplateColumns.split(" ").filter(Boolean).length;
        const listRight = list.getBoundingClientRect().right;
        const clipped = [...list.querySelectorAll("strong, .trust-credential-copy span, .trust-credential-copy a")]
          .filter((el) => {
            const range = document.createRange();
            range.selectNodeContents(el);
            const rect = range.getBoundingClientRect();
            return rect.width > 1 && (rect.right > listRight + 1 || el.scrollWidth > el.clientWidth + 1);
          })
          .map((el) => (el.textContent || "").replace(/\s+/g, " ").trim());
        return { columns, clipped };
      });
      expect(trust.columns, "trust strip stacks at 390px").toBe(1);
      expect(trust.clipped, "trust labels clipped at 390px").toEqual([]);
    }

    for (const path of ["/breads/", "/pastries/"]) {
      await page.goto(path);
      const catalog = await page.evaluate(() => {
        const grid = document.querySelector(".product-grid")!;
        const tools = document.querySelector(".catalog-tools")!;
        const shell = grid.closest(".shell")!;
        const available = window.innerWidth - shell.getBoundingClientRect().left * 2;
        const img = grid.querySelector("img") as HTMLImageElement;
        const label = grid.querySelector(".illustrative-label") as HTMLElement;
        const title = grid.querySelector("h3") as HTMLElement;
        return {
          grid: grid.getBoundingClientRect().width,
          available,
          toolsLeft: Math.round(tools.getBoundingClientRect().left),
          gridLeft: Math.round(grid.getBoundingClientRect().left),
          objectFit: getComputedStyle(img).objectFit,
          labelSize: parseFloat(getComputedStyle(label).fontSize),
          titleClipped: title.scrollWidth > title.clientWidth + 1,
          labelClipped: label.scrollWidth > label.clientWidth + 1,
        };
      });
      expect(catalog.grid, `${path} product grid at ${width}px`).toBeGreaterThanOrEqual(catalog.available * 0.9);
      expect(catalog.toolsLeft, `${path} search lines up with the product grid at ${width}px`).toBe(catalog.gridLeft);
      expect(["cover", "contain"], `${path} product photo fit`).toContain(catalog.objectFit);
      expect(catalog.labelSize, `${path} illustrative label size`).toBeGreaterThanOrEqual(12);
      expect(catalog.titleClipped, `${path} product title clipped`).toBeFalsy();
      expect(catalog.labelClipped, `${path} illustrative label clipped`).toBeFalsy();
    }
  }

  for (const width of [1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const edges = await page.evaluate(() => {
      const left = (selector: string) => Math.round(document.querySelector(selector)!.getBoundingClientRect().left);
      return {
        trust: left(".trust-credential-list"),
        assortment: left(".assortment"),
        making: left(".application-section"),
      };
    });
    expect(edges.making, `making lines up with assortment at ${width}px`).toBe(edges.assortment);
    expect(edges.making, `making lines up with the trust strip at ${width}px`).toBe(edges.trust);
    const proofLeft = await page.evaluate(() => Math.round(document.querySelector(".buyer-proof")!.getBoundingClientRect().left));
    expect(proofLeft, `customer proof lines up with the trust strip at ${width}px`).toBe(edges.trust);
  }
});

test("the removed Oskar Blues comment is not rendered on any page", async ({ page }) => {
  for (const [path] of PAGES) {
    await page.goto(path);
    await expect(page.locator("body"), path).not.toContainText(/kicks ass/i);
  }
  await page.goto("/");
  await expect(page.getByText("Customer listed on Bluepoint's community page")).toHaveCount(0);
  await expect(page.locator(".proof-quotes blockquote")).toHaveCount(2);
});

test("about story, community partners, and homepage proof use published facts only", async ({ page }) => {
  await page.goto("/about/");
  const about = page.locator(".about-copy");
  await expect(about).toContainText("Fred Bramhall");
  await expect(about).toContainText("Mary Clark");
  await expect(about).toContainText("Best Bakery");
  await expect(about).toContainText("Willie Ramirez");
  await expect(about).not.toContainText("does not give a date");
  await expect(about).toContainText("Outstanding Small Business");
  await expect(about).toContainText("AFP Colorado Chapter");
  await expect(about).toContainText("made from scratch daily");
  await expect(about).toContainText("minority-owned and family-owned");
  await expect(about).toContainText("We also deliver to Cheyenne and nearby communities in Wyoming.");
  await expect(page.locator(".about-figure figcaption")).toHaveText("Baguettes on a rack.");
  await expect(page.getByRole("heading", { level: 1 })).not.toContainText("Willie");
  await expect(page.getByRole("heading", { name: "Willie Ramirez, from baker to owner" })).toBeVisible();

  await page.goto("/community/");
  await expect(page.locator(".community-page")).toContainText("Project Angel Heart");
  await expect(page.locator(".community-page")).toContainText("CASA of Adams");
  await expect(page.locator(".community-page")).toContainText("GrowHaus");
  await expect(page.locator(".community-page")).toContainText("Soup for the Soul");
  await expect(page.locator(".community-page")).not.toContainText("Mountain Sun");
  await expect(page.locator(".community-page")).not.toContainText("Oskar Blues");
  await expect(page.locator(".community-page")).not.toContainText("Cherry Cricket");
  await expect(page.locator(".community-page")).not.toContainText("Outstanding Small Business");
  await expect(page.locator(".community-page")).not.toContainText("AFP");
  await expect(page.locator(".community-page")).toContainText("holiday sugar cookies");
  await expect(page.locator(".community-page")).toContainText("raised over $15,000");
  await expect(page.locator(".community-page")).toContainText("food box program");
  await expect(page.locator(".community-page")).toContainText("silent auction");
  await expect(page.locator(".community-page")).not.toContainText("birthday cake");
  await expect(page.locator(".community-page")).not.toContainText("$1 million");
  await expect(page.locator(".community-page")).not.toContainText("Philanthropist of the Year");
  await expect(page.locator(".community-page")).not.toContainText("sports venues");
  await expect(page.getByRole("link", { name: "Pie in the Sky" })).toHaveAttribute("href", "http://www.pieintheskycolorado.org/");
  await expect(page.getByRole("link", { name: "CASA Cookie Campaign" })).toHaveAttribute("href", "http://casa17th.org/menus/cookies-count.html");
  await expect(page.getByRole("link", { name: "Mercado Lado" })).toHaveAttribute("href", "http://www.mercadolado.com");
  await expect(page.getByRole("link", { name: "The Butterfly Program" })).toHaveAttribute(
    "href",
    "http://www.centurahealthathome.org/CHH/Our-Specialties/The-Butterfly-Program/",
  );
  await expect(page.locator(".partner-marks img")).toHaveCount(4);

  await page.goto("/");
  await expect(page.locator(".brand-trust")).toContainText("Colorado Proud");
  await expect(page.locator(".brand-trust")).toContainText("Listed in the product directory");
  await expect(page.locator(".brand-trust")).toContainText("Family-owned");
  await expect(page.locator(".brand-trust")).toContainText("Minority-owned");
  await expect(page.locator(".brand-trust")).not.toContainText("not a certification");
  await expect(page.locator(".brand-trust")).not.toContainText("Outstanding Small Business");
  await expect(page.locator(".brand-trust")).not.toContainText("AFP");
  await expect(page.locator("main")).not.toContainText("Outstanding Small Business");
  const proof = page.locator("#customers");
  await expect(proof).toContainText("The Cherry Cricket");
  await expect(proof).toContainText("Mountain Sun");
  await expect(proof.locator(".verified-client-strip img[alt*='Oskar Blues']")).toBeVisible();
  await expect(proof).not.toContainText("Customer listed on Bluepoint's community page");
  await expect(proof.locator(".use-shots")).toHaveCount(0);
  await expect(proof).not.toContainText("Ask permission before using this product photo on a live site.");
  await expect(proof).not.toContainText(/kicks ass/i);
  await expect(proof.locator(".verified-client-strip img")).toHaveCount(5);
  await expect(proof.getByRole("heading", { name: "Named in public" })).toHaveCount(0);
  await expect(proof).toContainText("West Main Taproom + Grill");
  await expect(proof).not.toContainText("Cafe 180");
  await expect(proof.locator(".verified-client-wordmark")).not.toContainText("logo");
});

test("about, community, trust, and customer proof fill the column without clipped text", async ({ page }) => {
  const pages = [
    {
      path: "/about/",
      root: ".about-story",
      heading: ".ticket-hero h1",
      body: ".about-copy p",
    },
    {
      path: "/community/",
      root: ".community-page",
      heading: ".ticket-hero h1",
      body: ".community-intro",
    },
    {
      path: "/",
      root: ".trust-credential-list",
      heading: ".trust-credential-copy strong",
      body: ".trust-credential-copy span",
    },
    {
      path: "/",
      root: ".buyer-proof",
      heading: "#buyer-proof-heading",
      body: ".buyer-proof .section-intro p",
    },
  ] as const;

  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const target of pages) {
      await page.goto(target.path);
      await page.evaluate(() => document.fonts.ready);
      const fit = await page.evaluate(({ root, heading, body }) => {
        const el = document.querySelector(root)!;
        const shell = el.closest(".shell") ?? el;
        const shellRect = shell.getBoundingClientRect();
        const available = window.innerWidth - shellRect.left * 2;
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const content = rect.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const headingLeft = Math.round(document.querySelector(heading)!.getBoundingClientRect().left);
        const bodyLeft = Math.round(document.querySelector(body)!.getBoundingClientRect().left);
        const rootRight = rect.right;
        const clipped = [...el.querySelectorAll("h1, h2, h3, p, li, strong, span, a, figcaption, small, blockquote, footer")]
          .filter((node) => {
            const box = node.getBoundingClientRect();
            if (box.width < 2 || box.height < 2) return false;
            const styleOverflow = getComputedStyle(node);
            if (styleOverflow.display === "inline") return false;
            return node.scrollWidth > node.clientWidth + 2 || box.right > rootRight + 2;
          })
          .map((node) => (node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80));
        return { content, available, headingLeft, bodyLeft, clipped };
      }, target);
      expect(fit.content, `${target.root} width at ${width}px`).toBeGreaterThanOrEqual(fit.available * 0.9);
      expect(Math.abs(fit.headingLeft - fit.bodyLeft), `${target.root} heading and body align at ${width}px`).toBeLessThanOrEqual(1);
      expect(fit.clipped, `${target.root} clipped text at ${width}px`).toEqual([]);
    }
  }
});

test("homepage brand: serif headline, service icons, rolling-pin logo, and contact clearance", async ({ page }) => {
  for (const width of [390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole("heading", { name: "Fresh, Scratch-Baked Breads, Rolls & Pastries" })).toBeVisible();
    await expect(page.locator(".approved-hero .lede")).toContainText("Colorado Front Range");
    const actions = page.locator(".hero-actions a");
    await expect(actions.nth(0)).toContainText("Explore Our Products");
    await expect(actions.nth(1)).toContainText("Request a Wholesale Account");
    await expect(actions.nth(0)).toHaveAttribute("href", /\/breads\/?$/);
    await expect(actions.nth(1)).toHaveAttribute("href", /\/wholesale\/?$/);

    const benefits = page.locator(".approved-hero-benefits li");
    await expect(benefits).toHaveCount(3);
    await expect(benefits.nth(0)).toContainText("Made from Scratch");
    await expect(benefits.nth(1)).toContainText("Six-Day Delivery");
    await expect(benefits.nth(2)).toContainText("Personal Service");
    const iconsHidden = await page.locator(".approved-hero-benefits svg").evaluateAll((nodes) =>
      nodes.every((node) => node.getAttribute("aria-hidden") === "true"),
    );
    expect(iconsHidden).toBeTruthy();

    const type = await page.evaluate(() => {
      const variable = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const family = (selector: string) => getComputedStyle(document.querySelector(selector)!).fontFamily;
      const h1 = document.querySelector("#approved-hero-title")!;
      const h1Style = getComputedStyle(h1);
      return {
        serif: variable("--font-serif"),
        sans: variable("--font-franklin"),
        h1: h1Style.fontFamily,
        body: getComputedStyle(document.body).fontFamily,
        nav: family(".nav-link"),
        button: getComputedStyle(document.querySelector(".approved-hero-primary")!).backgroundColor,
        wordBreak: h1Style.wordBreak,
        overflowWrap: h1Style.overflowWrap,
        hyphens: h1Style.hyphens,
        h1Overflows: h1.scrollWidth > h1.clientWidth + 1,
      };
    });
    const familyName = (value: string) => value.replace(/["']/g, "").split(",")[0].trim();
    expect(type.h1, `headline font at ${width}`).toContain(familyName(type.serif));
    expect(type.body, `body font at ${width}`).toContain(familyName(type.serif));
    expect(type.nav, `nav font at ${width}`).toContain(familyName(type.sans));
    expect(type.button, `primary button at ${width}`).toBe("rgb(11, 43, 81)");
    expect(type.wordBreak).not.toBe("break-all");
    expect(type.overflowWrap).not.toBe("anywhere");
    expect(type.hyphens).not.toBe("auto");
    expect(type.h1Overflows, `headline overflows at ${width}`).toBeFalsy();

    await expect(page.locator(".site-header .heritage-logo")).toHaveAttribute("src", /bluepoint-logo\.png/);
    await expect(page.locator(".hero .heritage-logo, .approved-hero-logo")).toHaveCount(0);
    await expect(page.locator(".making-footnote")).toContainText("Our Product Assortment, above");

    const headerHits = await page.evaluate(() => {
      const nodes = [
        ...document.querySelectorAll(
          ".site-header .heritage-logo, .site-header .nav-link, .site-header .util-phone, .site-header .header-pricing, .site-header .customer-login, .site-header .menu-toggle",
        ),
      ];
      const visible = nodes
        .filter((el) => {
          const style = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 1 && rect.height > 1;
        })
        .map((el) => ({ name: (el.textContent || el.getAttribute("alt") || el.className).toString().trim().slice(0, 40), rect: el.getBoundingClientRect() }));
      const hits: string[] = [];
      for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
          const a = visible[i].rect;
          const b = visible[j].rect;
          const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (overlapX > 1 && overlapY > 1) hits.push(`${visible[i].name} / ${visible[j].name}`);
        }
      }
      return hits;
    });
    expect(headerHits, `header overlap at ${width}`).toEqual([]);
    expect(await overflow(page), `overflow at ${width}`).toBeLessThanOrEqual(1);

    const pillBox = await page.getByTestId("quick-actions").boundingBox();
    expect(pillBox!.height).toBeGreaterThanOrEqual(44);
    expect(pillBox!.width).toBeGreaterThanOrEqual(44);
    const coveredAtTop = await page.evaluate(() => {
      const pill = document.querySelector("[data-testid='quick-actions']")!.getBoundingClientRect();
      const hits: string[] = [];
      for (const el of document.querySelectorAll(".hero-actions a, #approved-hero-title, .approved-hero .lede")) {
        const rect = el.getBoundingClientRect();
        const overlapX = Math.min(rect.right, pill.right) - Math.max(rect.left, pill.left);
        const overlapY = Math.min(rect.bottom, pill.bottom) - Math.max(rect.top, pill.top);
        if (overlapX > 1 && overlapY > 1) hits.push((el.textContent || "").trim().slice(0, 48));
      }
      return hits;
    });
    expect(coveredAtTop, `contact pill covers the hero at ${width}`).toEqual([]);
    if (width <= 480) {
      const labelHits = await page.evaluate(() => {
        const pill = document.querySelector("[data-testid='quick-actions']")!.getBoundingClientRect();
        const hits: string[] = [];
        for (const el of document.querySelectorAll(".approved-hero-benefits li span")) {
          const range = document.createRange();
          range.selectNodeContents(el);
          for (const rect of range.getClientRects()) {
            const overlapX = Math.min(rect.right, pill.right) - Math.max(rect.left, pill.left);
            const overlapY = Math.min(rect.bottom, pill.bottom) - Math.max(rect.top, pill.top);
            if (overlapX > 1 && overlapY > 1) hits.push((el.textContent || "").trim());
          }
        }
        return hits;
      });
      expect(labelHits, `service labels under the contact pill at ${width}`).toEqual([]);
    }
  }

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const primary = page.getByRole("link", { name: /Explore Our Products/ }).first();
  await primary.focus();
  await expect(primary).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/breads\/?$/);

  await page.goto("/");
  await page.getByRole("button", { name: "Contact" }).click();
  await expect(page.getByRole("link", { name: "Call" })).toHaveAttribute("href", "tel:+13032981100");
  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:sales@bluepointbakery.com");
  await expect(page.getByRole("link", { name: "Request pricing" }).last()).toHaveAttribute("href", /\/wholesale\/?$/);
  const panelLink = await page.getByRole("link", { name: "Call" }).boundingBox();
  expect(panelLink!.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("link", { name: "Call" })).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toBeHidden();
});

const CONTENT_PAGES = [
  ["/", "home"],
  ["/breads/", "breads"],
  ["/pastries/", "pastries"],
  ["/delivery/", "delivery"],
  ["/contact/", "contact"],
  ["/community/", "community"],
  ["/making/burgers/", "burgers"],
  ["/making/sandwiches/", "sandwiches"],
  ["/making/breakfast/", "breakfast"],
  ["/making/dinner/", "dinner"],
  ["/sectors/restaurants/", "restaurants"],
  ["/sectors/cafes/", "cafes"],
  ["/sectors/hotels/", "hotels"],
  ["/sectors/institutions/", "institutions"],
] as const;

test("changed pages use the column, keep labels readable, and leave the contact pill clear", async ({ page }) => {
  for (const [path] of CONTENT_PAGES) {
    for (const width of [390, 768]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const fit = await page.evaluate(() => {
        const column =
          document.querySelector("main .content-page") ||
          document.querySelector("main .shell") ||
          document.querySelector("main");
        if (!column) return null;
        const rect = column.getBoundingClientRect();
        const style = getComputedStyle(column);
        const content = rect.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const available = window.innerWidth - rect.left * 2;
        const labels = [...document.querySelectorAll("main label, main legend, main .fact-label, main .spec dt, main .compare-card dt")]
          .filter((el) => {
            const box = el.getBoundingClientRect();
            return box.width > 1 && box.height > 1 && getComputedStyle(el).display !== "none";
          })
          .map((el) => ({
            text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
            size: parseFloat(getComputedStyle(el).fontSize),
          }));
        const broken = [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main td, main th, main a, main button, main dd")]
          .filter((el) => {
            const text = (el.textContent || "").trim();
            if (!text) return false;
            const css = getComputedStyle(el);
            return css.wordBreak === "break-all" || css.overflowWrap === "anywhere" || el.scrollWidth > el.clientWidth + 2;
          })
          .map((el) => (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60));
        const pill = document.querySelector("[data-testid='quick-actions']")!.getBoundingClientRect();
        const hits: string[] = [];
        for (const el of document.querySelectorAll("main a, main button, main input, main summary")) {
          const box = el.getBoundingClientRect();
          if (box.width < 2 || box.height < 2 || box.bottom < 0 || box.top > window.innerHeight) continue;
          const overlapX = Math.min(box.right, pill.right) - Math.max(box.left, pill.left);
          const overlapY = Math.min(box.bottom, pill.bottom) - Math.max(box.top, pill.top);
          if (overlapX > 1 && overlapY > 1) hits.push((el.textContent || el.tagName).replace(/\s+/g, " ").trim().slice(0, 40));
        }
        const search = document.querySelector<HTMLInputElement>("#product-search");
        const request = document.querySelector<HTMLElement>(".catalog-tools .catalog-request");
        const searchBox = search?.getBoundingClientRect();
        const requestBox = request?.getBoundingClientRect();
        return {
          content,
          available,
          labels,
          broken: broken.slice(0, 8),
          hits,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          searchWidth: searchBox && searchBox.width > 1 ? searchBox.width : null,
          requestWidth: requestBox && requestBox.height > 1 && requestBox.top < window.innerHeight ? requestBox.width : null,
          searchBorder: search ? parseFloat(getComputedStyle(search).borderTopWidth) : 0,
          placeholder: search?.getAttribute("placeholder") ?? "",
        };
      });
      expect(fit, path).toBeTruthy();
      expect(fit!.content, `${path} width at ${width}px`).toBeGreaterThanOrEqual(fit!.available * 0.9);
      expect(fit!.broken, `${path} mid-word break at ${width}px`).toEqual([]);
      for (const label of fit!.labels) {
        expect(label.size, `${path} label “${label.text}” at ${width}px`).toBeGreaterThanOrEqual(14);
      }
      expect(fit!.hits, `${path} contact pill covers a control at ${width}px`).toEqual([]);
      expect(fit!.overflow, `${path} overflow at ${width}px`).toBeLessThanOrEqual(1);
      if (fit!.searchWidth != null) {
        expect(fit!.searchWidth, `${path} search width at ${width}px`).toBeGreaterThanOrEqual(fit!.content * 0.9);
        expect(fit!.searchBorder, `${path} search box at ${width}px`).toBeGreaterThanOrEqual(1);
        expect(fit!.placeholder, `${path} search placeholder`).toMatch(/^Search /);
      }
      if (width <= 700 && fit!.requestWidth != null) {
        expect(fit!.requestWidth, `${path} request button width at ${width}px`).toBeGreaterThanOrEqual(fit!.content * 0.9);
      }
    }
  }
});

test("contact intro lines up with the details and the four values share one size", async ({ page }) => {
  for (const width of [1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact/");
    const align = await page.evaluate(() => {
      const hero = document.querySelector(".contact-hero")!.getBoundingClientRect().left;
      const facts = document.querySelector(".contact-facts")!.getBoundingClientRect().left;
      const values = [...document.querySelectorAll(".contact-facts .fact-value")].map((el) =>
        Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10,
      );
      const email = document.querySelector(".contact-email")!;
      const time = document.querySelector(".hours-time")!;
      return {
        hero,
        facts,
        values,
        emailDecoration: getComputedStyle(email).textDecorationLine,
        timeWrap: getComputedStyle(time).whiteSpace,
      };
    });
    expect(Math.abs(align.hero - align.facts), `left edges at ${width}px`).toBeLessThanOrEqual(1);
    expect(new Set(align.values).size, `value sizes at ${width}px`).toBe(1);
    expect(align.values[0], `value size at ${width}px`).toBeGreaterThanOrEqual(20);
    expect(align.values[0], `value size at ${width}px`).toBeLessThanOrEqual(22);
    expect(align.emailDecoration).toContain("underline");
    expect(align.timeWrap).toBe("nowrap");
  }
});

test("catalog search combines with a category filter and can be reset", async ({ page }) => {
  await page.goto("/pastries/");
  await page.getByRole("button", { name: "Scones", exact: true }).click();
  await page.locator("#product-search").fill("blue");
  await expect(page.locator("#scones").getByRole("heading", { name: "Blueberry", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Apple Cinnamon Crunch" })).toHaveCount(0);
  await page.locator("#product-search").fill("zzzznotaproduct");
  await expect(page.getByText("No products match that search.")).toBeVisible();
  await page.getByRole("button", { name: "Reset search and filters" }).first().click();
  await expect(page.getByRole("heading", { name: "Croissants" })).toBeVisible();
  await page.locator("#product-search").focus();
  await page.keyboard.type("bear");
  await expect(page.getByRole("heading", { name: "Bear Claw" })).toBeVisible();
});

test("two products compare published fields and offer an inquiry", async ({ page }) => {
  await page.goto("/breads/");
  const brioche = page.locator(".product-card", { hasText: 'Brioche Bun 4"' });
  const picnic = page.locator(".product-card", { hasText: 'Picnic Bun 3.5"' });
  await brioche.getByRole("button", { name: "Compare" }).click();
  await picnic.getByRole("button", { name: "Compare" }).click();
  const panel = page.getByTestId("compare-panel");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('4"');
  await expect(panel).toContainText('3.5"');
  await expect(panel).not.toContainText(/confirm with bakery/i);
  await expect(panel.getByRole("link", { name: "Request pricing for these" })).toHaveAttribute("href", /\/wholesale\/?$/);
  await brioche.locator("summary").click();
  await expect(brioche.getByText(/confirm with bakery/i)).toHaveCount(0);
  await expect(brioche.getByText("Ask sales for a quote")).toHaveCount(0);
});

test("delivery map shows the weekday overview and does not draw a route line", async ({ page }) => {
  await page.goto("/delivery/");
  await expect(page.locator(".city-link")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Colors and weekdays" })).toBeVisible();
  await expect(page.locator(".route-table")).toContainText("Yellow");
  await expect(page.locator(".route-table")).toContainText("Purple");
  for (const days of [
    "Mon, Tue, Wed, Thu, Fri, Sat",
    "Mon, Wed, Fri, Sat",
    "Tue, Thu, Sat",
    "Tue, Sat",
    "Mon, Tue, Thu, Fri",
  ]) {
    await expect(page.locator(".route-table")).toContainText(days);
    await expect(page.locator(".map-legend")).toContainText(days);
  }
  await expect(page.getByText("This is an overview. Please call us to see if we service your city").first()).toBeVisible();
  await expect(page.locator(".delivery-lede")).toContainText("We bake and deliver 6 days a week.");
  await expect(page.getByText("kicks ass")).toHaveCount(0);
});

test("removed testimonial is gone and contact uses published links only", async ({ page }) => {
  for (const path of ["/", "/community/", "/sectors/restaurants/"]) {
    await page.goto(path);
    await expect(page.getByText("kicks ass")).toHaveCount(0);
    await expect(page.getByText("Jason R.")).toHaveCount(0);
  }
  await page.goto("/contact/");
  await expect(page.locator('.contact-facts a[href="mailto:sales@bluepointbakery.com"]')).toBeVisible();
  await expect(page.locator('.contact-facts a[href="tel:+13032981100"]')).toBeVisible();
  await expect(page.locator('.contact-facts a[href*="google.com/maps"]')).toBeVisible();
  await expect(page.locator('.contact-facts a[href*="bakery.software"]')).toBeVisible();
  await expect(page.locator('.contact-facts a[href*="paywholesail.com"]')).toBeVisible();
  const social = await page.locator(".social-row a").evaluateAll((links) => links.map((link) => link.getAttribute("href") || ""));
  expect(social.length).toBeGreaterThan(0);
  for (const href of social) {
    expect(href === "https://instagram.com/bluepointbakery/" || href === "https://www.facebook.com/BluepointBakery/").toBeTruthy();
  }
  await expect(page.locator('a[href*="linkedin"], a[href*="twitter"], a[href*="x.com"]')).toHaveCount(0);
});

test("pages keep noindex and a demo canonical", async ({ page }) => {
  for (const path of ["/", "/breads/", "/contact/", "/delivery/", "/sectors/cafes/"]) {
    await page.goto(path);
    const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
    expect(robots).toContain("noindex");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, path).toBe(`https://bluepoint-bakery-demo.vercel.app${path}`);
    expect(canonical).not.toContain("demo.invalid");
  }
});

test("making pathways and sector links reach catalog choices", async ({ page }) => {
  await page.goto("/");
  for (const [name, path] of [
    ["Burgers & Sliders", "/making/burgers/"],
    ["Sandwiches & Subs", "/making/sandwiches/"],
    ["Coffee & Breakfast", "/making/breakfast/"],
    ["Dinner & Catering", "/making/dinner/"],
  ] as const) {
    await page.goto("/");
    await page.getByRole("link", { name: new RegExp(name) }).click();
    await expect(page).toHaveURL(new RegExp(path));
    await expect(page.locator(".menu-guide a").first()).toBeVisible();
  }
  await page.goto("/making/burgers/");
  await expect(page.locator(".menu-guide").getByRole("link", { name: /Brioche Bun 4/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Curved Butter Croissant 3 oz" })).toHaveCount(0);
  await page.goto("/sectors/hotels/");
  await expect(page.getByRole("link", { name: "Dinner and catering" })).toHaveAttribute("href", /\/making\/dinner\/?$/);
  await expect(page.getByText("not named publicly")).toHaveCount(0);
  await expect(page.getByText("does not name")).toHaveCount(0);
});

