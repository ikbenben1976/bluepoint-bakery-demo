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
      "Bluepoint bakes for restaurants, delis, and bar and grills, and publishes comments from Cherry Cricket, Mountain Sun, and Oskar Blues.",
    body: [
      "Fresh baked goods for fine restaurants, delis, bar and grills, specialty groceries, and espresso bars — for over 30 years.",
      "Customers who have commented include Cherry Cricket (since 1994, burgers and sandwiches), Mountain Sun Pub, Southern Sun Pub and Vine Street Pub, and Oskar Blues, Chuburger and Cyclhops.",
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
      "Cafés and espresso bars are among the businesses Bluepoint bakes for. A December 2023 Restaurantji review mentions a coffee shop that has ordered for over 10 years.",
    body: [
      "Bluepoint lists cafés and espresso bars among the kitchens it serves.",
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
      "Bluepoint bakes for hotels, country clubs, and catering businesses.",
    body: [
      "Hotels and catered events along the Front Range are part of that service.",
      "Individual hotel and catering accounts are not named publicly. Ask the bakery about service for your property.",
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
      "Hospitals, schools, universities, and airports are among the institutions Bluepoint bakes for.",
    body: [
      "That service includes corporate dining rooms, hospitals, and schools.",
      "Universities and airports are listed as well. Individual institutions are not named publicly.",
    ],
    links: [
      { href: "/breads", label: "Breads" },
      { href: "/making/sandwiches", label: "Sandwich breads" },
      { href: "/pastries", label: "Pastries" },
    ],
  },
];
