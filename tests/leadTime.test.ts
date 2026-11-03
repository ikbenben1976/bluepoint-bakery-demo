import assert from "node:assert/strict";
import { test } from "node:test";
import {
  earliestDeliveryIso,
  leadTimeExplanation,
  leadTimeHours,
} from "../lib/leadTime";

const afternoon = new Date("2026-11-03T15:00:00-07:00");

test("breads only are +24 hours", () => {
  assert.equal(leadTimeHours(["bread"]), 24);
  assert.equal(leadTimeHours(["bread", "bread"]), 24);
  assert.equal(earliestDeliveryIso(afternoon, ["bread"]), "2026-11-04");
  assert.match(leadTimeExplanation(["bread"]), /24 hour notice for orders on all breads/);
});

test("any pastry is +48 hours, including when breads are in the request", () => {
  assert.equal(leadTimeHours(["pastry"]), 48);
  assert.equal(leadTimeHours(["bread", "pastry"]), 48);
  assert.equal(earliestDeliveryIso(afternoon, ["bread", "pastry"]), "2026-11-05");
  assert.match(leadTimeExplanation(["pastry"]), /48 hour notice for orders on all pastries/);
});

test("Sourdough Boule is +3 days and outranks breads and pastries", () => {
  assert.equal(leadTimeHours(["boule"]), 72);
  assert.equal(leadTimeHours(["bread", "boule"]), 72);
  assert.equal(leadTimeHours(["pastry", "boule"]), 72);
  assert.equal(leadTimeHours(["bread", "pastry", "boule"]), 72);
  assert.equal(earliestDeliveryIso(afternoon, ["boule"]), "2026-11-06");
  assert.match(leadTimeExplanation(["boule"]), /Sourdough Boule: 3 day notice required/);
  assert.match(leadTimeExplanation(["pastry", "boule"]), /longer notice applies/);
});

test("uses the America/Denver calendar date, not UTC", () => {
  // 06:00 UTC on Nov 3 is 23:00 on Nov 2 in Denver (MST, UTC-7).
  const lateEvening = new Date("2026-11-03T06:00:00Z");
  assert.equal(earliestDeliveryIso(lateEvening, ["bread"]), "2026-11-03");
  assert.equal(earliestDeliveryIso(lateEvening, ["pastry"]), "2026-11-04");
  assert.equal(earliestDeliveryIso(lateEvening, ["boule"]), "2026-11-05");
});

test("a 3 day notice stays 72 hours across the March daylight-saving change", () => {
  const beforeSpringForward = new Date("2026-03-07T18:00:00Z");
  assert.equal(earliestDeliveryIso(beforeSpringForward, ["boule"]), "2026-03-10");
});
