import { getProduct } from "@/data/products";
import {
  DELIVERY_DAYS,
  ORDER_FREQUENCIES,
  emptyDraft,
  type Draft,
  type DraftLine,
} from "@/lib/draft";

const KEY = "bluepoint-demo-request-v1";
export const REQUEST_CHANGE_EVENT = "bluepoint-request-change";

function notifyRequestChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REQUEST_CHANGE_EVENT));
}

function cleanLine(value: unknown): DraftLine | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<DraftLine>;
  if (typeof raw.productId !== "string") return null;
  const product = getProduct(raw.productId);
  if (!product) return null;
  const qty = typeof raw.qty === "number" && Number.isFinite(raw.qty) ? Math.round(raw.qty) : 1;
  const unit =
    product.units.length === 0
      ? ""
      : product.units.length === 1
        ? product.units[0]
        : typeof raw.unit === "string" && product.units.includes(raw.unit)
          ? raw.unit
          : "";
  const sliceOptions = product.sliceOptions ?? [];
  let slice = "";
  if (sliceOptions.length === 1) slice = sliceOptions[0];
  else if (typeof raw.slice === "string" && sliceOptions.includes(raw.slice)) slice = raw.slice;
  const dipped =
    raw.dipped === "dipped" || raw.dipped === "undipped" ? raw.dipped : "";
  return {
    productId: product.id,
    qty: Math.min(9999, Math.max(1, qty)),
    unit,
    slice,
    wrapped: Boolean(raw.wrapped) && product.individuallyWrapped,
    dipped: product.dippedOption ? dipped : "",
  };
}

export function loadDraft(): Draft {
  if (typeof window === "undefined") return emptyDraft();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyDraft();
    const parsed = JSON.parse(raw) as Partial<Draft>;
    const base = emptyDraft();
    const days = Array.isArray(parsed.days)
      ? parsed.days.filter((day): day is string =>
          (DELIVERY_DAYS as readonly string[]).includes(day),
        )
      : [];
    const lines = Array.isArray(parsed.lines)
      ? parsed.lines.map(cleanLine).filter((line): line is DraftLine => line !== null)
      : [];
    return {
      ...base,
      businessName: stringField(parsed.businessName),
      businessType: stringField(parsed.businessType),
      deliveryCity: stringField(parsed.deliveryCity),
      days,
      contactName: stringField(parsed.contactName),
      contactEmail: stringField(parsed.contactEmail),
      contactPhone: stringField(parsed.contactPhone),
      notes: stringField(parsed.notes),
      productsText: stringField(parsed.productsText),
      weeklyQuantity: stringField(parsed.weeklyQuantity),
      orderFrequency: ORDER_FREQUENCIES.some(([id]) => id === parsed.orderFrequency)
        ? (parsed.orderFrequency as string)
        : "",
      askAboutSamples: parsed.askAboutSamples === true,
      sampleInterest: stringField(parsed.sampleInterest),
      customFamily: ["breads", "pastries", "other"].includes(parsed.customFamily ?? "")
        ? (parsed.customFamily as string)
        : "",
      customSize: stringField(parsed.customSize),
      customPackaging: stringField(parsed.customPackaging),
      consent: parsed.consent === true,
      lines,
      firstDelivery: /^\d{4}-\d{2}-\d{2}$/.test(parsed.firstDelivery ?? "")
        ? (parsed.firstDelivery as string)
        : "",
    };
  } catch {
    return emptyDraft();
  }
}

function stringField(value: unknown): string {
  return typeof value === "string" ? value.slice(0, 500) : "";
}

export function saveDraft(draft: Draft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(draft));
    notifyRequestChange();
  } catch {
    // Browser privacy settings or storage quota may block persistence.
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    notifyRequestChange();
  } catch {
    // Clearing is best-effort if storage is inaccessible.
  }
}
