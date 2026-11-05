/**
 * Cities and colors named on https://www.bluepointbakery.com/map (checked 4 Nov 2026).
 * Weekdays are from Ben’s distribution-map legend (5 Nov 2026). That legend
 * assigns days to colors. City names stay the published list. On both the
 * published page and Ben’s map, Colorado Springs and Fountain are blue and
 * Cheyenne is purple. Keystone is shaded on Ben’s map and is not a published
 * city name, so it is not pinned. Positions are real city coordinates.
 */

export type DayKey = "mon-sat" | "mwfs" | "tts" | "ts" | "mttf" | "confirm";

export type RouteCity = {
  name: string;
  lat: number;
  lon: number;
  /** Label offset in basemap pixels. Negative lx anchors the label to the left. */
  lx: number;
  ly: number;
  days: DayKey;
  /** Cities that share a zone id get one wash. */
  zone?: string;
  note?: string;
  aliases?: readonly string[];
};

/** Weekdays printed beside each color on Ben’s distribution map, 5 Nov 2026. */
export const DAY_TEXT: Record<DayKey, string> = {
  "mon-sat": "Mon, Tue, Wed, Thu, Fri, Sat",
  mwfs: "Mon, Wed, Fri, Sat",
  tts: "Tue, Thu, Sat",
  ts: "Tue, Sat",
  mttf: "Mon, Tue, Thu, Fri",
  confirm: "Call to confirm",
};

/** Color names printed on the bakery's map page. */
export const ROUTE_NAME: Record<DayKey, string> = {
  "mon-sat": "Yellow",
  mwfs: "Green",
  tts: "Blue",
  ts: "Orange",
  mttf: "Purple",
  confirm: "Call to confirm",
};

/** Every city named under a color on https://www.bluepointbakery.com/map. */
export const PUBLISHED_MAP_CITIES = [
  "Cheyenne",
  "Fort Collins",
  "Greeley",
  "Loveland",
  "Windsor",
  "Aurora",
  "Boulder",
  "Broomfield",
  "Castle Rock",
  "Denver",
  "Denver International Airport",
  "Englewood",
  "Evergreen",
  "Golden",
  "Lakewood",
  "Littleton",
  "Longmont",
  "Blackhawk",
  "Breckenridge",
  "Central City",
  "Colorado Springs",
  "Fountain",
] as const;

export const DAY_SWATCH: Record<DayKey, string> = {
  "mon-sat": "#E6C84A",
  mwfs: "#6E8B3D",
  tts: "#5C7EBE",
  ts: "#C46A45",
  mttf: "#6B5B8C",
  confirm: "#C09040",
};

/** 5105 Cook St, Elyria-Swansea, between I-25 and I-70. */
export const BAKERY = { lat: 39.7893685, lon: -104.9476617 };

export const ROUTE_CITIES: readonly RouteCity[] = [
  { name: "Cheyenne", lat: 41.14, lon: -104.8203, lx: 12, ly: -8, days: "mttf", zone: "cheyenne" },
  { name: "Fort Collins", lat: 40.5853, lon: -105.0844, lx: -10, ly: -16, days: "mwfs", zone: "north" },
  { name: "Windsor", lat: 40.4772, lon: -104.9014, lx: 12, ly: -8, days: "mwfs", zone: "north" },
  { name: "Loveland", lat: 40.3978, lon: -105.075, lx: -10, ly: 16, days: "mwfs", zone: "north" },
  { name: "Greeley", lat: 40.4233, lon: -104.7091, lx: 12, ly: 4, days: "mwfs", zone: "north" },
  { name: "Longmont", lat: 40.1672, lon: -105.1019, lx: 12, ly: -6, days: "mon-sat", zone: "metro" },
  { name: "Boulder", lat: 40.015, lon: -105.2705, lx: -10, ly: 4, days: "mon-sat", zone: "metro" },
  { name: "Central City", lat: 39.8019, lon: -105.5144, lx: -10, ly: -14, days: "ts", zone: "canyon" },
  { name: "Black Hawk", lat: 39.796, lon: -105.484, lx: 12, ly: 14, days: "ts", zone: "canyon", aliases: ["Blackhawk"] },
  { name: "Broomfield", lat: 39.9205, lon: -105.0867, lx: 12, ly: -12, days: "mon-sat", zone: "metro" },
  { name: "Golden", lat: 39.7555, lon: -105.2211, lx: -10, ly: -8, days: "mon-sat", zone: "metro" },
  { name: "Denver", lat: 39.7392, lon: -104.9903, lx: 14, ly: 18, days: "mon-sat", zone: "metro" },
  {
    name: "Denver International Airport",
    lat: 39.8561,
    lon: -104.6737,
    lx: 12,
    ly: -6,
    days: "mon-sat",
    zone: "metro",
    aliases: ["DIA"],
  },
  { name: "Lakewood", lat: 39.7047, lon: -105.0814, lx: -10, ly: 14, days: "mon-sat", zone: "metro" },
  { name: "Aurora", lat: 39.7294, lon: -104.8319, lx: 12, ly: 6, days: "mon-sat", zone: "metro" },
  { name: "Englewood", lat: 39.6478, lon: -104.9878, lx: 12, ly: 16, days: "mon-sat", zone: "metro" },
  {
    name: "Evergreen",
    lat: 39.6333,
    lon: -105.3172,
    lx: -10,
    ly: 4,
    days: "mon-sat",
    zone: "metro",
  },
  { name: "Littleton", lat: 39.6133, lon: -105.0166, lx: -10, ly: 16, days: "mon-sat", zone: "metro" },
  { name: "Breckenridge", lat: 39.4817, lon: -106.0384, lx: -10, ly: 14, days: "ts", zone: "summit" },
  { name: "Castle Rock", lat: 39.3722, lon: -104.8561, lx: 12, ly: 4, days: "mon-sat", zone: "metro" },
  { name: "Colorado Springs", lat: 38.8339, lon: -104.8214, lx: -10, ly: -8, days: "tts", zone: "springs" },
  { name: "Fountain", lat: 38.6822, lon: -104.7008, lx: 12, ly: 8, days: "tts", zone: "springs" },
];

export const CAVEAT =
  "This is an overview. Please call us to see if we service your city and to confirm the street address.";

function norm(value: string): string {
  return value.trim().toLowerCase().replace(/\./g, "").replace(/,/g, "").replace(/\s+/g, " ");
}

export function findRouteCity(query: string): RouteCity | undefined {
  const q = norm(query);
  if (!q) return undefined;
  return ROUTE_CITIES.find(
    (city) => norm(city.name) === q || city.aliases?.some((alias) => norm(alias) === q),
  );
}
