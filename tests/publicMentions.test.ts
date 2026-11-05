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
  assert.deepEqual(
    publicMentions.map((mention) => [mention.name, mention.audience]),
    [
      ["Cafe 180", "cafes"],
      ["Urban Egg", "cafes"],
      ["West Main Taproom + Grill", "restaurants"],
      ["Windsor Lake Cafe & Marketplace", "cafes"],
      ["Revolver Kitchen", "restaurants"],
      ["Red Cedar Bistro", "restaurants"],
      ["The GrowHaus", "community"],
    ],
  );
  const tabAudiences = new Set(["restaurants", "cafes", "hotels", "institutions"]);
  for (const mention of publicMentions) {
    assert.equal(fs.existsSync(`public${mention.src}`), true, mention.src);
    assert.match(mention.caption, /Public post/);
    assert.doesNotMatch(mention.caption, /current account|kicks ass/i);
    if (mention.audience === "community") {
      assert.equal(tabAudiences.has(mention.audience), false);
    } else {
      assert.equal(tabAudiences.has(mention.audience), true);
    }
  }
  const joined = names.join(" ");
  assert.doesNotMatch(joined, /Lincoln|T-Bonz|Cosmic Coyote|Grecian|Flour Shop|Easton/);
  const buyer = fs.readFileSync("components/BuyerProof.tsx", "utf8");
  const rendered = ["components/BuyerProof.tsx", "app/community/page.tsx", "app/page.tsx"]
    .map((path) => fs.readFileSync(path, "utf8"))
    .join("\n");
  assert.doesNotMatch(rendered, /kicks ass/i);
  assert.doesNotMatch(rendered, /Flour Shop|Easton/);
  assert.doesNotMatch(buyer, /Named in public/);
  assert.doesNotMatch(buyer, /public-mentions/);
  assert.match(buyer, /mention\.audience === audience/);
  assert.doesNotMatch(buyer, /fire-foundation/);
  assert.match(fs.readFileSync("app/community/page.tsx", "utf8"), /FIRE Foundation/);
  assert.match(fs.readFileSync("app/community/page.tsx", "utf8"), /Pie in the Sky/);
  assert.match(fs.readFileSync("data/site.ts", "utf8"), /public post named Bluepoint Bakery breads as an add-on/);
  assert.match(fs.readFileSync("docs/OWNER-QUESTIONS.md", "utf8"), /no separate Named in public block/);
});
