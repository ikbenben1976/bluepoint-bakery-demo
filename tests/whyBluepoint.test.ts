import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { DELIVERY_TRUCK_CAPTION, deliveryTruck, WILLIE_CAPTION, williePortrait } from "../data/photos";
import { whyBluepoint } from "../data/whyBluepoint";

test("Why Bluepoint is six sentence-case pillars from the values sheets", () => {
  assert.deepEqual(
    whyBluepoint.map((pillar) => pillar.title),
    ["Product", "Company", "Selection", "Value", "Service", "Integrity"],
  );
  for (const pillar of whyBluepoint) {
    assert.equal(pillar.body, pillar.body.trim());
    assert.notEqual(pillar.body, pillar.body.toUpperCase());
    assert.doesNotMatch(pillar.body, /HANDMADE|CONFIRM WITH|MBE/);
    assert.doesNotMatch(pillar.body, /illustrative/i);
    assert.doesNotMatch(pillar.title, /confirm|MBE/i);
  }
  assert.match(whyBluepoint[0].body, /handmade, baked fresh/);
  assert.match(whyBluepoint[0].body, /six days a week/);
  assert.match(whyBluepoint[1].body, /oldest and largest locally owned wholesale bakery/);
  assert.match(whyBluepoint[2].body, /600 items and sizes/);
  assert.match(whyBluepoint[2].body, /largest selection/);
  assert.match(whyBluepoint[3].body, /maximum value to price ratio/);
  assert.match(whyBluepoint[3].body, /most for your money/);
  assert.match(whyBluepoint[4].body, /40 years of combined experience/);
  assert.match(whyBluepoint[5].body, /honesty, integrity, and respect/);

  const component = fs.readFileSync("components/WhyBluepoint.tsx", "utf8");
  const page = fs.readFileSync("app/wholesale/page.tsx", "utf8");
  assert.match(component, /why-card/);
  assert.match(component, /why-grid/);
  assert.match(page, /WhyBluepoint/);
  assert.doesNotMatch(component, /values-sheet|\.png|confirm with bakery|MBE/i);
  assert.doesNotMatch(page, /values-sheet|07-|08-|09-/);
});

test("truck and Willie photos are real, captioned, and optimized", () => {
  assert.equal(DELIVERY_TRUCK_CAPTION, "Delivered fresh in our own trucks, six days a week.");
  assert.equal(WILLIE_CAPTION, "Willie, part of the Bluepoint family.");
  assert.doesNotMatch(deliveryTruck.alt, /illustrative|AI|generated/i);
  assert.doesNotMatch(williePortrait.alt, /illustrative|AI|generated/i);
  assert.match(fs.readFileSync("app/delivery/page.tsx", "utf8"), /DELIVERY_TRUCK_CAPTION/);
  assert.match(fs.readFileSync("app/about/page.tsx", "utf8"), /WILLIE_CAPTION/);
  assert.doesNotMatch(fs.readFileSync("app/delivery/page.tsx", "utf8"), /Illustrative image|confirm with bakery/i);
  assert.doesNotMatch(fs.readFileSync("app/about/page.tsx", "utf8"), /Illustrative image/);
  for (const file of [deliveryTruck.src, williePortrait.src]) {
    const disk = `public${file}`;
    assert.equal(fs.existsSync(disk), true, disk);
    assert.ok(fs.statSync(disk).size < 250 * 1024, disk);
  }
});
