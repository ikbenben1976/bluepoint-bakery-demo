import assert from "node:assert/strict";
import { test } from "node:test";
import { products } from "../data/products";
import { addProductLine, emptyDraft, lineFromProduct } from "../lib/draft";
import { buildEmailPreview } from "../lib/emailPreview";
import {
  areaSummary,
  dateStatus,
  dateWarning,
  extraProductNote,
  showWrappedChoice,
  validateStep,
} from "../lib/requestFlow";

const afternoon = new Date("2026-11-03T15:00:00-07:00");

function product(category: string, name: string) {
  const found = products.find((item) => item.category === category && item.name === name);
  assert.ok(found, `${category} / ${name}`);
  return found;
}

function readyBusiness() {
  return {
    ...emptyDraft(),
    businessName: "Key Cafe",
    businessType: "cafe",
    contactName: "Ada Baker",
    contactEmail: "ada@example.com",
    contactPhone: "3035550100",
    weeklyQuantity: "about 20 dozen",
    consent: true,
    deliveryCity: "Denver",
  };
}

test("core business fields are required and weekly needs are not", () => {
  const errors = validateStep(emptyDraft(), 1, afternoon);
  assert.ok(errors.includes("Enter the business name."));
  assert.ok(errors.includes("Choose a customer type."));
  assert.ok(errors.includes("Enter a contact name."));
  assert.ok(errors.includes("Enter a valid email address."));
  assert.ok(errors.includes("Enter a phone number."));
  assert.equal(errors.some((error) => /weekly/i.test(error)), false);
  assert.deepEqual(validateStep(readyBusiness(), 1, afternoon), []);
});

test("catalog lines and a written note are both kept, without repeating the same name", () => {
  const brioche = product("buns", 'Brioche Bun 4"');
  let draft = addProductLine(readyBusiness(), brioche);
  draft = { ...draft, productsText: "Also a custom sandwich roll" };
  assert.equal(extraProductNote(draft), "Also a custom sandwich roll");
  draft = { ...draft, productsText: 'Brioche Bun 4"' };
  assert.equal(extraProductNote(draft), "");
  assert.ok(validateStep({ ...readyBusiness(), productsText: "Kaiser rolls" }, 2, afternoon).length === 0);
  assert.ok(validateStep(readyBusiness(), 2, afternoon).includes("Select or describe at least one product."));
});

test("slice, pack, wrap, and dipped choices follow the published product", () => {
  const vienna = product("deli-loaves", "Vienna White");
  const rosemary = product("deli-loaves", "Potato Rosemary");
  const almond = product("biscotti", "Almond");
  const pumpkin = product("quick-breads", "Pumpkin Chocolate");
  const brownie = product("brownies", "Plain (no fudge, no nut)");
  const brioche = product("buns", 'Brioche Bun 4"');

  assert.equal(lineFromProduct(vienna).slice, "");
  assert.equal(lineFromProduct(rosemary).slice, '3/4"');
  assert.equal(lineFromProduct(almond).dipped, "");
  assert.equal(lineFromProduct(pumpkin).unit, "");
  assert.equal(lineFromProduct(pumpkin).wrapped, false);
  assert.equal(showWrappedChoice(pumpkin), false);
  assert.equal(showWrappedChoice(brownie), true);
  assert.equal(showWrappedChoice(brioche), false);

  const missingSlice = addProductLine(readyBusiness(), vienna);
  assert.ok(
    validateStep(missingSlice, 2, afternoon).includes("Choose a published slice thickness for Vienna White."),
  );
  const chosen = {
    ...missingSlice,
    lines: missingSlice.lines.map((line) => ({ ...line, slice: '1/2"' })),
  };
  assert.deepEqual(validateStep(chosen, 2, afternoon), []);

  const missingPack = addProductLine(readyBusiness(), pumpkin);
  assert.ok(
    validateStep(missingPack, 2, afternoon).includes("Choose a published pack size for Pumpkin Chocolate."),
  );
  const dippedUnset = addProductLine(readyBusiness(), almond);
  assert.equal(validateStep(dippedUnset, 2, afternoon).some((error) => /dipped/i.test(error)), false);
});

test("delivery days are optional, a ZIP is not eligible, and a published city is labeled as such", () => {
  const draft = { ...readyBusiness(), productsText: "Kaiser rolls", days: [] };
  assert.deepEqual(validateStep(draft, 3, afternoon), []);
  assert.match(areaSummary("Denver"), /Confirmed published area: Denver Metro Area/);
  assert.match(areaSummary("Denver"), /does not confirm the street address/);
  assert.match(areaSummary("80216"), /ZIP code is not used to confirm delivery/);
  assert.match(areaSummary("Paris"), /Ask Bluepoint/);
  assert.doesNotMatch(areaSummary("80216"), /Confirmed published area/);
});

test("desired dates warn from the published notice, including a mixed order and the March daylight-saving change", () => {
  const bread = product("buns", 'Brioche Bun 4"');
  const pastry = product("biscotti", "Almond");
  const boule = product("specialty-breads", "Sourdough Boule 8 oz");
  let draft = addProductLine(readyBusiness(), bread);
  draft = addProductLine(draft, pastry);
  draft = addProductLine(draft, boule);
  draft = { ...draft, firstDelivery: "2026-11-05" };
  const early = dateWarning(draft, afternoon);
  assert.ok(early);
  assert.match(early, /earlier than the published notice/);
  assert.match(early, /November 6, 2026/);
  assert.match(early, /longer notice applies/);
  assert.doesNotMatch(early, /does not promise/);
  assert.equal(validateStep(draft, 3, afternoon).some((error) => /date/i.test(error)), false);

  draft = { ...draft, firstDelivery: "2026-11-10" };
  assert.equal(dateWarning(draft, afternoon), null);
  assert.match(dateStatus(draft, afternoon), /on or after the published notice/);
  assert.match(dateStatus(draft, afternoon), /48 hour notice|3 day notice|longer notice applies/);

  const beforeSpringForward = new Date("2026-03-07T18:00:00Z");
  let bouleOnly = addProductLine(readyBusiness(), boule);
  bouleOnly = { ...bouleOnly, firstDelivery: "2026-03-09" };
  assert.match(dateWarning(bouleOnly, beforeSpringForward) ?? "", /March 10, 2026/);
});

test("the preview keeps catalog lines, written notes, sample questions, and customization examples", () => {
  const brioche = product("buns", 'Brioche Bun 4"');
  let draft = addProductLine(readyBusiness(), brioche);
  draft = {
    ...draft,
    productsText: "Also interested in a custom sandwich roll.",
    askAboutSamples: true,
    sampleInterest: "brioche buns",
    customFamily: "breads",
    customSize: "a diameter to discuss",
    customPackaging: "a pack to discuss",
    days: ["Tuesday"],
    firstDelivery: "2026-11-10",
    notes: "Please call mornings.",
  };
  const preview = buildEmailPreview(draft, afternoon);
  assert.match(preview, /DEMO PREVIEW/);
  assert.match(preview, /does not submit wholesale requests/);
  assert.match(preview, /To: sales@bluepointbakery.com/);
  assert.match(preview, /Brioche Bun 4"/);
  assert.match(preview, /custom sandwich roll/);
  assert.match(preview, /Samples: Interested in trying products first\./);
  assert.match(preview, /brioche buns/);
  assert.match(preview, /Examples to discuss/);
  assert.match(preview, /a diameter to discuss/);
  assert.match(preview, /a pack to discuss/);
  assert.match(preview, /Tuesday/);
  assert.match(preview, /not a confirmed route/);
  assert.match(preview, /about 20 dozen/);
  assert.equal(preview.includes("$"), false);
  assert.equal(preview.toLowerCase().includes("mailto:"), false);
  assert.equal(preview.toLowerCase().includes("free sample"), false);
});
