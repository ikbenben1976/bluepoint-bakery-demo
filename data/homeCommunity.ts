import { categoryPhotos, type Photo } from "./photos";

/**
 * Home page community tiles, in display order.
 *
 * Project Angel Heart uses the existing bakery pie photo (`categoryPhotos.pies`,
 * public/images/scenes/pie-filling.webp). The other three tiles have no photo:
 * `image: null` is what the home page renders as the "Photo needed" box.
 *
 * To swap in a real photo, add the file under public/images/ and replace that
 * tile's `image: null` with a Photo `{ src, width, height, alt }`.
 */
export type HomeCommunityTile = {
  caption: string;
  image: Photo | null;
};

export const homeCommunityTiles: readonly HomeCommunityTile[] = [
  {
    caption: "Project Angel Heart: Pie in the Sky",
    image: categoryPhotos.pies,
  },
  {
    caption: "CASA of Adams & Broomfield Counties",
    image: null,
  },
  {
    caption: "The GrowHaus",
    image: null,
  },
  {
    caption: "Soup for the Soul",
    image: null,
  },
];
