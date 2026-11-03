import assert from "node:assert/strict";
import { test } from "node:test";
import { products } from "../data/products";
import { ADDRESS, DISCLAIMER, EMAIL, HOURS, ORDER_URL, PAY_URL, PHONE_DISPLAY, faqs } from "../data/site";
import { buildEmailPreview } from "../lib/emailPreview";
import { emptyDraft, addProductLine } from "../lib/draft";

const EXPECTED: Record<string, string[]> = {
  buns: [
    'Brioche Bun 4"',
    'BP Hamburger Bun 4"',
    'Plain Kaiser 4"',
    'Sesame Kaiser 4"',
    'Cornmeal Kaiser 4"',
    'Oat Bun 4"',
    'Potato Bun 4"',
    'Picnic Bun 3.5"',
    'Brioche Bun 5"',
    "Premium Brioche Bun",
    'Plain Kaiser 5"',
    'Sesame Topped Kaiser 5"',
    'Onion Topped Kaiser 5"',
    'Poppy Topped Kaiser 5"',
    'Cornmeal Topped Kaiser 5"',
  ],
  "sandwich-rolls": [
    'Hot Dog 6"',
    'Soft Hoagie 7"',
    'Philly Roll 6"',
    'Club Roll 6"',
    'Club Roll 6" sliced',
    'Club Roll 8"',
    'Club Roll 8" sliced',
  ],
  "french-breads": [
    'Baguette 6"',
    'Baguette 8"',
    'Baguette 12"',
    'Baguette 24"',
    'Lt Baked White Baguette 12"',
    'Lt Baked Wheat Baguette 12"',
    'Golden Parisien 24"',
    'Lt Baked Parisien 24"',
    'Lt Baked Wheat Parisien 24"',
  ],
  "deli-loaves": [
    "Vienna White",
    "Cracked Wheat",
    "Sourdough",
    "7 Grain",
    "Marble Rye",
    "Light Rye",
    "Pumpernickel",
    "Potato Rosemary",
    "Dakota",
  ],
  "pan-loaves": [
    "Vienna White",
    "Cracked Wheat",
    "Sourdough",
    "Marble Rye",
    'Texas Toast (Vienna 3/4")',
    "Egg Bread (Brioche)",
  ],
  "dinner-rolls": [
    "Brioche (Dozen)",
    "Brioche (Case 120)",
    "Potato (Dozen)",
    "Potato (Case 120)",
    "Savory (Dozen)",
    "6x5 Slider Buns (30 count)",
  ],
  "specialty-breads": [
    "Focaccia precut in 10 pieces",
    "Focaccia full sheet (2-pack)",
    "French Rustic Roll",
    "Potato Rosemary Rustic Roll",
    "7 Grain Rustic Roll",
    "Top Split Bun",
    "Telera Roll",
    "Sourdough Boule 8 oz",
    "16x4 Vienna",
    "Brown Bread",
  ],
  croissants: [
    "Curved Butter Croissant 3 oz",
    "Curved Butter Croissant 1 oz",
    "Chocolate Croissant",
    "Raspberry Cream Cheese Croissant",
    "Variety Pack (3 Choc, 3 Rasp)",
  ],
  danishes: [
    "Apple",
    "Cherry",
    "Cream Cheese",
    "Bear Claw",
    "Variety Pack (2 Apple, 2 Cherry, 2 Cream Cheese)",
  ],
  "mini-danish": ["Apple", "Cherry", "Cream Cheese", "Blueberry"],
  turnovers: ["Apple", "Cherry"],
  scones: [
    "Double Orange",
    "Apricot Almond",
    "Cinnamon Pecan",
    "Blueberry",
    "Lemon Cranberry",
    "Seasonal",
    "Variety Pack A (2 Cinn, 2 Apricot)",
    "Variety Pack B (2 Orange, 2 Blue)",
  ],
  "mini-scones": ["Double Orange", "Apricot Almond", "Blueberry", "Lemon Cranberry"],
  "quick-breads": ["Pumpkin Chocolate", "Zucchini Spice", "Banana Pecan", "Blueberry Lemon"],
  muffins: [
    "Apple Cinnamon Crunch",
    "Blueberry",
    "Lemon Poppy",
    "Double Chocolate Chip",
    "Triple Berry",
    "Variety Pack (Blue, Lemon)",
    "Blueberry Coffee Crumb Cake",
  ],
  "half-size-muffins": ["Blueberry", "Lemon Poppy"],
  "muffin-tops": ["Blueberry", "Lemon Poppy", "Triple Berry", "Seasonal"],
  cookies: [
    "Chocolate Chip (no nut)",
    "Oatmeal Raisin",
    "Monster",
    "Snickerdoodle",
    "Seasonal",
  ],
  "specialty-cookies": ["Seasonal Iced Sugar", "Black and Whites"],
  "cinnamon-rolls": ['Cinnamon Roll Ring 9" (full ring)', "Cinnamon Rolls 4-pack"],
  biscotti: ["Almond", "Chocolate Chip", "Cherry Walnut"],
  brownies: [
    "Plain (no fudge, no nut)",
    "Rocky Road",
    "Walnut Brownie",
    "White Chocolate Raspberry",
    "German Chocolate",
    "Caramel Pecan Blondie",
    "Cranberry Granola Bars",
    "Brownies (any flavor) 4-pack",
    "Brownies (any flavor) full sheet",
    "Brownies (any flavor) 1/2 sheet",
    "Brownies (any flavor) 1/4 sheet",
  ],
  pies: [
    "Dutch Apple Pie",
    "Apple Pie",
    "Cherry Pie",
    "Blueberry Pie",
    "Pumpkin Pie (seasonal)",
    "Pecan Pie (seasonal)",
    "Chocolate Pecan (seasonal)",
  ],
};

const WRAPPED = new Set([
  "croissants|Curved Butter Croissant 1 oz",
  "croissants|Raspberry Cream Cheese Croissant",
  "danishes|Apple",
  "danishes|Cherry",
  "danishes|Cream Cheese",
  "danishes|Bear Claw",
  "danishes|Variety Pack (2 Apple, 2 Cherry, 2 Cream Cheese)",
  "turnovers|Apple",
  "turnovers|Cherry",
  "scones|Apricot Almond",
  "scones|Cinnamon Pecan",
  "scones|Blueberry",
  "scones|Lemon Cranberry",
  "scones|Variety Pack A (2 Cinn, 2 Apricot)",
  "quick-breads|Pumpkin Chocolate",
  "quick-breads|Zucchini Spice",
  "quick-breads|Banana Pecan",
  "quick-breads|Blueberry Lemon",
  "muffin-tops|Blueberry",
  "muffin-tops|Lemon Poppy",
  "muffin-tops|Triple Berry",
  "cookies|Chocolate Chip (no nut)",
  "cookies|Oatmeal Raisin",
  "cookies|Monster",
  "cookies|Snickerdoodle",
  "cookies|Seasonal",
  "specialty-cookies|Seasonal Iced Sugar",
  "brownies|Plain (no fudge, no nut)",
  "brownies|Rocky Road",
]);

function find(category: string, name: string) {
  const matches = products.filter((product) => product.category === category && product.name === name);
  assert.equal(matches.length, 1, `${category} / ${name}`);
  return matches[0];
}

test("catalog names match section 4.5 and nothing else", () => {
  const expectedKeys = new Set<string>();
  for (const [category, names] of Object.entries(EXPECTED)) {
    for (const name of names) expectedKeys.add(`${category}|${name}`);
  }
  const actualKeys = new Set(products.map((product) => `${product.category}|${product.name}`));
  assert.deepEqual([...actualKeys].sort(), [...expectedKeys].sort());
  assert.equal(products.filter((product) => product.family === "breads").length, 62);
  assert.equal(products.filter((product) => product.family === "pastries").length, 75);
});

test("lead times, slices, and individually wrapped flags", () => {
  const boule = find("specialty-breads", "Sourdough Boule 8 oz");
  assert.equal(boule.lead, "3d");
  assert.equal(
    products.filter((product) => product.lead === "3d").length,
    1,
  );
  for (const product of products) {
    if (product.family === "pastries") assert.equal(product.lead, "48h", product.name);
    if (product.family === "breads" && product.id !== boule.id) assert.equal(product.lead, "24h", product.name);
    const key = `${product.category}|${product.name}`;
    assert.equal(product.individuallyWrapped, WRAPPED.has(key), key);
    assert.equal(product.name.includes("$"), false);
  }

  assert.deepEqual(find("deli-loaves", "Vienna White").sliceOptions, ['1/2"', '5/8"', '3/4"']);
  assert.deepEqual(find("deli-loaves", "Potato Rosemary").sliceOptions, ['3/4"']);
  assert.deepEqual(find("deli-loaves", "Dakota").sliceOptions, ['1/2"', '3/4"']);
  assert.deepEqual(find("pan-loaves", "Egg Bread (Brioche)").sliceOptions, ['3/4"']);
  assert.equal(find("biscotti", "Almond").dippedOption, true);
  assert.deepEqual(find("quick-breads", "Pumpkin Chocolate").units, ["loaf", "individually wrapped 4-pack"]);
});

test("contact facts and portal URLs are the published ones", () => {
  assert.equal(ADDRESS, "5105 Cook St., Denver, CO 80216");
  assert.equal(ADDRESS.includes("1721"), false);
  assert.equal(PHONE_DISPLAY, "(303) 298-1100");
  assert.equal(EMAIL, "sales@bluepointbakery.com");
  assert.equal(HOURS, "Monday–Friday 7:00 AM–3:00 PM");
  assert.equal(ORDER_URL, "https://us.bakery.software/app/bluepoint/us/-1/Account/Login");
  assert.equal(PAY_URL, "https://app.paywholesail.com/portal/bluepointbakery");
  assert.equal(DISCLAIMER, "Demo prepared for review — not the official site");
  assert.equal(faqs.length, 6);
  assert.match(faqs[3].a, /sales professional will assist you/);
  assert.match(faqs[2].a, /5105 Cook St\. Denver, CO 80216/);
});

test("email preview names the sales inbox and does not invent a price", () => {
  const kaiser = products.find((product) => product.name === 'Plain Kaiser 4"');
  const boule = products.find((product) => product.name === "Sourdough Boule 8 oz");
  assert.ok(kaiser && boule);
  let draft = emptyDraft();
  draft = addProductLine(draft, kaiser);
  draft = addProductLine(draft, boule);
  draft = {
    ...draft,
    businessName: "Demo Restaurant",
    businessType: "restaurant",
    deliveryCity: "Boulder",
    days: ["Monday"],
    firstDelivery: "2026-11-10",
  };
  const preview = buildEmailPreview(draft, new Date("2026-11-03T15:00:00-07:00"));
  assert.match(preview, /To: sales@bluepointbakery.com/);
  assert.match(preview, /DEMO PREVIEW/);
  assert.match(preview, /Plain Kaiser 4"/);
  assert.match(preview, /Sourdough Boule/);
  assert.match(preview, /3 day notice required/);
  assert.equal(preview.includes("$"), false);
  assert.equal(preview.toLowerCase().includes("mailto:"), false);
});
