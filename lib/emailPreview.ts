import { getProduct } from "@/data/products";
import { ADDRESS, EMAIL, HOURS, PHONE_DISPLAY } from "@/data/site";
import type { Draft } from "@/lib/draft";
import { CUSTOM_FAMILIES } from "@/lib/draft";
import { formatCustomerType, formatPhone, formatStartDate } from "@/lib/formatInquiry";
import {
  areaSummary,
  dateWarning,
  extraProductNote,
  kindsInDraft,
  PUBLISHED_CUSTOM_LINE,
  SAMPLE_QUESTION,
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
      `${index + 1}. ${product.name} (${product.categoryLabel}) — ${line.qty}${line.unit ? ` ${line.unit}` : " (pack size not specified)"}`,
    ];
    if (line.slice) bits.push(`slice ${line.slice}`);
    if (line.wrapped) bits.push("individually wrapped");
    if (line.dipped) bits.push(line.dipped);
    if (product.lead === "3d") bits.push("3 day notice required");
    return bits.join("; ");
  });

  const extra = extraProductNote(draft);
  if (extra) itemLines.push(`Also described: ${extra}`);

  const customBits = [
    draft.customFamily && `Product family to discuss: ${familyLabel(draft.customFamily)}`,
    draft.customSize.trim() && `Size or dimensions to discuss: ${draft.customSize.trim()}`,
    draft.customPackaging.trim() && `Packaging or other requirements to discuss: ${draft.customPackaging.trim()}`,
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
        `Samples: ${SAMPLE_QUESTION}. Please advise whether samples are available, and any cost or conditions.`,
        draft.sampleInterest.trim() ? `Products to ask about: ${draft.sampleInterest.trim()}` : "",
      ].filter(Boolean)
    : [];

  return [
    "DEMO PREVIEW — nothing has been sent.",
    "This concept site does not submit wholesale requests.",
    `To: ${EMAIL}`,
    `Subject: New wholesale account request — ${draft.businessName.trim() || "(business name)"}`,
    "",
    `Business name: ${draft.businessName.trim() || "(not entered)"}`,
    `Business type: ${draft.businessType ? formatCustomerType(draft.businessType) : "(not chosen)"}`,
    `Delivery city: ${draft.deliveryCity.trim() || "(not entered)"}`,
    `Delivery area: ${areaLine}`,
    `Preferred days to discuss (not a confirmed route): ${draft.days.length ? draft.days.join(", ") : "(none chosen — that is allowed)"}`,
    timing,
    lead ? `Lead time: ${lead}` : "",
    warning ? `Date note: ${warning}` : "",
    "",
    "Products (quantity per delivery):",
    itemLines.length ? itemLines.join("\n") : "(none added)",
    "",
    customBits.length
      ? [
          "Customization to discuss:",
          `Bluepoint's About page says: "${PUBLISHED_CUSTOM_LINE}"`,
          "Examples to discuss.",
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
