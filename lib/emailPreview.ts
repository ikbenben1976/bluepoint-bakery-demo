import { leadKindFor, getProduct } from "@/data/products";
import { ADDRESS, EMAIL, HOURS, PHONE_DISPLAY } from "@/data/site";
import { checkDelivery, deliveryPhrase } from "@/lib/deliveryArea";
import type { Draft } from "@/lib/draft";
import {
  earliestDeliveryIso,
  formatLongDate,
  isOnOrAfter,
  leadTimeExplanation,
  type LeadKind,
} from "@/lib/leadTime";

export function kindsInDraft(draft: Draft): LeadKind[] {
  const kinds: LeadKind[] = [];
  for (const line of draft.lines) {
    const product = getProduct(line.productId);
    if (product) kinds.push(leadKindFor(product));
  }
  return kinds;
}

export function buildEmailPreview(draft: Draft, now: Date): string {
  const kinds = kindsInDraft(draft);
  const delivery = checkDelivery(draft.deliveryCity);
  const phrase = deliveryPhrase(delivery.status === "empty" ? "ask" : delivery.status, "wholesale");
  const areaLine =
    delivery.status === "yes"
      ? `${phrase} — ${delivery.area}`
      : phrase;

  let timing = "First delivery date: not chosen";
  if (draft.firstDelivery && kinds.length > 0) {
    const earliest = earliestDeliveryIso(now, kinds);
    const when = formatLongDate(draft.firstDelivery);
    timing = isOnOrAfter(draft.firstDelivery, earliest)
      ? `First delivery date: ${when}`
      : `First delivery date: ${when} (before the required notice — earliest is ${formatLongDate(earliest)})`;
  }

  const lead = kinds.length > 0 ? leadTimeExplanation(kinds) : "";

  const itemLines = draft.lines.map((line, index) => {
    const product = getProduct(line.productId);
    if (!product) return `${index + 1}. Unknown item`;
    const bits = [
      `${index + 1}. ${product.name} (${product.categoryLabel}) — ${line.qty}${line.unit ? ` ${line.unit}` : " (pack size not specified)"}`,
    ];
    if (line.slice) bits.push(`slice ${line.slice}`);
    if (line.wrapped) bits.push("individually wrapped");
    if (line.dipped) bits.push(line.dipped);
    if (product.lead === "3d") bits.push("3 day notice required");
    return bits.join("; ");
  });

  const contact = [
    draft.contactName && `Name: ${draft.contactName}`,
    draft.contactEmail && `Email: ${draft.contactEmail}`,
    draft.contactPhone && `Phone: ${draft.contactPhone}`,
    draft.notes && `Notes: ${draft.notes}`,
  ].filter(Boolean);

  return [
    "DEMO PREVIEW — nothing has been sent.",
    `To: ${EMAIL}`,
    `Subject: New wholesale account request — ${draft.businessName.trim() || "(business name)"}`,
    "",
    `Business name: ${draft.businessName.trim() || "(not entered)"}`,
    `Business type: ${draft.businessType || "(not chosen)"}`,
    `Delivery city: ${draft.deliveryCity.trim() || "(not entered)"}`,
    `Delivery area: ${areaLine}`,
    `Preferred delivery days: ${draft.days.length ? draft.days.join(", ") : "(none chosen)"}`,
    timing,
    lead ? `Lead time: ${lead}` : "",
    "",
    "Products (quantity per delivery):",
    itemLines.length ? itemLines.join("\n") : "(none added)",
    "",
    "Contact (optional):",
    contact.length ? contact.join("\n") : "(none entered)",
    "",
    "Bluepoint Bakery",
    ADDRESS,
    PHONE_DISPLAY,
    `Office hours ${HOURS}`,
  ].join("\n");
}
