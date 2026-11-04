import assert from "node:assert/strict";
import { test } from "node:test";
import { BAKERY, ROUTE_CITIES } from "../data/routes";
import { BASEMAP } from "../data/basemap";
import {
  DELIVERY_BAKERY_LABEL_DY,
  cityLabelAnchor,
  cityLabelOffset,
} from "../lib/deliveryMapLabels";
import { project } from "../lib/project";

/**
 * Glyph boxes from getBBox() with Libre Franklin 600 at 42px (the delivery
 * map's .city-label size), including the halo stroke. Height is the same
 * for every label.
 */
const GLYPH_WIDTH: Record<string, number> = {
  Cheyenne: 199.5,
  "Fort Collins": 225.5,
  Windsor: 171.6,
  Loveland: 180.1,
  Greeley: 155.2,
  Longmont: 207.2,
  Boulder: 159.1,
  "Central City": 238.4,
  "Black Hawk": 235.3,
  Broomfield: 223.2,
  Golden: 142,
  Denver: 145.2,
  DIA: 75.8,
  Lakewood: 205,
  Aurora: 138.3,
  Englewood: 221.2,
  Evergreen: 204.9,
  Littleton: 173.2,
  Breckenridge: 269.5,
  "Castle Rock": 239.6,
  "Colorado Springs": 344.2,
  Fountain: 172.9,
  "5105 Cook St": 274.4,
};

const GLYPH_ASCENT = 40.3;
const GLYPH_HEIGHT = 50.5;
const GAP = 8;
const EDGE = 12;

type Box = { name: string; left: number; top: number; right: number; bottom: number };

function boxFor(name: string, x: number, baseline: number, anchor: "start" | "end"): Box {
  const width = GLYPH_WIDTH[name];
  assert.ok(width, `missing glyph width for ${name}`);
  const left = anchor === "end" ? x - width : x;
  const top = baseline - GLYPH_ASCENT;
  return { name, left, top, right: left + width, bottom: top + GLYPH_HEIGHT };
}

function deliveryBoxes(): Box[] {
  const boxes = ROUTE_CITIES.map((city) => {
    const offset = cityLabelOffset(city, false);
    const label = cityLabelAnchor(city.lon, city.lat, offset.lx, offset.ly);
    const name = city.name === "Denver International Airport" ? "DIA" : city.name;
    return boxFor(name, label.x, label.y, label.anchor);
  });
  const bakery = project(BAKERY.lon, BAKERY.lat);
  boxes.push(boxFor("5105 Cook St", bakery.x + 24, bakery.y + DELIVERY_BAKERY_LABEL_DY, "start"));
  return boxes;
}

function separated(a: Box, b: Box): boolean {
  const gapX = Math.max(a.left, b.left) - Math.min(a.right, b.right);
  const gapY = Math.max(a.top, b.top) - Math.min(a.bottom, b.bottom);
  return gapX >= GAP || gapY >= GAP;
}

test("homepage preview keeps the shared label offsets", () => {
  const golden = ROUTE_CITIES.find((city) => city.name === "Golden");
  const hawk = ROUTE_CITIES.find((city) => city.name === "Black Hawk");
  assert.ok(golden && hawk);
  assert.deepEqual(cityLabelOffset(golden, true), { lx: golden.lx, ly: golden.ly });
  assert.deepEqual(cityLabelOffset(hawk, true), { lx: hawk.lx, ly: hawk.ly });
  assert.notDeepEqual(cityLabelOffset(hawk, false).ly, hawk.ly);
});

test("delivery map labels do not overlap and stay inside the basemap", () => {
  const boxes = deliveryBoxes();
  assert.equal(boxes.length, ROUTE_CITIES.length + 1);

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      assert.ok(
        separated(boxes[i], boxes[j]),
        `${boxes[i].name} overlaps ${boxes[j].name}`,
      );
    }
  }

  for (const label of boxes) {
    assert.ok(label.left >= EDGE, `${label.name} clips the left edge`);
    assert.ok(label.top >= EDGE, `${label.name} clips the top edge`);
    assert.ok(label.right <= BASEMAP.width - EDGE, `${label.name} clips the right edge`);
    assert.ok(label.bottom <= BASEMAP.height - EDGE, `${label.name} clips the bottom edge`);
  }

  const fountain = boxes.find((label) => label.name === "Fountain");
  assert.ok(fountain, "Fountain label missing");
  assert.ok(fountain.bottom < BASEMAP.height - EDGE, "Fountain is clipped");
});
