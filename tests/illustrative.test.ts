import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { illustrativeFiles } from "../data/illustrative";
import { products } from "../data/products";
import { visualForProduct } from "../data/illustrative";

test("every catalog item has a labeled illustrative image on disk", () => {
  const seen = new Set<string>();
  for (const product of products) {
    const visual = visualForProduct(product.id);
    assert.equal(visual.illustrative, true);
    assert.match(visual.alt, /^Illustrative image of /);
    assert.match(visual.alt, /Not a verified photograph of this Bluepoint product/);
    assert.match(visual.webp, /^\/images\/illustrative\/.+\.webp$/);
    assert.match(visual.avif, /^\/images\/illustrative\/.+\.avif$/);
    seen.add(visual.webp);
  }
  assert.ok(seen.size >= 20, "product cards should not all share one photograph");

  for (const visual of illustrativeFiles) {
    for (const file of [visual.webp, visual.avif]) {
      const absolute = path.join(process.cwd(), "public", file);
      assert.equal(fs.existsSync(absolute), true, absolute);
    }
  }
});
