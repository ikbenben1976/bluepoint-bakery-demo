import type { RouteCity } from "@/data/routes";
import { project } from "@/lib/project";

/**
 * Delivery-page label nudges (#78). The homepage preview keeps each city's
 * shared lx/ly so this page can separate labels without moving the preview.
 * lx/ly use the same units as RouteCity: x shifts by lx * 3, y by ly * 2.4.
 */
export const DELIVERY_LABEL_OFFSET: Readonly<Record<string, { lx: number; ly: number }>> = {
  "Black Hawk": { lx: 12, ly: -28 },
  Aurora: { lx: 36, ly: 6 },
  Lakewood: { lx: -10, ly: 2 },
};

/** Baseline offset from the bakery dot. The preview map keeps -28. */
export const DELIVERY_BAKERY_LABEL_DY = -8;

export function cityLabelOffset(city: RouteCity, preview: boolean): { lx: number; ly: number } {
  if (preview) return { lx: city.lx, ly: city.ly };
  return DELIVERY_LABEL_OFFSET[city.name] ?? { lx: city.lx, ly: city.ly };
}

export function cityLabelAnchor(
  lon: number,
  lat: number,
  lx: number,
  ly: number,
): { x: number; y: number; anchor: "start" | "end" } {
  const pt = project(lon, lat);
  if (pt.x < 320) return { x: pt.x + 18, y: pt.y + ly * 2.4, anchor: "start" };
  return {
    x: pt.x + lx * 3,
    y: pt.y + ly * 2.4,
    anchor: lx < 0 ? "end" : "start",
  };
}
