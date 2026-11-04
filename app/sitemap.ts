import type { MetadataRoute } from "next";

import { DEMO_ORIGIN } from "@/data/site";

export const dynamic = "force-static";

const paths = [
  "",
  "/breads",
  "/pastries",
  "/wholesale",
  "/delivery",
  "/about",
  "/community",
  "/faq",
  "/contact",
  "/making/burgers",
  "/making/sandwiches",
  "/making/breakfast",
  "/making/dinner",
  "/sectors/restaurants",
  "/sectors/cafes",
  "/sectors/hotels",
  "/sectors/institutions",
];

const BASE = DEMO_ORIGIN;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: path === "" ? `${BASE}/` : `${BASE}${path}/`,
  }));
}
