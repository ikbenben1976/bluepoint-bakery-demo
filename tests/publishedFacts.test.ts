import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { homeCommunityTiles } from "../data/homeCommunity";
import { communityMarks, customerMarks } from "../data/photos";
import { communityPartners, customerComments } from "../data/site";

const read = (path: string) => fs.readFileSync(path, "utf8");

test("2016 AFP award is on Community with a link from About", () => {
  const about = read("app/about/page.tsx");
  const home = read("app/page.tsx");
  const community = read("app/community/page.tsx");
  const site = read("data/site.ts");
  assert.match(community, /id="recognition"/);
  assert.match(community, /Good baking\. Good neighbors\./);
  assert.match(community, /Project Angel Heart/);
  assert.match(community, /Pie in the Sky/);
  assert.match(community, /CASA of Adams/);
  assert.match(community, /The GrowHaus/);
  assert.match(community, /Soup for the Soul/);
  assert.match(community, /FIRE Foundation of Denver/);
  assert.match(community, /National Philanthropy Day/);
  assert.match(community, /2016 Outstanding Small Business/);
  assert.doesNotMatch(home, /Good baking\. Good neighbors\./);
  assert.doesNotMatch(home, /Association of Fundraising Professionals/);
  assert.doesNotMatch(community, /Philanthropist of the Year|AFP Colorado/);
  assert.match(about, /Recognized for giving back — see our community work/);
  assert.ok(about.includes('href="/community#recognition"'));
  assert.doesNotMatch(about, /Outstanding Small Business|AFP Colorado/);
  assert.doesNotMatch(site, /Outstanding Small Business|AFP Colorado|Philanthropist of the Year/);
});

test("home community tiles use the four charity logos", () => {
  assert.deepEqual(
    homeCommunityTiles.map((tile) => [tile.caption, tile.image?.src, tile.image?.alt]),
    [
      [
        "Project Angel Heart: Pie in the Sky",
        "/images/community-logos/project-angel-heart.png",
        "Project Angel Heart logo",
      ],
      [
        "CASA of Adams & Broomfield Counties",
        "/images/community-logos/casa.png",
        "CASA of Adams & Broomfield Counties logo",
      ],
      ["The GrowHaus", "/images/community-logos/growhaus.png", "The GrowHaus logo"],
      ["Soup for the Soul", "/images/community-logos/soup-for-the-soul.png", "Soup for the Soul logo"],
    ],
  );
  for (const tile of homeCommunityTiles) {
    assert.ok(tile.image);
    assert.ok(tile.image.width > 0 && tile.image.height > 0);
    assert.ok(fs.existsSync(`public${tile.image.src}`));
  }
  const home = read("app/page.tsx");
  const section = home.slice(home.indexOf('className="block home-community"'));
  assert.ok(section.includes("home-charity-grid"));
  assert.ok(section.indexOf("Community partners") > section.indexOf("home-charity-grid"));
  assert.doesNotMatch(section, /illustrative-label/);
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
