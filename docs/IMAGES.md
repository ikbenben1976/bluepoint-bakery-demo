# Image slots

Illustrative or generated photographs are labeled “Illustrative photo” in the page and use alt text that says they are illustrative. Original Bluepoint photography stays unlabeled as illustration.

## Hero drop-in files

The home hero uses a `<picture>` element so sharper files can replace these paths without a code change.

| File | Used when | Current file | Intended replacement |
| --- | --- | --- | --- |
| `/images/brand/hero-desktop.avif` and `.jpg` | viewports 1024px and wider, full-bleed behind the text | The existing `hero-assortment` photograph, unchanged (1120×574). Do not crop this desktop source. | A sharper 2:1 file, 2880×1440, with the products kept on the right so the left side stays a calm ground for the headline. |
| `/images/brand/hero-mobile.avif` and `.jpg` | viewports under 1024px, in a 4:3 frame after the buttons | A 1600×1200 crop of the product side of `hero-assortment`, so the erased left area is not the whole frame. It is upscaled from a small source and will look soft until it is replaced. | A real 4:3 photograph, 1600×1200. |

`public/images/brand/hero-assortment.avif` remains in the repo as the current desktop master.

## Photos that need a higher-resolution original

These Bluepoint files are displayed no larger than about 1.2× their native width. They still look soft up close. Replace them with higher-resolution originals from Bluepoint, or with a new generated image that is labeled illustrative.

| File | Native size | Where it shows |
| --- | --- | --- |
| `public/images/scenes/sesame-buns-rack.webp` | 360×288 | Home buns card and the buns category |
| `public/images/scenes/rack-loaves.webp` | 360×288 | Deli loaves category, and the about gallery |
| `public/images/scenes/baker.webp` | 360×288 | About gallery |
| `public/images/front-range.jpg` | 800×1444 | Delivery and home route maps. The home map is capped at 960px wide. |

Larger scene files already in the repo (`baguette-rack`, `bakers-line`, `chocolate-pastries`, `brownie-sheet`, and others) are used for the wide slots.
