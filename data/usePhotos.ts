/**
 * Plated photos of dishes the cited public posts describe.
 * West Main’s burger and Reuben are the restaurant’s public menu photos of
 * the plates those posts credit to Bluepoint buns and marble rye.
 * The Cafe 180 sandwiches are that café’s public photo. The Facebook paste
 * named the posts and did not include the image files.
 * These are food-use photos only. They are not logo-card captions.
 */

export type UseAudience = "restaurants" | "cafes";

export type UsePhoto = {
  audience: UseAudience;
  src: string;
  width: number;
  height: number;
  alt: string;
  name: string;
  credit: string;
};

export const PERMISSION_NOTE =
  "Shown for this demo. Ask permission before using this product photo on a live site.";

export const usePhotos: readonly UsePhoto[] = [
  {
    audience: "restaurants",
    src: "/images/use/west-main-burger.jpg",
    width: 1080,
    height: 720,
    alt: "West Main burger on a bun, with fries",
    name: "Burger",
    credit: "West Main Taproom + Grill.",
  },
  {
    audience: "restaurants",
    src: "/images/use/west-main-reuben.jpg",
    width: 720,
    height: 1080,
    alt: "West Main Reuben on marble rye, with fries",
    name: "Reuben",
    credit: "West Main Taproom + Grill.",
  },
  {
    audience: "cafes",
    src: "/images/use/cafe-180-sandwiches.jpg",
    width: 1500,
    height: 1000,
    alt: "Cafe 180 sandwiches on toasted bread",
    name: "Sandwiches",
    credit: "Cafe 180.",
  },
];
