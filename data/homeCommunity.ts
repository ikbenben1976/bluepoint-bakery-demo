import type { Photo } from "./photos";

/**
 * Home page community tiles, in display order.
 * Each tile shows that charity's logo from public/images/community-logos/.
 */
export type HomeCommunityTile = {
  caption: string;
  image: Photo | null;
};

export const homeCommunityTiles: readonly HomeCommunityTile[] = [
  {
    caption: "Project Angel Heart: Pie in the Sky",
    image: {
      src: "/images/community-logos/project-angel-heart.png",
      width: 1007,
      height: 615,
      alt: "Project Angel Heart logo",
    },
  },
  {
    caption: "CASA of Adams & Broomfield Counties",
    image: {
      src: "/images/community-logos/casa.png",
      width: 880,
      height: 521,
      alt: "CASA of Adams & Broomfield Counties logo",
    },
  },
  {
    caption: "The GrowHaus",
    image: {
      src: "/images/community-logos/growhaus.png",
      width: 1500,
      height: 915,
      alt: "The GrowHaus logo",
    },
  },
  {
    caption: "Soup for the Soul",
    image: {
      src: "/images/community-logos/soup-for-the-soul.png",
      width: 592,
      height: 1464,
      alt: "Soup for the Soul logo",
    },
  },
];
