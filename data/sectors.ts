export type Sector = {
  slug: string;
  title: string;
  description: string;
  body: readonly string[];
  links: readonly { href: string; label: string }[];
};

export const sectors: readonly Sector[] = [
  {
    slug: "restaurants",
    title: "Restaurants and pubs",
    description:
      "Bluepoint’s site names restaurants, delis, and bar and grills among the businesses it bakes for, and publishes comments from Cherry Cricket, Mountain Sun, and Oskar Blues.",
    body: [
      "The FAQ calls Bluepoint a provider of fresh baked goods to fine restaurants, delis, bar and grills, specialty groceries, and espresso bars.",
      "Named comments on the bakery’s community page: Cherry Cricket (since 1994, burgers and sandwiches), Mountain Sun Pub, Southern Sun Pub and Vine Street Pub, and Oskar Blues, Chuburger and Cyclhops.",
    ],
    links: [
      { href: "/making/burgers", label: "Burgers and sliders" },
      { href: "/making/sandwiches", label: "Sandwiches and subs" },
      { href: "/breads", label: "All breads" },
    ],
  },
  {
    slug: "cafes",
    title: "Cafés and coffee shops",
    description:
      "The bakery’s pages name espresso bars and cafes. A December 2023 Restaurantji review mentions a coffee shop ordering for over 10 years.",
    body: [
      "The About page lists cafes among the industries it serves. The homepage names espresso bars.",
      "A Restaurantji review from December 2023 says: “Ordering for our coffee shop for over 10 years… always fresh and delicious.” The review does not name the shop.",
    ],
    links: [
      { href: "/making/breakfast", label: "Coffee and breakfast" },
      { href: "/pastries", label: "All pastries" },
    ],
  },
  {
    slug: "hotels",
    title: "Hotels and catering",
    description:
      "Bluepoint’s About page says it is trusted by hotels, country clubs, and catering businesses. It does not name those accounts.",
    body: [
      "The homepage also lists hotels and catered events along the Front Range.",
      "No hotel or catering account is named on the bakery’s site, so this page does not add any.",
    ],
    links: [
      { href: "/making/dinner", label: "Dinner and catering" },
      { href: "/making/breakfast", label: "Breakfast pastries" },
    ],
  },
  {
    slug: "institutions",
    title: "Institutions",
    description:
      "Bluepoint’s pages name hospitals, schools, universities, and airports. They do not name the accounts.",
    body: [
      "The homepage says it provides service to corporate dining rooms, hospitals, and schools.",
      "The About page adds universities and airports. No institution is named, so none is named here.",
    ],
    links: [
      { href: "/breads", label: "Breads" },
      { href: "/making/sandwiches", label: "Sandwich breads" },
      { href: "/pastries", label: "Pastries" },
    ],
  },
];
