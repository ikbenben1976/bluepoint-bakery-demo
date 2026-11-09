import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SERVICE_AREAS,
  checkDelivery,
  deliveryPhrase,
} from "../lib/deliveryArea";

test("every area named in section 4.4 is a yes", () => {
  const named = [
    "Denver Metro Area",
    "Denver",
    "Boulder",
    "Fort Collins/Greeley",
    "Fort Collins",
    "Greeley",
    "Colorado Springs",
    "Central City/Blackhawk",
    "Central City",
    "Blackhawk",
    "I-70 Corridor to Breckenridge",
    "I-70 Corridor",
    "Breckenridge",
    "Cheyenne, Wyoming",
    "Cheyenne",
    "Loveland",
    "Summit County",
  ];
  for (const place of named) {
    const result = checkDelivery(place);
    assert.equal(result.status, "yes", place);
  }
  for (const area of SERVICE_AREAS) {
    assert.equal(checkDelivery(area.label).status, "yes", area.label);
  }
});

test("places outside the named list ask us", () => {
  for (const place of ["Aspen", "Pueblo", "Grand Junction", "Vail", "Colorado", "Wyoming", "Denver Metroplex"]) {
    assert.equal(checkDelivery(place).status, "ask", place);
  }
  assert.equal(checkDelivery("").status, "empty");
  assert.equal(checkDelivery("   ").status, "empty");
});

test("matching ignores case and extra spaces", () => {
  assert.equal(checkDelivery("  boulder  ").status, "yes");
  assert.equal(checkDelivery("FORT COLLINS").area, "Fort Collins/Greeley");
  assert.equal(checkDelivery("Black Hawk").area, "Central City/Blackhawk");
  assert.equal(checkDelivery("Fort Collins / Greeley").area, "Fort Collins/Greeley");
});

test("phrases match the request builder and the delivery page", () => {
  const served =
    "This area appears on Bluepoint's delivery map. Contact our team to confirm service to your address and available delivery days.";
  assert.equal(deliveryPhrase("yes", "page"), served);
  assert.equal(deliveryPhrase("yes", "wholesale"), served);
  assert.equal(deliveryPhrase("ask", "page"), "Contact Bluepoint to check availability");
  assert.equal(deliveryPhrase("ask", "wholesale"), "Please contact Bluepoint to check availability");
});
