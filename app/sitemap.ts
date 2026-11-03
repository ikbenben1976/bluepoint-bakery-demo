import type { MetadataRoute } from "next";

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

/** Non-routable host. This demo is not published. */
const BASE = "https://demo.invalid/bluepoint";

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${BASE}${path}/`,
  }));
}
