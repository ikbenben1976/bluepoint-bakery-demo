/**
 * Front Range businesses Ben approved on 2026-11-05 for public-mention marks.
 * Each one named Denver Bluepoint in a public Facebook post. Logos are the
 * businesses’ own site assets. Nothing here says the account is current.
 *
 * Restaurant and café entries render inside the matching BuyerProof audience
 * tab, in the same logo cards as Cherry Cricket, Mountain Sun, and Oskar
 * Blues. There is no separate “Named in public” block.
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
  caption: string;
  audience: PublicMentionAudience;
};

export const publicMentions: readonly PublicMention[] = [
  {
    name: "Cafe 180",
    src: "/images/customers/cafe-180.png",
    width: 800,
    height: 215,
    alt: "Cafe 180 logo",
    caption: "Public post: sourdough and baguettes.",
    audience: "cafes",
  },
  {
    name: "Urban Egg",
    src: "/images/customers/urban-egg.png",
    width: 640,
    height: 640,
    alt: "Urban Egg logo",
    caption: "Public post: Stuffed French Toast brioche made for Urban Egg.",
    audience: "cafes",
  },
  {
    name: "West Main Taproom + Grill",
    src: "/images/customers/west-main.png",
    width: 900,
    height: 255,
    alt: "West Main Taproom + Grill logo",
    caption: "Public posts: burger buns and marble rye.",
    audience: "restaurants",
  },
  {
    name: "Windsor Lake Cafe & Marketplace",
    src: "/images/customers/windsor-lake-cafe.png",
    width: 720,
    height: 777,
    alt: "Windsor Lake Cafe & Marketplace logo",
    caption: "Public post: some pastries from Bluepoint in Denver.",
    audience: "cafes",
  },
  {
    name: "Revolver Kitchen",
    src: "/images/customers/revolver-kitchen.png",
    width: 520,
    height: 507,
    alt: "Revolver Kitchen logo",
    caption: "Public post: bread sourced from Bluepoint.",
    audience: "restaurants",
  },
  {
    name: "Red Cedar Bistro",
    src: "/images/customers/red-cedar-bistro.png",
    width: 547,
    height: 235,
    alt: "Red Cedar Bistro logo",
    caption: "Public post: named among local suppliers.",
    audience: "restaurants",
  },
  {
    name: "The GrowHaus",
    src: "/images/customers/growhaus.png",
    width: 800,
    height: 610,
    alt: "The GrowHaus logo",
    caption: "Public post: breads as a CSA add-on. Also a community partner.",
    audience: "community",
  },
];
