import type { Product } from "@/data/products";

export type SpecRow = { label: string; value: string };

export function publishedSize(name: string): string | null {
  const inches = name.match(/(\d+(?:\.\d+)?)\s*"/);
  if (inches) return `${inches[1]}"`;
  const ounces = name.match(/(\d+(?:\.\d+)?)\s*oz/i);
  if (ounces) return `${ounces[1]} oz`;
  if (/16x4/i.test(name)) return "16x4";
  return null;
}

export function leadWords(product: Product): string {
  return categoryNotice(product.lead);
}

export function categoryNotice(lead: Product["lead"]): string {
  if (lead === "3d") return "3 day notice required";
  if (lead === "48h") return "48 hour notice for orders on all pastries";
  return "24 hour notice for orders on all breads";
}

/** One factual line from fields already stored on the product. */
export function cardFacts(product: Product): string {
  const bits: string[] = [];
  const size = publishedSize(product.name);
  if (size) bits.push(size);
  if (product.detail && !/notice/i.test(product.detail)) bits.push(product.detail);
  if (product.individuallyWrapped) bits.push("Individually wrapped");
  if (product.seasonal) bits.push("Seasonal");
  if (product.sliceOptions?.length) bits.push(product.sliceOptions.join(", "));
  if (product.dippedOption) bits.push("Dipped or undipped");
  if (product.units.length) bits.push(product.units.join(" or "));
  if (bits.length === 0) bits.push(product.categoryLabel);
  return bits.join(" · ");
}

/** Published catalog fields only. A missing value is omitted, not filled in. */
export function specRows(product: Product): SpecRow[] {
  const size = publishedSize(product.name);
  const rows: SpecRow[] = [];
  if (size) rows.push({ label: "Published size", value: size });
  rows.push({ label: "Category", value: product.categoryLabel });
  if (product.sliceOptions?.length) {
    rows.push({ label: "Slicing", value: product.sliceOptions.join(", ") });
  }
  rows.push({ label: "Order lead time", value: leadWords(product) });
  if (product.units.length > 0) {
    rows.push({ label: "Pack size", value: product.units.join(" or ") });
  }
  const cases = product.units.filter((unit) => /case/i.test(unit));
  if (cases.length > 0) {
    rows.push({ label: "Case quantity", value: cases.join(" or ") });
  }
  rows.push({
    label: "Wrapping",
    value: product.individuallyWrapped ? "Marked on the catalog page" : "Not marked on the catalog page",
  });
  rows.push({ label: "Seasonal", value: product.seasonal ? "Seasonal" : "Not marked seasonal" });
  if (product.dippedOption) {
    rows.push({ label: "Dipped option", value: "Dipped or undipped" });
  }
  if (product.category === "croissants") {
    rows.push({ label: "Ingredients / allergens", value: "Pure butter" });
  }
  return rows;
}
