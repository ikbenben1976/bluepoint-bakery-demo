import assert from "node:assert/strict";
import { test } from "node:test";
import sitemap from "../app/sitemap";
import { products } from "../data/products";
import { DEMO_ORIGIN, FACEBOOK, INSTAGRAM, customerComments } from "../data/site";
import { specRows } from "../lib/spec";

test("unpublished product specs are omitted", () => {
  for (const product of products) {
    for (const row of specRows(product)) {
      assert.notEqual(row.value.trim(), "", product.name);
      assert.doesNotMatch(`${row.label} ${row.value}`, /confirm with bakery/i, product.name);
    }
  }

  const bun = products.find((product) => product.name === 'Brioche Bun 4"');
  assert.ok(bun);
  const rows = Object.fromEntries(specRows(bun).map((row) => [row.label, row.value]));
  assert.equal(rows["Published size"], undefined);
  assert.equal(rows["Category"], undefined);
  assert.equal(rows["Order lead time"], undefined);
  assert.equal(rows["Pack"], undefined);
  assert.equal(rows["Slice"], undefined);
  assert.equal(rows["Wrapping"], undefined);
  assert.equal(rows["Seasonal"], undefined);
  assert.equal(rows["Ingredients"], undefined);
  assert.equal(rows["Wholesale pricing"], undefined);

  const croissant = products.find((product) => product.name === "Curved Butter Croissant 3 oz");
  assert.ok(croissant);
  const pastry = Object.fromEntries(specRows(croissant).map((row) => [row.label, row.value]));
  assert.equal(pastry["Ingredients"], "Pure butter");
  assert.equal(pastry["Order lead time"], undefined);
  assert.equal(pastry["Published size"], undefined);

  const loaf = products.find((product) => product.category === "deli-loaves" && product.name === "Vienna White");
  assert.ok(loaf);
  const sliced = Object.fromEntries(specRows(loaf).map((row) => [row.label, row.value]));
  assert.equal(sliced["Slice"], '1/2" or 5/8" or 3/4" slices');

  const dakota = products.find((product) => product.name === "Dakota");
  assert.ok(dakota);
  const dakotaText = specRows(dakota).map((row) => row.value).join(" ");
  assert.match(dakotaText, /1\/2" or 3\/4" slices/);
  assert.doesNotMatch(dakotaText, /no 5\/8/);

  const rosemary = products.find((product) => product.name === "Potato Rosemary");
  assert.ok(rosemary);
  assert.equal(specRows(rosemary).filter((row) => row.label === "Slice").length, 1);
  assert.equal(specRows(rosemary).find((row) => row.label === "Slice")?.value, '3/4" slice');

  const rollCase = products.find((product) => product.name === "Brioche (Case 120)");
  assert.ok(rollCase);
  const rollRows = specRows(rollCase);
  assert.equal(rollRows.find((row) => row.label === "Pack")?.value, "Case of 120");
  assert.equal(rollRows.find((row) => row.label === "Weight")?.value, "1.5 oz");
  assert.equal(rollRows.filter((row) => /case/i.test(row.value) && row.value !== "Case of 120").length, 0);

  const boule = products.find((product) => product.name === "Sourdough Boule 8 oz");
  assert.ok(boule);
  assert.equal(specRows(boule).find((row) => row.label === "Order lead time")?.value, "3 day notice required");
  assert.equal(specRows(boule).filter((row) => row.value === "3 day notice required").length, 1);
});

test("the removed testimonial is not in the published comments", () => {
  const blob = JSON.stringify(customerComments);
  assert.equal(blob.toLowerCase().includes("kicks ass"), false);
  assert.equal(blob.includes("Jason R."), false);
  assert.equal(customerComments.length, 2);
});

test("social links are the accounts the bakery site itself links", () => {
  assert.equal(INSTAGRAM, "https://instagram.com/bluepointbakery/");
  assert.equal(FACEBOOK, "https://www.facebook.com/BluepointBakery/");
});

test("sitemap uses the demo origin and keeps every public path", () => {
  const urls = sitemap().map((entry) => entry.url);
  assert.equal(urls.some((url) => url.includes("demo.invalid")), false);
  assert.equal(urls[0], `${DEMO_ORIGIN}/`);
  assert.ok(urls.includes(`${DEMO_ORIGIN}/contact/`));
  assert.ok(urls.includes(`${DEMO_ORIGIN}/breads/`));
  assert.equal(urls.length, 13);
});
