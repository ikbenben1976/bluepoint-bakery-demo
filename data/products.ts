import { makingSlugsFor, type MakingSlug } from "@/data/making";

export type Family = "breads" | "pastries";
export type Lead = "24h" | "48h" | "3d";

export type Product = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  family: Family;
  lead: Lead;
  /** Menu uses ("What are you making?") this product is baked for. */
  making: readonly MakingSlug[];
  individuallyWrapped: boolean;
  seasonal: boolean;
  sliceOptions?: readonly string[];
  units: readonly string[];
  dippedOption: boolean;
  detail?: string;
};

export type CatalogGroup = {
  id: string;
  label: string;
  family: Family;
  lead: Lead;
  note?: string;
  items: readonly Product[];
};

type Seed = {
  name: string;
  wrapped?: boolean;
  seasonal?: boolean;
  slices?: readonly string[];
  units?: readonly string[];
  dipped?: boolean;
  lead?: Lead;
  detail?: string;
};

const DELI_SLICES = ['1/2"', '5/8"', '3/4"'] as const;
const THREE_QUARTER = ['3/4"'] as const;

const GROUPS: readonly {
  id: string;
  label: string;
  family: Family;
  lead: Lead;
  note?: string;
  items: readonly Seed[];
}[] = [
  {
    id: "buns",
    label: "Buns and Kaiser Rolls",
    family: "breads",
    lead: "24h",
    items: [
      { name: 'Brioche Bun 4"' },
      { name: 'BP Hamburger Bun 4"' },
      { name: 'Plain Kaiser 4"' },
      { name: 'Sesame Kaiser 4"' },
      { name: 'Cornmeal Kaiser 4"' },
      { name: 'Oat Bun 4"' },
      { name: 'Potato Bun 4"' },
      { name: 'Picnic Bun 3.5"' },
      { name: 'Brioche Bun 5"' },
      { name: "Premium Brioche Bun" },
      { name: 'Plain Kaiser 5"' },
      { name: 'Sesame Topped Kaiser 5"' },
      { name: 'Onion Topped Kaiser 5"' },
      { name: 'Poppy Topped Kaiser 5"' },
      { name: 'Cornmeal Topped Kaiser 5"' },
    ],
  },
  {
    id: "sandwich-rolls",
    label: "Sandwich Rolls",
    family: "breads",
    lead: "24h",
    items: [
      { name: 'Hot Dog 6"' },
      { name: 'Soft Hoagie 7"' },
      { name: 'Philly Roll 6"' },
      { name: 'Club Roll 6"' },
      { name: 'Club Roll 6" sliced' },
      { name: 'Club Roll 8"' },
      { name: 'Club Roll 8" sliced' },
    ],
  },
  {
    id: "french-breads",
    label: "French Breads",
    family: "breads",
    lead: "24h",
    items: [
      { name: 'Baguette 6"' },
      { name: 'Baguette 8"' },
      { name: 'Baguette 12"' },
      { name: 'Baguette 24"' },
      { name: 'Lt Baked White Baguette 12"' },
      { name: 'Lt Baked Wheat Baguette 12"' },
      { name: 'Golden Parisien 24"' },
      { name: 'Lt Baked Parisien 24"' },
      { name: 'Lt Baked Wheat Parisien 24"' },
    ],
  },
  {
    id: "deli-loaves",
    label: "Deli Loaves",
    family: "breads",
    lead: "24h",
    note: '1/2", 5/8", 3/4" slice',
    items: [
      { name: "Vienna White", slices: DELI_SLICES },
      { name: "Cracked Wheat", slices: DELI_SLICES },
      { name: "Sourdough", slices: DELI_SLICES },
      { name: "7 Grain", slices: DELI_SLICES },
      { name: "Marble Rye", slices: DELI_SLICES },
      { name: "Light Rye", slices: DELI_SLICES },
      { name: "Pumpernickel", slices: DELI_SLICES },
      { name: "Potato Rosemary", slices: THREE_QUARTER, detail: '3/4" only' },
      { name: "Dakota", slices: ['1/2"', '3/4"'], detail: 'no 5/8"' },
    ],
  },
  {
    id: "pan-loaves",
    label: "Pan Size Loaves",
    family: "breads",
    lead: "24h",
    note: '3/4" slice',
    items: [
      { name: "Vienna White", slices: THREE_QUARTER },
      { name: "Cracked Wheat", slices: THREE_QUARTER },
      { name: "Sourdough", slices: THREE_QUARTER },
      { name: "Marble Rye", slices: THREE_QUARTER },
      { name: 'Texas Toast (Vienna 3/4")', slices: THREE_QUARTER },
      { name: "Egg Bread (Brioche)", slices: THREE_QUARTER, detail: '3/4" only' },
    ],
  },
  {
    id: "dinner-rolls",
    label: "Dinner Rolls",
    family: "breads",
    lead: "24h",
    note: "1.5 oz",
    items: [
      { name: "Brioche (Dozen)", units: ["dozen"], detail: "1.5 oz" },
      { name: "Brioche (Case 120)", units: ["case"], detail: "1.5 oz" },
      { name: "Potato (Dozen)", units: ["dozen"], detail: "1.5 oz" },
      { name: "Potato (Case 120)", units: ["case"], detail: "1.5 oz" },
      { name: "Savory (Dozen)", units: ["dozen"], detail: "1.5 oz" },
      { name: "6x5 Slider Buns (30 count)", units: ["30 count"], detail: "1.5 oz" },
    ],
  },
  {
    id: "specialty-breads",
    label: "Specialty Breads",
    family: "breads",
    lead: "24h",
    items: [
      { name: "Focaccia precut in 10 pieces" },
      { name: "Focaccia full sheet (2-pack)", units: ["2-pack"] },
      { name: "French Rustic Roll" },
      { name: "Potato Rosemary Rustic Roll" },
      { name: "7 Grain Rustic Roll" },
      { name: "Top Split Bun" },
      { name: "Telera Roll" },
      {
        name: "Sourdough Boule 8 oz",
        lead: "3d",
        detail: "3 day notice required",
      },
      { name: "16x4 Vienna" },
      { name: "Brown Bread" },
    ],
  },
  {
    id: "croissants",
    label: "Croissants",
    family: "pastries",
    lead: "48h",
    note: "pure butter",
    items: [
      { name: "Curved Butter Croissant 3 oz" },
      { name: "Curved Butter Croissant 1 oz", wrapped: true },
      { name: "Chocolate Croissant" },
      { name: "Raspberry Cream Cheese Croissant", wrapped: true },
      { name: "Variety Pack (3 Choc, 3 Rasp)" },
    ],
  },
  {
    id: "danishes",
    label: "Danishes",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Apple", wrapped: true },
      { name: "Cherry", wrapped: true },
      { name: "Cream Cheese", wrapped: true },
      { name: "Bear Claw", wrapped: true },
      { name: "Variety Pack (2 Apple, 2 Cherry, 2 Cream Cheese)", wrapped: true },
    ],
  },
  {
    id: "mini-danish",
    label: "Mini Danish",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Apple" },
      { name: "Cherry" },
      { name: "Cream Cheese" },
      { name: "Blueberry" },
    ],
  },
  {
    id: "turnovers",
    label: "Turnovers",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Apple", wrapped: true },
      { name: "Cherry", wrapped: true },
    ],
  },
  {
    id: "scones",
    label: "Scones",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Double Orange" },
      { name: "Apricot Almond", wrapped: true },
      { name: "Cinnamon Pecan", wrapped: true },
      { name: "Blueberry", wrapped: true },
      { name: "Lemon Cranberry", wrapped: true },
      { name: "Seasonal", seasonal: true },
      { name: "Variety Pack A (2 Cinn, 2 Apricot)", wrapped: true },
      { name: "Variety Pack B (2 Orange, 2 Blue)" },
    ],
  },
  {
    id: "mini-scones",
    label: "Mini Scones",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Double Orange" },
      { name: "Apricot Almond" },
      { name: "Blueberry" },
      { name: "Lemon Cranberry" },
    ],
  },
  {
    id: "quick-breads",
    label: "Quick Breads",
    family: "pastries",
    lead: "48h",
    note: "loaf or individually wrapped 4-pack",
    items: [
      { name: "Pumpkin Chocolate", wrapped: true, units: ["loaf", "individually wrapped 4-pack"] },
      { name: "Zucchini Spice", wrapped: true, units: ["loaf", "individually wrapped 4-pack"] },
      { name: "Banana Pecan", wrapped: true, units: ["loaf", "individually wrapped 4-pack"] },
      { name: "Blueberry Lemon", wrapped: true, units: ["loaf", "individually wrapped 4-pack"] },
    ],
  },
  {
    id: "muffins",
    label: "Muffins",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Apple Cinnamon Crunch" },
      { name: "Blueberry" },
      { name: "Lemon Poppy" },
      { name: "Double Chocolate Chip" },
      { name: "Triple Berry" },
      { name: "Variety Pack (Blue, Lemon)" },
      { name: "Blueberry Coffee Crumb Cake" },
    ],
  },
  {
    id: "half-size-muffins",
    label: "Half-size Muffins",
    family: "pastries",
    lead: "48h",
    items: [{ name: "Blueberry" }, { name: "Lemon Poppy" }],
  },
  {
    id: "muffin-tops",
    label: "Muffin Tops",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Blueberry", wrapped: true },
      { name: "Lemon Poppy", wrapped: true },
      { name: "Triple Berry", wrapped: true },
      { name: "Seasonal", seasonal: true },
    ],
  },
  {
    id: "cookies",
    label: "Cookies",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Chocolate Chip (no nut)", wrapped: true },
      { name: "Oatmeal Raisin", wrapped: true },
      { name: "Monster", wrapped: true },
      { name: "Snickerdoodle", wrapped: true },
      { name: "Seasonal", wrapped: true, seasonal: true },
    ],
  },
  {
    id: "specialty-cookies",
    label: "Specialty Cookies",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Seasonal Iced Sugar", wrapped: true, seasonal: true },
      { name: "Black and Whites" },
    ],
  },
  {
    id: "cinnamon-rolls",
    label: "Cinnamon Rolls",
    family: "pastries",
    lead: "48h",
    items: [
      { name: 'Cinnamon Roll Ring 9" (full ring)', units: ["full ring"] },
      { name: "Cinnamon Rolls 4-pack", units: ["4-pack"] },
    ],
  },
  {
    id: "biscotti",
    label: "Biscotti",
    family: "pastries",
    lead: "48h",
    note: "dipped or undipped",
    items: [
      { name: "Almond", dipped: true },
      { name: "Chocolate Chip", dipped: true },
      { name: "Cherry Walnut", dipped: true },
    ],
  },
  {
    id: "brownies",
    label: "Brownies & bars",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Plain (no fudge, no nut)", wrapped: true },
      { name: "Rocky Road", wrapped: true },
      { name: "Walnut Brownie" },
      { name: "White Chocolate Raspberry" },
      { name: "German Chocolate" },
      { name: "Caramel Pecan Blondie" },
      { name: "Cranberry Granola Bars" },
      { name: "Brownies (any flavor) 4-pack", units: ["4-pack"] },
      { name: "Brownies (any flavor) full sheet", units: ["full sheet"] },
      { name: "Brownies (any flavor) 1/2 sheet", units: ["1/2 sheet"] },
      { name: "Brownies (any flavor) 1/4 sheet", units: ["1/4 sheet"] },
    ],
  },
  {
    id: "pies",
    label: "Pies and Desserts",
    family: "pastries",
    lead: "48h",
    items: [
      { name: "Dutch Apple Pie" },
      { name: "Apple Pie" },
      { name: "Cherry Pie" },
      { name: "Blueberry Pie" },
      { name: "Pumpkin Pie (seasonal)", seasonal: true },
      { name: "Pecan Pie (seasonal)", seasonal: true },
      { name: "Chocolate Pecan (seasonal)", seasonal: true },
    ],
  },
];

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/["″]/g, " in ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toProduct(
  group: (typeof GROUPS)[number],
  seed: Seed,
): Product {
  return {
    id: slug(`${group.id}-${seed.name}`),
    name: seed.name,
    category: group.id,
    categoryLabel: group.label,
    family: group.family,
    making: makingSlugsFor({ category: group.id, name: seed.name }),
    lead: seed.lead ?? group.lead,
    individuallyWrapped: Boolean(seed.wrapped),
    seasonal: Boolean(seed.seasonal),
    sliceOptions: seed.slices,
    units: seed.units ?? [],
    dippedOption: Boolean(seed.dipped),
    detail: seed.detail,
  };
}

export const catalog: readonly CatalogGroup[] = GROUPS.map((group) => ({
  id: group.id,
  label: group.label,
  family: group.family,
  lead: group.lead,
  note: group.note,
  items: group.items.map((seed) => toProduct(group, seed)),
}));

export const products: readonly Product[] = catalog.flatMap((group) => group.items);

export const breadGroups = catalog.filter((group) => group.family === "breads");
export const pastryGroups = catalog.filter((group) => group.family === "pastries");

const byId = new Map(products.map((product) => [product.id, product]));

const duplicateIds = products.filter((product, index) =>
  products.findIndex((other) => other.id === product.id) !== index,
);
if (duplicateIds.length > 0) {
  throw new Error(`Duplicate product ids: ${duplicateIds.map((p) => p.id).join(", ")}`);
}

export function getProduct(id: string): Product | undefined {
  return byId.get(id);
}

export function leadKindFor(product: Product): "bread" | "pastry" | "boule" {
  if (product.lead === "3d") return "boule";
  if (product.lead === "48h") return "pastry";
  return "bread";
}
