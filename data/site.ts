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
  { href: "/wholesale", label: "Wholesale" },
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
    q: "What is Bluepoint Bakery?",
    a: "Bluepoint Bakery is a locally owned, independent provider of fresh baked goods to the food service community of the front range of Colorado. Fine restaurants, delis, bar & grills, specialty groceries and espresso bars have been enjoying our breads and pastries for over 30 years.",
  },
  {
    id: "does",
    q: "What does Bluepoint Bakery do?",
    a: "We bake and deliver 6 days a week. Our product line includes, but is not limited to, a variety of different styles, sizes and flavors of hamburger buns, many flavors of sliced breads in different sizes and thickness of slice, baguette/hoagie rolls in various lengths and styles, as well as a full line of breakfast pastries.",
  },
  {
    id: "where",
    q: "Where is Bluepoint Bakery located?",
    a: "Our baking facility and office are located at 5105 Cook St. Denver, CO 80216",
  },
  {
    id: "become",
    q: "How do I become a customer?",
    a: "It\u2019s easy! You can set up an account by contacting us through phone or email and a sales professional will assist you!",
  },
  {
    id: "deliver",
    q: "Where does Bluepoint Bakery deliver?",
    a: "Deliveries are available from Denver Metro Area; Colorado Springs; Fort Collins; Greeley; Loveland; Summit County; Blackhawk; and Cheyenne, Wyoming.",
  },
  {
    id: "order",
    q: "How do I order from Bluepoint Bakery?",
    a: "Existing customers can order by calling us at 303-298-1100, emailing sales@bluepointbakery.com, or by ordering through this website.",
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

/** Facts from https://www.bluepointbakery.com/community — the 2016 award is not repeated here. */
export const communityPartners = [
  {
    name: "Project Angel Heart",
    points: [
      "Donates thousands of baked goods every year.",
      "Each month, donates birthday cakes to clients.",
      "Prepares and donates all the pies for Pie in the Sky, since 2009.",
    ],
  },
  {
    name: "CASA of Adams & Broomfield Counties",
    points: [
      "Provides cookies and baked goods through the year.",
      "Sponsors the annual Cookie Campaign. The inaugural campaign in December 2013 raised over $15,000.",
      "Has supported the CASA Classic Golf Tournament, Indulge for CASA, and Kaleidoscope of Hope.",
    ],
  },
  {
    name: "The GrowHaus",
    points: [
      "Nonprofit indoor farm, marketplace, and educational center in Denver\u2019s Elyria-Swansea neighborhood.",
      "Bluepoint assists with bread weekly for community distribution.",
      "Breads are an add-on for the CSA-style food box.",
    ],
  },
  {
    name: "Soup for the Soul",
    points: [
      "For over 15 years, Bluepoint has donated desserts for around 700 attendees.",
      "Proceeds support Porter Hospice, St. Anthony Hospice, and The Butterfly Program.",
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

export const RAMIREZ_STUDY =
  "https://www.44businesscapital.com/business-loan-story/from-baker-to-manager-to-owner-long-time-employee-acquires-bakery-business-with-2675000-sba-loan/";

export const WESTWORD_FOUNDING = "https://www.westword.com/location/bluepoint-bakery-5170644/";

export const WESTWORD_2000 = "https://www.westword.com/news/best-of-denver-winners-from-2000-5834471/";
