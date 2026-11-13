import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { makingHref, makingUses } from "../data/making";
import { products } from "../data/products";
import { groupsForUse } from "../data/uses";

const legacyMatch: Record<string, (product: { category: string; name: string }) => boolean> = {
  burgers: (product) => product.category === "buns" || product.name.startsWith("6x5 Slider"),
  sandwiches: (product) =>
    ["sandwich-rolls", "deli-loaves", "pan-loaves", "french-breads"].includes(product.category),
  breakfast: (product) =>
    [
      "croissants",
      "danishes",
      "mini-danish",
      "scones",
      "mini-scones",
      "muffins",
      "half-size-muffins",
      "muffin-tops",
      "quick-breads",
      "cinnamon-rolls",
    ].includes(product.category),
  dinner: (product) => ["dinner-rolls", "specialty-breads"].includes(product.category),
};

test("making tags match the products each old making page listed", () => {
  assert.deepEqual(
    makingUses.map((use) => use.slug),
    ["burgers", "sandwiches", "breakfast", "dinner"],
  );
  for (const use of makingUses) {
    const tagged = products.filter((product) => product.making.includes(use.slug));
    const expected = products.filter((product) => legacyMatch[use.slug](product));
    assert.deepEqual(
      tagged.map((product) => product.id),
      expected.map((product) => product.id),
      use.slug,
    );
    assert.ok(tagged.length > 0, use.slug);
    assert.ok(
      tagged.every((product) => product.family === use.family),
      `${use.title} stays on the ${use.family} catalog`,
    );
    assert.equal(makingHref(use.slug), `/${use.family}/?making=${use.slug}#catalog`);
    const shown = groupsForUse(use.slug).flatMap((group) => group.items);
    assert.deepEqual(
      shown.map((product) => product.id),
      tagged.map((product) => product.id),
    );
  }
});

test("slider buns stay on both burger and dinner filters", () => {
  const sliders = products.filter((product) => product.name.startsWith("6x5 Slider"));
  assert.equal(sliders.length, 1);
  assert.deepEqual(sliders[0]?.making, ["burgers", "dinner"]);
  const burgers = new Set(groupsForUse("burgers").flatMap((group) => group.items.map((item) => item.name)));
  assert.equal(burgers.has("Brioche (Dozen)"), false);
  assert.equal(burgers.has('Brioche Bun 4"'), true);
});

test("old making urls redirect permanently to the filtered catalogs", () => {
  const config = JSON.parse(fs.readFileSync("vercel.json", "utf8")) as {
    redirects: { source: string; destination: string; permanent: boolean }[];
  };
  for (const use of makingUses) {
    for (const source of [`/making/${use.slug}`, `/making/${use.slug}/`]) {
      const rule = config.redirects.find((entry) => entry.source === source);
      assert.ok(rule, source);
      assert.equal(rule?.permanent, true);
      assert.equal(rule?.destination, makingHref(use.slug));
    }
  }
});
