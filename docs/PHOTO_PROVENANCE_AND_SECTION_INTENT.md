# Image provenance and design intent

## Two separate buyer journeys — do not conflate

1. **Menu applications: "What are you making?"** shows finished dishes and catering contexts. Burgers and sandwiches use plated photos from public posts, labeled with a demo permission note. Breakfast and dinner stay **illustrative**. None of these photos are Bluepoint product shots.
2. **Our Product Assortment** shows existing Bluepoint bakery catalog item/category photographs from the original company's public website. Only these are presented as published Bluepoint product images.
3. The **hero** uses a generated illustration in `public/images/illustrative/`, labeled “Illustrative image.” It is not a verified photograph of Bluepoint products. One refreshed logo remains in the global header; the HTML headline, icons and clickable buttons sit outside the photograph.

## Application photography

Burgers and sandwiches on “What are you making?” use plated photos in `public/images/use/`. Each one carries the demo permission note from `PERMISSION_NOTE` in `data/usePhotos.ts`, and does not say “Illustrative image.” Coffee & Breakfast and Dinner & Catering still use generated images in `public/images/illustrative/`, labeled “Illustrative image.” They are not photographs of Bluepoint products. Earlier Unsplash CDN links were removed. Illustrative provenance is in `docs/IMAGE-CREDITS.md`.

| Application | File |
| --- | --- |
| Burgers & Sliders | `/images/use/west-main-burger.jpg` |
| Sandwiches & Subs | `/images/use/cafe-180-sandwiches.jpg` |
| Coffee & Breakfast | `/images/illustrative/app-breakfast.webp` |
| Dinner & Catering | `/images/illustrative/app-dinner.webp` |

## Unfinished visual acceptance

- A successful build or accessible component is not a visual match.
- Compare the entire hero against the user's supplied **Bluepoint Bakery Fresh-Baked Hero Banner.png**, including natural photograph composition, cream warmth, tabletop, type hierarchy and element placement.
- The live hero is the generated illustration in `public/images/illustrative/hero-desktop` and `hero-mobile`, with the HTML headline and buttons outside the image. The older brand hero files are no longer shown. #6 remains open until the new illustration is accepted.
- The user-approved refreshed existing logo belongs in the header, not repeated in the hero. Preserve the rolling pin, orange triangle and wordmark, and the approved BP favicon.
- Compare the application cards with the original user-supplied screenshot (large, approximately 5:3 images, 2×2 on desktop) and the assortment with distinct Bluepoint catalog images.
