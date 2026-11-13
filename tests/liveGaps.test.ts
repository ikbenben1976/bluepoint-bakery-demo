import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { communityPartners } from "../data/site";

const read = (path: string) => fs.readFileSync(path, "utf8");

const STORY_OPENING =
  "Bluepoint Bakery began in Denver in 1987, founded by chefs Fred Bramhall and Mary Clark. Willie Ramirez built his career inside the bakery, spending 28 years baking, managing operations and helping the business grow before becoming its owner.";

const STORY_TODAY =
  "Today, Bluepoint continues its tradition as a minority-owned, family-owned Colorado bakery, combining scratch baking with dedicated wholesale service. From independent restaurants to institutional kitchens, we focus on dependable delivery, quality products and strong customer relationships.";

test("homepage states bread and pastry lead times near the order actions", () => {
  const home = read("app/page.tsx");
  assert.match(home, /hero-lead-times/);
  assert.match(home, /Order breads at least 24 hours ahead\./);
  assert.match(home, /Order pastries at least 48 hours ahead\./);
  const lead = home.indexOf("hero-lead-times");
  const actions = home.indexOf("hero-actions");
  assert.ok(actions > 0 && lead > actions, "lead-time notice follows the hero order actions");
});

test("homepage food service leads into delivery and community, without the story", () => {
  const home = read("app/page.tsx");
  const about = read("app/about/page.tsx");
  assert.doesNotMatch(home, /home-story|home-why|Our story|WILLIE_CAPTION/);
  assert.ok(about.includes(STORY_OPENING));
  assert.ok(about.includes(STORY_TODAY));
  assert.match(home, /From first conversation to first order/);
  assert.doesNotMatch(home, /From your menu to the right order/);
  const food = home.indexOf("buyer-proof-block");
  const deliver = home.indexOf("Where we deliver");
  const community = home.indexOf("home-community");
  assert.ok(food > 0 && deliver > food && community > deliver);
  assert.doesNotMatch(home, /sports venues/);
  assert.doesNotMatch(home, /accolades|finest ingredients|newspaper reviews/i);
  assert.doesNotMatch(home, /Best of Denver|44 Business Capital/);
});

test("about keeps scratch-made and ownership lines and names Cheyenne, Wyoming", () => {
  const about = read("app/about/page.tsx");
  assert.match(about, /minority-owned, family-owned Colorado bakery/);
  assert.doesNotMatch(about, /Westword|Best of Denver|44 Business/i);
  assert.match(about, /prepares fresh breads, pastries and specialty baked goods/);
  assert.match(about, /We also deliver to Cheyenne and nearby communities in Wyoming\./);
});

test("community partners use the approved rewrites, links, and banned omissions", () => {
  const byName = Object.fromEntries(communityPartners.map((partner) => [partner.name, partner]));
  const angel = byName["Project Angel Heart"];
  const casa = byName["CASA of Adams & Broomfield Counties"];
  const grow = byName["The GrowHaus"];
  const soup = byName["Soup for the Soul"];
  assert.ok(angel && casa && grow && soup);

  const angelText = angel.points.join(" ");
  assert.match(angelText, /donate thousands of baked goods each year/);
  assert.match(angelText, /home-delivers nutritious meals at no cost/);
  assert.match(angelText, /metro Denver, Boulder, and Colorado Springs/);
  assert.match(angelText, /fresh pies for Pie in the Sky/);
  assert.match(angelText, /partnership that began in 2009/);
  assert.deepEqual(
    angel.links.map((link) => link.href),
    ["http://www.projectangelheart.org/", "http://www.pieintheskycolorado.org/"],
  );

  const casaText = casa.points.join(" ");
  assert.match(casaText, /holiday sugar cookies/);
  assert.match(casaText, /first campaign in December 2013 raised over \$15,000/);
  assert.match(casaText, /CASA Classic Golf Tournament, Indulge for CASA, and Kaleidoscope of Hope/);
  assert.deepEqual(
    casa.links.map((link) => link.href),
    ["https://casa17th.org/", "http://casa17th.org/menus/cookies-count.html"],
  );

  const growText = grow.points.join(" ");
  assert.match(growText, /education center in Denver.s Elyria-Swansea neighborhood/);
  assert.match(growText, /food[- ]box program/);
  assert.doesNotMatch(growText, /CSA-style/);
  assert.deepEqual(
    grow.links.map((link) => link.href),
    ["http://www.thegrowhaus.com", "http://www.mercadolado.com"],
  );

  const soupText = soup.points.join(" ");
  assert.match(soupText, /more than 15 years/);
  assert.match(soupText, /more than 15 Denver restaurants/);
  assert.match(soupText, /silent auction/);
  assert.match(soupText, /around 700 guests/);
  assert.match(soupText, /Centura Health at Home.s Porter Hospice, St\. Anthony Hospice, and The Butterfly Program/);
  assert.deepEqual(
    soup.links.map((link) => link.href),
    [
      "http://www.soupforthesouldenver.org/",
      "http://www.chahf.org/PorterHospice",
      "http://www.chahf.org/StAnthonyHospice",
      "http://www.centurahealthathome.org/CHH/Our-Specialties/The-Butterfly-Program/",
    ],
  );

  const all = communityPartners.map((partner) => `${partner.points.join(" ")} ${partner.links.map((link) => link.label).join(" ")}`).join("\n");
  assert.doesNotMatch(all, /\$1 million|\$100,?000|Philanthropist of the Year|birthday cake|Mary said|ovarian/i);
  assert.match(all, /\$15,000/);

  const page = read("app/community/page.tsx");
  assert.match(page, /partner\.links/);
  assert.doesNotMatch(page, /Philanthropist of the Year|birthday cake|\$1 million/);
});

test("contact is a service hub with real working links, not a dead-end message preview", () => {
  const page = read("app/contact/page.tsx");
  assert.match(page, /Let&apos;s talk bakery/);
  assert.match(page, /Start a wholesale inquiry/);
  assert.match(page, /New wholesale customers/);
  assert.match(page, /Existing customers/);
  assert.match(page, /Questions about delivery/);
  assert.match(page, /Find our Denver bakery/);
  assert.match(page, /PHONE_TEL/);
  assert.match(page, /EMAIL/);
  assert.match(page, /ORDER_URL/);
  assert.match(page, /PAY_URL/);
  assert.match(page, /HOURS/);
  assert.match(page, /MAPS_SEARCH_URL/);
  assert.doesNotMatch(page, /ContactMessage|Preview message|contact-message-form|cookStreetMap/);
});
