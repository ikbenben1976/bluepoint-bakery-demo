import { getProduct, leadKindFor, type Product } from "@/data/products";
import { QUANTITY_BASES, type Draft, type DraftLine } from "@/lib/draft";
import { publishedUnit } from "@/lib/spec";
import { checkDelivery, normalizePlace } from "@/lib/deliveryArea";
import {
  earliestDeliveryIso,
  formatLongDate,
  isOnOrAfter,
  leadTimeExplanation,
  type LeadKind,
} from "@/lib/leadTime";

export const SAMPLE_QUESTION = "I'd like to ask about trying a product first";

export const SAMPLE_REVIEW = "Interested in trying products first.";

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
    return `Listed delivery area: ${delivery.area}. Bluepoint can confirm service to your address and available delivery days.`;
  }
  return "Please contact Bluepoint to confirm delivery to this location.";
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
    return "Add a catalog product to check its published lead time. Bluepoint will confirm timing for custom requests.";
  }
  const earliest = earliestDeliveryIso(now, kinds);
  if (!isOnOrAfter(draft.firstDelivery, earliest)) {
    return `Your preferred date is earlier than the published notice period. The earliest date based on that notice is ${formatLongDate(earliest)}. ${leadTimeExplanation(kinds)}.`;
  }
  return null;
}

export function dateStatus(draft: Draft, now: Date): string {
  const warning = dateWarning(draft, now);
  if (warning) return warning;
  const kinds = kindsInDraft(draft);
  if (!draft.firstDelivery) {
    return kinds.length > 0
      ? `No date chosen. ${leadTimeExplanation(kinds)}.`
      : "No date chosen. Published notice is 24 hours for breads, 48 hours for pastries, and 3 days for Sourdough Boule.";
  }
  return `Your preferred date meets the published notice period, subject to Bluepoint's delivery confirmation. ${leadTimeExplanation(kinds)}.`;
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type FieldIssue = { fieldId: string; message: string };

/** `now` is reserved for date checks that warn instead of blocking. */
function issuesFor(draft: Draft, step: 1 | 2 | 3, now: Date): FieldIssue[] {
  void now;
  const issues: FieldIssue[] = [];
  if (step === 1) {
    if (!draft.businessName.trim()) issues.push({ fieldId: "inquiry-business", message: "Enter the business name." });
    if (!draft.businessType) issues.push({ fieldId: "inquiry-type", message: "Choose a customer type." });
    if (!draft.contactName.trim()) issues.push({ fieldId: "inquiry-contact", message: "Enter a contact name." });
    if (!validEmail(draft.contactEmail.trim())) issues.push({ fieldId: "inquiry-email", message: "Enter a valid email address." });
    if (draft.contactPhone.replace(/\D/g, "").length < 7) issues.push({ fieldId: "inquiry-phone", message: "Enter a phone number." });
  }
  if (step === 2) {
    if (draft.lines.length === 0 && !draft.productsText.trim()) {
      issues.push({ fieldId: "inquiry-picker-product", message: "Select or describe at least one product." });
    }
    for (const line of draft.lines) {
      const product = getProduct(line.productId);
      if (!product) continue;
      if (line.qty != null && (!Number.isInteger(line.qty) || line.qty < 1)) {
        issues.push({ fieldId: `inquiry-qty-${product.id}`, message: `Enter a quantity for ${product.name}.` });
      }
      if (product.units.length > 1 && !line.unit) {
        issues.push({ fieldId: `inquiry-unit-${product.id}`, message: `Choose a published pack size for ${product.name}.` });
      }
      if ((product.sliceOptions?.length ?? 0) > 1 && !line.slice) {
        issues.push({ fieldId: `inquiry-slice-${product.id}`, message: `Choose a published slice thickness for ${product.name}.` });
      }
    }
  }
  if (step === 3) {
    if (!draft.deliveryCity.trim()) issues.push({ fieldId: "inquiry-delivery", message: "Enter a delivery city." });
    if (!draft.consent) {
      issues.push({ fieldId: "inquiry-consent", message: "Please confirm you understand this is a preview and does not submit your inquiry." });
    }
  }
  return issues;
}

/** `now` is reserved for date checks that warn instead of blocking. */
export function validateStep(draft: Draft, step: 1 | 2 | 3, now: Date): string[] {
  return issuesFor(draft, step, now).map((issue) => issue.message);
}

/** DOM id of the first control that fails `validateStep`, in the same order. */
export function firstInvalidFieldId(draft: Draft, step: 1 | 2 | 3, now: Date): string | null {
  return issuesFor(draft, step, now)[0]?.fieldId ?? null;
}

/** Buyer estimate only. Blank stays blank, and Not sure is not a number. */
export function estimatePhrase(line: DraftLine, product: Product): string {
  const unit = publishedUnit(product) || line.unit;
  const amount = line.qty == null ? "" : unit ? `${line.qty} ${unit}` : String(line.qty);
  if (line.basis === "unsure") return amount ? `${amount}, Not sure` : "Not sure";
  const basis = line.basis === "week" ? "per week" : line.basis === "delivery" ? "per delivery" : "one-time";
  if (!amount) return `${QUANTITY_BASES.find(([id]) => id === line.basis)?.[1] ?? "Per week"}, quantity not estimated`;
  return line.basis === "once" ? `${amount}, one-time` : `${amount} ${basis}`;
}

export function lineSummary(line: DraftLine, product: Product): string {
  const bits = [`${product.name} — ${estimatePhrase(line, product)}`];
  if (line.scheduleNote.trim()) bits.push(line.scheduleNote.trim());
  if (line.slice) bits.push(`slice ${line.slice}`);
  if (line.wrapped) bits.push("individually wrapped");
  if (line.dipped === "dipped" || line.dipped === "undipped") bits.push(line.dipped);
  return bits.join("; ");
}
