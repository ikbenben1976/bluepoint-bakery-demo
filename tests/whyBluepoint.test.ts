import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { DELIVERY_TRUCK_CAPTION, deliveryTruck, WILLIE_CAPTION, williePortrait } from "../data/photos";
import { whyBluepoint } from "../data/whyBluepoint";

test("Why Bluepoint is six sentence-case pillars from the values sheets", () => {
  assert.deepEqual(
    whyBluepoint.map((pillar) => pillar.title),
    ["Fresh, scratch-baked quality", "Colorado roots since 1987", "A wide selection for every menu", "Quality that works for your business", "A team that knows wholesale", "Relationships built on trust"],
  );
  for (const pillar of whyBluepoint) {
    assert.equal(pillar.body, pillar.body.trim());
    assert.notEqual(pillar.body, pillar.body.toUpperCase());
    assert.doesNotMatch(pillar.body, /HANDMADE|CONFIRM WITH|MBE/);
    assert.doesNotMatch(pillar.body, /illustrative/i);
    assert.doesNotMatch(pillar.title, /confirm|MBE/i);
  }
  assert.deepEqual(
    whyBluepoint.map((pillar) => pillar.body),
    [
      "Our products are handmade, baked fresh, and delivered in our own trucks, six days a week.",
      "A family-owned Colorado wholesale bakery since 1987.",
      "Hundreds of breads, rolls, and pastries, with new products added regularly.",
      "Quality products, dependable service and practical choices to help you get more from your bakery purchasing.",
      "Our experienced sales and customer service team takes time to understand your operation and help you find the right products.",
      "The entire Bluepoint team is committed to treating you, our customer, with the honesty, integrity, and respect you deserve.",
    ],
  );
  assert.doesNotMatch(whyBluepoint.map((pillar) => pillar.body).join(" "), /MVPR|oldest and largest|600 items/);

  const component = fs.readFileSync("components/WhyBluepoint.tsx", "utf8");
  const about = fs.readFileSync("app/about/page.tsx", "utf8");
  const wholesale = fs.readFileSync("app/wholesale/page.tsx", "utf8");
  assert.match(component, /why-card/);
  assert.match(component, /why-grid/);
  assert.match(about, /WhyBluepoint/);
  assert.doesNotMatch(wholesale, /WhyBluepoint/);
  assert.doesNotMatch(component, /values-sheet|\.png|confirm with bakery|MBE/i);
  assert.doesNotMatch(wholesale, /values-sheet|07-|08-|09-/);
});

test("truck and Willie photos are real, captioned, and optimized", () => {
  assert.equal(DELIVERY_TRUCK_CAPTION, "Delivered fresh in our own trucks, six days a week.");
  assert.equal(WILLIE_CAPTION, "Willie Ramirez, owner");
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
