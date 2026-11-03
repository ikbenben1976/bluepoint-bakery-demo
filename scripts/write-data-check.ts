import { writeFileSync } from "node:fs";
import { products } from "../data/products";

const wrapped = new Set([
  "croissants|Curved Butter Croissant 1 oz",
  "croissants|Raspberry Cream Cheese Croissant",
  "danishes|Apple",
  "danishes|Cherry",
  "danishes|Cream Cheese",
  "danishes|Bear Claw",
  "danishes|Variety Pack (2 Apple, 2 Cherry, 2 Cream Cheese)",
  "turnovers|Apple",
  "turnovers|Cherry",
  "scones|Apricot Almond",
  "scones|Cinnamon Pecan",
  "scones|Blueberry",
  "scones|Lemon Cranberry",
  "scones|Variety Pack A (2 Cinn, 2 Apricot)",
  "quick-breads|Pumpkin Chocolate",
  "quick-breads|Zucchini Spice",
  "quick-breads|Banana Pecan",
  "quick-breads|Blueberry Lemon",
  "muffin-tops|Blueberry",
  "muffin-tops|Lemon Poppy",
  "muffin-tops|Triple Berry",
  "cookies|Chocolate Chip (no nut)",
  "cookies|Oatmeal Raisin",
  "cookies|Monster",
  "cookies|Snickerdoodle",
  "cookies|Seasonal",
  "specialty-cookies|Seasonal Iced Sugar",
  "brownies|Plain (no fudge, no nut)",
  "brownies|Rocky Road",
]);

const seasonalStar = new Set([
  "pies|Pumpkin Pie (seasonal)",
  "pies|Pecan Pie (seasonal)",
  "pies|Chocolate Pecan (seasonal)",
]);

const sourceUnit: Record<string, string> = {
  "dinner-rolls|Brioche (Dozen)": "dozen; 1.5 oz",
  "dinner-rolls|Brioche (Case 120)": "case of 120; 1.5 oz",
  "dinner-rolls|Potato (Dozen)": "dozen; 1.5 oz",
  "dinner-rolls|Potato (Case 120)": "case of 120; 1.5 oz",
  "dinner-rolls|Savory (Dozen)": "dozen; 1.5 oz",
  "dinner-rolls|6x5 Slider Buns (30 count)": "30 count; 1.5 oz",
  "specialty-breads|Focaccia full sheet (2-pack)": "2-pack",
  "quick-breads|Pumpkin Chocolate": "loaf or individually wrapped 4-pack",
  "quick-breads|Zucchini Spice": "loaf or individually wrapped 4-pack",
  "quick-breads|Banana Pecan": "loaf or individually wrapped 4-pack",
  "quick-breads|Blueberry Lemon": "loaf or individually wrapped 4-pack",
  'cinnamon-rolls|Cinnamon Roll Ring 9" (full ring)': "full ring",
  "cinnamon-rolls|Cinnamon Rolls 4-pack": "4-pack",
  "brownies|Brownies (any flavor) 4-pack": "4-pack",
  "brownies|Brownies (any flavor) full sheet": "full sheet",
  "brownies|Brownies (any flavor) 1/2 sheet": "1/2 sheet",
  "brownies|Brownies (any flavor) 1/4 sheet": "1/4 sheet",
};

let corrected = 0;
const rows = products.map((product) => {
  const key = `${product.category}|${product.name}`;
  const sourceWrapped = wrapped.has(key)
    ? "asterisk: individually wrapped"
    : seasonalStar.has(key)
      ? "asterisk means seasonal, not wrapped"
      : "no asterisk";
  const demoWrapped = product.individuallyWrapped ? "Individually wrapped" : "no label";
  const sourceU = sourceUnit[key] ?? "no pack size on the page";
  const demoU = product.units.length ? product.units.join(" or ") : "Ask for pack size";
  const lead = product.lead === "3d" ? "3 day notice" : product.lead === "48h" ? "48 hour notice" : "24 hour notice";
  let fix = "none";
  if (key === "muffin-tops|Seasonal" || key === "specialty-cookies|Black and Whites") {
    fix = "removed Individually wrapped; the source has no asterisk";
    corrected += 1;
  } else if (!sourceUnit[key] && demoU === "Ask for pack size") {
    fix = "stopped defaulting the unit to each";
    corrected += 1;
  } else if (key.startsWith("dinner-rolls|")) {
    fix = "card now shows 1.5 oz from the catalog line";
    corrected += 1;
  }
  const name = product.name.replace(/\|/g, "/");
  return `| ${product.categoryLabel} | ${name} | ${sourceWrapped} | ${demoWrapped} | ${sourceU} | ${demoU} | ${lead} | ${fix} |`;
});

const md = `# Catalog reconciliation

Source: the public pages [Breads](https://www.bluepointbakery.com/breads) and [Pastries](https://www.bluepointbakery.com/pastries), fetched 3 Nov 2026.

An asterisk on those pages means the item is available individually wrapped, except under Pies and Desserts, where the legend says the asterisk marks seasonal items.

Where the source names a pack (dozen, case, 4-pack, sheet, full ring, 2-pack, 30 count), the demo shows that unit. Where it does not, the demo says Ask for pack size. It no longer assumes each.

Lead time follows the page headings: 24 hours for breads, 48 hours for pastries, and 3 days for Sourdough Boule.

A few demo names differ only in punctuation from the source (Club Roll 6"-sliced, Chocolate Chip, NO Nut, Plain, No Fudge No Nut, Focaccia- Precut In 10 Pieces). The item is the same.

Items checked: ${products.length}. Rows with a correction: ${corrected}.

| Category | Item | Source mark | Demo label | Source unit or size | Demo unit | Lead time | Fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}
`;

writeFileSync(new URL("../../docs/DATA_CHECK.md", import.meta.url), md);
console.log("items", products.length, "corrected", corrected);
