import type { Product } from "@/data/products";

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
