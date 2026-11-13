import { makingHref } from "@/data/making";

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
      "Build your menu with hamburger buns, sandwich breads and specialty rolls suited to restaurants, delis, pubs and sandwich shops.",
    ],
    links: [
      { href: makingHref("burgers"), label: "Burgers and sliders" },
      { href: makingHref("sandwiches"), label: "Sandwiches and subs" },
      { href: "/breads", label: "All breads" },
    ],
  },
  {
    slug: "cafes",
    title: "Cafés and coffee shops",
    description:
      "Croissants, muffins, scones, and other breakfast pastries for cafés and espresso bars.",
    body: [
      "Keep your café's bakery selection fresh with croissants, muffins, scones, Danish pastries and desserts.",
      "Explore our breakfast pastry selection. Please allow at least 48 hours' notice for pastry orders.",
    ],
    links: [
      { href: makingHref("breakfast"), label: "Coffee and breakfast" },
      { href: "/pastries", label: "All pastries" },
    ],
  },
  {
    slug: "hotels",
    title: "Hotels and catering",
    description:
      "Dinner rolls, breakfast pastries, and pies for hotels, country clubs, and catering.",
    body: [
      "From hotel dining rooms to catered events, Bluepoint offers breads, rolls and pastries for a wide range of food-service occasions.",
      "Explore dinner rolls, rustic breads, breakfast pastries and pies for your next menu.",
    ],
    links: [
      { href: makingHref("dinner"), label: "Dinner and catering" },
      { href: makingHref("breakfast"), label: "Breakfast pastries" },
      { href: "/pastries", label: "Pies and pastries" },
    ],
  },
  {
    slug: "institutions",
    title: "Institutions",
    description:
      "Sandwich loaves and breakfast pastries for hospitals, schools, universities, and airports.",
    body: [
      "Bluepoint serves institutional food-service operations, including hospitals, schools, universities, airports and corporate dining facilities.",
      "Our selection includes sandwich loaves, club rolls and breakfast pastries for a variety of food-service needs.",
    ],
    links: [
      { href: "/breads", label: "Breads" },
      { href: makingHref("sandwiches"), label: "Sandwich breads" },
      { href: "/pastries", label: "Pastries" },
    ],
  },
];
