import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { PERMISSION_NOTE, platedPhotoFor, usePhotos } from "../data/usePhotos";

test("plated use photos are burgers and sandwiches only", () => {
  assert.equal(usePhotos.length, 2);
  assert.match(PERMISSION_NOTE, /Shown for this demo/);
  assert.match(PERMISSION_NOTE, /Ask permission before using this product photo on a live site/);
  const burgers = platedPhotoFor("burgers");
  const sandwiches = platedPhotoFor("sandwiches");
  assert.equal(burgers?.src, "/images/use/west-main-burger.jpg");
  assert.equal(sandwiches?.src, "/images/use/cafe-180-sandwiches.jpg");
  assert.equal(platedPhotoFor("breakfast"), undefined);
  assert.equal(platedPhotoFor("dinner"), undefined);
  assert.equal(fs.existsSync("public/images/use/west-main-burger.jpg"), true);
  assert.equal(fs.existsSync("public/images/use/cafe-180-sandwiches.jpg"), true);
  assert.equal(fs.existsSync("public/images/use/west-main-reuben.jpg"), true);
  assert.doesNotMatch(burgers?.alt ?? "", /illustrative/i);
  assert.doesNotMatch(sandwiches?.alt ?? "", /illustrative/i);
});

test("making cards show the permission note and buyer proof has no plated strip", () => {
  const making = fs.readFileSync("components/MakingCards.tsx", "utf8");
  const buyer = fs.readFileSync("components/BuyerProof.tsx", "utf8");
  const sector = fs.readFileSync("app/sectors/[slug]/page.tsx", "utf8");
  assert.match(making, /platedPhotoFor/);
  assert.match(making, /PERMISSION_NOTE/);
  assert.match(making, /making-permission/);
  assert.match(making, /label="Illustrative image"/);
  assert.match(making, /plated photos for this demo/);
  assert.doesNotMatch(making, /Illustrative images, not photographs/);
  assert.equal(fs.existsSync("components/UseShots.tsx"), false);
  assert.doesNotMatch(buyer, /UseShots|use-shots|usePhotos/);
  assert.doesNotMatch(sector, /UseShots|use-shots|usePhotos/);
  assert.doesNotMatch(fs.readFileSync("app/brand.css", "utf8"), /\.use-shots|\.use-shot\b/);
});
