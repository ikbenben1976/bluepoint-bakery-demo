# Image slots

Illustrative or generated photographs are labeled “Illustrative image” in the page and use alt text that says they are illustrative. Original Bluepoint photography stays unlabeled as illustration.

## Hero files

The home hero uses a `<picture>` element. Desktop (1024px and wider) loads the wide file. Narrower viewports load the 4:3 file. Both are generated illustrations, not Bluepoint photographs. See `docs/IMAGE-CREDITS.md`.

| File | Used when | Size |
| --- | --- | --- |
| `/images/illustrative/hero-desktop.avif` and `.webp` | viewports 1024px and wider | 1280×720, products kept to the right |
| `/images/illustrative/hero-mobile.avif` and `.webp` | viewports under 1024px | 1200×900 |

`public/images/brand/hero-assortment.avif` and the older `hero-desktop` / `hero-mobile` brand files remain in the repo and are no longer shown.

## Photos that need a higher-resolution original

These Bluepoint files are displayed no larger than about 1.2× their native width. They still look soft up close. Replace them with higher-resolution originals from Bluepoint, or with a new generated image that is labeled illustrative.

| File | Native size | Where it shows |
| --- | --- | --- |
| `public/images/scenes/sesame-buns-rack.webp` | 360×288 | Home buns card and the buns category |
| `public/images/scenes/rack-loaves.webp` | 360×288 | Deli loaves category, and the about gallery |
| `public/images/scenes/baker.webp` | 360×288 | About gallery |
| `public/images/front-range.jpg` | 800×1444 | Delivery and home route maps. The home map is capped at 960px wide. |

Larger scene files already in the repo (`baguette-rack`, `bakers-line`, `chocolate-pastries`, `brownie-sheet`, and others) are used for the wide slots.
