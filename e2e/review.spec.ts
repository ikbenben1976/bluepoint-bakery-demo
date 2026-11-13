import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  ["/", "Bluepoint Bakery"],
  ["/breads/", "Breads"],
  ["/pastries/", "Pastries"],
  ["/wholesale/", "wholesale account"],
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
  const bearClaw = page.locator("#danishes-bear-claw");
  await expect(bearClaw.locator("img")).toHaveCount(0);
  await bearClaw.getByRole("button", { name: "Add to request" }).click();
  const sheet = page.getByTestId("request-sheet");
  await expect(sheet.getByRole("heading", { name: "Bear Claw" })).toBeVisible();
  await expect(sheet.locator("img")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await page.locator("#product-search").fill("zzzznotaproduct");
  await expect(page.getByText("No matching products found. Try a different search or browse another category.")).toBeVisible();
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
  const qty = page.getByRole("spinbutton", { name: 'Estimated quantity for Brioche Bun 4"' });
  await qty.fill("4");
  await page.goto("/pastries/");
  await page.goto("/wholesale/");
  await expect(qty).toHaveValue("4");
  await page.getByRole("button", { name: 'Remove Brioche Bun 4"' }).click();
  await expect(page.locator("#inquiry-products")).toBeVisible();
});

test("products keep separate estimates, and a blank Not sure stays blank", async ({ page }) => {
  await page.goto("/breads/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  const dozen = page.locator(".product-card", { hasText: "Brioche (Dozen)" });
  await dozen.getByRole("button", { name: "Add to request" }).click();
  const sheet = page.getByTestId("request-sheet");
  await expect(sheet).toBeVisible();
  const dozenQty = sheet.getByRole("spinbutton", { name: "Estimated quantity for Brioche (Dozen)" });
  await expect(dozenQty).toHaveValue("");
  await expect(sheet.getByRole("combobox", { name: "Estimate basis for Brioche (Dozen)" })).toHaveValue("week");
  await dozenQty.fill("2");
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();

  const bun = page.locator(".product-card", { hasText: 'Brioche Bun 4"' });
  await bun.scrollIntoViewIfNeeded();
  await bun.getByRole("button", { name: "Add to request" }).click();
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("spinbutton", { name: 'Estimated quantity for Brioche Bun 4"' })).toHaveValue("");
  await sheet.getByRole("combobox", { name: 'Estimate basis for Brioche Bun 4"' }).selectOption("unsure");
  await sheet.getByRole("textbox", { name: 'Delivery preferences for Brioche Bun 4"' }).fill("Skip some weeks.");
  await sheet.getByRole("link", { name: "Review selections" }).click();

  await expect(page).toHaveURL(/\/wholesale\/#request-lines/);
  await expect(page.getByRole("spinbutton", { name: "Estimated quantity for Brioche (Dozen)" })).toHaveValue("2");
  await expect(page.getByRole("combobox", { name: "How often? Delivery frequency for Brioche (Dozen)" })).toHaveValue("week");
  await expect(page.getByRole("spinbutton", { name: 'Estimated quantity for Brioche Bun 4"' })).toHaveValue("");
  await expect(page.getByRole("combobox", { name: 'How often? Delivery frequency for Brioche Bun 4"' })).toHaveValue("unsure");
  await page.getByRole("combobox", { name: "How often? Delivery frequency for Brioche (Dozen)" }).selectOption("once");
  await page.getByRole("textbox", { name: "Product-specific notes for Brioche (Dozen)" }).fill("Holiday tray only.");
  await page.reload();
  await expect(page.getByRole("combobox", { name: "How often? Delivery frequency for Brioche (Dozen)" })).toHaveValue("once");
  await expect(page.getByRole("textbox", { name: "Product-specific notes for Brioche (Dozen)" })).toHaveValue("Holiday tray only.");
  await expect(page.getByRole("spinbutton", { name: 'Estimated quantity for Brioche Bun 4"' })).toHaveValue("");

  await page.getByRole("button", { name: "Business", exact: true }).click();
  await page.locator("#inquiry-business").fill("Key Cafe");
  await page.locator("#inquiry-type").selectOption("cafe");
  await page.locator("#inquiry-contact").fill("Ada Baker");
  await page.locator("#inquiry-email").fill("ada@example.com");
  await page.locator("#inquiry-phone").fill("3035550100");
  await expect(page.locator("#inquiry-frequency")).toHaveCount(0);
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await page.locator("#inquiry-delivery").fill("Denver");
  await page.locator("#inquiry-consent").check();
  await page.getByRole("button", { name: "Review", exact: true }).click();

  const review = page.getByTestId("inquiry-confirmation");
  await expect(review).toBeVisible();
  await expect(review.getByText("Estimated quantities only; pricing and delivery are subject to confirmation.")).toBeVisible();
  await expect(review.getByText(/Brioche \(Dozen\) — 2 dozen, one-time/)).toBeVisible();
  await expect(review.getByText(/Brioche Bun 4" — Not sure/)).toBeVisible();
  await expect(review.getByRole("term", { name: "How often" })).toHaveCount(0);
  await expect(review.locator("#request-preview")).toContainText("2 dozen, one-time");
  await expect(review.locator("#request-preview")).toContainText("Not sure");
  await expect(review.locator("#request-preview")).not.toContainText("How often:");
});

test("an older saved draft keeps its quantity as per delivery", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "bluepoint-demo-request-v1",
      JSON.stringify({
        businessName: "Key Cafe",
        businessType: "cafe",
        contactName: "Ada Baker",
        contactEmail: "ada@example.com",
        contactPhone: "3035550100",
        weeklyQuantity: "about 20 dozen",
        orderFrequency: "few-times",
        notes: "Side door.",
        consent: true,
        deliveryCity: "Denver",
        days: ["Tuesday"],
        lines: [
          {
            productId: "dinner-rolls-brioche-dozen",
            qty: 4,
            unit: "dozen",
            slice: "",
            wrapped: false,
            dipped: "",
          },
        ],
      }),
    );
  });
  await page.goto("/wholesale/#request-lines");
  await expect(page.getByRole("spinbutton", { name: "Estimated quantity for Brioche (Dozen)" })).toHaveValue("4");
  await expect(page.getByRole("combobox", { name: "How often? Delivery frequency for Brioche (Dozen)" })).toHaveValue("delivery");
  await page.getByRole("button", { name: "Review", exact: true }).click();
  const review = page.getByTestId("inquiry-confirmation");
  await expect(review.getByText(/Brioche \(Dozen\) — 4 dozen per delivery/)).toBeVisible();
  await expect(review.getByRole("definition").filter({ hasText: "Side door." })).toContainText(
    "Earlier answer, not a product schedule: how often — A few times a week.",
  );
  await expect(review.getByRole("definition").filter({ hasText: "about 20 dozen" })).toBeVisible();
  await expect(review.getByRole("term", { name: "How often" })).toHaveCount(0);
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
  await page.getByRole("button", { name: "Continue to review" }).click();
  await expect(page.getByTestId("inquiry-form").getByRole("alert")).toContainText("Enter a delivery city.");
  await page.locator("#inquiry-delivery").fill("Denver");
  await page.getByRole("button", { name: "Continue to review" }).click();
  await expect(page.getByTestId("inquiry-form").getByRole("alert")).toContainText("does not submit your inquiry");
  await page.getByRole("checkbox", { name: /this is a preview and my information will not be sent automatically/i }).check();
  await page.getByRole("button", { name: "Continue to review" }).click();
  await expect(page.getByTestId("inquiry-confirmation")).toContainText(
    "Preview only — not submitted",
  );
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Sesame kaiser rolls");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("sales@bluepointbakery.com");

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
  await page.getByRole("checkbox", { name: /I'd like to ask about trying a product first/i }).focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Continue to delivery" }).focus();
  await page.keyboard.press("Enter");
  await fillWithKeyboard("#inquiry-delivery", "Denver");
  await page.locator("#inquiry-consent").focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Continue to review" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Keyboard Cafe");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Kaiser rolls");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Interested in trying products first");
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
    await expect(page.locator("#mobile-menu").getByRole("link", { name: "Request a quote" })).toBeVisible();
    await expect(page.locator("#mobile-menu").getByRole("link", { name: "Order online (existing customers)" })).toBeVisible();
    expect(await overflow(page)).toBeLessThanOrEqual(1);
  });
}

test("what are you making filters the catalog and the spec card uses published fields", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Burgers & Sliders/ }).click();
  await expect(page.getByRole("heading", { name: 'Brioche Bun 4"' })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Curved Butter Croissant 3 oz" })).toHaveCount(0);
  await expect(page.getByText(/Available bun sizes include/)).toBeVisible();
  const card = page.locator(".product-card", { hasText: 'Brioche Bun 4"' });
  await expect(card.locator("summary")).toHaveCount(0);
  await expect(card.getByText("Not marked")).toHaveCount(0);
  await expect(card.getByText("Published size")).toHaveCount(0);
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
    const action = page.getByRole("link", { name: "Review my selections" });
    await expect(action).toBeVisible();
    await expect(width < 768 ? page.locator(".header-call") : page.getByTestId("quick-actions")).toBeVisible();
    if (width < 768) await expect(page.getByTestId("quick-actions")).toBeHidden();
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
      await expect(page.locator("#mobile-menu nav").getByRole("link", { name: "Request a quote" })).toBeVisible();
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
  await expect(page.getByRole("tabpanel")).toContainText("Nosh Catering");
  await expect(page.getByRole("tabpanel").locator(".verified-client-mark")).toHaveCount(3);
});

test("home delivery lookup qualifies city and does not promise a specific route", async ({ page }) => {
  await page.goto("/");
  await page.locator("#home-delivery-city").fill("Denver");
  await expect(page.getByRole("status").filter({ hasText: "Denver" }).first()).toBeVisible();
  await expect(page.locator(".home-delivery-check")).toContainText("confirm service to your address");
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
  await page.getByRole("checkbox", { name: /I'd like to ask about trying a product first/i }).check();
  await page.locator("#inquiry-sample-products").fill("hamburger buns");
  await page.goto("/breads/");
  await page.goto("/wholesale/");
  await page.getByRole("button", { name: "Business", exact: true }).click();
  await expect(page.locator("#inquiry-business")).toHaveValue("A Test Kitchen");
  await expect(page.locator("#inquiry-quantity")).toHaveValue("40 dozen per week");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: /I'd like to ask about trying a product first/i })).toBeChecked();
  await expect(page.locator("#inquiry-products")).toHaveValue("Hamburger buns");
  await page.getByRole("button", { name: "Continue to delivery" }).click();
  await page.locator("#inquiry-delivery").fill("Denver");
  await page.getByRole("checkbox", { name: /this is a preview and my information will not be sent automatically/i }).check();
  await page.getByRole("button", { name: "Continue to review" }).click();
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("40 dozen per week");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Interested in trying products first");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("hamburger buns");
  await page.getByRole("button", { name: "Clear request" }).click();
  await expect(page.locator("#inquiry-business")).toHaveValue("");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: /I'd like to ask about trying a product first/i })).not.toBeChecked();
});

test("homepage offers truthful commercial steps, sample question and published customer marks", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "From first conversation to first order." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ask about samples" })).toHaveAttribute("href", /wholesale.*sample-request/);
  await expect(page.locator(".verified-client-strip img")).toHaveCount(17);
  await expect(page.locator(".verified-client-mark").filter({ hasText: "The Cherry Cricket" })).toBeVisible();
  await expect(page.locator(".verified-client-wordmark")).toHaveCount(0);
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
  await expect(panel).not.toContainText("West Main");
  await expect(panel.locator(".use-shots")).toHaveCount(0);
  await expect(panel).not.toContainText("Ask permission before using this product photo on a live site.");
  await expect(panel.getByRole("img", { name: "West Main burger on a bun, with fries" })).toHaveCount(0);
  await expect(panel.getByRole("img", { name: "West Main Reuben on marble rye, with fries" })).toHaveCount(0);
  await expect(panel).toContainText("Revolver Kitchen");
  await expect(panel).toContainText("Red Cedar Bistro");
  await expect(panel).toContainText("Oskar Blues Fooderies");
  await expect(panel).toContainText("Wynkoop Brewing Company");
  await expect(panel).toContainText("New Belgium Brewing — DEN Airport");
  await expect(panel).not.toContainText("Public post");
  await expect(panel).not.toContainText("Cafe 180");
  await expect(panel).not.toContainText("Urban Egg");
  await expect(panel).not.toContainText("Meet the Makers");
  await expect(panel).not.toContainText("Stuffed French Toast");
  await expect(panel).not.toContainText("Windsor Lake");
  await expect(panel).not.toContainText("GrowHaus");
  await expect(panel).not.toContainText("FIRE Foundation");
  await expect(panel.locator(".verified-client-mark")).toHaveCount(17);
  await expect(page.locator(".verified-client-strip img")).toHaveCount(17);
  const restaurantNames = await panel.locator(".verified-client-mark strong").allTextContents();
  expect(new Set(restaurantNames).size).toBe(restaurantNames.length);

  await page.getByRole("tab", { name: "Restaurants & pubs" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Cafés & coffee shops" })).toHaveAttribute("aria-selected", "true");
  await expect(panel).not.toContainText("Cafe 180");
  await expect(panel.locator(".use-shots")).toHaveCount(0);
  await expect(panel.getByRole("img", { name: "Cafe 180 sandwiches on toasted bread" })).toHaveCount(0);
  await expect(panel.locator(".verified-client-strip")).not.toContainText("Ask permission before using this product photo on a live site.");
  await expect(panel).toContainText("Urban Egg");
  await expect(panel.locator(".verified-client-mark").filter({ hasText: "Urban Egg" })).toHaveCount(1);
  await expect(panel).not.toContainText("Public post: Meet the Makers.");
  await expect(panel).not.toContainText("Urban Egg · Meet the Makers · October");
  await expect(panel).not.toContainText("Public post, not a testimonial.");
  await expect(panel.locator(".cafe-pull")).toContainText("Bluepoint Bakery, the family- and minority-owned bakery behind so many of our breads");
  await expect(panel.locator(".cafe-pull")).toContainText("created the Stuffed French Toast Brioche specifically for Urban Egg!");
  await expect(panel.locator(".cafe-pull footer")).toHaveText("Urban Egg, Meet the Makers");
  await expect(panel.locator(".cafe-pull .illustrative-label")).toHaveText("Edges extended with AI");
  await expect(panel.locator(".cafe-pull .making-permission")).toContainText("Customer plate.");
  await expect(panel.locator(".cafe-pull .making-permission")).toContainText("Ask permission before using this product photo on a live site.");
  const cafeOrder = await page.evaluate(() => {
    const strip = document.querySelector(".verified-client-strip");
    const pull = document.querySelector(".cafe-pull");
    if (!strip || !pull) return false;
    const stripFirst = (strip.compareDocumentPosition(pull) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    return stripFirst && strip.getBoundingClientRect().bottom <= pull.getBoundingClientRect().top + 1;
  });
  expect(cafeOrder).toBe(true);
  await expect(panel).not.toContainText("Blue Point Brewing");
  await expect(panel).toContainText("Fluid Coffee Bar");
  await expect(panel).toContainText("Urban Cafe Denver");
  await expect(panel).toContainText("Windsor Lake Cafe & Marketplace");
  await expect(panel.getByText("Ordering for our coffee shop for over 10 years")).toHaveCount(1);
  await expect(panel).toContainText("Restaurantji");
  await expect(panel).not.toContainText("West Main");
  await expect(panel).not.toContainText("The Cherry Cricket");
  await expect(panel.locator(".verified-client-mark")).toHaveCount(4);
  await expect(page.locator(".verified-client-strip img")).toHaveCount(4);

  await page.getByRole("tab", { name: "Hotels & catering" }).click();
  await expect(panel).toContainText("Nosh Catering");
  await expect(panel).toContainText("Front Porch Coffee Shop — Event Catering");
  await expect(panel).toContainText("Vīb Hotel Denver RiNo — Lobby Café");
  await expect(panel).not.toContainText("Public post");
  await expect(panel).not.toContainText("confirm with bakery");
  await expect(panel.locator(".verified-client-mark")).toHaveCount(3);
  await expect(page.locator(".verified-client-strip img")).toHaveCount(3);

  await page.getByRole("tab", { name: "Institutions" }).click();
  await expect(panel).toContainText("University of Colorado Boulder");
  await expect(panel).toContainText("Regis University — Ranger Dining");
  await expect(panel).toContainText("Arapahoe Libraries");
  await expect(panel).not.toContainText("New Belgium Brewing — DEN Airport");
  await expect(panel).not.toContainText("GrowHaus");
  await expect(panel).not.toContainText("Public post");
  await expect(panel).not.toContainText("confirm with bakery");
  await expect(panel.locator(".verified-client-mark")).toHaveCount(3);
  await expect(page.locator(".verified-client-strip img")).toHaveCount(3);

  await page.goto("/community/");
  await expect(page.locator(".community-page")).toContainText("The GrowHaus");
  await expect(page.locator(".community-page")).toContainText("food-box program");
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
    await page.getByRole("tab", { name: "Hotels & catering" }).click();
    await expect(page.getByRole("tabpanel").getByText("Nosh Catering")).toBeVisible();
    await page.locator("#customers").screenshot({
      path: `test-results/buyer-proof-hotels-${width}.png`,
      animations: "disabled",
    });
    await page.getByRole("tab", { name: "Institutions" }).click();
    await expect(page.getByRole("tabpanel").getByText("Arapahoe Libraries")).toBeVisible();
    await page.locator("#customers").screenshot({
      path: `test-results/buyer-proof-institutions-${width}.png`,
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
    await expect(page.locator(".home-story")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText("Our story");
    expect(await overflow(page), String(width)).toBeLessThanOrEqual(1);
  }
  await page.goto("/");
  const icon = await page.locator('link[rel="icon"][href*="icon.svg"]').count();
  expect(icon).toBeGreaterThan(0);
  expect(await page.locator('link[rel="icon"][href*="icon.png"]').count()).toBe(0);
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
  await page.getByRole("checkbox", { name: /this is a preview and my information will not be sent automatically/i }).check();
  await page.getByRole("button", { name: "Continue to review" }).click();
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
  await expect(page.locator('main a[href="mailto:sales@bluepointbakery.com"]').first()).toBeVisible();
});

test("homepage separates illustrative menu applications from actual bakery product assortment", async ({ page }) => {
  await page.goto("/");
  const applications = page.locator(".application-section");
  const assortment = page.locator(".assortment");
  await expect(applications.getByRole("heading", { name: "What are you making?" })).toBeVisible();
  await expect(assortment.getByRole("heading", { name: "Explore Our Bakery Products" })).toBeVisible();
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
  await expect(breakfast.locator("img")).toHaveAttribute("src", /\/images\/use\/stuffed-french-toast\.webp/);
  await expect(dinner.locator("img")).toHaveAttribute("src", /\/images\/illustrative\/app-dinner/);
  await expect(burgers.locator(".illustrative-label")).toHaveCount(0);
  await expect(sandwiches.locator(".illustrative-label")).toHaveCount(0);
  await expect(breakfast.locator(".illustrative-label")).toHaveText("Edges extended with AI");
  await expect(dinner.locator(".illustrative-label")).toHaveText("Illustrative image");
  await expect(burgers.locator(".making-permission")).toContainText("Ask permission before using this product photo on a live site.");
  await expect(sandwiches.locator(".making-permission")).toContainText("Ask permission before using this product photo on a live site.");
  await expect(breakfast.locator(".making-permission")).toContainText("Ask permission before using this product photo on a live site.");
  await expect(burgers.locator(".making-permission")).not.toContainText("Illustrative image");
  await expect(sandwiches.locator(".making-permission")).not.toContainText("Illustrative image");
  await expect(breakfast.locator(".making-permission")).not.toContainText("Illustrative image");
  await expect(breakfast.locator(".illustrative-label")).toHaveText("Edges extended with AI");
  await expect(dinner.locator(".making-permission")).toHaveCount(0);
  await expect(applications.locator(".making-footnote")).toContainText("Menu images illustrate serving ideas");
  await expect(applications.locator(".making-footnote")).toContainText("do not identify specific Bluepoint products");
  await expect(applications.locator(".making-footnote")).not.toContainText("Illustrative images, not photographs of Bluepoint products.");
  await expect(assortment.locator(".assortment-card img").first()).toHaveAttribute("src", /scenes\/sesame-buns-rack\.webp/);
  await expect(applications.getByRole("link", { name: /Burgers & Sliders/ })).toHaveAttribute("href", /making\/burgers/);
  await expect(assortment.getByRole("link", { name: /Buns & Rolls/ })).toHaveAttribute("href", /breads\/.*buns/);
  await page.goto("/breads/");
  await expect(page.locator(".featured-spec")).toBeVisible();
  await expect(page.locator(".featured-spec-facts")).not.toContainText("24 hour notice for orders on all breads");
  await expect(page.locator(".featured-spec-facts")).not.toContainText("Published size");
  await expect(page.locator(".featured-spec-facts")).not.toContainText("Not marked");
  await expect(page.locator(".featured-spec-facts")).not.toContainText("Case quantity");
  await expect(page.locator(".featured-spec-facts")).not.toContainText(/confirm with bakery/i);
  await expect(page.locator(".application-section")).toHaveCount(0);
  await page.goto("/pastries/");
  await expect(page.locator(".application-section")).toHaveCount(0);
});

test("delivery truck, Willie, Why Bluepoint, and the breakfast plate render", async ({ page }) => {
  await page.goto("/delivery/");
  const truck = page.locator(".delivery-truck img");
  await expect(truck).toHaveAttribute("src", /delivery-truck\.webp/);
  await expect(truck).toHaveAttribute("alt", /Everybody Must Get Sconed/);
  await expect(page.locator(".delivery-truck figcaption")).toHaveText(
    "Delivered fresh in our own trucks, six days a week.",
  );
  await expect(page.locator(".delivery-truck .illustrative-label")).toHaveCount(0);
  await expect
    .poll(() => truck.evaluate((el) => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0))
    .toBeTruthy();

  await page.goto("/about/");
  const willie = page.locator(".about-portrait img");
  await expect(willie).toHaveAttribute("src", /willie-portrait\.webp/);
  await expect(willie).toHaveAttribute("alt", "Willie in a Bluepoint Bakery uniform");
  await expect(page.locator(".about-portrait figcaption")).toHaveText("Willie Ramirez, owner");
  await expect(page.locator(".about-portrait .illustrative-label")).toHaveCount(0);
  await expect
    .poll(() => willie.evaluate((el) => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0))
    .toBeTruthy();

  const why = page.locator(".why-bluepoint");
  await expect(why.getByRole("heading", { name: "Why businesses choose Bluepoint" })).toBeVisible();
  await expect(why.locator(".why-card")).toHaveCount(6);
  for (const title of ["Fresh, scratch-baked quality", "Colorado roots since 1987", "A wide selection for every menu", "Quality that works for your business", "A team that knows wholesale", "Relationships built on trust"]) {
    await expect(why.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }
  await expect(why).toContainText("handmade, baked fresh");
  await expect(why).toContainText("A family-owned Colorado wholesale bakery since 1987.");
  await expect(why).toContainText("Hundreds of breads, rolls, and pastries, with new products added regularly.");
  await expect(why).toContainText("Quality products, dependable service and practical choices");
  await expect(why).not.toContainText("MVPR");
  await expect(why).not.toContainText("oldest and largest");
  await expect(why).not.toContainText(/confirm with bakery/i);
  await expect(why.locator("img")).toHaveCount(0);
  await page.goto("/wholesale/");
  await expect(page.locator(".why-bluepoint")).toHaveCount(0);
  await expect(page.getByTestId("request-flow")).toBeVisible();

  await page.goto("/");
  const breakfast = page.locator('.making-visual-link[href^="/making/breakfast"]');
  const photo = breakfast.locator("img");
  await expect(photo).toHaveAttribute("src", /stuffed-french-toast\.webp/);
  await expect(photo).toHaveAttribute("alt", "Plated stuffed French toast with berries and custard");
  await expect(breakfast.locator(".making-permission")).toContainText("Customer plate.");
  await expect(breakfast.locator(".making-permission")).toContainText(
    "Shown for this demo. Ask permission before using this product photo on a live site.",
  );
  await expect(breakfast.locator(".illustrative-label")).toHaveText("Edges extended with AI");
  // Chrome lazy-loads below-fold images only when brought into view.
  await photo.scrollIntoViewIfNeeded();
  await expect
    .poll(() => photo.evaluate((el) => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0))
    .toBeTruthy();

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/delivery/");
  const truckLayout = await page.evaluate(() => {
    const copy = document.querySelector(".delivery-intro-copy")!.getBoundingClientRect();
    const photo = document.querySelector(".delivery-truck")!.getBoundingClientRect();
    const img = document.querySelector(".delivery-truck img") as HTMLImageElement;
    return {
      beside: photo.left >= copy.right - 4,
      sameBand: photo.top < copy.bottom && photo.bottom > copy.top,
      height: img.getBoundingClientRect().height,
    };
  });
  expect(truckLayout.beside).toBe(true);
  expect(truckLayout.sameBand).toBe(true);
  expect(truckLayout.height).toBeLessThanOrEqual(362);
  expect(truckLayout.height).toBeGreaterThan(200);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/delivery/");
  const stacked = await page.evaluate(() => {
    const copy = document.querySelector(".delivery-lede")!.getBoundingClientRect();
    const photo = document.querySelector(".delivery-truck")!.getBoundingClientRect();
    return photo.top >= copy.bottom - 2 && photo.left <= copy.left + 2;
  });
  expect(stacked).toBe(true);

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/about/");
  const willieLayout = await page.evaluate(() => {
    const heading = document.querySelector(".willie-copy h2")!.getBoundingClientRect();
    const photo = document.querySelector(".willie-portrait")!.getBoundingClientRect();
    return {
      beside: photo.left >= heading.right - 8,
      sameBand: Math.abs(photo.top - heading.top) < 40,
    };
  });
  expect(willieLayout.beside).toBe(true);
  expect(willieLayout.sameBand).toBe(true);

  await page.goto("/");
  const quotes = page.locator(".buyer-proof-panel > .proof-quotes blockquote");
  await expect(quotes).toHaveCount(2);
  const quoteHeights = await quotes.evaluateAll((nodes) => nodes.map((node) => Math.round(node.getBoundingClientRect().height)));
  expect(Math.abs(quoteHeights[0] - quoteHeights[1])).toBeLessThanOrEqual(2);
  const shortSize = await page.locator(".proof-quote-short p").evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
  const longSize = await page.locator(".buyer-proof-panel > .proof-quotes blockquote:not(.proof-quote-short) p").evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
  expect(shortSize).toBeGreaterThan(longSize + 6);
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
    await expect(width < 768 ? page.locator(".header-call") : page.getByTestId("quick-actions")).toBeVisible();
    if (width < 768) await expect(page.getByTestId("quick-actions")).toBeHidden();
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
  await page.goto("/wholesale/#request-lines");
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
    await expect(badges).toHaveCount(4);
    await expect(badges.nth(0)).toContainText("Colorado Proud");
    await expect(badges.nth(1)).toContainText("Family-owned");
    await expect(badges.nth(2)).toContainText("Minority-owned");
    await expect(badges.nth(3)).toContainText("NMSDC Certified Minority Business Enterprise");
    await expect(badges.nth(3).locator("img")).toHaveAttribute("src", /nmsdc-mbe\.png/);
    const photos = page.locator(".assortment-card .assortment-photo img");
    await expect(photos).toHaveCount(5);
    // Scroll each lazy image into view before checking its decoded asset.
    for (const img of await photos.all()) await img.scrollIntoViewIfNeeded();
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


test("assortment cards are one full-width row on phones", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const tiles = page.locator(".assortment-grid > li");
  await expect(tiles).toHaveCount(5);
  const gridBox = await page.locator(".assortment-grid").boundingBox();
  const boxes = await tiles.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
  expect(gridBox).toBeTruthy();
  for (const width of boxes) {
    expect(width).toBeGreaterThan(gridBox!.width * 0.95);
  }
  const photo = await tiles.first().locator(".assortment-photo").boundingBox();
  expect(photo!.width).toBeGreaterThan(gridBox!.width * 0.9);
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
          const headerBottom = document.querySelector(".sticky-stack")?.getBoundingClientRect().bottom ?? 0;
          const docked = Boolean(document.querySelector(".site-header .quick-actions"));
          const hits: string[] = [];
          for (const el of document.querySelectorAll(selector)) {
            const rect = el.getBoundingClientRect();
            if (rect.width < 2 || rect.height < 2) continue;
            // Scrolled content underneath a sticky header is not visually exposed.
            const visibleTop = docked ? Math.max(rect.top, headerBottom) : rect.top;
            if (visibleTop >= rect.bottom) continue;
            const overlapX = Math.min(rect.right, pill.right) - Math.max(rect.left, pill.left);
            const overlapY = Math.min(rect.bottom, pill.bottom) - Math.max(visibleTop, pill.top);
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
    if (width < 768) {
      await expect(page.locator(".header-call")).toBeVisible();
      expect(fit.pillVisible, `floating contact hidden at ${width}px`).toBeFalsy();
    } else {
      expect(fit.pillVisible, `contact pill visible at ${width}px`).toBeTruthy();
      expect(fit.padBottom, `bottom clearance at ${width}px`).toBeGreaterThanOrEqual(fit.pillHeight);
    }
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
      expect(trust.columns, "trust strip has two columns at 390px").toBe(2);
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
  await expect(about).toContainText("From the bakery floor to business ownership: Willie Ramirez");
  await expect(about).toContainText("spending 28 years baking, managing operations");
  await expect(about).not.toContainText("does not give a date");
  await expect(about).not.toContainText("Westword");
  await expect(about).not.toContainText("Best of Denver");
  await expect(about).not.toContainText("44 Business");
  await expect(about).not.toContainText("Outstanding Small Business");
  await expect(about).not.toContainText("AFP Colorado Chapter");
  await expect(about.getByRole("link", { name: "Recognized for giving back — see our community work" })).toHaveAttribute(
    "href",
    "/community/#recognition",
  );
  await expect(about).toContainText("tradition as a minority-owned, family-owned Colorado bakery, combining scratch baking");
  await expect(about).toContainText("minority-owned, family-owned");
  await expect(about).toContainText("We also deliver to Cheyenne and nearby communities in Wyoming.");
  await expect(page.locator(".about-figure figcaption")).toHaveText("Willie Ramirez, owner");
  await expect(page.locator(".about-portrait img")).toHaveAttribute("src", /willie-portrait\.webp/);
  await expect(page.locator(".about-portrait .illustrative-label")).toHaveCount(0);
  await expect(page.locator('.about-gallery img[alt="Baguettes on a rack"]')).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).not.toContainText("Willie");
  await expect(page.getByRole("heading", { name: "From the bakery floor to business ownership: Willie Ramirez" })).toBeVisible();

  await page.goto("/community/");
  await expect(page.locator(".community-page")).toContainText("Project Angel Heart");
  await expect(page.locator(".community-page")).toContainText("CASA of Adams");
  await expect(page.locator(".community-page")).toContainText("GrowHaus");
  await expect(page.locator(".community-page")).toContainText("Soup for the Soul");
  await expect(page.locator(".community-page")).not.toContainText("Mountain Sun");
  await expect(page.locator(".community-page")).not.toContainText("Oskar Blues");
  await expect(page.locator(".community-page")).not.toContainText("Cherry Cricket");
  const approvedGiving =
    "In 2016, the Colorado chapter of the Association of Fundraising Professionals named Bluepoint Bakery Outstanding Small Business at its National Philanthropy Day luncheon. That giving continues today. Since 2009 we've baked and donated every pie for Project Angel Heart's Pie in the Sky, and we support CASA of Adams & Broomfield Counties, The GrowHaus and Soup for the Soul.";
  await expect(page.locator("#recognition")).toContainText(approvedGiving);
  await expect(page.locator("#recognition")).not.toContainText("Community involvement has long been part");
  await expect(page.locator(".community-page")).toContainText("Outstanding Small Business");
  await expect(page.locator(".community-page")).not.toContainText("AFP");
  await expect(page.locator(".community-page")).toContainText("holiday sugar cookies");
  await expect(page.locator(".community-page")).toContainText("raised over $15,000");
  await expect(page.locator(".community-page")).toContainText("food-box program");
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
  await expect(page.locator(".brand-trust")).toContainText("Made in Colorado");
  await expect(page.locator(".brand-trust")).toContainText("Family-owned");
  await expect(page.locator(".brand-trust")).toContainText("Minority-owned");
  await expect(page.locator(".brand-trust")).toContainText("NMSDC Certified Minority Business Enterprise");
  await expect(page.locator(".brand-trust img[alt='NMSDC Certified Minority Business Enterprise badge']")).toBeVisible();
  await expect(page.locator(".brand-trust")).not.toContainText("not a certification");
  await expect(page.locator(".brand-trust")).not.toContainText("Outstanding Small Business");
  await expect(page.locator(".brand-trust")).not.toContainText("AFP");
  await expect(page.getByRole("heading", { name: "Giving back to the communities we serve" })).toHaveCount(1);
  await expect(page.locator(".home-community")).toContainText(
    "Our commitment to Colorado goes beyond the bakery. We're proud to support organizations that make a difference in our communities.",
  );
  await expect(page.locator(".home-community")).not.toContainText("Association of Fundraising Professionals");
  await expect(page.locator("main")).not.toContainText("Association of Fundraising Professionals");
  await expect(page.locator(".home-community")).not.toContainText("prepared and donated all the pies");
  await expect(page.locator("main")).not.toContainText("Community involvement has long been part");
  const tiles = page.locator(".home-charity-tile");
  await expect(tiles).toHaveCount(4);
  const logos = [
    ["community-logos/project-angel-heart.png", "Project Angel Heart logo", "Project Angel Heart: Pie in the Sky"],
    ["community-logos/casa.png", "CASA of Adams & Broomfield Counties logo", "CASA of Adams & Broomfield Counties"],
    ["community-logos/growhaus.png", "The GrowHaus logo", "The GrowHaus"],
    ["community-logos/soup-for-the-soul.png", "Soup for the Soul logo", "Soup for the Soul"],
  ] as const;
  for (const [index, [src, alt, caption]] of logos.entries()) {
    await expect(tiles.nth(index).locator("img")).toHaveAttribute("src", new RegExp(src.replace("/", "\\/")));
    await expect(tiles.nth(index).locator("img")).toHaveAttribute("alt", alt);
    await expect(tiles.nth(index)).toContainText(caption);
  }
  await expect(page.locator(".home-community .home-charity-placeholder")).toHaveCount(0);
  await expect(page.locator(".home-community .illustrative-label")).toHaveCount(0);
  await expect(page.locator(".home-community .btn")).toHaveText("Community partners");
  await expect(page.locator(".home-community .btn")).toHaveAttribute("href", /\/community\/?$/);
  const proof = page.locator("#customers");
  await expect(proof).toContainText("The Cherry Cricket");
  await expect(proof).toContainText("Mountain Sun");
  await expect(proof.locator(".verified-client-strip img[alt*='Oskar Blues']")).toBeVisible();
  await expect(proof).not.toContainText("Customer listed on Bluepoint's community page");
  await expect(proof.locator(".use-shots")).toHaveCount(0);
  await expect(proof).not.toContainText("Ask permission before using this product photo on a live site.");
  await expect(proof).not.toContainText(/kicks ass/i);
  await expect(proof.locator(".verified-client-strip img")).toHaveCount(17);
  await expect(proof.getByRole("heading", { name: "Named in public" })).toHaveCount(0);
  await expect(proof).not.toContainText("West Main");
  await expect(proof).not.toContainText("Cafe 180");
  await expect(proof.locator(".verified-client-wordmark")).toHaveCount(0);
  await expect(proof.getByRole("img", { name: "The Cherry Cricket logo" })).toBeVisible();
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
    await expect(page.locator(".approved-hero .lede")).toContainText("Front Range");
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
    const scratchLines = await page.locator(".hero-keep").evaluate((el) => el.getClientRects().length);
    expect(scratchLines, `Scratch-Baked stays on one line at ${width}`).toBe(1);

    await expect(page.locator(".site-header .heritage-logo")).toHaveAttribute("src", /bluepoint-logo\.png/);
    await expect(page.locator(".hero .heritage-logo, .approved-hero-logo")).toHaveCount(0);
    await expect(page.locator(".making-footnote")).toContainText("do not identify specific Bluepoint products");

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

    const contactBox = await page.getByRole("button", { name: "Contact", exact: true }).boundingBox();
    expect(contactBox!.height).toBeGreaterThanOrEqual(44);
    expect(contactBox!.width).toBeGreaterThanOrEqual(44);
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
  const dialog = page.getByRole("dialog", { name: "Contact Bluepoint" });
  const call = dialog.getByRole("link", { name: /^Call / });
  await expect(call).toHaveAttribute("href", "tel:+13032981100");
  await expect(dialog.getByRole("link", { name: "Email sales" })).toHaveAttribute("href", "mailto:sales@bluepointbakery.com");
  await expect(dialog.getByRole("link", { name: "Request a quote" })).toHaveAttribute("href", /\/wholesale\/#wholesale-request$/);
  const panelLink = await call.boundingBox();
  expect(panelLink!.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

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

test("contact page keeps its editorial columns readable across desktop widths", async ({ page }) => {
  for (const width of [1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact/");
    const fit = await page.evaluate(() => {
      const intro = document.querySelector("main h1")!.getBoundingClientRect();
      const methods = document.querySelector('main section[aria-label="Contact our Denver team"]')!.getBoundingClientRect();
      const help = document.querySelector('main h2[id="contact-help-heading"]')!.getBoundingClientRect();
      return {
        introLeft: intro.left,
        methodsRight: methods.right,
        helpLeft: help.left,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(fit.methodsRight, `contacts alongside intro at ${width}`).toBeGreaterThan(fit.introLeft);
    expect(Math.abs(fit.introLeft - fit.helpLeft), `column alignment at ${width}`).toBeLessThanOrEqual(1);
    expect(fit.overflow).toBeLessThanOrEqual(1);
  }
});

test("contact page is usable without cards or forms at phone, tablet, desktop widths", async ({ page }) => {
  for (const width of [375, 390, 430, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact/");
    await expect(page.getByRole("heading", { level: 1, name: "Let's talk bakery." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "How can we help?" })).toBeVisible();
    await expect(page.locator('main a[href="tel:+13032981100"]')).toHaveCount(1);
    await expect(page.locator('main a[href="mailto:sales@bluepointbakery.com"]')).toHaveCount(1);
    await expect(page.locator("main").getByRole("link", { name: /Start a wholesale inquiry/ })).toHaveAttribute("href", "/wholesale/");
    await expect(page.locator("main").getByRole("link", { name: /Order online/ })).toHaveAttribute("href", /bakery\.software/);
    await expect(page.locator("main").getByRole("link", { name: /Pay an invoice/ })).toHaveAttribute("href", /paywholesail/);
    await expect(page.getByRole("link", { name: /Get directions/ })).toHaveAttribute("href", /google\.com\/maps/);
    await expect(page.getByRole("link", { name: /Explore delivery areas/ })).toHaveAttribute("href", "/delivery/");
    await expect(page.locator('main form, main [data-testid="contact-message-form"], main .map-frame')).toHaveCount(0);
    const fit = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rows: document.querySelectorAll('main article[class*="helpCard"]').length,
    }));
    expect(fit.overflow, `overflow at ${width}`).toBeLessThanOrEqual(1);
    expect(fit.rows).toBe(3);
  }
});

test("inner pages have a consistent linked Home breadcrumb", async ({ page }) => {
  for (const path of ["/breads/", "/pastries/", "/delivery/", "/about/", "/community/", "/contact/", "/faq/", "/wholesale/"]) {
    await page.goto(path);
    const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(crumbs).toBeVisible();
    await expect(crumbs.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    await expect(crumbs.locator('[aria-current="page"]')).toBeVisible();
  }
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toHaveCount(0);
});

test("catalog search combines with a category filter and can be reset", async ({ page }) => {
  await page.goto("/pastries/");
  await page.getByRole("button", { name: "Scones", exact: true }).click();
  await page.locator("#product-search").fill("blue");
  await expect(page.locator("#scones").getByRole("heading", { name: "Blueberry", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Apple Cinnamon Crunch" })).toHaveCount(0);
  await page.locator("#product-search").fill("zzzznotaproduct");
  await expect(page.getByText("No matching products found. Try a different search or browse another category.")).toBeVisible();
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
  await expect(panel.getByRole("link", { name: "Request a quote for selected products" })).toHaveAttribute("href", /\/wholesale\/?$/);
  await expect(brioche.locator("summary")).toHaveCount(0);
  await expect(brioche.getByText(/confirm with bakery/i)).toHaveCount(0);
  await expect(brioche.getByText("Ask sales for a quote")).toHaveCount(0);
  await expect(brioche.getByText("Not marked")).toHaveCount(0);
});

test("delivery map shows the weekday overview and does not draw a route line", async ({ page }) => {
  await page.goto("/delivery/");
  await expect(page.locator(".city-link")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Delivery routes & days" })).toBeVisible();
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
  await expect(page.locator(".delivery-lede")).toContainText("confirm the street address");
  await expect(page.locator(".delivery-lede")).toContainText("We bake and deliver six days a week");
  await expect(page.getByText("kicks ass")).toHaveCount(0);
});

test("removed testimonial is gone and contact uses published links only", async ({ page }) => {
  for (const path of ["/", "/community/", "/sectors/restaurants/"]) {
    await page.goto(path);
    await expect(page.getByText("kicks ass")).toHaveCount(0);
    await expect(page.getByText("Jason R.")).toHaveCount(0);
  }
  await page.goto("/contact/");
  const main = page.locator("main");
  await expect(main.locator('a[href="mailto:sales@bluepointbakery.com"]').first()).toBeVisible();
  await expect(main.locator('a[href="tel:+13032981100"]').first()).toBeVisible();
  await expect(main.locator('a[href*="google.com/maps"]')).toBeVisible();
  await expect(main.locator('a[href*="bakery.software"]')).toBeVisible();
  await expect(main.locator('a[href*="paywholesail.com"]')).toBeVisible();
  const social = await page.locator(".site-footer .social-row a").evaluateAll((links) => links.map((link) => link.getAttribute("href") || ""));
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

