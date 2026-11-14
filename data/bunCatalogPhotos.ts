/** Buns & Kaiser Rolls: one addressable product image per SKU.
 * Unaltered bread texture comes only from the official photographs below.
 * Unverified exact-SKU identifications are openly labeled as representative.
 * Legacy generated imagery stays labeled illustrative and is never called a photo.
 */
export type BunCatalogPhoto = {
  webp: string;
  avif?: string;
  width: 960;
  height: 720;
  alt: string;
  illustrative: boolean;
  label?: "Representative photo" | "Illustrative image";
  provenance: {
    sourceUrl: string;
    sourceObject: string;
    treatment: "extracted-and-background-edited" | "existing-illustration";
    exactSkuVerified: boolean;
  };
};

const site = "https://www.bluepointbakery.com";
const bluepointSources = {
  variety: "https://irp.cdn-website.com/59a1f314/dms3rep/multi/Specialty+Variety+%281%29.jpg",
  sesame: "https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1053.jpg",
  round: "https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1070.jpg",
} as const;

type RecordEntry =
  | { name: string; kind: "photo"; source: keyof typeof bluepointSources; object: string; exact: boolean; description: string }
  | { name: string; kind: "illustration"; file: string; description: string };

const entries: Record<string, RecordEntry> = {
  "buns-brioche-bun-4-in": {name: "Brioche Bun 4 in", kind: "photo", source: "variety", object: "B01-B smooth scored bun", exact: false, description: "smooth golden-brown bakery bun"},
  "buns-bp-hamburger-bun-4-in": {name: "BP Hamburger Bun 4 in", kind: "photo", source: "round", object: "IMG_1070 foreground plain round bun", exact: false, description: "round bun on a bakery tray"},
  "buns-plain-kaiser-4-in": {name: "Plain Kaiser 4 in", kind: "photo", source: "variety", object: "B01-C scored bun", exact: false, description: "scored golden bakery roll"},
  "buns-sesame-kaiser-4-in": {name: "Sesame Kaiser 4 in", kind: "photo", source: "sesame", object: "IMG_1053 foreground sesame bun", exact: false, description: "sesame-covered bakery bun"},
  "buns-cornmeal-kaiser-4-in": {name: "Cornmeal Kaiser 4 in", kind: "illustration", file: "product-kaiser-cornmeal", description: "cornmeal-topped kaiser roll"},
  "buns-oat-bun-4-in": {name: "Oat Bun 4 in", kind: "photo", source: "variety", object: "B01-D front oat-topped bun", exact: true, description: "oat-topped Bluepoint bun"},
  "buns-potato-bun-4-in": {name: "Potato Bun 4 in", kind: "illustration", file: "product-potato-bun", description: "potato hamburger bun"},
  "buns-picnic-bun-3-5-in": {name: "Picnic Bun 3.5 in", kind: "illustration", file: "product-plain-bun", description: "plain picnic bun"},
  "buns-brioche-bun-5-in": {name: "Brioche Bun 5 in", kind: "photo", source: "variety", object: "B01-B smooth scored bun", exact: false, description: "smooth golden-brown bakery bun"},
  "buns-premium-brioche-bun": {name: "Premium Brioche Bun", kind: "photo", source: "variety", object: "B01-E right smooth bun", exact: false, description: "soft golden round bun"},
  "buns-plain-kaiser-5-in": {name: "Plain Kaiser 5 in", kind: "photo", source: "variety", object: "B01-C scored bun", exact: false, description: "scored golden bakery roll"},
  "buns-sesame-topped-kaiser-5-in": {name: "Sesame Topped Kaiser 5 in", kind: "photo", source: "sesame", object: "IMG_1053 foreground sesame bun", exact: false, description: "sesame-covered bakery bun"},
  "buns-onion-topped-kaiser-5-in": {name: "Onion Topped Kaiser 5 in", kind: "illustration", file: "product-kaiser-onion", description: "onion-topped kaiser roll"},
  "buns-poppy-topped-kaiser-5-in": {name: "Poppy Topped Kaiser 5 in", kind: "illustration", file: "product-kaiser-poppy", description: "poppy-seed kaiser roll"},
  "buns-cornmeal-topped-kaiser-5-in": {name: "Cornmeal Topped Kaiser 5 in", kind: "illustration", file: "product-kaiser-cornmeal", description: "cornmeal-topped kaiser roll"},
};

export const bunProductIds = Object.freeze(Object.keys(entries));

export function bunCatalogPhotoFor(id: string): BunCatalogPhoto | undefined {
  const entry = entries[id];
  if (!entry) return undefined;
  const root = {
    webp: `/images/catalog/buns/${id}.webp`,
    width: 960 as const,
    height: 720 as const,
  };
  if (entry.kind === "photo") {
    return {
      ...root,
      illustrative: false,
      label: entry.exact ? undefined : "Representative photo",
      alt: entry.exact
        ? `Edited Bluepoint photograph of ${entry.description}.`
        : `Edited Bluepoint photograph of a ${entry.description}, representative of ${entry.name}.`,
      provenance: {
        sourceUrl: bluepointSources[entry.source],
        sourceObject: entry.object,
        treatment: "extracted-and-background-edited",
        exactSkuVerified: entry.exact,
      },
    };
  }
  return {
    ...root,
    illustrative: true,
    label: "Illustrative image",
    alt: `Illustrative image of ${entry.description}. Not a verified Bluepoint SKU photograph.`,
    provenance: {
      sourceUrl: `${site}/`, // site context only; original illustrated asset identified below
      sourceObject: `public/images/illustrative/${entry.file}.webp (existing generated illustration)`,
      treatment: "existing-illustration",
      exactSkuVerified: false,
    },
  };
}
