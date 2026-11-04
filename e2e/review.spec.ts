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
  const fillWithKeyboard = async (selector: string, value: string) => {
    await page.locator(selector).focus();
    await page.keyboard.type(value);
  };
  await fillWithKeyboard("#inquiry-business", "Keyboard Cafe");
  await page.locator("#inquiry-type").focus();
  await page.keyboard.press("ArrowDown");
  await fillWithKeyboard("#inquiry-delivery", "Denver");
  await fillWithKeyboard("#inquiry-contact", "Ada Baker");
  await fillWithKeyboard("#inquiry-email", "ada@example.com");
  await fillWithKeyboard("#inquiry-phone", "3035550199");
  await fillWithKeyboard("#inquiry-quantity", "10 dozen");
  await fillWithKeyboard("#inquiry-products", "Kaiser rolls");
  await fillWithKeyboard("#inquiry-notes", "Please call mornings.");
  await page.getByRole("button", { name: "Preview request" }).focus();
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

test("no timed pop-up interrupts the homepage", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(5400);
  await expect(page.getByTestId("call-notice")).toHaveCount(0);
});

test("the mobile catalog request CTA is unobstructed and contact is in navigation", async ({ page }) => {
  for (const width of [375, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/breads/");
    const action = page.getByRole("link", { name: "Open your request" });
    await expect(action).toBeVisible();
    await expect(page.getByTestId("quick-actions")).toHaveCount(0);
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
  await expect(page.getByRole("tabpanel")).toContainText("breakfast buffets");
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
  await page.locator("#inquiry-delivery").fill("Denver");
  await page.locator("#inquiry-contact").fill("Jo Baker");
  await page.locator("#inquiry-email").fill("jo@example.com");
  await page.locator("#inquiry-phone").fill("3035550199");
  await page.locator("#inquiry-quantity").fill("40 dozen per week");
  await page.locator("#inquiry-products").fill("Hamburger buns");
  await page.getByRole("checkbox", { name: /Ask the bakery whether samples are available/i }).check();
  await page.goto("/breads/");
  await page.goto("/wholesale/");
  await expect(page.locator("#inquiry-business")).toHaveValue("A Test Kitchen");
  await expect(page.locator("#inquiry-quantity")).toHaveValue("40 dozen per week");
  await expect(page.getByRole("checkbox", { name: /Ask the bakery whether samples are available/i })).toBeChecked();
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("40 dozen per week");
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("Please advise whether samples are available");
  await page.getByRole("button", { name: "Clear request" }).click();
  await expect(page.locator("#inquiry-business")).toHaveValue("");
  await expect(page.getByRole("checkbox", { name: /Ask the bakery whether samples are available/i })).not.toBeChecked();
});

test("homepage offers truthful commercial steps, sample question and published customer marks", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "From your menu to the right order." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ask about samples" })).toHaveAttribute("href", /wholesale.*sample-request/);
  await expect(page.locator(".verified-client-strip img")).toHaveCount(2);
  await expect(page.locator(".verified-client-wordmark")).toContainText("The Cherry Cricket");
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
    await expect(page.locator(".site-header .original-header-logo")).toHaveAttribute("src", /bluepoint-logo-refresh\.svg/);
    await expect(page.getByRole("heading", { name: "Fresh, Scratch-Baked Breads, Rolls & Pastries" })).toBeVisible();
    await expect(page.locator(".approved-hero-benefits li")).toHaveCount(3);
    await expect(page.locator(".seamless-hero-media .hero-bread")).toHaveCount(0);
    await expect(page.locator(".seamless-hero-photo")).toHaveAttribute("src", /hero-assortment\.avif/);
    await expect(page.locator(".seamless-hero-media .approved-product")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Explore Our Products/ })).toHaveAttribute("href", /breads/);
    await expect(page.getByRole("link", { name: "Request a Wholesale Account" })).toHaveAttribute("href", /wholesale/);
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
  await page.locator("#inquiry-delivery").fill("Denver");
  await page.locator("#inquiry-contact").fill("Alex Baker");
  await page.locator("#inquiry-email").fill("alex@example.com");
  await page.locator("#inquiry-phone").fill("3035550123");
  await page.locator("#inquiry-products").fill("Also interested in a custom sandwich roll.");
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(page.getByTestId("inquiry-confirmation")).toContainText('Brioche Bun 4"');
  await expect(page.getByTestId("inquiry-confirmation")).toContainText("custom sandwich roll");
});

test("sector pages show useful related catalog links; contact email is clickable", async ({ page }) => {
  await page.goto("/sectors/cafes/");
  await expect(page.getByRole("navigation", { name: /Explore more for Cafés and coffee shops/ })).toContainText("Coffee and breakfast");
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
  await expect(applications.locator(".making-visual-link img").first()).toHaveAttribute("src", /unsplash\.com/);
  await expect(assortment.locator(".assortment-card img").first()).toHaveAttribute("src", /scenes\/sesame-buns-rack\.webp/);
  await expect(applications.getByRole("link", { name: /Burgers & Sliders/ })).toHaveAttribute("href", /making\/burgers/);
  await expect(assortment.getByRole("link", { name: /Buns & Rolls/ })).toHaveAttribute("href", /breads\/.*buns/);
  await page.goto("/breads/");
  await expect(page.locator(".featured-spec")).toBeVisible();
  await expect(page.locator(".featured-spec-facts")).toContainText("Case quantity");
  await expect(page.locator(".application-section")).toHaveCount(0);
  await page.goto("/pastries/");
  await expect(page.locator(".application-section")).toHaveCount(0);
});


test("mobile opening screen visibly includes bakery photography and a clear action", async ({ page }) => {
  for (const width of [375, 390, 430, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const photograph = page.locator(".mobile-hero-photograph");
    const image = photograph.locator("img");
    await expect(photograph).toBeVisible();
    await expect.poll(() => image.evaluate((el) => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0), { timeout: 18000 }).toBeTruthy();
    const bounds = await photograph.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.y, `photograph begins inside first screen at ${width}px`).toBeLessThan(720);
    await expect(page.getByRole("link", { name: /Explore Our Products/ })).toBeVisible();
    await expect(page.getByTestId("quick-actions")).toHaveCount(0);
    expect(await overflow(page), `overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".mobile-hero-photograph")).toBeHidden();
  await expect(page.locator(".seamless-hero-media")).toBeVisible();
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
  await expect(page.locator(".inquiry-catalog .product-card")).toHaveCount(0);
  await expect(page.locator("#inquiry-picker-product")).toBeVisible();
  await page.locator("#inquiry-picker-product").selectOption({ label: 'Brioche Bun 4"' });
  await page.getByRole("button", { name: "Add selected product" }).click();
  await expect(page.locator(".inquiry")).toContainText('Brioche Bun 4"');
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
