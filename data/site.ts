export const ORDER_URL =
  "https://us.bakery.software/app/bluepoint/us/-1/Account/Login";
export const PAY_URL = "https://app.paywholesail.com/portal/bluepointbakery";
export const PHONE_DISPLAY = "(303) 298-1100";
export const PHONE_TEL = "+13032981100";
export const EMAIL = "sales@bluepointbakery.com";
export const ADDRESS = "5105 Cook St., Denver, CO 80216";
export const HOURS = "Monday–Friday 7:00 AM–3:00 PM";
/** Footer link on bluepointbakery.com, checked 4 Nov 2026. */
export const INSTAGRAM = "https://instagram.com/bluepointbakery/";
/** Linked from https://www.bluepointbakery.com/contact-us, checked 4 Nov 2026. */
export const FACEBOOK = "https://www.facebook.com/BluepointBakery/";
export const DEMO_ORIGIN = "https://bluepoint-bakery-demo.vercel.app";
export const COLORADO_PROUD = "https://coloradoproud.com/product-finder/";
export const DISCLAIMER = "Demo prepared for review — not the official site";

export const NAV = [
  { href: "/breads", label: "Breads" },
  { href: "/pastries", label: "Pastries" },
  { href: "/delivery", label: "Delivery Area" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const MAPS_SEARCH_URL =
  "https://www.google.com/maps/search/?api=1&query=5105+Cook+St%2C+Denver%2C+CO+80216";

export const faqs = [
  {
    id: "what",
    q: "Who is Bluepoint Bakery?",
    a: "Bluepoint Bakery is a locally owned wholesale bakery in Denver, serving restaurants, cafés and other food-service businesses across Colorado's Front Range.",
  },
  {
    id: "does",
    q: "What products does Bluepoint offer?",
    a: "We specialize in fresh wholesale breads, hamburger buns, sandwich rolls, sliced loaves, baguettes and breakfast pastries, with a range of sizes and styles for food-service menus.",
  },
  {
    id: "where",
    q: "Where is Bluepoint Bakery located?",
    a: "Our baking facility and office are located at 5105 Cook St. Denver, CO 80216",
  },
  {
    id: "become",
    q: "How do I become a customer?",
    a: "Contact our sales team to discuss your business, product needs and delivery location. We'll guide you through the account setup process.",
  },
  {
    id: "deliver",
    q: "Where does Bluepoint Bakery deliver?",
    a: "Our published delivery areas include the Denver metro area, Colorado Springs, Fort Collins, Greeley, Loveland, Summit County, Black Hawk and Cheyenne, Wyoming. Contact us to confirm service to your address.",
  },
  {
    id: "order",
    q: "How do I order from Bluepoint Bakery?",
    a: "Existing customers can order by calling us at 303-298-1100, emailing sales@bluepointbakery.com, or by ordering through this website.",
  },
  {
    id: "notice",
    q: "How much notice do you need?",
    a: "24 hours for all breads; Sourdough Boule needs 3 days.",
  },
  {
    id: "days",
    q: "What days do you deliver?",
    a: "We bake and deliver six days a week.",
  },
  {
    id: "pricing",
    q: "How do I get pricing?",
    a: "Add products to a pricing request and we'll follow up. It's a request, not an order.",
  },
  {
    id: "samples",
    q: "Can I try your products first?",
    a: "Ask Bluepoint's sales team about sample availability and any applicable conditions.",
  },
  {
    id: "slice",
    q: "Do you slice bread?",
    a: "Yes, many of our sliced breads come in different sizes and slice thicknesses.",
  },
  {
    id: "hours",
    q: "When is your office open?",
    a: "Monday to Friday, 7:00 AM to 3:00 PM.",
  },
] as const;

export const reviews = [
  {
    quote:
      "Exceptional Bread, Exceptional People \u2026 incredibly fresh \u2026 expertly baked.",
    stars: "5 star",
    when: "January 2026",
    source: "Restaurantji",
  },
  {
    quote:
      "We use Bluepoint for our Italian restaurant in Lakewood for our sandwich rolls and brownies \u2026 I deal almost exclusively with Nicole \u2026 she\u2019s always on top of things!",
    stars: "5 star",
    when: "September 2025",
    source: "Restaurantji",
  },
  {
    quote: "They do have some of the best bread in the market",
    stars: "5 star",
    when: "December 2022",
    source: "Chamber of Commerce",
  },
] as const;

/**
 * Partner stories adapted from https://www.bluepointbakery.com/community.
 * Pie in the Sky has no dollar total. Monthly birthday-cake lines and Mary’s quote are omitted.
 * The 2016 award stays on About only.
 */
export const communityPartners = [
  {
    name: "Project Angel Heart",
    points: [
      "We donate thousands of baked goods each year to Project Angel Heart, which home-delivers nutritious meals at no cost for people coping with life-threatening illness in metro Denver, Boulder, and Colorado Springs.",
      "We prepare and donate all the fresh pies for Pie in the Sky, their annual fundraiser, a partnership that began in 2009.",
    ],
    links: [
      { href: "http://www.projectangelheart.org/", label: "Project Angel Heart" },
      { href: "http://www.pieintheskycolorado.org/", label: "Pie in the Sky" },
    ],
  },
  {
    name: "CASA of Adams & Broomfield Counties",
    points: [
      "Our work with CASA of Adams & Broomfield Counties has included cookies and baked goods.",
      "We sponsor the annual Cookie Campaign with holiday sugar cookies (the first campaign in December 2013 raised over $15,000) and support the CASA Classic Golf Tournament, Indulge for CASA, and Kaleidoscope of Hope.",
    ],
    links: [
      { href: "https://casa17th.org/", label: "CASA" },
      { href: "http://casa17th.org/menus/cookies-count.html", label: "CASA Cookie Campaign" },
    ],
  },
  {
    name: "The GrowHaus",
    points: [
      "The GrowHaus is a nonprofit indoor farm, marketplace, and education center in Denver's Elyria-Swansea neighborhood.",
      "Our donated bread has helped support the organization’s food-box program and its efforts to improve food access in the neighborhood.",
    ],
    links: [
      { href: "http://www.thegrowhaus.com", label: "The GrowHaus" },
      { href: "http://www.mercadolado.com", label: "Mercado Lado" },
    ],
  },
  {
    name: "Soup for the Soul",
    points: [
      "For more than 15 years, Bluepoint has contributed desserts to Soup for the Soul, an annual tasting with soups and appetizers from more than 15 Denver restaurants and a silent auction for around 700 guests.",
      "Proceeds support Centura Health at Home's Porter Hospice, St. Anthony Hospice, and The Butterfly Program.",
    ],
    links: [
      { href: "http://www.soupforthesouldenver.org/", label: "Soup for the Soul" },
      { href: "http://www.chahf.org/PorterHospice", label: "Porter Hospice" },
      { href: "http://www.chahf.org/StAnthonyHospice", label: "St. Anthony Hospice" },
      {
        href: "http://www.centurahealthathome.org/CHH/Our-Specialties/The-Butterfly-Program/",
        label: "The Butterfly Program",
      },
    ],
  },
] as const;

export type ProofTheme = "quality" | "service" | "longevity";

export const customerComments: readonly {
  quote: string;
  name: string;
  place: string;
  themes: readonly ProofTheme[];
}[] = [
  {
    quote:
      "Since 1994 The Cherry Cricket has been pleased to serve Bluepoint Bakery products for all of our burgers and sandwiches. Their product is top notch and the customer service is outstanding. It is such a pleasure to work with all of their staff and products on a day-to-day basis.",
    name: "Todd A.",
    place: "Cherry Cricket",
    themes: ["quality", "service", "longevity"],
  },
  {
    quote: "Best burger bun in town!",
    name: "Paul N.",
    place: "Mountain Sun Pub, Southern Sun Pub and Vine Street Pub",
    themes: ["quality"],
  },
];

export const CAFE_REVIEW = {
  quote: "Ordering for our coffee shop for over 10 years… always fresh and delicious.",
  when: "December 2023",
  source: "Restaurantji",
  themes: ["quality", "longevity"] as const satisfies readonly ProofTheme[],
} as const;
