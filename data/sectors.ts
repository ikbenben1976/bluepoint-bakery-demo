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
      "Hamburger buns, Kaiser rolls, hoagies, and sandwich breads for restaurants, delis, and bar and grills.",
    body: [
      "Bluepoint bakes hamburger buns, sandwich breads, and specialty rolls for restaurants, delis, bar and grills, and sandwich shops.",
      "Published comments name Cherry Cricket, since 1994, for burgers and sandwiches, and Mountain Sun Pub, Southern Sun Pub, and Vine Street Pub for the burger bun.",
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
      "Croissants, muffins, scones, and other breakfast pastries for cafés and espresso bars.",
    body: [
      "Bluepoint lists cafés and espresso bars among the kitchens it bakes for, along with breakfast pastries and desserts.",
      "Croissants, muffins, scones, and danishes are on the pastry list. Pastries need 48 hour notice.",
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
      "Dinner rolls, breakfast pastries, and pies for hotels, country clubs, and catering.",
    body: [
      "Hotels, country clubs, and catering businesses are among the kitchens Bluepoint says it serves, including catered events along the Front Range.",
      "The published catalog for that service includes dinner rolls, rustic rolls, breakfast pastries, and pies.",
    ],
    links: [
      { href: "/making/dinner", label: "Dinner and catering" },
      { href: "/making/breakfast", label: "Breakfast pastries" },
      { href: "/pastries", label: "Pies and pastries" },
    ],
  },
  {
    slug: "institutions",
    title: "Institutions",
    description:
      "Sandwich loaves and breakfast pastries for hospitals, schools, universities, and airports.",
    body: [
      "Corporate dining rooms, hospitals, schools, universities, and airports are among the institutions named on Bluepoint’s site.",
      "Sandwich loaves, pan loaves, club rolls, and breakfast pastries are in the published catalog for that kind of service.",
    ],
    links: [
      { href: "/breads", label: "Breads" },
      { href: "/making/sandwiches", label: "Sandwich breads" },
      { href: "/pastries", label: "Pastries" },
    ],
  },
];
