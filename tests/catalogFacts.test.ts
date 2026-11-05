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
  assert.equal(rows["Published size"], '4"');
  assert.equal(rows["Order lead time"], "24 hour notice for orders on all breads");
  assert.equal(rows["Pack size"], undefined);
  assert.equal(rows["Slicing"], undefined);
  assert.equal(rows["Ingredients / allergens"], undefined);
  assert.equal(rows["Shelf life / storage"], undefined);
  assert.equal(rows["Wholesale pricing"], undefined);
  assert.equal(rows["Dipped option"], undefined);

  const croissant = products.find((product) => product.name === "Curved Butter Croissant 3 oz");
  assert.ok(croissant);
  const pastry = Object.fromEntries(specRows(croissant).map((row) => [row.label, row.value]));
  assert.equal(pastry["Ingredients / allergens"], "Pure butter");
  assert.equal(pastry["Order lead time"], "48 hour notice for orders on all pastries");

  const loaf = products.find((product) => product.category === "deli-loaves" && product.name === "Vienna White");
  assert.ok(loaf);
  const sliced = Object.fromEntries(specRows(loaf).map((row) => [row.label, row.value]));
  assert.match(sliced["Slicing"], /1\/2"/);

  const boule = products.find((product) => product.name === "Sourdough Boule 8 oz");
  assert.ok(boule);
  assert.equal(specRows(boule).find((row) => row.label === "Order lead time")?.value, "3 day notice required");
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
  assert.equal(urls.length, 17);
});
