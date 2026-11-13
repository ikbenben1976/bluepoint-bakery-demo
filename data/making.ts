import type { Family } from "@/data/products";

/**
 * Menu uses behind "What are you making?". The matchers are the same rules
 * the old /making/ pages used, so a filtered catalog shows that page's products.
 * A product can belong to more than one use (slider buns are burgers and dinner).
 */
export type MakingSlug = "burgers" | "sandwiches" | "breakfast" | "dinner";

export type MakingUse = {
  slug: MakingSlug;
  title: string;
  summary: string;
  /** Catalog page that contains every product in this use. */
  family: Family;
  match: (product: { category: string; name: string }) => boolean;
};

const inCategories =
  (ids: readonly string[]) =>
  (product: { category: string }): boolean =>
    ids.includes(product.category);

export const makingUses: readonly MakingUse[] = [
  {
    slug: "burgers",
    title: "Burgers & Sliders",
    summary: "Explore hamburger buns, Kaiser rolls and slider options for your menu.",
    family: "breads",
    match: (product) => product.category === "buns" || product.name.startsWith("6x5 Slider"),
  },
  {
    slug: "sandwiches",
    title: "Sandwiches & Subs",
    summary:
      "Sandwich rolls, deli loaves, pan loaves, and French breads, including baguettes and hoagie rolls.",
    family: "breads",
    match: inCategories(["sandwich-rolls", "deli-loaves", "pan-loaves", "french-breads"]),
  },
  {
    slug: "breakfast",
    title: "Coffee & Breakfast",
    summary: "Croissants, danishes, scones, muffins, muffin tops, and quick breads.",
    family: "pastries",
    match: inCategories([
      "croissants",
      "danishes",
      "mini-danish",
      "scones",
      "mini-scones",
      "muffins",
      "half-size-muffins",
      "muffin-tops",
      "quick-breads",
      "cinnamon-rolls",
    ]),
  },
  {
    slug: "dinner",
    title: "Dinner & Catering",
    summary: "Dinner rolls and specialty breads, including rustic rolls, for dinner service and catering.",
    family: "breads",
    match: inCategories(["dinner-rolls", "specialty-breads"]),
  },
];

export function makingSlugsFor(product: { category: string; name: string }): MakingSlug[] {
  return makingUses.filter((use) => use.match(product)).map((use) => use.slug);
}

export function findMaking(slug: string | null, family: Family | null): MakingUse | undefined {
  if (!slug || !family) return undefined;
  return makingUses.find((use) => use.slug === slug && use.family === family);
}

/** Filtered catalog deep link, same shape as the homepage assortment links. */
export function makingHref(slug: string): string {
  const use = makingUses.find((item) => item.slug === slug);
  if (!use) return "/breads/#catalog";
  return `/${use.family}/?making=${use.slug}#catalog`;
}

export function catalogViewAllLabel(family: Family): string {
  return family === "breads" ? "breads & rolls" : "pastries";
}
