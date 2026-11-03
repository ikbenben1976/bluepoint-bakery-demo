import { BASEMAP } from "@/data/basemap";

function mercatorY(lat: number): number {
  const s = Math.sin((lat * Math.PI) / 180);
  return Math.log((1 + s) / (1 - s)) / 2;
}

const NORTH_Y = mercatorY(BASEMAP.north);
const SOUTH_Y = mercatorY(BASEMAP.south);

/** Same Web Mercator crop the basemap was drawn with. */
export function project(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon - BASEMAP.west) / (BASEMAP.east - BASEMAP.west)) * BASEMAP.width;
  const y = ((NORTH_Y - mercatorY(lat)) / (NORTH_Y - SOUTH_Y)) * BASEMAP.height;
  return { x, y };
}
