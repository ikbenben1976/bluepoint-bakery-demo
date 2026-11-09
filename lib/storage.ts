import { getProduct } from "@/data/products";
import {
  DELIVERY_DAYS,
  ORDER_FREQUENCIES,
  QUANTITY_BASES,
  emptyDraft,
  type Draft,
  type DraftLine,
  type QuantityBasis,
} from "@/lib/draft";

const KEY = "bluepoint-demo-request-v1";
export const REQUEST_CHANGE_EVENT = "bluepoint-request-change";

function notifyRequestChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REQUEST_CHANGE_EVENT));
}

const BASES = QUANTITY_BASES.map(([id]) => id);

function cleanQty(value: unknown): number | null {
  if (value === null || value === "") return null;
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < 1) return null;
  return Math.min(9999, rounded);
}

function cleanLine(value: unknown): DraftLine | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<DraftLine>;
  if (typeof raw.productId !== "string") return null;
  const product = getProduct(raw.productId);
  if (!product) return null;
  const hasBasis = typeof raw.basis === "string" && BASES.includes(raw.basis as QuantityBasis);
  const basis: QuantityBasis = hasBasis ? (raw.basis as QuantityBasis) : "delivery";
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
    qty: cleanQty(raw.qty),
    unit,
    slice,
    wrapped: Boolean(raw.wrapped) && product.individuallyWrapped,
    dipped: product.dippedOption ? dipped : "",
    basis,
    scheduleNote: typeof raw.scheduleNote === "string" ? raw.scheduleNote.slice(0, 500) : "",
  };
}

function notesWithLegacyFrequency(notes: string, frequency: unknown): string {
  const label = ORDER_FREQUENCIES.find(([id]) => id === frequency)?.[1];
  if (!label) return notes;
  const line = `Earlier answer, not a product schedule: how often — ${label}.`;
  if (notes.includes(line)) return notes;
  return notes ? `${notes}\n${line}` : line;
}

export function draftFromStored(parsed: Partial<Draft> & { orderFrequency?: string }): Draft {
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
      notes: notesWithLegacyFrequency(stringField(parsed.notes), parsed.orderFrequency),
      productsText: stringField(parsed.productsText),
      weeklyQuantity: stringField(parsed.weeklyQuantity),
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
}

export function loadDraft(): Draft {
  if (typeof window === "undefined") return emptyDraft();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyDraft();
    return draftFromStored(JSON.parse(raw) as Partial<Draft> & { orderFrequency?: string });
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
