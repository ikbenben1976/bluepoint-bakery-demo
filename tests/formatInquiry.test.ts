import assert from "node:assert/strict";
import { test } from "node:test";
import { formatCustomerType, formatPhone, formatStartDate } from "../lib/formatInquiry";

test("wholesale preview values use human labels", () => {
  assert.equal(formatCustomerType("restaurant"), "Restaurant");
  assert.equal(formatCustomerType("cafe"), "Café");
  assert.equal(formatCustomerType("grocery/retail"), "Grocery / retail");
  assert.equal(formatPhone("3035550100"), "(303) 555-0100");
  assert.equal(formatPhone("13035550100"), "(303) 555-0100");
  assert.equal(formatStartDate("2026-12-01"), "Dec 1, 2026");
});
