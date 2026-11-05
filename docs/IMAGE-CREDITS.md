# Image credits

Nothing in `public/images/illustrative/` is a Bluepoint photograph or a stock download. Each file is a generated illustration made for this demo on 2026-11-04. The page labels them “Illustrative image.” Alt text says they are not verified photographs of Bluepoint products.

No people, logos, or bakery signage were requested in the prompts. The images were checked for those before they were encoded.

## How they were made

| Files | Tool | Notes |
| --- | --- | --- |
| `hero-desktop`, `hero-mobile`, `app-burgers`, `app-sandwiches`, `app-breakfast`, `app-dinner`, and every `product-*` file except the six listed below | Cursor image generation | No seed was returned. |
| `product-brioche-bun` | Hugging Face Z-Image-Turbo | Seed 584018. |
| `product-plain-bun` | Hugging Face Z-Image-Turbo | Seed 559545. |
| `product-kaiser-plain` | Hugging Face Z-Image-Turbo | Seed 13578. |
| `product-kaiser-sesame` | Hugging Face Z-Image-Turbo | Seed 589699. |
| `product-kaiser-cornmeal` | Hugging Face Z-Image-Turbo | Seed 152224. |
| `product-kaiser-onion` | Hugging Face Z-Image-Turbo | Seed 764937. |

Each master was encoded to WebP (quality 76) and AVIF (SVT-AV1 CRF 32). Product frames are 960×720. Application photos and the mobile hero are 1200×900. The desktop hero is 1280×720. The site is a static export, so `next/image` is `unoptimized` and the `<picture>` element selects AVIF, then WebP.

## Where they show

- Home hero: `hero-desktop` from 1024px wide, `hero-mobile` below that.
- “What are you making?”: Coffee & Breakfast and Dinner & Catering still use `app-breakfast` and `app-dinner`. Burgers and sandwiches use plated photos in `public/images/use/` (`west-main-burger.jpg`, `cafe-180-sandwiches.jpg`), with a demo permission note. `west-main-reuben.jpg` is kept and is not on a card.
- Catalog cards: one representative file per group below. Several catalog rows share a file when they are the same shape at another size, pack, or flavor. That shared file is not a verified photo of any of those items. Authentic per-item photographs are still missing.

| File | Representative subject | Catalog ids that share it |
| --- | --- | --- |
| `product-brioche-bun` | glossy brioche hamburger bun | `buns-brioche-bun-4-in`, `buns-brioche-bun-5-in`, `buns-premium-brioche-bun` |
| `product-plain-bun` | plain hamburger bun | `buns-bp-hamburger-bun-4-in`, `buns-picnic-bun-3-5-in` |
| `product-potato-bun` | potato hamburger bun | `buns-potato-bun-4-in` |
| `product-oat-bun` | oat-topped hamburger bun | `buns-oat-bun-4-in` |
| `product-kaiser-plain` | plain kaiser roll | `buns-plain-kaiser-4-in`, `buns-plain-kaiser-5-in` |
| `product-kaiser-sesame` | sesame-topped kaiser roll | `buns-sesame-kaiser-4-in`, `buns-sesame-topped-kaiser-5-in` |
| `product-kaiser-cornmeal` | cornmeal-topped kaiser roll | `buns-cornmeal-kaiser-4-in`, `buns-cornmeal-topped-kaiser-5-in` |
| `product-kaiser-onion` | onion-topped kaiser roll | `buns-onion-topped-kaiser-5-in` |
| `product-kaiser-poppy` | poppy-seed kaiser roll | `buns-poppy-topped-kaiser-5-in` |
| `product-hot-dog` | hot dog bun | `sandwich-rolls-hot-dog-6-in` |
| `product-hoagie` | hoagie roll | `sandwich-rolls-soft-hoagie-7-in`, `sandwich-rolls-philly-roll-6-in` |
| `product-club` | club roll | club rolls at 6" and 8", sliced and unsliced |
| `product-baguette` | baguette | white baguettes, lightly baked white baguette, Golden Parisien, lightly baked Parisien, `specialty-breads-16x4-vienna` |
| `product-wheat-long` | whole-wheat baguette | lightly baked wheat baguette and wheat Parisien |
| `product-white-loaf` | white sandwich loaf | deli and pan Vienna, Texas toast |
| `product-egg-loaf` | brioche pan loaf | `pan-loaves-egg-bread-brioche` |
| `product-wheat-loaf` | cracked-wheat loaf | cracked wheat and 7 grain loaves, pan cracked wheat |
| `product-sourdough` | sourdough loaf | deli sourdough, pan sourdough, sourdough boule |
| `product-rye` | light rye loaf | `deli-loaves-light-rye` |
| `product-pumpernickel` | dark pumpernickel loaf | pumpernickel and brown bread |
| `product-marble` | marble rye loaf | deli and pan marble rye |
| `product-rosemary` | rosemary loaf | potato rosemary loaf and rustic roll |
| `product-seeded-loaf` | seeded multigrain loaf | `deli-loaves-dakota` |
| `product-dinner-rolls` | dinner rolls | brioche, potato, and savory dinner rolls, including dozen and case rows |
| `product-sliders` | slider buns | `dinner-rolls-6x5-slider-buns-30-count` |
| `product-focaccia` | rosemary focaccia | precut focaccia and the full sheet |
| `product-rustic-roll` | rustic roll | French rustic roll, 7 grain rustic roll, top split bun, telera |
| `product-croissant` | plain butter croissants | 3 oz and 1 oz curved butter croissants |
| `product-chocolate-croissant` | chocolate croissant | chocolate croissant, raspberry cream cheese croissant, variety pack |
| `product-danish` | fruit danish | danish and mini danish flavors, including the variety pack and bear claw |
| `product-turnover` | apple turnover | apple and cherry turnovers |
| `product-scone` | blueberry scones | scones and mini scones, including variety packs and seasonal |
| `product-muffin` | blueberry muffin | muffins, half-size muffins, and muffin tops |
| `product-cookie` | chocolate chip cookies | cookies and specialty cookies |
| `product-cinnamon` | iced cinnamon rolls | the 9" ring and the 4-pack |
| `product-biscotti` | almond biscotti | almond, chocolate chip, and cherry walnut |
| `product-quick-bread` | quick-bread loaf | all four quick breads |
| `product-brownie` | chocolate brownies | brownies, blondie, granola bars, and sheet packs |
| `product-pie` | apple pie | all pies, including seasonal |

The assignment list in code is `data/illustrative.ts`.

## Bluepoint’s own photographs

These stay in use and are not labeled as illustrations:

- Category headers on the bread and pastry pages, from `data/photos.ts` `categoryPhotos` (files under `public/images/scenes/`).
- “Our Product Assortment” on the home page, also Bluepoint scene photographs.
- The about, community, and delivery photographs that were already on the site.

Studio cutouts under `public/images/studio/` were not placed on the new product cards. `data/photos.ts` already records that those cutouts were retired from large display because of their edges. They are also not separate published photos of each catalog row. The card gap is filled with the generated files above.
