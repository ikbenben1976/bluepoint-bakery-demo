/**
 * Front Range businesses Ben approved on 2026-11-05 for public-mention marks.
 * Each one named Denver Bluepoint in a public Facebook post. Logos are the
 * businesses’ own site assets. Nothing here says the account is current.
 *
 * Restaurant and café entries render inside the matching BuyerProof audience
 * tab, in the same logo cards as Cherry Cricket, Mountain Sun, and Oskar
 * Blues. Logo cards are the name and mark only. There is no separate
 * “Named in public” block and no provenance caption.
 * Urban Egg’s Cafés tab (and the cafés sector page) shows Urban Egg’s
 * October Meet the Makers public post in the featured callout. The paste did
 * not state a year, so the attribution says October only.
 * Blue Point Brewing, Nettie’s Country Bakery, and Blue Point Farmstand are
 * a Maryland beer-bread mention, not Denver Bluepoint Bakery, and are omitted.
 * - restaurants — West Main Taproom + Grill, Revolver Kitchen, Red Cedar Bistro
 * - cafes — Cafe 180, Urban Egg, Windsor Lake Cafe & Marketplace
 * - community — The GrowHaus. It is a community partner (nonprofit farm and
 *   CSA), not a hospital, school, university, or airport, so the public-post
 *   line stays on the Community page rather than the Institutions tab.
 *
 * Sources:
 * - Cafe 180 — https://www.cafe180.org/ header PNG (CAFE180_Logo_horizontal_2021.png)
 * - Urban Egg — https://www.urbanegg.com/ primary logo PNG
 * - West Main Taproom + Grill — https://westmaintaproom.com/ schema logo (white lockup, inked navy for a light card)
 * - Windsor Lake Cafe & Marketplace — og:image on https://wlcmarketplace.square.site/ (white knocked out)
 * - Revolver Kitchen — https://www.revolverkitchen.com/ header logo
 * - Red Cedar Bistro — https://redcedarbistro.com/ header logo
 * - The GrowHaus — https://www.thegrowhaus.org/ crest (also a community partner)
 *
 * Skipped (no clean public mark): Lincoln’s Roadhouse, T-Bonz Grill, Cosmic Coyote, The Grecian Grazer.
 * FIRE Foundation’s logo is used on Community, not in this list.
 * The Flour Shop / Bluepoint Hospitality (Easton, MD) is excluded.
 */

export type PublicMentionAudience = "restaurants" | "cafes" | "hotels" | "institutions" | "community";

export type PublicMention = {
  name: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  audience: PublicMentionAudience;
};

export type FeaturedPublicMention = {
  name: string;
  series: string;
  when: string;
  quote: string;
  audience: PublicMentionAudience;
};

/** Verbatim Urban Egg public post. October only — the paste did not state a year. */
export const featuredPublicMentions: readonly FeaturedPublicMention[] = [
  {
    name: "Urban Egg",
    series: "Meet the Makers",
    when: "October",
    quote:
      "Welcome to Part 3 of Meet the Makers, where we celebrate the trusted partner behind the ingredients that make our menu special. This time, we visited Bluepoint Bakery, the family- and minority-owned bakery behind so many of our breads. Most notably, they created the Stuffed French Toast Brioche specifically for Urban Egg! Getting to see where it all comes together was pretty special.",
    audience: "cafes",
  },
];

export const publicMentions: readonly PublicMention[] = [
  {
    name: "Cafe 180",
    src: "/images/customers/cafe-180.png",
    width: 800,
    height: 215,
    alt: "Cafe 180 logo",
    audience: "cafes",
  },
  {
    name: "Urban Egg",
    src: "/images/customers/urban-egg.png",
    width: 640,
    height: 640,
    alt: "Urban Egg logo",
    audience: "cafes",
  },
  {
    name: "West Main Taproom + Grill",
    src: "/images/customers/west-main.png",
    width: 900,
    height: 255,
    alt: "West Main Taproom + Grill logo",
    audience: "restaurants",
  },
  {
    name: "Windsor Lake Cafe & Marketplace",
    src: "/images/customers/windsor-lake-cafe.png",
    width: 720,
    height: 777,
    alt: "Windsor Lake Cafe & Marketplace logo",
    audience: "cafes",
  },
  {
    name: "Revolver Kitchen",
    src: "/images/customers/revolver-kitchen.png",
    width: 520,
    height: 507,
    alt: "Revolver Kitchen logo",
    audience: "restaurants",
  },
  {
    name: "Red Cedar Bistro",
    src: "/images/customers/red-cedar-bistro.png",
    width: 547,
    height: 235,
    alt: "Red Cedar Bistro logo",
    audience: "restaurants",
  },
  {
    name: "The GrowHaus",
    src: "/images/customers/growhaus.png",
    width: 800,
    height: 610,
    alt: "The GrowHaus logo",
    audience: "community",
  },
];
