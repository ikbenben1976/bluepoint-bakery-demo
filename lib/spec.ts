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
  if (product.lead === "3d") return "3 Day Notice Required";
  if (product.lead === "48h") return "48 hour notice for orders on all pastries";
  return "24 hour notice for orders on all breads";
}
