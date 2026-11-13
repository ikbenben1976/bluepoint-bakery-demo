import assert from "node:assert/strict";
import test from "node:test";
import { assortmentHref, findAssortment, homeAssortment } from "../data/homeAssortment";
import { breadGroups, pastryGroups } from "../data/products";

test("each homepage collection uses real groups from its correct catalog", () => {
  assert.equal(homeAssortment.length, 5);
  assert.equal(new Set(homeAssortment.map((entry) => entry.id)).size, homeAssortment.length);
  for (const entry of homeAssortment) {
    const groups = entry.family === "breads" ? breadGroups : pastryGroups;
    const ids = new Set(groups.map((group) => group.id));
    assert.ok(entry.groupIds.length > 0, entry.name);
    assert.ok(entry.groupIds.every((id) => ids.has(id)), `invalid catalog group in ${entry.name}`);
    assert.ok(entry.groupIds.some((id) => groups.find((group) => group.id === id)?.items.length), entry.name);
    const href = assortmentHref(entry);
    assert.equal(href, `/${entry.family}/?assortment=${entry.id}#catalog`);
    assert.equal(findAssortment(entry.id, entry.family), entry);
    assert.equal(findAssortment(entry.id, entry.family === "breads" ? "pastries" : "breads"), undefined);
  }
});

test("homepage categories preserve the intended overlaps and separate unrelated collections", () => {
  const byId = (id: string) => homeAssortment.find((entry) => entry.id === id)!;
  assert.deepEqual(byId("buns-rolls").groupIds, ["buns", "sandwich-rolls", "dinner-rolls"]);
  assert.deepEqual(byId("breads-loaves").groupIds, ["french-breads", "deli-loaves", "pan-loaves"]);
  assert.deepEqual(byId("specialty-breads").groupIds, ["specialty-breads"]);
  const pastries = byId("pastries");
  const desserts = byId("desserts-treats");
  assert.ok(pastries.groupIds.includes("croissants"));
  assert.ok(!desserts.groupIds.includes("croissants"));
  for (const dessert of ["pies", "brownies", "cookies", "specialty-cookies", "muffins"]) {
    assert.ok(desserts.groupIds.includes(dessert), dessert);
  }
  assert.ok(pastries.groupIds.includes("muffins"), "muffins fit both marketing categories");
});
