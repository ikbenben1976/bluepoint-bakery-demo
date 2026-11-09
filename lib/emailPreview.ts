import { getProduct } from "@/data/products";
import { ADDRESS, EMAIL, HOURS, PHONE_DISPLAY } from "@/data/site";
import type { Draft } from "@/lib/draft";
import { CUSTOM_FAMILIES } from "@/lib/draft";
import { formatCustomerType, formatPhone, formatStartDate } from "@/lib/formatInquiry";
import {
  areaSummary,
  dateWarning,
  estimatePhrase,
  extraProductNote,
  kindsInDraft,
  SAMPLE_REVIEW,
} from "@/lib/requestFlow";
import { earliestDeliveryIso, formatLongDate, isOnOrAfter, leadTimeExplanation } from "@/lib/leadTime";

export { kindsInDraft };

function familyLabel(value: string): string {
  return CUSTOM_FAMILIES.find(([id]) => id === value)?.[1] ?? value;
}

export function buildEmailPreview(draft: Draft, now: Date): string {
  const kinds = kindsInDraft(draft);
  const areaLine = areaSummary(draft.deliveryCity);

  let timing = "First delivery date: not chosen";
  if (draft.firstDelivery && kinds.length > 0) {
    const earliest = earliestDeliveryIso(now, kinds);
    const when = formatLongDate(draft.firstDelivery);
    timing = isOnOrAfter(draft.firstDelivery, earliest)
      ? `First delivery date: ${when}`
      : `First delivery date: ${when} (before the required notice — earliest is ${formatLongDate(earliest)})`;
  } else if (draft.firstDelivery) {
    timing = `First delivery date: ${formatStartDate(draft.firstDelivery)} (not checked against a catalog lead time)`;
  }

  const lead = kinds.length > 0 ? leadTimeExplanation(kinds) : "";
  const warning = dateWarning(draft, now);

  const itemLines = draft.lines.map((line, index) => {
    const product = getProduct(line.productId);
    if (!product) return `${index + 1}. Unknown item`;
    const bits = [
      `${index + 1}. ${product.name} (${product.categoryLabel}) — ${estimatePhrase(line, product)}`,
    ];
    if (line.scheduleNote.trim()) bits.push(line.scheduleNote.trim());
    if (line.slice) bits.push(`slice ${line.slice}`);
    if (line.wrapped) bits.push("individually wrapped");
    if (line.dipped) bits.push(line.dipped);
    if (product.lead === "3d") bits.push("3 day notice required");
    return bits.join("; ");
  });

  const extra = extraProductNote(draft);
  if (extra) itemLines.push(`Also described: ${extra}`);

  const customBits = [
    draft.customFamily && `Product family: ${familyLabel(draft.customFamily)}`,
    draft.customSize.trim() && `Preferred size or dimensions: ${draft.customSize.trim()}`,
    draft.customPackaging.trim() && `Packaging and other requirements: ${draft.customPackaging.trim()}`,
  ].filter(Boolean);

  const contact = [
    draft.contactName && `Name: ${draft.contactName.trim()}`,
    draft.contactEmail && `Email: ${draft.contactEmail.trim()}`,
    draft.contactPhone && `Phone: ${formatPhone(draft.contactPhone)}`,
    draft.notes.trim() && `Notes: ${draft.notes.trim()}`,
    draft.weeklyQuantity.trim() && `Approximate weekly needs: ${draft.weeklyQuantity.trim()}`,
  ].filter(Boolean);

  const sample = draft.askAboutSamples
    ? [
        `Samples: ${SAMPLE_REVIEW}`,
        draft.sampleInterest.trim() ? `Products to ask about: ${draft.sampleInterest.trim()}` : "",
      ].filter(Boolean)
    : [];

  return [
    "DEMO PREVIEW — nothing has been sent or ordered.",
    `To: ${EMAIL}`,
    `Subject: New wholesale account request — ${draft.businessName.trim() || "(business name)"}`,
    "",
    `Business name: ${draft.businessName.trim() || "(not entered)"}`,
    `Business type: ${draft.businessType ? formatCustomerType(draft.businessType) : "(not chosen)"}`,
    `Delivery city: ${draft.deliveryCity.trim() || "(not entered)"}`,
    `Delivery area: ${areaLine}`,
    `Preferred delivery days (subject to confirmation): ${draft.days.length ? draft.days.join(", ") : "(none chosen — that is allowed)"}`,
    timing,
    lead ? `Lead time: ${lead}` : "",
    warning ? `Date note: ${warning}` : "",
    "",
    "Estimated products and quantities (subject to confirmation):",
    itemLines.length ? itemLines.join("\n") : "(none added)",
    "",
    customBits.length
      ? [
          "Special requests and customization (subject to Bluepoint's review):",
          ...customBits,
          "",
        ].join("\n")
      : "",
    sample.length ? `${sample.join("\n")}\n` : "",
    "Contact:",
    contact.length ? contact.join("\n") : "(none entered)",
    "",
    "Bluepoint Bakery",
    ADDRESS,
    PHONE_DISPLAY,
    `Office hours ${HOURS}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}
