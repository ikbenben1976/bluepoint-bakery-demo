/**
 * Customer Showcase marks for the four BuyerProof tabs, plus The GrowHaus
 * on the Community page. Each showcase brand appears once, in its tab.
 * Logo cards are the name and the mark only. There is no provenance caption.
 *
 * West Main Taproom + Grill and Cafe 180 are omitted because no Bluepoint
 * proof-point link was established. Their plated-food photos stay on the
 * homepage “What are you making?” cards.
 * The GrowHaus is a community partner (nonprofit farm), so it stays
 * audience "community" and off the Institutions tab.
 * Blue Point Brewing, Nettie’s Country Bakery, and Blue Point Farmstand are
 * a Maryland beer-bread mention, not Denver Bluepoint Bakery, and are omitted.
 *
 * `surface: "ink"` is a dark badge behind marks that are light on transparent
 * (or a cream extrusion that disappears on a light well). It is not shown as text.
 * Snarf’s uses the stacked wordmark because it stays sharp at card size.
 */

export type PublicMentionAudience = "restaurants" | "cafes" | "hotels" | "institutions" | "community";

export type LogoSurface = "paper" | "ink";

export type PublicMention = {
  name: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  audience: PublicMentionAudience;
  surface?: LogoSurface;
};

export type FeaturedPublicMention = {
  name: string;
  series: string;
  when: string;
  quote: string;
  audience: PublicMentionAudience;
};

/** Shortened pull quote for the homepage Cafés tab. The verbatim post stays below for the sector page. */
export const URBAN_EGG_PULL_QUOTE =
  "Bluepoint Bakery, the family- and minority-owned bakery behind so many of our breads… created the Stuffed French Toast Brioche specifically for Urban Egg!";

export const URBAN_EGG_PULL_CREDIT = "Urban Egg, Meet the Makers";

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

const SHOWCASE_AUDIENCES = ["restaurants", "cafes", "hotels", "institutions"] as const;

export function isShowcaseAudience(audience: PublicMentionAudience): boolean {
  return (SHOWCASE_AUDIENCES as readonly string[]).includes(audience);
}

export const publicMentions: readonly PublicMention[] = [
  {
    name: "The Cherry Cricket",
    src: "/images/customers/cherry-cricket.svg",
    width: 348,
    height: 218,
    alt: "The Cherry Cricket logo",
    audience: "restaurants",
  },
  {
    name: "Mountain Sun Pub & Brewery",
    src: "/images/scenes/mountain-sun.webp",
    width: 350,
    height: 318,
    alt: "Mountain Sun Pub & Brewery logo",
    audience: "restaurants",
  },
  {
    name: "Oskar Blues Fooderies",
    src: "/images/scenes/oskar-blues.webp",
    width: 174,
    height: 174,
    alt: "Oskar Blues Fooderies logo",
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
    name: "Revolver Kitchen",
    src: "/images/customers/revolver-kitchen.png",
    width: 520,
    height: 507,
    alt: "Revolver Kitchen logo",
    audience: "restaurants",
  },
  {
    name: "The Lobby Denver",
    src: "/images/customers/lobby-denver.png",
    width: 338,
    height: 288,
    alt: "The Lobby Denver logo",
    audience: "restaurants",
  },
  {
    name: "Lindsay's Boulder Deli",
    src: "/images/customers/lindsays.webp",
    width: 800,
    height: 488,
    alt: "Lindsay's Boulder Deli logo",
    audience: "restaurants",
  },
  {
    name: "Grande Station",
    src: "/images/customers/grande-station.webp",
    width: 800,
    height: 652,
    alt: "Grande Station logo",
    audience: "restaurants",
  },
  {
    name: "My Brother's Bar",
    src: "/images/customers/my-brothers-bar.png",
    width: 221,
    height: 107,
    alt: "My Brother's Bar logo",
    surface: "ink",
    audience: "restaurants",
  },
  {
    name: "Snarf's Sandwiches",
    src: "/images/customers/snarfs.webp",
    width: 627,
    height: 300,
    alt: "Snarf's Sandwiches logo",
    audience: "restaurants",
  },
  {
    name: "Bon Ami Bistro & Crêperie",
    src: "/images/customers/bon-ami.png",
    width: 174,
    height: 174,
    alt: "Bon Ami Bistro & Crêperie logo",
    audience: "restaurants",
  },
  {
    name: "Chop Shop Casual Urban Eatery",
    src: "/images/customers/chop-shop.webp",
    width: 600,
    height: 270,
    alt: "Chop Shop Casual Urban Eatery logo",
    surface: "ink",
    audience: "restaurants",
  },
  {
    name: "La Merise French Bistro",
    src: "/images/customers/la-merise.png",
    width: 437,
    height: 133,
    alt: "La Merise French Bistro logo",
    audience: "restaurants",
  },
  {
    name: "Linger",
    src: "/images/customers/linger.svg",
    width: 294,
    height: 146,
    alt: "Linger logo",
    audience: "restaurants",
  },
  {
    name: "Root Down",
    src: "/images/customers/root-down.svg",
    width: 488,
    height: 151,
    alt: "Root Down logo",
    audience: "restaurants",
  },
  {
    name: "Wynkoop Brewing Company",
    src: "/images/customers/wynkoop.svg",
    width: 218,
    height: 190,
    alt: "Wynkoop Brewing Company logo",
    audience: "restaurants",
  },
  {
    name: "New Belgium Brewing — DEN Airport",
    src: "/images/customers/new-belgium.webp",
    width: 300,
    height: 300,
    alt: "New Belgium Brewing logo",
    audience: "restaurants",
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
    name: "Fluid Coffee Bar",
    src: "/images/customers/fluid.png",
    width: 466,
    height: 60,
    alt: "Fluid Coffee Bar logo",
    surface: "ink",
    audience: "cafes",
  },
  {
    name: "Urban Cafe Denver",
    src: "/images/customers/urban-cafe.webp",
    width: 574,
    height: 435,
    alt: "Urban Cafe Denver logo",
    audience: "cafes",
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
    name: "Nosh Catering",
    src: "/images/customers/nosh.webp",
    width: 371,
    height: 322,
    alt: "Nosh Catering logo",
    audience: "hotels",
  },
  {
    name: "Front Porch Coffee Shop — Event Catering",
    src: "/images/customers/front-porch.webp",
    width: 418,
    height: 418,
    alt: "Front Porch Coffee Shop logo",
    audience: "hotels",
  },
  {
    name: "Vīb Hotel Denver RiNo — Lobby Café",
    src: "/images/customers/vib-hotel.webp",
    width: 800,
    height: 800,
    alt: "Vīb Hotel Denver RiNo logo",
    surface: "ink",
    audience: "hotels",
  },
  {
    name: "University of Colorado Boulder",
    src: "/images/customers/cu-boulder.svg",
    width: 868,
    height: 80,
    alt: "University of Colorado Boulder logo",
    audience: "institutions",
  },
  {
    name: "Regis University — Ranger Dining",
    src: "/images/customers/ranger-dining.webp",
    width: 800,
    height: 592,
    alt: "Regis University Ranger Dining logo",
    surface: "ink",
    audience: "institutions",
  },
  {
    name: "Arapahoe Libraries",
    src: "/images/customers/arapahoe.png",
    width: 500,
    height: 120,
    alt: "Arapahoe Libraries logo",
    audience: "institutions",
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
