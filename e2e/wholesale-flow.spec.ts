import fs from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const ORDER_URL = "https://us.bakery.software/app/bluepoint/us/-1/Account/Login";
const PAY_URL = "https://app.paywholesail.com/portal/bluepointbakery";

async function fillBusiness(page: Page) {
  await page.locator("#inquiry-business").fill("Key Cafe");
  await page.locator("#inquiry-type").selectOption("cafe");
  await page.locator("#inquiry-contact").fill("Ada Baker");
  await page.locator("#inquiry-email").fill("ada@example.com");
  await page.locator("#inquiry-phone").fill("3035550100");
  await page.locator("#inquiry-quantity").fill("about 20 dozen");
  await page.getByRole("button", { name: "Continue to products" }).click();
}

async function resetRequest(page: Page) {
  await page.goto("/wholesale/");
  await page.locator(".request-flow").waitFor();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.getByTestId("inquiry-form").waitFor();
}

test("product options follow the catalog and an early date warns without blocking", async ({ page }) => {
  await resetRequest(page);
  await fillBusiness(page);
  const picker = page.locator("#inquiry-picker-product");
  await picker.selectOption("deli-loaves-vienna-white");
  await page.getByRole("button", { name: "Add selected product" }).click();
  await picker.selectOption("buns-brioche-bun-4-in");
  await page.getByRole("button", { name: "Add selected product" }).click();
  await picker.selectOption("biscotti-almond");
  await page.getByRole("button", { name: "Add selected product" }).click();
  await picker.selectOption("quick-breads-pumpkin-chocolate");
  await page.getByRole("button", { name: "Add selected product" }).click();
  await picker.selectOption("brownies-plain-no-fudge-no-nut");
  await page.getByRole("button", { name: "Add selected product" }).click();
  await picker.selectOption("specialty-breads-sourdough-boule-8-oz");
  await page.getByRole("button", { name: "Add selected product" }).click();

  await expect(page.getByRole("combobox", { name: "Slice thickness for Vienna White" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: /Slice thickness for Brioche Bun/ })).toHaveCount(0);
  await expect(page.getByRole("combobox", { name: "Dipped or undipped for Almond" })).toHaveValue("");
  await expect(page.getByRole("combobox", { name: "Pack size for Pumpkin Chocolate" })).toHaveValue("");
  await expect(page.getByRole("checkbox", { name: "Mention individual wrapping for Pumpkin Chocolate" })).toHaveCount(0);
  const brownieWrap = page.getByRole("checkbox", { name: "Mention individual wrapping for Plain (no fudge, no nut)" });
  await expect(brownieWrap).not.toBeChecked();
  await brownieWrap.check();

  await page.getByRole("button", { name: "Continue to delivery" }).click();
  await expect(page.locator("#request-errors")).toContainText("Choose a published slice thickness for Vienna White.");
  await expect(page.locator("#request-errors")).toContainText("Choose a published pack size for Pumpkin Chocolate.");
  await page.getByRole("combobox", { name: "Slice thickness for Vienna White" }).selectOption('5/8"');
  await page.getByRole("combobox", { name: "Pack size for Pumpkin Chocolate" }).selectOption("loaf");
  await page.getByRole("spinbutton", { name: "Estimated quantity for Pumpkin Chocolate" }).fill("2");
  await page.getByRole("combobox", { name: "Dipped or undipped for Almond" }).selectOption("undipped");
  await page.locator("#inquiry-custom-family").selectOption("breads");
  await page.locator("#inquiry-custom-size").fill("a diameter to discuss");
  await page.locator("#inquiry-custom-packaging").fill("a pack to discuss");
  await page.locator("#inquiry-products").fill("Also a seeded roll to discuss");
  await page.getByRole("checkbox", { name: /I'd like to ask about trying a product first/i }).check();
  await page.locator("#inquiry-sample-products").fill("Vienna White");
  await page.getByRole("button", { name: "Continue to delivery" }).click();

  await page.locator("#inquiry-delivery").fill("80216");
  await expect(page.getByTestId("delivery-status")).toContainText("ZIP code is not used to confirm delivery");
  await expect(page.getByTestId("delivery-status")).not.toContainText("Confirmed published area");
  await page.locator("#inquiry-delivery").fill("Denver");
  await expect(page.getByTestId("delivery-status")).toContainText("Confirmed published area: Denver Metro Area");
  await expect(page.getByTestId("delivery-status")).toContainText("does not confirm the street address");
  await expect(page.getByRole("link", { name: "See the delivery map" })).toHaveAttribute("href", /\/delivery\/?$/);
  await page.getByRole("button", { name: "Tuesday", exact: true }).click();
  await expect(page.getByRole("button", { name: "Tuesday", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Sunday", exact: true })).toHaveAttribute("aria-pressed", "false");

  await page.locator("#inquiry-start").fill("2020-01-01");
  await expect(page.getByTestId("date-status")).toContainText("earlier than the published notice");
  await expect(page.getByTestId("date-status")).toContainText("longer notice applies");
  await page.getByRole("checkbox", { name: /concept site does not submit this request/i }).check();
  await page.getByRole("button", { name: "Preview request" }).click();

  const review = page.getByTestId("inquiry-confirmation");
  await expect(review).toContainText("This is a preview only. No message has been sent to Bluepoint Bakery.");
  await expect(review).toContainText("This concept site does not submit wholesale requests.");
  await expect(review).toContainText('Vienna White — Per week, quantity not estimated; slice 5/8"');
  await expect(review).toContainText("Pumpkin Chocolate — 2 loaf per week");
  await expect(review).toContainText("Almond — Per week, quantity not estimated; undipped");
  await expect(review).toContainText("individually wrapped");
  await expect(review).toContainText("Also a seeded roll to discuss");
  await expect(review).toContainText("a diameter to discuss");
  await expect(review).toContainText("a pack to discuss");
  await expect(review).toContainText("Examples to discuss.");
  await expect(review).toContainText("Interested in trying products first");
  await expect(review).toContainText("Tuesday (preferences, not a confirmed route)");
  await expect(review).toContainText("earlier than the published notice");
  await expect(review).not.toContainText("$");
  await expect(page.getByRole("button", { name: "Send to Bluepoint (demo: not connected)" })).toBeDisabled();

  await page.getByRole("button", { name: "Edit products" }).click();
  await expect(page.locator("#inquiry-products")).toHaveValue("Also a seeded roll to discuss");
  await page.locator("#inquiry-products").fill("A different roll to discuss");
  await page.getByRole("button", { name: "Continue to delivery" }).click();
  await page.getByRole("button", { name: "Preview request" }).click();
  await expect(review).toContainText("A different roll to discuss");
  await expect(review).toContainText("Key Cafe");
  await expect(review).not.toContainText("Also a seeded roll to discuss");

  await page.evaluate(() => {
    (window as unknown as { printed?: boolean }).printed = false;
    window.print = () => {
      (window as unknown as { printed?: boolean }).printed = true;
    };
  });
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { printed?: boolean }).printed)).toBeTruthy();
});

test("copy summary reads the unsent preview", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await resetRequest(page);
  await fillBusiness(page);
  await page.locator("#inquiry-products").fill("Kaiser rolls");
  await page.getByRole("button", { name: "Continue to delivery" }).click();
  await page.locator("#inquiry-delivery").fill("Boulder");
  await page.getByRole("checkbox", { name: /concept site does not submit this request/i }).check();
  await page.getByRole("button", { name: "Preview request" }).click();
  await page.getByRole("button", { name: "Copy summary" }).click();
  await expect(page.getByText("Summary copied.")).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("DEMO PREVIEW");
  expect(copied).toContain("does not submit wholesale requests");
  expect(copied).toContain("Kaiser rolls");
  expect(copied).toContain("Key Cafe");
  expect(copied.toLowerCase()).not.toContain("mailto:");
});

test("ask about samples opens from the wholesale hash", async ({ page }) => {
  await page.goto("/wholesale/#sample-request");
  await expect(page.locator("#sample-request")).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /I'd like to ask about trying a product first/i })).toBeVisible();
  await expect(page.getByText("We'll let you know what's available.")).toBeVisible();
  await expect(page.getByText(/not published on bluepointbakery.com/i)).toHaveCount(0);
});

test("new accounts and existing customers stay on different paths", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/wholesale/");
  const paths = page.locator(".account-paths");
  await expect(paths.getByRole("link", { name: "Order online (existing customers)" })).toHaveAttribute("href", ORDER_URL);
  await expect(paths.getByRole("link", { name: "Pay an invoice" })).toHaveAttribute("href", PAY_URL);
  await expect(paths.getByRole("link", { name: "(303) 298-1100" })).toHaveAttribute("href", "tel:+13032981100");
  await expect(paths.getByRole("link", { name: "sales@bluepointbakery.com" })).toHaveAttribute("href", "mailto:sales@bluepointbakery.com");
  await expect(page.locator(".request-notice")).toHaveText(
    "This concept site does not submit wholesale requests. This is a pricing request, not an order.",
  );
  await expect(paths).toContainText("New accounts");

  await page.goto("/");
  await page.locator(".customer-login summary").click();
  await expect(page.locator(".customer-login").getByRole("link", { name: "Order online (existing customers)" })).toHaveAttribute("href", ORDER_URL);
  await expect(page.getByRole("link", { name: "Request a Wholesale Account" })).toHaveAttribute("href", /\/wholesale\/?$/);

  await page.goto("/faq/");
  await expect(page.getByRole("link", { name: "existing customer login" })).toHaveAttribute("href", ORDER_URL);
  await expect(page.getByText(/sales professional will assist you/)).toBeVisible();
  await expect(page.getByRole("link", { name: "prepare a wholesale request" })).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.locator("#mobile-menu").getByRole("link", { name: "Order online (existing customers)" })).toHaveAttribute("href", ORDER_URL);
  await expect(page.locator("#mobile-menu").getByRole("link", { name: "Request pricing" })).toHaveAttribute("href", /\/wholesale\/#wholesale-request$/);
  await expect(page.locator("#mobile-menu").getByRole("link", { name: "Wholesale", exact: true })).toHaveCount(0);

  await page.goto("/");
  const footer = page.locator("footer.site-footer");
  await expect(footer.getByRole("link", { name: "Order online (existing customers)" })).toHaveAttribute("href", ORDER_URL);
  await expect(footer.getByRole("link", { name: "Become a wholesale customer" })).toHaveAttribute("href", /\/wholesale\/?$/);
  await expect(footer).toContainText("This concept website does not submit wholesale requests.");
});

test("request steps use the column width and leave the contact pill clear", async ({ page }) => {
  test.setTimeout(120_000);
  const shots = "/opt/cursor/artifacts";
  fs.mkdirSync(shots, { recursive: true });
  const widths: [number, number][] = [
    [390, 844],
    [768, 1024],
    [1280, 900],
    [1440, 900],
  ];

  for (const [width, height] of widths) {
    await page.setViewportSize({ width, height });
    await resetRequest(page);
    await page.evaluate(() => document.fonts.ready);

    const checkFit = async (step: string) => {
      await page.evaluate(() => window.scrollTo(0, 0));
      const fit = await page.evaluate(() => {
        const flow = document.querySelector(".request-flow")!;
        const rect = flow.getBoundingClientRect();
        const style = getComputedStyle(flow);
        const content = rect.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const shell = flow.getBoundingClientRect();
        const available = window.innerWidth - shell.left * 2;
        const pill = document.querySelector("[data-testid='quick-actions']")!.getBoundingClientRect();
        const hits: string[] = [];
        for (const el of document.querySelectorAll(".request-flow input, .request-flow select, .request-flow textarea, .request-flow button")) {
          const elStyle = getComputedStyle(el);
          if (elStyle.display === "none" || elStyle.visibility === "hidden") continue;
          const box = el.getBoundingClientRect();
          if (box.width < 2 || box.height < 2 || box.bottom < 0 || box.top > window.innerHeight) continue;
          const overlapX = Math.min(box.right, pill.right) - Math.max(box.left, pill.left);
          const overlapY = Math.min(box.bottom, pill.bottom) - Math.max(box.top, pill.top);
          if (overlapX > 1 && overlapY > 1) {
            hits.push((el.getAttribute("aria-label") || el.textContent || el.id || el.tagName).replace(/\s+/g, " ").trim().slice(0, 80));
          }
        }
        const broken = [...document.querySelectorAll(".request-flow h2, .request-flow p, .request-flow button, .request-flow label, .request-flow legend, .request-flow li")]
          .filter((el) => {
            const item = getComputedStyle(el);
            return item.wordBreak === "break-all" || item.overflowWrap === "anywhere" || item.hyphens === "auto";
          })
          .map((el) => (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60));
        return {
          content,
          available,
          hits,
          broken,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      expect(fit.content, `${step} width at ${width}px`).toBeGreaterThanOrEqual(fit.available * 0.9);
      expect(fit.hits, `${step} contact pill covers a control at ${width}px`).toEqual([]);
      expect(fit.broken, `${step} mid-word break at ${width}px`).toEqual([]);
      expect(fit.overflow, `${step} overflow at ${width}px`).toBeLessThanOrEqual(1);
      const typeSize = await page.evaluate(() => {
        const body = parseFloat(getComputedStyle(document.body).fontSize);
        const label = document.querySelector(".request-flow label, .request-flow legend");
        const help = document.querySelector(".request-flow .request-help");
        return {
          body,
          label: label ? parseFloat(getComputedStyle(label).fontSize) : null,
          help: help ? parseFloat(getComputedStyle(help).fontSize) : null,
        };
      });
      if (typeSize.label != null) expect(typeSize.label, `${step} label size at ${width}px`).toBeGreaterThanOrEqual(14);
      if (typeSize.help != null) {
        expect(typeSize.help, `${step} hint size at ${width}px`).toBeGreaterThanOrEqual(14);
        expect(typeSize.help, `${step} hint smaller than body at ${width}px`).toBeLessThan(typeSize.body);
      }
      await expect(page.locator(".request-progress-title")).toContainText(/Step [1-4] of 4/);
      await page.evaluate((slug) => {
        const root = document.documentElement;
        const previous = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        const el = document.querySelector(`[data-step="${slug}"]`);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 96;
          window.scrollTo(0, Math.max(0, top));
        }
        root.style.scrollBehavior = previous;
      }, step);
      await page.screenshot({
        path: `${shots}/flow-${step}-${width}.png`,
        animations: "disabled",
      });
    };

    await checkFit("business");
    await fillBusiness(page);
    await page.locator("#inquiry-picker-product").selectOption({ label: 'Brioche Bun 4"' });
    await page.getByRole("button", { name: "Add selected product" }).click();
    await expect(page.locator(".line-name", { hasText: 'Brioche Bun 4"' })).toBeVisible();
    await checkFit("products");
    await page.locator("#inquiry-products").fill("Kaiser rolls");
    await page.getByRole("checkbox", { name: /I'd like to ask about trying a product first/i }).check();
    await page.getByRole("button", { name: "Continue to delivery" }).click();
    await checkFit("delivery");
    await page.locator("#inquiry-delivery").fill("Denver");
    await page.getByRole("checkbox", { name: /concept site does not submit this request/i }).check();
    await page.getByRole("button", { name: "Preview request" }).click();
    await checkFit("review");
  }
});
