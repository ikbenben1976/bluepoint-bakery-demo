/**
 * Plated photos for the home “What are you making?” cards.
 * West Main’s burger and Cafe 180’s sandwiches are those businesses’ public
 * photos of dishes their posts describe. The Facebook paste named the posts
 * and did not include the image files.
 *
 * `public/images/use/west-main-reuben.jpg` stays in the repo. It is a portrait
 * Reuben. The sandwiches card is one landscape frame, and Cafe 180’s sandwich
 * photo is the plate that fits it. Breakfast and dinner have no fitting plated
 * photo here, so those cards stay illustrative.
 *
 * These are food-use photos only. They are not BuyerProof logo captions and
 * they are not a strip under the customer logos.
 */

export type UsePhoto = {
  slug: "burgers" | "sandwiches";
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
};

export const PERMISSION_NOTE =
  "Shown for this demo. Ask permission before using this product photo on a live site.";

export const usePhotos: readonly UsePhoto[] = [
  {
    slug: "burgers",
    src: "/images/use/west-main-burger.jpg",
    width: 1080,
    height: 720,
    alt: "West Main burger on a bun, with fries",
    credit: "West Main Taproom + Grill.",
  },
  {
    slug: "sandwiches",
    src: "/images/use/cafe-180-sandwiches.jpg",
    width: 1500,
    height: 1000,
    alt: "Cafe 180 sandwiches on toasted bread",
    credit: "Cafe 180.",
  },
];

export function platedPhotoFor(slug: string): UsePhoto | undefined {
  return usePhotos.find((photo) => photo.slug === slug);
}
