import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { featuredPublicMentions, isShowcaseAudience, publicMentions } from "../data/customers";

const URBAN_EGG_MEET_THE_MAKERS =
  "Welcome to Part 3 of Meet the Makers, where we celebrate the trusted partner behind the ingredients that make our menu special. This time, we visited Bluepoint Bakery, the family- and minority-owned bakery behind so many of our breads. Most notably, they created the Stuffed French Toast Brioche specifically for Urban Egg! Getting to see where it all comes together was pretty special.";

const RESTAURANTS = [
  "The Cherry Cricket",
  "Mountain Sun Pub & Brewery",
  "Oskar Blues Fooderies",
  "Red Cedar Bistro",
  "Revolver Kitchen",
  "The Lobby Denver",
  "Lindsay's Boulder Deli",
  "Grande Station",
  "My Brother's Bar",
  "Snarf's Sandwiches",
  "Bon Ami Bistro & Crêperie",
  "Chop Shop Casual Urban Eatery",
  "La Merise French Bistro",
  "Linger",
  "Root Down",
  "Wynkoop Brewing Company",
  "New Belgium Brewing — DEN Airport",
] as const;

const CAFES = [
  "Urban Egg",
  "Fluid Coffee Bar",
  "Urban Cafe Denver",
  "Windsor Lake Cafe & Marketplace",
] as const;

const HOTELS = [
  "Nosh Catering",
  "Front Porch Coffee Shop — Event Catering",
  "Vīb Hotel Denver RiNo — Lobby Café",
] as const;

const INSTITUTIONS = [
  "University of Colorado Boulder",
  "Regis University — Ranger Dining",
  "Arapahoe Libraries",
] as const;

const INK = [
  "My Brother's Bar",
  "Chop Shop Casual Urban Eatery",
  "Fluid Coffee Bar",
  "Vīb Hotel Denver RiNo — Lobby Café",
  "Regis University — Ranger Dining",
] as const;

test("the customer showcase lists 27 brands once across the four tabs", () => {
  const showcase = publicMentions.filter((mention) => isShowcaseAudience(mention.audience));
  assert.equal(showcase.length, 27);
  assert.deepEqual(
    showcase.filter((mention) => mention.audience === "restaurants").map((mention) => mention.name),
    [...RESTAURANTS],
  );
  assert.deepEqual(
    showcase.filter((mention) => mention.audience === "cafes").map((mention) => mention.name),
    [...CAFES],
  );
  assert.deepEqual(
    showcase.filter((mention) => mention.audience === "hotels").map((mention) => mention.name),
    [...HOTELS],
  );
  assert.deepEqual(
    showcase.filter((mention) => mention.audience === "institutions").map((mention) => mention.name),
    [...INSTITUTIONS],
  );
  assert.equal(new Set(showcase.map((mention) => mention.name)).size, 27);
  assert.equal(new Set(showcase.map((mention) => mention.src)).size, 27);

  const names = showcase.map((mention) => mention.name).join("\n");
  assert.doesNotMatch(names, /West Main|Cafe 180/);
  assert.equal(
    publicMentions.find((mention) => mention.name === "The GrowHaus")?.audience,
    "community",
  );
  assert.equal(isShowcaseAudience("community"), false);

  for (const mention of publicMentions) {
    assert.equal(fs.existsSync(`public${mention.src}`), true, mention.src);
    assert.equal("caption" in mention, false);
    assert.doesNotMatch(JSON.stringify(mention), /Public post|current account|kicks ass|utm_source|chatgpt\.com/i);
    if (mention.surface === "ink") {
      assert.equal(INK.includes(mention.name as (typeof INK)[number]), true, mention.name);
    }
  }
  assert.deepEqual(
    publicMentions.filter((mention) => mention.surface === "ink").map((mention) => mention.name),
    [...INK],
  );
  assert.equal(publicMentions.find((mention) => mention.name === "Arapahoe Libraries")?.surface, undefined);

  const buyer = fs.readFileSync("components/BuyerProof.tsx", "utf8");
  const rendered = ["components/BuyerProof.tsx", "app/community/page.tsx", "app/page.tsx"]
    .map((path) => fs.readFileSync(path, "utf8"))
    .join("\n");
  assert.doesNotMatch(rendered, /kicks ass/i);
  assert.doesNotMatch(rendered, /Flour Shop|Easton/);
  assert.doesNotMatch(rendered, /utm_source|chatgpt\.com/i);
  assert.doesNotMatch(buyer, /Named in public/);
  assert.doesNotMatch(buyer, /public-mentions/);
  assert.doesNotMatch(buyer, /West Main|Cafe 180|verified-client-wordmark|customerMarks|proof-empty/);
  assert.match(buyer, /mention\.audience === audience/);
  assert.doesNotMatch(buyer, /fire-foundation/);
  assert.match(fs.readFileSync("app/community/page.tsx", "utf8"), /FIRE Foundation/);
  assert.match(fs.readFileSync("app/community/page.tsx", "utf8"), /Pie in the Sky/);
  assert.match(fs.readFileSync("data/site.ts", "utf8"), /food[- ]box program/);
  assert.doesNotMatch(fs.readFileSync("data/site.ts", "utf8"), /CSA-style/);
  assert.doesNotMatch(fs.readFileSync("data/site.ts", "utf8"), /public post named/);
  const questions = fs.readFileSync("docs/OWNER-QUESTIONS.md", "utf8");
  assert.match(questions, /no separate Named in public block/);
  assert.match(questions, /27 brands, once each/);
  assert.match(questions, /West Main Taproom \+ Grill and Cafe 180 are omitted/);
  assert.doesNotMatch(questions, /utm_source|chatgpt\.com/i);
  assert.doesNotMatch(fs.readFileSync("data/customers.ts", "utf8"), /utm_source|chatgpt\.com/i);
  const joined = names;
  assert.doesNotMatch(joined, /Lincoln|T-Bonz|Cosmic Coyote|Grecian|Flour Shop|Easton/);
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
  const pull = fs.readFileSync("components/CafePull.tsx", "utf8");
  assert.match(buyer, /CafePull/);
  assert.doesNotMatch(buyer, /FeaturedMention/);
  assert.doesNotMatch(buyer, /confirmed with the bakery|Public post/);
  assert.match(pull, /URBAN_EGG_PULL_QUOTE/);
  assert.match(pull, /URBAN_EGG_PULL_CREDIT/);
  assert.match(customers, /Urban Egg, Meet the Makers/);
  assert.doesNotMatch(pull, /Public mention; not a customer testimonial/);
  assert.match(sector, /story\.audience === slug/);
  assert.match(featured, /\{mention\.name\} · \{mention\.series\} · \{mention\.when\}/);
  assert.match(featured, /Public mention; not a customer testimonial/);
  assert.doesNotMatch(`${buyer}\n${sector}\n${featured}`, /Nettie|Farmstand|Blue Point Brewing|fb\.watch|facebook\.com\/urban/i);
  assert.match(customers, /Maryland beer-bread/);
  assert.match(fs.readFileSync("app/layout.tsx", "utf8"), /noindex,nofollow/);
  assert.match(fs.readFileSync("app/layout.tsx", "utf8"), /demo-ribbon/);
});
