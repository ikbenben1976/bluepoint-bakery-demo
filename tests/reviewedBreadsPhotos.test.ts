import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { breadGroups } from "../data/products";
import { reviewedBreadPhotoFor, reviewedBreadProductIds } from "../data/reviewedBreadsPhotos";

const expectedCounts = new Map([
  ["french-breads", 9],
  ["deli-loaves", 9],
  ["pan-loaves", 6],
  ["dinner-rolls", 6],
  ["specialty-breads", 10],
]);

test("the five review-approved Breads categories have 40 unique image paths and traceable provenance", () => {
  const ids = breadGroups.filter((g) => expectedCounts.has(g.id)).flatMap((g) => {
    assert.equal(g.items.length, expectedCounts.get(g.id), g.id);
    return g.items.map((p) => p.id);
  });
  assert.equal(ids.length, 40);
  assert.deepEqual(new Set(reviewedBreadProductIds), new Set(ids));

  let photos = 0;
  let illustrations = 0;
  const paths = new Set<string>();
  for (const id of ids) {
    const photo = reviewedBreadPhotoFor(id);
    assert.ok(photo, "No mapping for " + id);
    assert.equal(photo.webp, "/images/catalog/reviewed-breads/" + id + ".webp");
    assert.equal(photo.width, 960);
    assert.equal(photo.height, 720);
    assert.match(photo.provenance.originalBluepointUrl, /^https:\/\/irp\.cdn-website\.com\//);
    assert.ok(photo.provenance.sourceObject.length > 6);
    const filepath = path.join(process.cwd(), "public", photo.webp);
    assert.ok(fs.existsSync(filepath), "Missing asset " + filepath);
    assert.ok(fs.statSync(filepath).size > 1000, filepath);
    paths.add(photo.webp);
    if (photo.provenance.imageKind === "original-photo-edited") {
      photos++;
      assert.equal(photo.label, "Photo edited");
      assert.equal(photo.illustrative, false);
    } else {
      illustrations++;
      assert.equal(photo.label, "Illustrative image");
      assert.equal(photo.illustrative, true);
    }
  }
  assert.equal(photos, 6);
  assert.equal(illustrations, 34);
  assert.equal(paths.size, 40);
});

test("unapproved Buns and Sandwich Rolls retain their existing images", () => {
  for (const group of breadGroups.filter((g) => ["buns", "sandwich-rolls"].includes(g.id))) {
    for (const item of group.items) assert.equal(reviewedBreadPhotoFor(item.id), undefined);
  }
  const page = fs.readFileSync("components/ProductBrowser.tsx", "utf8");
  assert.match(page, /catalogPath === "\/breads" \? reviewedBreadPhotoFor\(product.id\) : undefined/);
  assert.match(page, /const visual = reviewedPhoto \?\? visualForProduct\(product.id\)/);
  assert.match(page, /label=\{reviewedPhoto\?\.label \?\? "Illustrative image"\}/);
});
