import { products } from "@/data/products";

export type Visual = {
  webp: string;
  avif: string;
  width: number;
  height: number;
  alt: string;
  illustrative: true;
  /** Representative subject of the generated photograph, not a verified SKU. */
  subject: string;
};

const shot = (file: string, subject: string, width = 960, height = 720): Visual => ({
  webp: `/images/illustrative/${file}.webp`,
  avif: `/images/illustrative/${file}.avif`,
  width,
  height,
  alt: `Illustrative image of ${subject}. Not a verified photograph of this Bluepoint product.`,
  illustrative: true,
  subject,
});

export const heroDesktop = shot("hero-desktop", "an assortment of breads, rolls, and pastries", 1280, 720);
export const heroMobile = shot("hero-mobile", "an assortment of breads, rolls, and pastries", 1200, 900);

export const applicationVisuals = {
  burgers: shot("app-burgers", "a cheeseburger", 1200, 900),
  sandwiches: shot("app-sandwiches", "a deli sandwich", 1200, 900),
  breakfast: shot("app-breakfast", "croissants and a muffin", 1200, 900),
  dinner: shot("app-dinner", "dinner rolls and a rustic loaf", 1200, 900),
} as const;

const shots = {
  "product-brioche-bun": shot("product-brioche-bun", "a glossy brioche hamburger bun"),
  "product-plain-bun": shot("product-plain-bun", "a plain hamburger bun"),
  "product-potato-bun": shot("product-potato-bun", "a potato hamburger bun"),
  "product-oat-bun": shot("product-oat-bun", "an oat-topped hamburger bun"),
  "product-kaiser-plain": shot("product-kaiser-plain", "a plain kaiser roll"),
  "product-kaiser-sesame": shot("product-kaiser-sesame", "a sesame-topped kaiser roll"),
  "product-kaiser-cornmeal": shot("product-kaiser-cornmeal", "a cornmeal-topped kaiser roll"),
  "product-kaiser-onion": shot("product-kaiser-onion", "an onion-topped kaiser roll"),
  "product-kaiser-poppy": shot("product-kaiser-poppy", "a poppy-seed kaiser roll"),
  "product-hot-dog": shot("product-hot-dog", "a hot dog bun"),
  "product-hoagie": shot("product-hoagie", "a hoagie roll"),
  "product-club": shot("product-club", "a club roll"),
  "product-baguette": shot("product-baguette", "a baguette"),
  "product-wheat-long": shot("product-wheat-long", "a whole-wheat baguette"),
  "product-white-loaf": shot("product-white-loaf", "a white sandwich loaf"),
  "product-egg-loaf": shot("product-egg-loaf", "a brioche pan loaf"),
  "product-wheat-loaf": shot("product-wheat-loaf", "a cracked-wheat loaf"),
  "product-sourdough": shot("product-sourdough", "a sourdough loaf"),
  "product-rye": shot("product-rye", "a light rye loaf"),
  "product-pumpernickel": shot("product-pumpernickel", "a dark pumpernickel loaf"),
  "product-rosemary": shot("product-rosemary", "a rosemary loaf"),
  "product-seeded-loaf": shot("product-seeded-loaf", "a seeded multigrain loaf"),
  "product-marble": shot("product-marble", "a marble rye loaf"),
  "product-dinner-rolls": shot("product-dinner-rolls", "dinner rolls"),
  "product-sliders": shot("product-sliders", "slider buns"),
  "product-focaccia": shot("product-focaccia", "rosemary focaccia"),
  "product-rustic-roll": shot("product-rustic-roll", "a rustic roll"),
  "product-croissant": shot("product-croissant", "plain butter croissants"),
  "product-chocolate-croissant": shot("product-chocolate-croissant", "a chocolate croissant"),
  "product-danish": shot("product-danish", "a fruit danish"),
  "product-turnover": shot("product-turnover", "an apple turnover"),
  "product-scone": shot("product-scone", "blueberry scones"),
  "product-muffin": shot("product-muffin", "a blueberry muffin"),
  "product-cookie": shot("product-cookie", "chocolate chip cookies"),
  "product-cinnamon": shot("product-cinnamon", "iced cinnamon rolls"),
  "product-biscotti": shot("product-biscotti", "almond biscotti"),
  "product-quick-bread": shot("product-quick-bread", "a quick-bread loaf"),
  "product-brownie": shot("product-brownie", "chocolate brownies"),
  "product-pie": shot("product-pie", "an apple pie"),
} as const;

/**
 * Several catalog rows share one representative illustration when they are
 * the same shape at another size, pack, or flavor. The picture is not a
 * verified photo of any one of those items. See docs/IMAGE-CREDITS.md.
 */
const groups: Record<keyof typeof shots, readonly string[]> = {
  "product-brioche-bun": ["buns-brioche-bun-4-in", "buns-brioche-bun-5-in", "buns-premium-brioche-bun"],
  "product-plain-bun": ["buns-bp-hamburger-bun-4-in", "buns-picnic-bun-3-5-in"],
  "product-potato-bun": ["buns-potato-bun-4-in"],
  "product-oat-bun": ["buns-oat-bun-4-in"],
  "product-kaiser-plain": ["buns-plain-kaiser-4-in", "buns-plain-kaiser-5-in"],
  "product-kaiser-sesame": ["buns-sesame-kaiser-4-in", "buns-sesame-topped-kaiser-5-in"],
  "product-kaiser-cornmeal": ["buns-cornmeal-kaiser-4-in", "buns-cornmeal-topped-kaiser-5-in"],
  "product-kaiser-onion": ["buns-onion-topped-kaiser-5-in"],
  "product-kaiser-poppy": ["buns-poppy-topped-kaiser-5-in"],
  "product-hot-dog": ["sandwich-rolls-hot-dog-6-in"],
  "product-hoagie": ["sandwich-rolls-soft-hoagie-7-in", "sandwich-rolls-philly-roll-6-in"],
  "product-club": [
    "sandwich-rolls-club-roll-6-in",
    "sandwich-rolls-club-roll-6-in-sliced",
    "sandwich-rolls-club-roll-8-in",
    "sandwich-rolls-club-roll-8-in-sliced",
  ],
  "product-baguette": [
    "french-breads-baguette-6-in",
    "french-breads-baguette-8-in",
    "french-breads-baguette-12-in",
    "french-breads-baguette-24-in",
    "french-breads-lt-baked-white-baguette-12-in",
    "french-breads-golden-parisien-24-in",
    "french-breads-lt-baked-parisien-24-in",
    "specialty-breads-16x4-vienna",
  ],
  "product-wheat-long": ["french-breads-lt-baked-wheat-baguette-12-in", "french-breads-lt-baked-wheat-parisien-24-in"],
  "product-white-loaf": ["deli-loaves-vienna-white", "pan-loaves-vienna-white", "pan-loaves-texas-toast-vienna-3-4-in"],
  "product-egg-loaf": ["pan-loaves-egg-bread-brioche"],
  "product-wheat-loaf": ["deli-loaves-cracked-wheat", "deli-loaves-7-grain", "pan-loaves-cracked-wheat"],
  "product-sourdough": ["deli-loaves-sourdough", "pan-loaves-sourdough", "specialty-breads-sourdough-boule-8-oz"],
  "product-rye": ["deli-loaves-light-rye"],
  "product-pumpernickel": ["deli-loaves-pumpernickel", "specialty-breads-brown-bread"],
  "product-marble": ["deli-loaves-marble-rye", "pan-loaves-marble-rye"],
  "product-rosemary": ["deli-loaves-potato-rosemary", "specialty-breads-potato-rosemary-rustic-roll"],
  "product-seeded-loaf": ["deli-loaves-dakota"],
  "product-dinner-rolls": [
    "dinner-rolls-brioche-dozen",
    "dinner-rolls-brioche-case-120",
    "dinner-rolls-potato-dozen",
    "dinner-rolls-potato-case-120",
    "dinner-rolls-savory-dozen",
  ],
  "product-sliders": ["dinner-rolls-6x5-slider-buns-30-count"],
  "product-focaccia": ["specialty-breads-focaccia-precut-in-10-pieces", "specialty-breads-focaccia-full-sheet-2-pack"],
  "product-rustic-roll": [
    "specialty-breads-french-rustic-roll",
    "specialty-breads-7-grain-rustic-roll",
    "specialty-breads-top-split-bun",
    "specialty-breads-telera-roll",
  ],
  "product-croissant": ["croissants-curved-butter-croissant-3-oz", "croissants-curved-butter-croissant-1-oz"],
  "product-chocolate-croissant": [
    "croissants-chocolate-croissant",
    "croissants-raspberry-cream-cheese-croissant",
    "croissants-variety-pack-3-choc-3-rasp",
  ],
  "product-danish": [
    "danishes-apple",
    "danishes-cherry",
    "danishes-cream-cheese",
    "danishes-bear-claw",
    "danishes-variety-pack-2-apple-2-cherry-2-cream-cheese",
    "mini-danish-apple",
    "mini-danish-cherry",
    "mini-danish-cream-cheese",
    "mini-danish-blueberry",
  ],
  "product-turnover": ["turnovers-apple", "turnovers-cherry"],
  "product-scone": [
    "scones-double-orange",
    "scones-apricot-almond",
    "scones-cinnamon-pecan",
    "scones-blueberry",
    "scones-lemon-cranberry",
    "scones-seasonal",
    "scones-variety-pack-a-2-cinn-2-apricot",
    "scones-variety-pack-b-2-orange-2-blue",
    "mini-scones-double-orange",
    "mini-scones-apricot-almond",
    "mini-scones-blueberry",
    "mini-scones-lemon-cranberry",
  ],
  "product-quick-bread": [
    "quick-breads-pumpkin-chocolate",
    "quick-breads-zucchini-spice",
    "quick-breads-banana-pecan",
    "quick-breads-blueberry-lemon",
  ],
  "product-muffin": [
    "muffins-apple-cinnamon-crunch",
    "muffins-blueberry",
    "muffins-lemon-poppy",
    "muffins-double-chocolate-chip",
    "muffins-triple-berry",
    "muffins-variety-pack-blue-lemon",
    "muffins-blueberry-coffee-crumb-cake",
    "half-size-muffins-blueberry",
    "half-size-muffins-lemon-poppy",
    "muffin-tops-blueberry",
    "muffin-tops-lemon-poppy",
    "muffin-tops-triple-berry",
    "muffin-tops-seasonal",
  ],
  "product-cookie": [
    "cookies-chocolate-chip-no-nut",
    "cookies-oatmeal-raisin",
    "cookies-monster",
    "cookies-snickerdoodle",
    "cookies-seasonal",
    "specialty-cookies-seasonal-iced-sugar",
    "specialty-cookies-black-and-whites",
  ],
  "product-cinnamon": ["cinnamon-rolls-cinnamon-roll-ring-9-in-full-ring", "cinnamon-rolls-cinnamon-rolls-4-pack"],
  "product-biscotti": ["biscotti-almond", "biscotti-chocolate-chip", "biscotti-cherry-walnut"],
  "product-brownie": [
    "brownies-plain-no-fudge-no-nut",
    "brownies-rocky-road",
    "brownies-walnut-brownie",
    "brownies-white-chocolate-raspberry",
    "brownies-german-chocolate",
    "brownies-caramel-pecan-blondie",
    "brownies-cranberry-granola-bars",
    "brownies-brownies-any-flavor-4-pack",
    "brownies-brownies-any-flavor-full-sheet",
    "brownies-brownies-any-flavor-1-2-sheet",
    "brownies-brownies-any-flavor-1-4-sheet",
  ],
  "product-pie": [
    "pies-dutch-apple-pie",
    "pies-apple-pie",
    "pies-cherry-pie",
    "pies-blueberry-pie",
    "pies-pumpkin-pie-seasonal",
    "pies-pecan-pie-seasonal",
    "pies-chocolate-pecan-seasonal",
  ],
};

const byProduct = new Map<string, Visual>();
for (const [key, ids] of Object.entries(groups) as [keyof typeof shots, readonly string[]][]) {
  for (const id of ids) {
    if (byProduct.has(id)) throw new Error(`Product ${id} is assigned twice`);
    byProduct.set(id, shots[key]);
  }
}

const missing = products.filter((product) => !byProduct.has(product.id)).map((product) => product.id);
if (missing.length > 0) {
  throw new Error(`Products without an illustrative image: ${missing.join(", ")}`);
}

export function visualForProduct(id: string): Visual {
  const visual = byProduct.get(id);
  if (!visual) throw new Error(`No illustrative visual for ${id}`);
  return visual;
}

export const illustrativeFiles: readonly Visual[] = [
  heroDesktop,
  heroMobile,
  ...Object.values(applicationVisuals),
  ...Object.values(shots),
];
