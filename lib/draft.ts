import type { Product } from "@/data/products";

export const BUSINESS_TYPES = [
  "restaurant",
  "caf\u00e9/espresso bar",
  "hotel",
  "hospital",
  "school",
  "caterer",
  "grocery",
  "other",
] as const;

export const DELIVERY_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type DraftLine = {
  productId: string;
  qty: number;
  unit: string;
  slice: string;
  wrapped: boolean;
  dipped: "" | "dipped" | "undipped";
};

export type Draft = {
  businessName: string;
  businessType: string;
  deliveryCity: string;
  days: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
  productsText: string;
  lines: DraftLine[];
  firstDelivery: string;
  weeklyQuantity: string;
  askAboutSamples: boolean;
};

export function emptyDraft(): Draft {
  return {
    businessName: "",
    businessType: "",
    deliveryCity: "",
    days: [],
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
    productsText: "",
    lines: [],
    firstDelivery: "",
    weeklyQuantity: "",
    askAboutSamples: false,
  };
}

export function lineFromProduct(product: Product, qty = 1): DraftLine {
  return {
    productId: product.id,
    qty,
    unit: product.units[0] ?? "",
    slice: product.sliceOptions?.length === 1 ? product.sliceOptions[0] : "",
    wrapped: false,
    dipped: "",
  };
}

export function addProductLine(draft: Draft, product: Product): Draft {
  if (draft.lines.some((line) => line.productId === product.id)) return draft;
  return { ...draft, lines: [...draft.lines, lineFromProduct(product)] };
}
