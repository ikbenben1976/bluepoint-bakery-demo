import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { communityMarks, customerMarks } from "../data/photos";
import { communityPartners, customerComments } from "../data/site";

const read = (path: string) => fs.readFileSync(path, "utf8");

test("2016 AFP award is written only in the About story", () => {
  const about = read("app/about/page.tsx");
  const home = read("app/page.tsx");
  const community = read("app/community/page.tsx");
  const site = read("data/site.ts");
  assert.match(about, /Outstanding Small Business/);
  assert.match(about, /AFP Colorado Chapter/);
  for (const source of [home, community, site]) {
    assert.doesNotMatch(source, /Outstanding Small Business/);
    assert.doesNotMatch(source, /AFP Colorado/);
    assert.doesNotMatch(source, /Philanthropist of the Year/);
  }
});

test("About names the published founders, Westword recognition, and Willie without calling the photo Willie", () => {
  const about = read("app/about/page.tsx");
  assert.match(about, /Fred Bramhall/);
  assert.match(about, /Mary Clark/);
  assert.match(about, /Best Bakery/);
  assert.match(about, /Willie Ramirez/);
  assert.match(about, /Illustrative bakery photo/);
  assert.match(about, /not Willie Ramirez/);
  assert.match(about, /westword\.com\/location\/bluepoint-bakery-5170644/);
  assert.match(about, /best-of-denver-winners-from-2000-5834471/);
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
  assert.match(home, /not a certification/);
  assert.match(home, /Headquartered in Denver, Colorado/);
  assert.doesNotMatch(home, /Independent Denver bakery/);
  assert.doesNotMatch(home, /MBE|certified minority/i);
});
