import { DAY_TEXT, ROUTE_CITIES, findRouteCity } from "@/data/routes";

/**
 * Service areas named in brief §4.4:
 * contact page — Denver Metro Area; Boulder; Fort Collins/Greeley;
 * Colorado Springs; Central City/Blackhawk; I-70 Corridor to Breckenridge;
 * Cheyenne, Wyoming.
 * About page also names Loveland and Summit County.
 * Towns printed on the distribution map but not in that list return "ask".
 */

export type DeliveryStatus = "yes" | "ask" | "empty";

export type ServiceArea = {
  label: string;
  aliases: readonly string[];
};

export const SERVICE_AREAS: readonly ServiceArea[] = [
  { label: "Denver Metro Area", aliases: ["Denver Metro Area", "Denver"] },
  { label: "Boulder", aliases: ["Boulder"] },
  {
    label: "Fort Collins/Greeley",
    aliases: ["Fort Collins/Greeley", "Fort Collins", "Greeley"],
  },
  { label: "Colorado Springs", aliases: ["Colorado Springs"] },
  {
    label: "Central City/Blackhawk",
    aliases: ["Central City/Blackhawk", "Central City", "Blackhawk", "Black Hawk"],
  },
  {
    label: "I-70 Corridor to Breckenridge",
    aliases: ["I-70 Corridor to Breckenridge", "I-70 Corridor", "Breckenridge"],
  },
  {
    label: "Cheyenne, Wyoming",
    aliases: ["Cheyenne, Wyoming", "Cheyenne", "Cheyenne WY"],
  },
  { label: "Loveland", aliases: ["Loveland"] },
  { label: "Summit County", aliases: ["Summit County"] },
];

export function normalizePlace(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s+/g, " ");
}

export function checkDelivery(input: string): {
  status: DeliveryStatus;
  area?: string;
  days?: string;
} {
  const query = normalizePlace(input);
  if (!query) return { status: "empty" };
  const city = findRouteCity(input);
  const days =
    city == null ? undefined : city.days === "confirm" ? DAY_TEXT.confirm : DAY_TEXT[city.days];
  for (const area of SERVICE_AREAS) {
    for (const alias of area.aliases) {
      if (normalizePlace(alias) === query) {
        return { status: "yes", area: area.label, days: days === DAY_TEXT.confirm ? undefined : days };
      }
    }
  }
  if (city && city.days !== "confirm") {
    return { status: "yes", area: city.name, days };
  }
  if (city) {
    return { status: "ask", area: city.name, days };
  }
  return { status: "ask" };
}

export function deliveryPhrase(
  status: DeliveryStatus,
  context: "page" | "wholesale",
): string {
  if (status === "yes") {
    return "This area appears on Bluepoint's delivery map. Contact our team to confirm service to your address and available delivery days.";
  }
  if (status === "empty") return "";
  return context === "wholesale" ? "Please contact Bluepoint to check availability" : "Contact Bluepoint to check availability";
}

export function deliverySuggestions(
  query: string,
): { label: string; area: string }[] {
  const q = normalizePlace(query);
  if (!q) return [];
  const out: { label: string; area: string }[] = [];
  const seen = new Set<string>();
  for (const area of SERVICE_AREAS) {
    for (const alias of area.aliases) {
      const key = normalizePlace(alias);
      if (seen.has(key)) continue;
      if (key.includes(q)) {
        seen.add(key);
        out.push({ label: alias, area: area.label });
      }
    }
  }
  for (const city of ROUTE_CITIES) {
    const names = [city.name, ...(city.aliases ?? [])];
    for (const name of names) {
      const key = normalizePlace(name);
      if (seen.has(key)) continue;
      if (key.includes(q)) {
        seen.add(key);
        out.push({ label: name, area: city.name });
      }
    }
  }
  return out.slice(0, 8);
}
