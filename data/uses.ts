import { catalog, type CatalogGroup, type Product } from "@/data/products";

export type UseCase = {
  slug: string;
  title: string;
  summary: string;
  match: (product: Product) => boolean;
};

const inCategories =
  (ids: readonly string[]) =>
  (product: Product): boolean =>
    ids.includes(product.category);

export const uses: readonly UseCase[] = [
  {
    slug: "burgers",
    title: "Burgers & Sliders",
    summary:
      "Explore hamburger buns, Kaiser rolls and slider options for your menu.",
    match: (product) =>
      product.category === "buns" || product.name.startsWith("6x5 Slider"),
  },
  {
    slug: "sandwiches",
    title: "Sandwiches & Subs",
    summary:
      "Sandwich rolls, deli loaves, pan loaves, and French breads, including baguettes and hoagie rolls.",
    match: inCategories(["sandwich-rolls", "deli-loaves", "pan-loaves", "french-breads"]),
  },
  {
    slug: "breakfast",
    title: "Coffee & Breakfast",
    summary:
      "Croissants, danishes, scones, muffins, muffin tops, and quick breads.",
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
    summary:
      "Dinner rolls and specialty breads, including rustic rolls, for dinner service and catering.",
    match: inCategories(["dinner-rolls", "specialty-breads"]),
  },
];

export function groupsForUse(slug: string): readonly CatalogGroup[] {
  const use = uses.find((item) => item.slug === slug);
  if (!use) return [];
  return catalog
    .map((group) => ({ ...group, items: group.items.filter(use.match) }))
    .filter((group) => group.items.length > 0);
}

export function publishedBunSizes(): string[] {
  const sizes = new Set<string>();
  for (const product of catalog.flatMap((group) => group.items)) {
    if (product.category !== "buns") continue;
    const size = product.name.match(/(\d+(?:\.\d+)?)"/);
    if (size) sizes.add(`${size[1]}"`);
  }
  return [...sizes];
}
