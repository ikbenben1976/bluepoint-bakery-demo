import type { Family } from "@/data/products";

/**
 * Marketing groupings on the homepage are not one-to-one with the catalog's
 * native groups. These definitions are shared by the cards and ProductBrowser.
 * Keep the original catalog group IDs intact for search, comparison and orders.
 */
export type HomeAssortment = {
  id: string;
  name: string;
  line: string;
  family: Family;
  groupIds: readonly string[];
  src: string;
  alt: string;
};

export const homeAssortment: readonly HomeAssortment[] = [
  {
    id: "buns-rolls",
    name: "Buns & Rolls",
    line: "Buns and Kaiser rolls",
    family: "breads",
    groupIds: ["buns", "sandwich-rolls", "dinner-rolls"],
    src: "/images/scenes/sesame-buns-rack.webp",
    alt: "Bluepoint sesame-topped buns on a bakery rack",
  },
  {
    id: "breads-loaves",
    name: "Breads & Loaves",
    line: "Deli loaves, pan loaves, and French breads",
    family: "breads",
    groupIds: ["french-breads", "deli-loaves", "pan-loaves"],
    src: "/images/scenes/baguette-rack.webp",
    alt: "Baguettes on a rack at Bluepoint Bakery",
  },
  {
    id: "pastries",
    name: "Pastries",
    line: "Croissants, Danish, muffins, and other pastries",
    family: "pastries",
    groupIds: [
      "croissants",
      "danishes",
      "mini-danish",
      "turnovers",
      "scones",
      "mini-scones",
      "quick-breads",
      "muffins",
      "half-size-muffins",
      "muffin-tops",
      "cinnamon-rolls",
      "biscotti",
    ],
    src: "/images/scenes/chocolate-pastries.webp",
    alt: "Finished chocolate pastries on Bluepoint bakery racks",
  },
  {
    id: "specialty-breads",
    name: "Specialty Breads",
    line: "Focaccia, rustic rolls, and sourdough boule",
    family: "breads",
    groupIds: ["specialty-breads"],
    src: "/images/scenes/baguette-tray.webp",
    alt: "Bluepoint specialty French breads on a baking tray",
  },
  {
    id: "desserts-treats",
    name: "Desserts & Sweet Treats",
    line: "Pies, brownies, cookies, and muffins",
    family: "pastries",
    groupIds: [
      "pies",
      "brownies",
      "cookies",
      "specialty-cookies",
      "muffins",
      "half-size-muffins",
      "muffin-tops",
    ],
    src: "/images/scenes/brownie-sheet.webp",
    alt: "A sheet of brownies in the Bluepoint bakery",
  },
];

export function assortmentHref(entry: HomeAssortment): string {
  return `/${entry.family}/?assortment=${entry.id}#catalog`;
}

export function findAssortment(
  id: string | null,
  family: Family | null,
): HomeAssortment | undefined {
  return homeAssortment.find((entry) => entry.id === id && entry.family === family);
}
