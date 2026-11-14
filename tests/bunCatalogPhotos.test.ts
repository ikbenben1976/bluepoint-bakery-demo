import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { bunCatalogPhotoFor, bunProductIds } from "../data/bunCatalogPhotos";
import { breadGroups } from "../data/products";

test("all 15 bun SKUs have distinct image paths and traceable provenance", () => {
  const buns = breadGroups.find((group) => group.id === "buns");
  assert.ok(buns);
  assert.equal(buns.items.length, 15);
  assert.deepEqual(new Set(buns.items.map((p) => p.id)), new Set(bunProductIds));
  const urls = new Set<string>();
  let edited = 0, illustrative = 0;
  for (const product of buns.items) {
    const photo = bunCatalogPhotoFor(product.id);
    assert.ok(photo, product.id);
    assert.equal(photo.webp, "/images/catalog/buns/" + product.id + ".webp");
    assert.equal(photo.width, 960);
    assert.equal(photo.height, 720);
    assert.equal(photo.avif, undefined);
    urls.add(photo.webp);
    const file = path.join(process.cwd(), "public", photo.webp);
    assert.ok(fs.existsSync(file), "Missing asset: " + file);
    assert.ok(fs.statSync(file).size > 1000);
    if (photo.illustrative) {
      illustrative++;
      assert.equal(photo.label, "Illustrative image");
      assert.equal(photo.provenance.treatment, "existing-illustration");
      assert.match(photo.alt, /^Illustrative image/);
    } else {
      edited++;
      assert.equal(photo.provenance.treatment, "extracted-and-background-edited");
      assert.match(photo.provenance.sourceUrl, /^https:\/\/(irp\.cdn-website\.com|irp-cdn\.multiscreensite\.com)\//);
      assert.ok(photo.provenance.sourceObject.length > 10);
      assert.ok(photo.label === undefined || photo.label === "Representative photo");
      assert.doesNotMatch(photo.alt, /^Illustrative image/);
    }
  }
  assert.equal(urls.size, 15);
  assert.equal(edited, 9);
  assert.equal(illustrative, 6);
});

test("bun photo override is scoped to the /breads product page", () => {
  const component = fs.readFileSync("components/ProductBrowser.tsx", "utf8");
  assert.match(component, /catalogPath === "\/breads" && product\.category === "buns"/);
  assert.match(component, /const visual = bunPhoto \?\? visualForProduct\(product\.id\)/);
  assert.match(component, /label=\{bunPhoto \? bunPhoto\.label : "Illustrative image"\}/);
  const framed = fs.readFileSync("components/FramedImage.tsx", "utf8");
  assert.match(framed, /avif\?: string/);
  assert.match(framed, /avif \? <source/);
});
