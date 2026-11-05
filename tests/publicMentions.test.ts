import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { publicMentions } from "../data/customers";

test("approved public mentions use real logo files and skip excluded names", () => {
  const names = publicMentions.map((mention) => mention.name);
  assert.deepEqual(names, [
    "Cafe 180",
    "Urban Egg",
    "West Main Taproom + Grill",
    "Windsor Lake Cafe & Marketplace",
    "Revolver Kitchen",
    "Red Cedar Bistro",
    "The GrowHaus",
  ]);
  for (const mention of publicMentions) {
    assert.equal(fs.existsSync(`public${mention.src}`), true, mention.src);
    assert.match(mention.caption, /Public post/);
    assert.doesNotMatch(mention.caption, /current account|kicks ass/i);
  }
  const joined = names.join(" ");
  assert.doesNotMatch(joined, /Lincoln|T-Bonz|Cosmic Coyote|Grecian|Flour Shop|Easton/);
  const rendered = ["components/BuyerProof.tsx", "app/community/page.tsx", "app/page.tsx"]
    .map((path) => fs.readFileSync(path, "utf8"))
    .join("\n");
  assert.doesNotMatch(rendered, /kicks ass/i);
  assert.doesNotMatch(rendered, /Flour Shop|Easton/);
  assert.match(fs.readFileSync("app/community/page.tsx", "utf8"), /FIRE Foundation/);
  assert.match(fs.readFileSync("app/community/page.tsx", "utf8"), /Pie in the Sky/);
});
