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

export function categoryNotice(lead: Product["lead"]): string {
  if (lead === "3d") return "3 day notice required";
  if (lead === "48h") return "48 hour notice for orders on all pastries";
  return "24 hour notice for orders on all breads";
}

export function leadWords(product: Product): string {
  return categoryNotice(product.lead);
}

/** Category pages already state the usual notice. Only an exception is a product fact. */
export function leadIsCategoryDefault(product: Product): boolean {
  if (product.family === "pastries") return product.lead === "48h";
  return product.lead === "24h";
}

function sliceFact(product: Product): string | null {
  const slices = product.sliceOptions ?? [];
  if (slices.length === 0) return null;
  if (slices.length === 1) return `${slices[0]} slice`;
  return `${slices.join(" or ")} slices`;
}

function weightFact(product: Product): string | null {
  const detail = product.detail?.trim() ?? "";
  const match = detail.match(/^(\d+(?:\.\d+)?)\s*oz$/i);
  if (!match) return null;
  if (new RegExp(`${match[1]}\\s*oz`, "i").test(product.name)) return null;
  return `${match[1]} oz`;
}

/** A pack fact only when the catalog names a real count or pack. A bare "case" is not one. */
export function packFact(product: Product): string | null {
  const caseCount = product.name.match(/case\s+(\d+)/i);
  if (caseCount) return `Case of ${caseCount[1]}`;
  const namedCount = product.name.match(/(\d+)\s*count/i);
  if (namedCount) return `${namedCount[1]} count`;
  if (/\bdozen\b/i.test(product.name)) return null;
  const extra = product.units.filter((unit) => {
    if (/^case$/i.test(unit)) return false;
    return !product.name.toLowerCase().includes(unit.toLowerCase());
  });
  if (extra.length === 0) return null;
  return extra.join(" or ");
}

/** The single published selling unit, when the catalog names exactly one. */
export function publishedUnit(product: Product): string | null {
  if (product.units.length !== 1) return null;
  const unit = product.units[0];
  if (/^case$/i.test(unit)) {
    const count = product.name.match(/case\s+(\d+)/i);
    return count ? `case of ${count[1]}` : null;
  }
  return unit;
}

/** Known catalog facts only. Missing wrapping, season, size, and pack are omitted. */
export function specRows(product: Product): SpecRow[] {
  const rows: SpecRow[] = [];
  const slice = sliceFact(product);
  if (slice) rows.push({ label: "Slice", value: slice });
  const weight = weightFact(product);
  if (weight) rows.push({ label: "Weight", value: weight });
  const pack = packFact(product);
  if (pack) rows.push({ label: "Pack", value: pack });
  if (!leadIsCategoryDefault(product)) {
    rows.push({ label: "Order lead time", value: categoryNotice(product.lead) });
  }
  if (product.individuallyWrapped) rows.push({ label: "Wrapping", value: "Individually wrapped" });
  if (product.seasonal) rows.push({ label: "Seasonal", value: "Seasonal" });
  if (product.dippedOption) rows.push({ label: "Finish", value: "Dipped or undipped" });
  if (product.category === "croissants") rows.push({ label: "Ingredients", value: "Pure butter" });
  return rows;
}

/** Extra facts for a card. Wrapping and seasonal stay on their badges. */
export function cardFacts(product: Product): string {
  return specRows(product)
    .filter((row) => row.label !== "Wrapping" && row.label !== "Seasonal")
    .map((row) => row.value)
    .join(" · ");
}

export function specChips(product: Product): string[] {
  const facts = cardFacts(product);
  return facts ? facts.split(" · ") : [];
}
