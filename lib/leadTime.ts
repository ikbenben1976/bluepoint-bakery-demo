/**
 * Lead times from Bluepoint's published rules:
 * - 24 hour notice for orders on all breads
 * - 48 hour notice for orders on all pastries
 * - Sourdough Boule: 3 day notice required
 *
 * "3 days" is applied as 72 hours so it lines up with the 24h / 48h rules.
 * The earliest selectable calendar date is the America/Denver date of
 * (now + that duration). A date-only picker cannot see the time of day.
 */

export type LeadKind = "bread" | "pastry" | "boule";

const HOUR_MS = 60 * 60 * 1000;

export function leadTimeHours(kinds: readonly LeadKind[]): number {
  if (kinds.length === 0) {
    throw new Error("leadTimeHours requires at least one product");
  }
  const set = new Set(kinds);
  if (set.has("boule")) return 72;
  if (set.has("pastry")) return 48;
  return 24;
}

export function denverIsoDate(instant: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** Calendar date (YYYY-MM-DD, America/Denver) of now + the required notice. */
export function earliestDeliveryIso(now: Date, kinds: readonly LeadKind[]): string {
  const hours = leadTimeHours(kinds);
  return denverIsoDate(new Date(now.getTime() + hours * HOUR_MS));
}

export function isOnOrAfter(isoDate: string, earliestIso: string): boolean {
  return isoDate >= earliestIso;
}

export function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 18));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(utcNoon);
}

/** Uses Bluepoint's own wording. The longer notice wins when rules overlap. */
export function leadTimeExplanation(kinds: readonly LeadKind[]): string {
  const set = new Set(kinds);
  const parts: string[] = [];
  if (set.has("boule")) {
    parts.push("Sourdough Boule: 3 day notice required");
  }
  if (set.has("pastry")) {
    parts.push("48 hour notice for orders on all pastries");
  }
  if (!set.has("pastry") && !set.has("boule")) {
    parts.push("24 hour notice for orders on all breads");
  }
  if (parts.length === 1) return parts[0];
  return `${parts.join(". ")}. The longer notice applies.`;
}
