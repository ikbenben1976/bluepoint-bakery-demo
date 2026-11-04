import type { Product } from "@/data/products";

/** Values match the labels in formatInquiry. "Other" covers published types not listed here. */
export const CUSTOMER_TYPES = [
  ["restaurant", "Restaurant"],
  ["cafe", "Caf\u00e9"],
  ["hotel", "Hotel"],
  ["grocery/retail", "Grocery / retail"],
  ["institution", "Institution"],
  ["other", "Other"],
] as const;

/**
 * Buyer preferences only. bluepointbakery.com says the bakery delivers 6 days
 * a week and does not name the days, so Sunday stays in the list.
 */
export const DELIVERY_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/** Catalog sections a buyer can name. Not a promise that a change is available. */
export const CUSTOM_FAMILIES = [
  ["breads", "Breads"],
  ["pastries", "Pastries"],
  ["other", "Something else to discuss"],
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
  /** Free text naming products to mention if the buyer asks about samples. */
  sampleInterest: string;
  /** breads | pastries | other | "" */
  customFamily: string;
  customSize: string;
  customPackaging: string;
  /** Buyer acknowledged that this demo does not submit the request. */
  consent: boolean;
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
    sampleInterest: "",
    customFamily: "",
    customSize: "",
    customPackaging: "",
    consent: false,
  };
}

export function lineFromProduct(product: Product, qty = 1): DraftLine {
  return {
    productId: product.id,
    qty,
    unit: product.units.length === 1 ? product.units[0] : "",
    slice: product.sliceOptions?.length === 1 ? product.sliceOptions[0] : "",
    wrapped: false,
    dipped: "",
  };
}

export function addProductLine(draft: Draft, product: Product): Draft {
  if (draft.lines.some((line) => line.productId === product.id)) return draft;
  return { ...draft, lines: [...draft.lines, lineFromProduct(product)] };
}
