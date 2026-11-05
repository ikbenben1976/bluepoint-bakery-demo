import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { featuredPublicMentions, publicMentions } from "../data/customers";

const URBAN_EGG_MEET_THE_MAKERS =
  "Welcome to Part 3 of Meet the Makers, where we celebrate the trusted partner behind the ingredients that make our menu special. This time, we visited Bluepoint Bakery, the family- and minority-owned bakery behind so many of our breads. Most notably, they created the Stuffed French Toast Brioche specifically for Urban Egg! Getting to see where it all comes together was pretty special.";

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
    assert.equal("caption" in mention, false);
    assert.doesNotMatch(JSON.stringify(mention), /Public post|current account|kicks ass/i);
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
  assert.match(fs.readFileSync("data/site.ts", "utf8"), /food box program/);
  assert.doesNotMatch(fs.readFileSync("data/site.ts", "utf8"), /CSA-style/);
  assert.doesNotMatch(fs.readFileSync("data/site.ts", "utf8"), /public post named/);
  assert.match(fs.readFileSync("docs/OWNER-QUESTIONS.md", "utf8"), /no separate Named in public block/);
});

test("Urban Egg logo card has no provenance caption", () => {
  const urban = publicMentions.find((mention) => mention.name === "Urban Egg");
  assert.equal(urban?.audience, "cafes");
  assert.equal("caption" in (urban ?? {}), false);
  assert.doesNotMatch(JSON.stringify(urban), /Public post|Stuffed French Toast|brioche/i);
});

test("Urban Egg Meet the Makers is featured café proof and stays off other audiences", () => {
  const story = featuredPublicMentions.find((mention) => mention.name === "Urban Egg");
  assert.ok(story);
  assert.equal(featuredPublicMentions.length, 1);
  assert.equal(story.audience, "cafes");
  assert.equal(story.series, "Meet the Makers");
  assert.equal(story.when, "October");
  assert.doesNotMatch(story.when, /\d/);
  assert.equal(story.quote, URBAN_EGG_MEET_THE_MAKERS);
  assert.doesNotMatch(story.quote, /Nettie|Farmstand|Blue Point Brewing|facebook\.com|fb\.watch/i);
  assert.doesNotMatch(story.quote, /current customer|current account/i);

  const buyer = fs.readFileSync("components/BuyerProof.tsx", "utf8");
  const sector = fs.readFileSync("app/sectors/[slug]/page.tsx", "utf8");
  const featured = fs.readFileSync("components/FeaturedMention.tsx", "utf8");
  const customers = fs.readFileSync("data/customers.ts", "utf8");
  assert.match(buyer, /featuredPublicMentions/);
  assert.match(buyer, /story\.audience === selected/);
  assert.doesNotMatch(buyer, /confirmed with the bakery|Public post:/);
  assert.match(buyer, /FeaturedMention/);
  assert.match(sector, /story\.audience === slug/);
  assert.match(featured, /\{mention\.name\} · \{mention\.series\} · \{mention\.when\}/);
  assert.match(featured, /Public post, not a testimonial/);
  assert.doesNotMatch(`${buyer}\n${sector}\n${featured}`, /Nettie|Farmstand|Blue Point Brewing|fb\.watch|facebook\.com\/urban/i);
  assert.match(customers, /Maryland beer-bread/);
  assert.match(fs.readFileSync("app/layout.tsx", "utf8"), /noindex,nofollow/);
  assert.match(fs.readFileSync("app/layout.tsx", "utf8"), /demo-ribbon/);
});
