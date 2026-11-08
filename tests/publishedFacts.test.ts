import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { communityMarks, customerMarks } from "../data/photos";
import { communityPartners, customerComments } from "../data/site";

const read = (path: string) => fs.readFileSync(path, "utf8");

test("2016 AFP award is on the community page, with a link from About", () => {
  const about = read("app/about/page.tsx");
  const home = read("app/page.tsx");
  const community = read("app/community/page.tsx");
  const site = read("data/site.ts");
  assert.match(community, /id="recognition"/);
  assert.match(
    community,
    /In 2016, the Colorado chapter of the Association of Fundraising Professionals named Bluepoint Bakery Outstanding Small Business at its National Philanthropy Day luncheon\. That giving continues today\. Since 2009 we&apos;ve baked and donated every pie for Project Angel Heart&apos;s Pie in the Sky, and we support CASA of Adams &amp; Broomfield Counties, The GrowHaus and Soup for the Soul\./,
  );
  assert.match(about, /Recognized for giving back — see our community work/);
  assert.match(about, /href="\/community#recognition"/);
  assert.doesNotMatch(about, /Outstanding Small Business/);
  assert.doesNotMatch(about, /AFP Colorado/);
  assert.match(community, /Outstanding Small Business/);
  assert.doesNotMatch(community, /AFP Colorado/);
  assert.doesNotMatch(community, /Philanthropist of the Year/);
  for (const source of [home, site]) {
    assert.doesNotMatch(source, /Outstanding Small Business/);
    assert.doesNotMatch(source, /AFP Colorado/);
    assert.doesNotMatch(source, /Philanthropist of the Year/);
  }
});

test("About uses the approved Willie story and keeps his portrait", () => {
  const about = read("app/about/page.tsx");
  const site = read("data/site.ts");
  assert.match(about, /From baker to owner:/);
  assert.match(about, /Willie Ramirez/);
  assert.match(
    about,
    /Bluepoint Bakery opened in Denver in 1987, founded by chefs Fred Bramhall and Mary Clark\. Willie Ramirez started in the kitchen and spent 28 years baking for and running the bakery before taking full ownership\./,
  );
  assert.match(
    about,
    /Today Bluepoint is a proud minority-owned, family-owned business\. We still bake from scratch with high-quality ingredients and deliver to restaurants, cafés, hotels, hospitals, schools and catering kitchens up and down the Front Range\. Reliable, on-time delivery and clear communication are how we work with every account\./,
  );
  assert.match(about, /WILLIE_CAPTION/);
  assert.match(about, /williePortrait/);
  assert.match(read("data/photos.ts"), /Willie Ramirez, owner/);
  assert.match(about, /about-gallery/);
  assert.match(read("data/photos.ts"), /Baguettes on a rack/);
  assert.doesNotMatch(about, /not Willie Ramirez|Illustrative bakery photo|does not give a date|Illustrative image/);
  assert.doesNotMatch(about, /Westword|Best of Denver|Best Bakery|44 Business|44businesscapital|westword\.com/i);
  assert.doesNotMatch(site, /Westword|44 Business|44businesscapital|westword\.com|Best of Denver/i);
});

test("community marks are the four nonprofits and customer marks are the published logos", () => {
  assert.deepEqual(
    communityMarks.map((mark) => mark.src),
    [
      "/images/scenes/angel-heart.png",
      "/images/scenes/casa.png",
      "/images/scenes/growhaus.webp",
      "/images/scenes/soup-for-the-soul.png",
    ],
  );
  assert.deepEqual(
    customerMarks.map((mark) => mark.src),
    ["/images/scenes/mountain-sun.webp", "/images/scenes/oskar-blues.webp"],
  );
  const partnerText = communityPartners.map((partner) => partner.points.join(" ")).join(" ");
  assert.doesNotMatch(partnerText, /Mountain Sun|Oskar Blues|Cherry Cricket|Outstanding/);
  assert.equal(customerComments.length, 2);
  assert.match(customerComments[0].place, /Cherry Cricket/);
  assert.match(customerComments[1].place, /Mountain Sun/);
  const quoted = customerComments.map((comment) => comment.quote).join(" ");
  assert.doesNotMatch(quoted, /kicks ass/i);
});

test("homepage trust strip does not invent a certification or an extra award", () => {
  const home = read("app/page.tsx");
  assert.match(home, /Listed in the product directory/);
  assert.match(home, /Minority-owned/);
  assert.match(home, /Headquartered in Denver, Colorado/);
  assert.match(home, /NMSDC Certified Minority Business Enterprise/);
  assert.match(home, /nmsdc-mbe\.png/);
  assert.doesNotMatch(home, /not a certification/);
  assert.doesNotMatch(home, /does not give a date/);
  assert.doesNotMatch(home, /The bakery must confirm whether samples/);
  assert.doesNotMatch(home, /Independent Denver bakery/);
  assert.doesNotMatch(home, /Do NOT add the MBE badge/);
});
