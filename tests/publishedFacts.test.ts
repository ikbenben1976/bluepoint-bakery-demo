import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { homeCommunityTiles } from "../data/homeCommunity";
import { communityMarks, customerMarks } from "../data/photos";
import { communityPartners, customerComments } from "../data/site";

const read = (path: string) => fs.readFileSync(path, "utf8");

test("2016 AFP award is on the community page, with a link from About", () => {
  const about = read("app/about/page.tsx");
  const home = read("app/page.tsx");
  const community = read("app/community/page.tsx");
  const site = read("data/site.ts");
  const rendered = (source: string) => source.replaceAll("&apos;", "'").replaceAll("&amp;", "&");
  assert.match(community, /id="recognition"/);
  assert.match(rendered(community), /Good baking\. Good neighbors\./);
  assert.match(rendered(community), /Project Angel Heart/);
  assert.match(rendered(community), /Pie in the Sky/);
  assert.match(rendered(community), /CASA of Adams/);
  assert.match(rendered(community), /The GrowHaus/);
  assert.match(rendered(community), /Soup for the Soul/);
  assert.match(rendered(community), /FIRE Foundation of Denver/);
  assert.match(rendered(community), /National Philanthropy Day/);
  assert.match(rendered(community), /2016 Outstanding Small Business/);
  assert.doesNotMatch(rendered(home), /Good baking\. Good neighbors\./);
  assert.doesNotMatch(rendered(home), /Association of Fundraising Professionals/);
  assert.equal(
    rendered(home).match(/Giving back to the communities we serve/g)?.length,
    1,
  );
  assert.equal(
    rendered(home).match(
      /Our commitment to Colorado goes beyond the bakery\. We're proud to support organizations that make a difference in our communities\./g,
    )?.length,
    1,
  );
  assert.doesNotMatch(rendered(community), /Community involvement has long been part/);
  assert.doesNotMatch(rendered(home), /prepared and donated all the pies/);
  assert.doesNotMatch(rendered(home), /Community involvement has long been part/);
  assert.match(about, /Recognized for giving back — see our community work/);
  assert.match(about, /href="\/community#recognition"/);
  assert.doesNotMatch(about, /Outstanding Small Business/);
  assert.doesNotMatch(about, /AFP Colorado/);
  assert.match(community, /Outstanding Small Business/);
  assert.doesNotMatch(community, /AFP Colorado/);
  assert.doesNotMatch(community, /Philanthropist of the Year/);
  assert.doesNotMatch(site, /Outstanding Small Business/);
  assert.doesNotMatch(site, /AFP Colorado/);
  assert.doesNotMatch(site, /Philanthropist of the Year/);
  assert.doesNotMatch(home, /AFP Colorado/);
  assert.doesNotMatch(home, /Philanthropist of the Year/);
});

test("home community tiles use the pie photo and three photo-needed slots", () => {
  assert.deepEqual(
    homeCommunityTiles.map((tile) => tile.caption),
    [
      "Project Angel Heart: Pie in the Sky",
      "CASA of Adams & Broomfield Counties",
      "The GrowHaus",
      "Soup for the Soul",
    ],
  );
  assert.equal(homeCommunityTiles[0].image?.src, "/images/scenes/pie-filling.webp");
  assert.deepEqual(
    homeCommunityTiles.slice(1).map((tile) => tile.image),
    [null, null, null],
  );
  const home = read("app/page.tsx");
  const grid = home.indexOf("home-charity-grid");
  const button = home.indexOf("Community partners");
  assert.ok(grid > 0 && button > grid);
  assert.match(home, /home-charity-placeholder">Photo needed/);
  assert.doesNotMatch(home, /split-photo/);
});

test("About uses the approved Willie story and keeps his portrait", () => {
  const about = read("app/about/page.tsx");
  const site = read("data/site.ts");
  assert.match(about, /From the bakery floor to business ownership:/);
  assert.match(about, /Willie Ramirez/);
  assert.match(
    about,
    /Bluepoint Bakery began in Denver in 1987, founded by chefs Fred Bramhall and Mary Clark.*Willie Ramirez built his career inside the bakery.*becoming its owner/,
  );
  assert.match(
    about,
    /Today, Bluepoint continues its tradition as a minority-owned, family-owned Colorado bakery/,
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
  assert.match(home, /Made in Colorado/);
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
