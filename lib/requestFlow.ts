import { getProduct, leadKindFor, type Product } from "@/data/products";
import type { Draft, DraftLine } from "@/lib/draft";
import { checkDelivery, normalizePlace } from "@/lib/deliveryArea";
import {
  earliestDeliveryIso,
  formatLongDate,
  isOnOrAfter,
  leadTimeExplanation,
  type LeadKind,
} from "@/lib/leadTime";

export const PUBLISHED_CUSTOM_LINE =
  "Orders can be customized to meet clients' personality, characteristics, or vision.";

export const SAMPLE_QUESTION =
  "Ask the bakery whether samples are available";

export function kindsInDraft(draft: Draft): LeadKind[] {
  const kinds: LeadKind[] = [];
  for (const line of draft.lines) {
    const product = getProduct(line.productId);
    if (product) kinds.push(leadKindFor(product));
  }
  return kinds;
}

export function looksLikeZip(value: string): boolean {
  return /^\d{5}(?:-\d{4})?$/.test(value.trim());
}

/** A published city match is not a street-address or frequency confirmation. */
export function areaSummary(city: string): string {
  const trimmed = city.trim();
  if (!trimmed) return "Enter a city. A ZIP code is not used to confirm delivery.";
  if (looksLikeZip(trimmed)) {
    return "A ZIP code is not used to confirm delivery. Enter the city, or ask Bluepoint.";
  }
  const delivery = checkDelivery(trimmed);
  if (delivery.status === "yes" && delivery.area) {
    return `Confirmed published area: ${delivery.area}. This matches a place named on the bakery site. It does not confirm the street address or how often a route runs.`;
  }
  return "Ask Bluepoint. This demo cannot confirm delivery here from the published area list.";
}

export function isExactPublishedPlace(city: string): boolean {
  const query = normalizePlace(city);
  if (!query || looksLikeZip(city)) return false;
  return checkDelivery(city).status === "yes";
}

export function showWrappedChoice(product: Product): boolean {
  return product.individuallyWrapped && !product.units.some((unit) => /wrapped/i.test(unit));
}

export function extraProductNote(draft: Draft): string {
  const note = draft.productsText.trim();
  if (!note) return "";
  const names = new Set(
    draft.lines
      .map((line) => getProduct(line.productId)?.name.trim().toLowerCase())
      .filter((name): name is string => Boolean(name)),
  );
  if (names.has(note.toLowerCase())) return "";
  return note;
}

export function dateWarning(draft: Draft, now: Date): string | null {
  if (!draft.firstDelivery) return null;
  const kinds = kindsInDraft(draft);
  if (kinds.length === 0) {
    return "This date is not compared with a lead time until a catalog product is added. A written description is confirmed by the bakery. Choosing a date does not reserve a route day.";
  }
  const earliest = earliestDeliveryIso(now, kinds);
  if (!isOnOrAfter(draft.firstDelivery, earliest)) {
    return `This date is earlier than the published notice. The earliest date from now is ${formatLongDate(earliest)}. ${leadTimeExplanation(kinds)}. This warning does not promise a route day.`;
  }
  return null;
}

export function dateStatus(draft: Draft, now: Date): string {
  const warning = dateWarning(draft, now);
  if (warning) return warning;
  const kinds = kindsInDraft(draft);
  if (!draft.firstDelivery) {
    return kinds.length > 0
      ? `No date chosen. ${leadTimeExplanation(kinds)}. A date is not required, and choosing one does not reserve a route day.`
      : "No date chosen. Published notice is 24 hours for breads, 48 hours for pastries, and 3 days for Sourdough Boule.";
  }
  return `This date is on or after the published notice. ${leadTimeExplanation(kinds)}. It is not a confirmed delivery day.`;
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** `now` is reserved for date checks that warn instead of blocking. */
export function validateStep(draft: Draft, step: 1 | 2 | 3, now: Date): string[] {
  void now;
  const errors: string[] = [];
  if (step === 1) {
    if (!draft.businessName.trim()) errors.push("Enter the business name.");
    if (!draft.businessType) errors.push("Choose a customer type.");
    if (!draft.contactName.trim()) errors.push("Enter a contact name.");
    if (!validEmail(draft.contactEmail.trim())) errors.push("Enter a valid email address.");
    if (draft.contactPhone.replace(/\D/g, "").length < 7) errors.push("Enter a phone number.");
  }
  if (step === 2) {
    if (draft.lines.length === 0 && !draft.productsText.trim()) {
      errors.push("Select or describe at least one product.");
    }
    for (const line of draft.lines) {
      const product = getProduct(line.productId);
      if (!product) continue;
      if (!Number.isInteger(line.qty) || line.qty < 1) {
        errors.push(`Enter a quantity for ${product.name}.`);
      }
      if (product.units.length > 1 && !line.unit) {
        errors.push(`Choose a published pack size for ${product.name}.`);
      }
      if ((product.sliceOptions?.length ?? 0) > 1 && !line.slice) {
        errors.push(`Choose a published slice thickness for ${product.name}.`);
      }
    }
  }
  if (step === 3) {
    if (!draft.deliveryCity.trim()) errors.push("Enter a delivery city.");
    if (!draft.consent) {
      errors.push("Confirm that this concept site does not submit the request.");
    }
  }
  return errors;
}

export function lineSummary(line: DraftLine, product: Product): string {
  const bits = [`${product.name} — ${line.qty}${line.unit ? ` ${line.unit}` : ""}`];
  if (line.slice) bits.push(`slice ${line.slice}`);
  if (line.wrapped) bits.push("individually wrapped");
  if (line.dipped === "dipped" || line.dipped === "undipped") bits.push(line.dipped);
  return bits.join("; ");
}
