# Bluepoint Bakery — First-party Image and Demo Slot Inventory

**Inventory date:** 2026-11-14 · **Target repository:** `ikbenben1976/bluepoint-bakery-demo` · **Scope:** image inventory only. No product-page images, styles or layout changed by this report.

## Method and caveats

- Primary sources: the linked image URLs on Bluepoint's live Homepage, Breads, Pastries, About, Community and Map pages; its Contact and FAQ pages were also checked for content images. The 3 November 2026 source-provenance list in `docs/PHOTOS.md` is used to cross-reference asset identity and provide full-size CDN links. All links below are first-party Bluepoint website/CDN sources, not the user's external image-search results.
- Homepage scan found 12 explicitly linked gallery images. This is a linked-image inventory, **not** a guarantee that an interactive carousel hides no additional browser-only lazy-loaded files or CSS-background assets.
- Demo audit: connected Vercel project `bluepoint-bakery-demo` (latest production deployment built from `main` commit `1ad42c7e...`), and the exact code in `data/products.ts`, `data/photos.ts`, `data/illustrative.ts`, `components/ProductBrowser.tsx`, `app/breads/page.tsx` and `app/pastries/page.tsx`. Direct anonymous Vercel browsing is SSO-protected, so the visual rendering has not been browser-verified in this pass.
- The source pages show a copyright notice. Asset links here are references for image selection; they do not establish rights to republish photos.

**Confirmed counts:** 35 linked content-image positions on the inspected live pages; 48 first-party source records in the prior provenance ledger (including non-product marks and excluded assets); 23 demo categories; 137 product cards; 39 distinct current product illustration subjects assigned to 136 cards; 1 product card without an image; 10 distinct category photos across 23 headers.

## 1. Live website image positions (primary source)

| ID | Live page | Visually identified content | Original Bluepoint source | Relevance |
|---|---|---|---|---|
| H01 | [Homepage](https://www.bluepointbakery.com/) | Rolls on bakery rack | [home1](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/home1-1920w.jpg) | Product / bakery candidate |
| H02 | [Homepage](https://www.bluepointbakery.com/) | Sesame-topped buns on rack | [home2](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/home2.jpg) | Product / bakery candidate |
| H03 | [Homepage](https://www.bluepointbakery.com/) | Baker shaping dough | [home3, the baker](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/home3-1920w.jpg) | Product / bakery candidate |
| H04 | [Homepage](https://www.bluepointbakery.com/) | Rustic rolls on tray | [IMG_1076 rolls on a tray](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1076.jpg) | Product / bakery candidate |
| H05 | [Homepage](https://www.bluepointbakery.com/) | Scored round bun | [Scored bun](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1074.jpg) | Product / bakery candidate |
| H06 | [Homepage](https://www.bluepointbakery.com/) | Plain round bun on tray | [Round bun](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1070.jpg) | Product / bakery candidate |
| H07 | [Homepage](https://www.bluepointbakery.com/) | French bread on tray | [IMG_1057 French bread on a tray](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1057.jpg) | Product / bakery candidate |
| H08 | [Homepage](https://www.bluepointbakery.com/) | Sesame-topped bun close-up | [Sesame bun](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1053.jpg) | Product / bakery candidate |
| H09 | [Homepage](https://www.bluepointbakery.com/) | Cherry pies being filled | [IMG_0286 pies being filled](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_0286.JPG) | Product / bakery candidate |
| H10 | [Homepage](https://www.bluepointbakery.com/) | Baking trays with muffin cups | [IMG_0280 pastry trays](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_0280.jpg) | Product / bakery candidate |
| H11 | [Homepage](https://www.bluepointbakery.com/) | Racks of rolls | [IMG_0264 racks](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_0264.JPG) | Product / bakery candidate |
| H12 | [Homepage](https://www.bluepointbakery.com/) | Par-baked baguettes | [12 Par Bk Baguette](https://irp.cdn-website.com/59a1f314/dms3rep/multi/12--+Par+Bk+Baguette+%284%29.jpg) | Product / bakery candidate |
| B01 | [Breads](https://www.bluepointbakery.com/breads) | Assorted round buns | [Specialty variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Specialty+Variety+%281%29.jpg) | Product / bakery candidate |
| B02 | [Breads](https://www.bluepointbakery.com/breads) | Three sandwich rolls | [Philly, pumpkin, and club rolls](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Philly--Pump-and-Club--282-29-1920w.jpg) | Product / bakery candidate |
| B03 | [Breads](https://www.bluepointbakery.com/breads) | Three long Parisien loaves | [Golden Parisien](https://irp.cdn-website.com/59a1f314/dms3rep/multi/24--+Golden+Parisien+1.jpg) | Product / bakery candidate |
| B04 | [Breads](https://www.bluepointbakery.com/breads) | Marble rye loaf and slice | [Marble rye](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Marble+Rye+%282%29.jpg) | Product / bakery candidate |
| B05 | [Breads](https://www.bluepointbakery.com/breads) | Two sliced pan loaves | [Pan size variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Pan+Size+Variety+%283%29.jpg) | Product / bakery candidate |
| B06 | [Breads](https://www.bluepointbakery.com/breads) | Three brioche rolls | [Brioche dinner rolls](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Brioche+Dinner+Rolls+4.jpg) | Product / bakery candidate |
| B07 | [Breads](https://www.bluepointbakery.com/breads) | Three short Vienna-style loaves | [16x4 loaf](https://irp.cdn-website.com/59a1f314/dms3rep/multi/16x4+Loaf+%283%29.jpg) | Product / bakery candidate |
| P01 | [Pastries](https://www.bluepointbakery.com/pastries) | Three curved croissants | [3 oz croissant](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/3oz+Croissant+3.jpg) | Product / bakery candidate |
| P02 | [Pastries](https://www.bluepointbakery.com/pastries) | Three iced Danish pastries | [Danish variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+Danish+1.jpg) | Product / bakery candidate |
| P03 | [Pastries](https://www.bluepointbakery.com/pastries) | Two fruit turnovers | [Cherry turnover](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Cherry+Turnover+%285%29.jpg) | Product / bakery candidate |
| P04 | [Pastries](https://www.bluepointbakery.com/pastries) | Four scones of varied finish/flavor | [Scones](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Scones-4b4a6de9-1920w.JPG) | Product / bakery candidate |
| P05 | [Pastries](https://www.bluepointbakery.com/pastries) | Loaf and individually packed slice | [Pumpkin chocolate loaf and slice](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Pump+Choc-+Loaf+and+Slice+%281%29.jpg) | Product / bakery candidate |
| P06 | [Pastries](https://www.bluepointbakery.com/pastries) | Four packaged muffins | [Muffin variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/4pk+Muffin+Variety+%281%29.jpg) | Product / bakery candidate |
| P07 | [Pastries](https://www.bluepointbakery.com/pastries) | Three muffin tops | [Blueberry muffins](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+%282%29.jpg) | Product / bakery candidate |
| P08 | [Pastries](https://www.bluepointbakery.com/pastries) | Four cookies, some wrapped | [Cookies](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Variety-2-6815e947-2bae6899-1920w.jpg) | Product / bakery candidate |
| P09 | [Pastries](https://www.bluepointbakery.com/pastries) | Large iced cinnamon ring | [Iced ring](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Iced-Ring--282-29-1920w.JPG) | Product / bakery candidate |
| P10 | [Pastries](https://www.bluepointbakery.com/pastries) | Four biscotti | [Dipped and undipped biscotti](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Dipped+-+Undipped+%282%29.jpg) | Product / bakery candidate |
| P11 | [Pastries](https://www.bluepointbakery.com/pastries) | Four brownie and blondie bars | [Brownie and blondie 4-pack](https://irp.cdn-website.com/59a1f314/dms3rep/multi/4pk+Variety+%284%29.jpg) | Product / bakery candidate |
| P12 | [Pastries](https://www.bluepointbakery.com/pastries) | Whole crumb-topped apple pie | [Dutch apple pie](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Dutch-Apple-Pie-1-1920w.jpg) | Product / bakery candidate |
| A01 | [About](https://www.bluepointbakery.com/about) | Cherry pies on racks | [IMG_1067 cherry pies](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1067.jpg) | Pie production candidate |
| C01 | [Community](https://www.bluepointbakery.com/community) | People preparing bakery trays | [Bakers on the line](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/community3.jpg) | Context / mark |
| C02 | [Community](https://www.bluepointbakery.com/community) | Organization logo; not product photo | [Soup for the Soul mark](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/community5.png) | Context / mark |
| M01 | [Map](https://www.bluepointbakery.com/map) | Delivery map; not product photo | [Distribution map](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/DistributionMap.jpg) | Context / mark |

## 2. Additional first-party source records not among the linked page positions

These were documented in the repository's earlier source crawl. A CDN URL is **not** proof the file is currently visible on the live page. Several are valuable supplementary product sources; others are logos/backgrounds not to be used as product images.

| Subject | First-party source | Prior documented use / caution |
|---|---|---|
| Marble rye slice | [Source](https://lirp.cdn-website.com/59a1f314/dms3rep/multi/opt/Marble+Rye+TK+slice+%283%29-1920w.jpg) | Extra photo on Deli loaves. `studio/marble-slice.webp` |
| IMG_2731 baguettes on a rack | [Source](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/IMG_2731-2880w.jpg) | French breads card, and the about gallery. This stands in for the failed baguette cutout. It is still their photograph. `scenes/baguette-rack.webp` |
| Chocolate pastries in the bakery | [Source](https://lirp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/opt/CHOCOLATE+2-1920w.jpg) | About gallery. `scenes/chocolate-pastries.webp` |
| Brownie sheet, raspberry white chocolate | [Source](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Brownie+Full+Sht.+Raspberry+White+Chocolate+2-2880w.jpg) | Extra photo on Brownies. It is a full sheet in a pan, not a cloth shot, so it was not cut out. `scenes/brownie-sheet.webp` |
| Project Angel Heart mark | [Source](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/community1-300w.png) | Community page. 301×415. `scenes/angel-heart.png` |
| CASA mark | [Source](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/community2-500w.png) | Community page. `scenes/casa.png` |
| The GrowHaus mark | [Source](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/community4-390w.jpg) | Community page. 300×261. `scenes/growhaus.webp` |
| Mountain Sun mark | [Source](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/comm5.jpg) | Community page. 350×318. `scenes/mountain-sun.webp` |
| Oskar Blues mark | [Source](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/comm6-390w.jpg) | Community page. Only 174×174 exists. `scenes/oskar-blues.webp` |
| Logo | [Source](https://lirp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/opt/BPLogo_-1920w.jpg) | Kept, unaltered, in the footer. Not a product photograph. |
| Colorado Proud badge | [Source](https://lirp.cdn-website.com/59a1f314/dms3rep/multi/opt/logo_cp_2019_v4_ct-rgb-1920w.jpg) | Shown in the trust strip and footer after the Colorado Proud product finder listed Bluepoint. Official 2019 logo, resized for the page. `public/images/colorado-proud.jpg` |
| heading.png | [Source](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/heading-2880w.png) | 25×25 pixels. A broken decorative file, not a photograph. |
| homebg | [Source](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/homebg-2880w.jpg), [homebg2](https://lirp.cdn-website.com/59a1f314/dms3rep/multi/opt/homebg2-1920w.jpg), [productbg](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/productbg-2880w.jpg) | Repeating page textures (hands shaping dough, a tray of small pastries), not a product or a portrait. The same hands appear as home3, which is on the site. |

## 3. Vercel demo category image slots (all 23)

The same `categoryPhotos` object is also referenced by other parts of the site. Any later corrections must be page-scoped so that the homepage and other pages are not inadvertently altered.

| Page | Category | Products | Current demo header photo | Shared on headers | Better official source candidates | Assessment |
|---|---|---:|---|---:|---|---|
| Breads | Buns and Kaiser Rolls | 15 | `/images/scenes/sesame-buns-rack.webp` (Sesame-topped buns) | 1 | [Specialty variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Specialty+Variety+%281%29.jpg); [Sesame bun](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1053.jpg); [Round bun](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1070.jpg); [Scored bun](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1074.jpg) | Relevant buns but native source only 360×288; may appear soft. |
| Breads | Sandwich Rolls | 7 | `/images/scenes/rolls-tray.webp` (Rolls on a tray) | 3 | [Philly, pumpkin, and club rolls](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Philly--Pump-and-Club--282-29-1920w.jpg) | Reused across unrelated categories; choose category-specific frame. |
| Breads | French Breads | 9 | `/images/scenes/baguette-rack.webp` (Baguettes on a rack) | 1 | [Golden Parisien](https://irp.cdn-website.com/59a1f314/dms3rep/multi/24--+Golden+Parisien+1.jpg); [12 Par Bk Baguette](https://irp.cdn-website.com/59a1f314/dms3rep/multi/12--+Par+Bk+Baguette+%284%29.jpg); [IMG_2731 baguettes on a rack](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/IMG_2731-2880w.jpg) | Relevant baguette rack; better source views also exist. |
| Breads | Deli Loaves | 9 | `/images/scenes/rack-loaves.webp` (Loaves on a bakery rack) | 1 | [Marble rye](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Marble+Rye+%282%29.jpg); [Marble rye slice](https://lirp.cdn-website.com/59a1f314/dms3rep/multi/opt/Marble+Rye+TK+slice+%283%29-1920w.jpg); [Pan size variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Pan+Size+Variety+%283%29.jpg) | Generic rack image; direct marble-rye and pan-loaf photos available. |
| Breads | Pan Size Loaves | 6 | `/images/scenes/roll-racks.webp` (Rolls proofing on bakery racks) | 1 | [Pan size variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Pan+Size+Variety+%283%29.jpg) | Current header shows rolls proofing, not sliced pan loaves. |
| Breads | Dinner Rolls | 6 | `/images/scenes/rolls-tray.webp` (Rolls on a tray) | 3 | [Brioche dinner rolls](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Brioche+Dinner+Rolls+4.jpg) | Reused across unrelated categories; choose category-specific frame. |
| Breads | Specialty Breads | 10 | `/images/scenes/baguette-tray.webp` (French bread on a tray) | 1 | [16x4 loaf](https://irp.cdn-website.com/59a1f314/dms3rep/multi/16x4+Loaf+%283%29.jpg); [Specialty variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Specialty+Variety+%281%29.jpg); [Golden Parisien](https://irp.cdn-website.com/59a1f314/dms3rep/multi/24--+Golden+Parisien+1.jpg) | Generic French breads; more specific candidate photos available. |
| Pastries | Croissants | 5 | `/images/scenes/chocolate-pastries.webp` (Chocolate pastries in the bakery) | 3 | [3 oz croissant](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/3oz+Croissant+3.jpg); [Chocolate pastries in the bakery](https://lirp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/opt/CHOCOLATE+2-1920w.jpg) | Current header shows chocolate pastries, not plain curved croissants. |
| Pastries | Danishes | 5 | `/images/scenes/pastry-trays.webp` (Pastries on bakery trays) | 10 | [Danish variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+Danish+1.jpg) | Reused across unrelated categories; choose category-specific frame. |
| Pastries | Mini Danish | 4 | `/images/scenes/pastry-trays.webp` (Pastries on bakery trays) | 10 | [Danish variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+Danish+1.jpg) | Reused across unrelated categories; choose category-specific frame. |
| Pastries | Turnovers | 2 | `/images/scenes/pastry-trays.webp` (Pastries on bakery trays) | 10 | [Cherry turnover](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Cherry+Turnover+%285%29.jpg) | Reused across unrelated categories; choose category-specific frame. |
| Pastries | Scones | 8 | `/images/scenes/pastry-trays.webp` (Pastries on bakery trays) | 10 | [Scones](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Scones-4b4a6de9-1920w.JPG) | Reused across unrelated categories; choose category-specific frame. |
| Pastries | Mini Scones | 4 | `/images/scenes/pastry-trays.webp` (Pastries on bakery trays) | 10 | [Scones](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Scones-4b4a6de9-1920w.JPG) | Reused across unrelated categories; choose category-specific frame. |
| Pastries | Quick Breads | 4 | `/images/scenes/rolls-tray.webp` (Rolls on a tray) | 3 | [Pumpkin chocolate loaf and slice](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Pump+Choc-+Loaf+and+Slice+%281%29.jpg) | Current header shows rolls on a tray, not quick breads. |
| Pastries | Muffins | 7 | `/images/scenes/pastry-trays.webp` (Pastries on bakery trays) | 10 | [Muffin variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/4pk+Muffin+Variety+%281%29.jpg); [Blueberry muffins](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+%282%29.jpg) | Reused across unrelated categories; choose category-specific frame. |
| Pastries | Half-size Muffins | 2 | `/images/scenes/pastry-trays.webp` (Pastries on bakery trays) | 10 | [Muffin variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/4pk+Muffin+Variety+%281%29.jpg); [Blueberry muffins](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+%282%29.jpg) | Reused across unrelated categories; choose category-specific frame. |
| Pastries | Muffin Tops | 4 | `/images/scenes/pastry-trays.webp` (Pastries on bakery trays) | 10 | [Blueberry muffins](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+%282%29.jpg) | Reused across unrelated categories; choose category-specific frame. |
| Pastries | Cookies | 5 | `/images/scenes/chocolate-pastries.webp` (Chocolate pastries in the bakery) | 3 | [Cookies](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Variety-2-6815e947-2bae6899-1920w.jpg) | Current header shows chocolate pastries, not cookies. |
| Pastries | Specialty Cookies | 2 | `/images/scenes/chocolate-pastries.webp` (Chocolate pastries in the bakery) | 3 | [Cookies](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Variety-2-6815e947-2bae6899-1920w.jpg) | Current header shows chocolate pastries, not cookies. |
| Pastries | Cinnamon Rolls | 2 | `/images/scenes/pastry-trays.webp` (Pastries on bakery trays) | 10 | [Iced ring](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Iced-Ring--282-29-1920w.JPG) | Reused across unrelated categories; choose category-specific frame. |
| Pastries | Biscotti | 3 | `/images/scenes/pastry-trays.webp` (Pastries on bakery trays) | 10 | [Dipped and undipped biscotti](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Dipped+-+Undipped+%282%29.jpg) | Generic pastry trays; dedicated source biscotti available. |
| Pastries | Brownies & bars | 11 | `/images/scenes/brownie-sheet.webp` (A sheet of brownies in the bakery) | 1 | [Brownie and blondie 4-pack](https://irp.cdn-website.com/59a1f314/dms3rep/multi/4pk+Variety+%284%29.jpg); [Brownie sheet, raspberry white chocolate](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Brownie+Full+Sht.+Raspberry+White+Chocolate+2-2880w.jpg) | Brownie-sheet photo is relevant; assess large crop. |
| Pastries | Pies and Desserts | 7 | `/images/scenes/pie-filling.webp` (Pies being filled in the bakery) | 1 | [Dutch apple pie](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Dutch-Apple-Pie-1-1920w.jpg); [IMG_1067 cherry pies](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1067.jpg) | Relevant family scene, but verify framing against actual product range. |

## 4. Vercel demo individual product image slots (all 137)

**Interpretation:** `Named candidate` means a first-party photograph with a name matching the item, but dimensions, current recipe and product identity still require confirmation. `Crop candidate` means a first-party multi-product photo could plausibly supply that card, subject to visual verification; it is not an authenticated per-SKU photograph. `Unmatched` means the reviewed first-party source library does not yet establish a distinct photograph for that SKU. Packaging and size variations can share the same base photograph if the representation is accurate.

| Category | Product / SKU | Current demo visual | First-party product-specific candidate | Classification / required action |
|---|---|---|---|---|
| Buns and Kaiser Rolls | Brioche Bun 4" | `product-brioche-bun.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | BP Hamburger Bun 4" | `product-plain-bun.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | Plain Kaiser 4" | `product-kaiser-plain.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | Sesame Kaiser 4" | `product-kaiser-sesame.webp` | [Sesame bun](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1053.jpg) | Crop candidate — identify subject, verify then crop |
| Buns and Kaiser Rolls | Cornmeal Kaiser 4" | `product-kaiser-cornmeal.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | Oat Bun 4" | `product-oat-bun.webp` | [Specialty variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Specialty+Variety+%281%29.jpg) | Crop candidate — identify subject, verify then crop |
| Buns and Kaiser Rolls | Potato Bun 4" | `product-potato-bun.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | Picnic Bun 3.5" | `product-plain-bun.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | Brioche Bun 5" | `product-brioche-bun.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | Premium Brioche Bun | `product-brioche-bun.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | Plain Kaiser 5" | `product-kaiser-plain.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | Sesame Topped Kaiser 5" | `product-kaiser-sesame.webp` | [Sesame bun](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1053.jpg) | Crop candidate — identify subject, verify then crop |
| Buns and Kaiser Rolls | Onion Topped Kaiser 5" | `product-kaiser-onion.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | Poppy Topped Kaiser 5" | `product-kaiser-poppy.webp` | — | Unmatched — source a representative individual-product photo |
| Buns and Kaiser Rolls | Cornmeal Topped Kaiser 5" | `product-kaiser-cornmeal.webp` | — | Unmatched — source a representative individual-product photo |
| Sandwich Rolls | Hot Dog 6" | `product-hot-dog.webp` | — | Unmatched — source a representative individual-product photo |
| Sandwich Rolls | Soft Hoagie 7" | `product-hoagie.webp` | — | Unmatched — source a representative individual-product photo |
| Sandwich Rolls | Philly Roll 6" | `product-hoagie.webp` | — | Unmatched — source a representative individual-product photo |
| Sandwich Rolls | Club Roll 6" | `product-club.webp` | — | Unmatched — source a representative individual-product photo |
| Sandwich Rolls | Club Roll 6" sliced | `product-club.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Sandwich Rolls | Club Roll 8" | `product-club.webp` | — | Unmatched — source a representative individual-product photo |
| Sandwich Rolls | Club Roll 8" sliced | `product-club.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| French Breads | Baguette 6" | `product-baguette.webp` | — | Unmatched — source a representative individual-product photo |
| French Breads | Baguette 8" | `product-baguette.webp` | — | Unmatched — source a representative individual-product photo |
| French Breads | Baguette 12" | `product-baguette.webp` | — | Unmatched — source a representative individual-product photo |
| French Breads | Baguette 24" | `product-baguette.webp` | — | Unmatched — source a representative individual-product photo |
| French Breads | Lt Baked White Baguette 12" | `product-baguette.webp` | [12 Par Bk Baguette](https://irp.cdn-website.com/59a1f314/dms3rep/multi/12--+Par+Bk+Baguette+%284%29.jpg) | Named candidate — verify then crop/clean |
| French Breads | Lt Baked Wheat Baguette 12" | `product-wheat-long.webp` | — | Unmatched — source a representative individual-product photo |
| French Breads | Golden Parisien 24" | `product-baguette.webp` | [Golden Parisien](https://irp.cdn-website.com/59a1f314/dms3rep/multi/24--+Golden+Parisien+1.jpg) | Named candidate — verify then crop/clean |
| French Breads | Lt Baked Parisien 24" | `product-baguette.webp` | — | Unmatched — source a representative individual-product photo |
| French Breads | Lt Baked Wheat Parisien 24" | `product-wheat-long.webp` | — | Unmatched — source a representative individual-product photo |
| Deli Loaves | Vienna White | `product-white-loaf.webp` | — | Unmatched — source a representative individual-product photo |
| Deli Loaves | Cracked Wheat | `product-wheat-loaf.webp` | — | Unmatched — source a representative individual-product photo |
| Deli Loaves | Sourdough | `product-sourdough.webp` | — | Unmatched — source a representative individual-product photo |
| Deli Loaves | 7 Grain | `product-wheat-loaf.webp` | — | Unmatched — source a representative individual-product photo |
| Deli Loaves | Marble Rye | `product-marble.webp` | [Marble rye](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Marble+Rye+%282%29.jpg) | Named candidate — verify then crop/clean |
| Deli Loaves | Light Rye | `product-rye.webp` | — | Unmatched — source a representative individual-product photo |
| Deli Loaves | Pumpernickel | `product-pumpernickel.webp` | — | Unmatched — source a representative individual-product photo |
| Deli Loaves | Potato Rosemary | `product-rosemary.webp` | — | Unmatched — source a representative individual-product photo |
| Deli Loaves | Dakota | `product-seeded-loaf.webp` | — | Unmatched — source a representative individual-product photo |
| Pan Size Loaves | Vienna White | `product-white-loaf.webp` | — | Unmatched — source a representative individual-product photo |
| Pan Size Loaves | Cracked Wheat | `product-wheat-loaf.webp` | — | Unmatched — source a representative individual-product photo |
| Pan Size Loaves | Sourdough | `product-sourdough.webp` | — | Unmatched — source a representative individual-product photo |
| Pan Size Loaves | Marble Rye | `product-marble.webp` | — | Unmatched — source a representative individual-product photo |
| Pan Size Loaves | Texas Toast (Vienna 3/4") | `product-white-loaf.webp` | — | Unmatched — source a representative individual-product photo |
| Pan Size Loaves | Egg Bread (Brioche) | `product-egg-loaf.webp` | — | Unmatched — source a representative individual-product photo |
| Dinner Rolls | Brioche (Dozen) | `product-dinner-rolls.webp` | [Brioche dinner rolls](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Brioche+Dinner+Rolls+4.jpg) | Named candidate — verify then crop/clean (May reuse identical underlying item subject across pack/size variants.) |
| Dinner Rolls | Brioche (Case 120) | `product-dinner-rolls.webp` | [Brioche dinner rolls](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Brioche+Dinner+Rolls+4.jpg) | Named candidate — verify then crop/clean (May reuse identical underlying item subject across pack/size variants.) |
| Dinner Rolls | Potato (Dozen) | `product-dinner-rolls.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Dinner Rolls | Potato (Case 120) | `product-dinner-rolls.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Dinner Rolls | Savory (Dozen) | `product-dinner-rolls.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Dinner Rolls | 6x5 Slider Buns (30 count) | `product-sliders.webp` | — | Unmatched — source a representative individual-product photo |
| Specialty Breads | Focaccia precut in 10 pieces | `product-focaccia.webp` | — | Unmatched — source a representative individual-product photo |
| Specialty Breads | Focaccia full sheet (2-pack) | `product-focaccia.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Specialty Breads | French Rustic Roll | `product-rustic-roll.webp` | — | Unmatched — source a representative individual-product photo |
| Specialty Breads | Potato Rosemary Rustic Roll | `product-rosemary.webp` | — | Unmatched — source a representative individual-product photo |
| Specialty Breads | 7 Grain Rustic Roll | `product-rustic-roll.webp` | — | Unmatched — source a representative individual-product photo |
| Specialty Breads | Top Split Bun | `product-rustic-roll.webp` | — | Unmatched — source a representative individual-product photo |
| Specialty Breads | Telera Roll | `product-rustic-roll.webp` | — | Unmatched — source a representative individual-product photo |
| Specialty Breads | Sourdough Boule 8 oz | `product-sourdough.webp` | — | Unmatched — source a representative individual-product photo |
| Specialty Breads | 16x4 Vienna | `product-baguette.webp` | [16x4 loaf](https://irp.cdn-website.com/59a1f314/dms3rep/multi/16x4+Loaf+%283%29.jpg) | Named candidate — verify then crop/clean |
| Specialty Breads | Brown Bread | `product-pumpernickel.webp` | — | Unmatched — source a representative individual-product photo |
| Croissants | Curved Butter Croissant 3 oz | `product-croissant.webp` | [3 oz croissant](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/3oz+Croissant+3.jpg) | Named candidate — verify then crop/clean |
| Croissants | Curved Butter Croissant 1 oz | `product-croissant.webp` | — | Unmatched — source a representative individual-product photo |
| Croissants | Chocolate Croissant | `product-chocolate-croissant.webp` | — | Unmatched — source a representative individual-product photo |
| Croissants | Raspberry Cream Cheese Croissant | `product-chocolate-croissant.webp` | — | Unmatched — source a representative individual-product photo |
| Croissants | Variety Pack (3 Choc, 3 Rasp) | `product-chocolate-croissant.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Danishes | Apple | `product-danish.webp` | [Danish variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+Danish+1.jpg) | Crop candidate — identify subject, verify then crop |
| Danishes | Cherry | `product-danish.webp` | [Danish variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+Danish+1.jpg) | Crop candidate — identify subject, verify then crop |
| Danishes | Cream Cheese | `product-danish.webp` | [Danish variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+Danish+1.jpg) | Crop candidate — identify subject, verify then crop |
| Danishes | Bear Claw | **No image** | — | No current image — needs accurate Bear Claw image |
| Danishes | Variety Pack (2 Apple, 2 Cherry, 2 Cream Cheese) | `product-danish.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Mini Danish | Apple | `product-danish.webp` | — | Unmatched — source a representative individual-product photo |
| Mini Danish | Cherry | `product-danish.webp` | — | Unmatched — source a representative individual-product photo |
| Mini Danish | Cream Cheese | `product-danish.webp` | — | Unmatched — source a representative individual-product photo |
| Mini Danish | Blueberry | `product-danish.webp` | — | Unmatched — source a representative individual-product photo |
| Turnovers | Apple | `product-turnover.webp` | — | Unmatched — source a representative individual-product photo |
| Turnovers | Cherry | `product-turnover.webp` | [Cherry turnover](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Cherry+Turnover+%285%29.jpg) | Named candidate — verify then crop/clean |
| Scones | Double Orange | `product-scone.webp` | — | Unmatched — source a representative individual-product photo |
| Scones | Apricot Almond | `product-scone.webp` | — | Unmatched — source a representative individual-product photo |
| Scones | Cinnamon Pecan | `product-scone.webp` | — | Unmatched — source a representative individual-product photo |
| Scones | Blueberry | `product-scone.webp` | — | Unmatched — source a representative individual-product photo |
| Scones | Lemon Cranberry | `product-scone.webp` | — | Unmatched — source a representative individual-product photo |
| Scones | Seasonal | `product-scone.webp` | — | Unmatched — source a representative individual-product photo |
| Scones | Variety Pack A (2 Cinn, 2 Apricot) | `product-scone.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Scones | Variety Pack B (2 Orange, 2 Blue) | `product-scone.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Mini Scones | Double Orange | `product-scone.webp` | — | Unmatched — source a representative individual-product photo |
| Mini Scones | Apricot Almond | `product-scone.webp` | — | Unmatched — source a representative individual-product photo |
| Mini Scones | Blueberry | `product-scone.webp` | — | Unmatched — source a representative individual-product photo |
| Mini Scones | Lemon Cranberry | `product-scone.webp` | — | Unmatched — source a representative individual-product photo |
| Quick Breads | Pumpkin Chocolate | `product-quick-bread.webp` | [Pumpkin chocolate loaf and slice](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Pump+Choc-+Loaf+and+Slice+%281%29.jpg) | Named candidate — verify then crop/clean |
| Quick Breads | Zucchini Spice | `product-quick-bread.webp` | — | Unmatched — source a representative individual-product photo |
| Quick Breads | Banana Pecan | `product-quick-bread.webp` | — | Unmatched — source a representative individual-product photo |
| Quick Breads | Blueberry Lemon | `product-quick-bread.webp` | — | Unmatched — source a representative individual-product photo |
| Muffins | Apple Cinnamon Crunch | `product-muffin.webp` | — | Unmatched — source a representative individual-product photo |
| Muffins | Blueberry | `product-muffin.webp` | [Muffin variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/4pk+Muffin+Variety+%281%29.jpg) | Crop candidate — identify subject, verify then crop |
| Muffins | Lemon Poppy | `product-muffin.webp` | [Muffin variety](https://irp.cdn-website.com/59a1f314/dms3rep/multi/4pk+Muffin+Variety+%281%29.jpg) | Crop candidate — identify subject, verify then crop |
| Muffins | Double Chocolate Chip | `product-muffin.webp` | — | Unmatched — source a representative individual-product photo |
| Muffins | Triple Berry | `product-muffin.webp` | — | Unmatched — source a representative individual-product photo |
| Muffins | Variety Pack (Blue, Lemon) | `product-muffin.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Muffins | Blueberry Coffee Crumb Cake | `product-muffin.webp` | — | Unmatched — source a representative individual-product photo |
| Half-size Muffins | Blueberry | `product-muffin.webp` | — | Unmatched — source a representative individual-product photo |
| Half-size Muffins | Lemon Poppy | `product-muffin.webp` | — | Unmatched — source a representative individual-product photo |
| Muffin Tops | Blueberry | `product-muffin.webp` | [Blueberry muffins](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+%282%29.jpg) | Crop candidate — identify subject, verify then crop |
| Muffin Tops | Lemon Poppy | `product-muffin.webp` | [Blueberry muffins](https://irp.cdn-website.com/59a1f314/dms3rep/multi/Variety+%282%29.jpg) | Crop candidate — identify subject, verify then crop |
| Muffin Tops | Triple Berry | `product-muffin.webp` | — | Unmatched — source a representative individual-product photo |
| Muffin Tops | Seasonal | `product-muffin.webp` | — | Unmatched — source a representative individual-product photo |
| Cookies | Chocolate Chip (no nut) | `product-cookie.webp` | — | Unmatched — source a representative individual-product photo |
| Cookies | Oatmeal Raisin | `product-cookie.webp` | [Cookies](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Variety-2-6815e947-2bae6899-1920w.jpg) | Crop candidate — identify subject, verify then crop |
| Cookies | Monster | `product-cookie.webp` | [Cookies](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Variety-2-6815e947-2bae6899-1920w.jpg) | Crop candidate — identify subject, verify then crop |
| Cookies | Snickerdoodle | `product-cookie.webp` | [Cookies](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Variety-2-6815e947-2bae6899-1920w.jpg) | Crop candidate — identify subject, verify then crop |
| Cookies | Seasonal | `product-cookie.webp` | — | Unmatched — source a representative individual-product photo |
| Specialty Cookies | Seasonal Iced Sugar | `product-cookie.webp` | — | Unmatched — source a representative individual-product photo |
| Specialty Cookies | Black and Whites | `product-cookie.webp` | — | Unmatched — source a representative individual-product photo |
| Cinnamon Rolls | Cinnamon Roll Ring 9" (full ring) | `product-cinnamon.webp` | [Iced ring](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Iced-Ring--282-29-1920w.JPG) | Named candidate — verify then crop/clean |
| Cinnamon Rolls | Cinnamon Rolls 4-pack | `product-cinnamon.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Biscotti | Almond | `product-biscotti.webp` | — | Unmatched — source a representative individual-product photo |
| Biscotti | Chocolate Chip | `product-biscotti.webp` | — | Unmatched — source a representative individual-product photo |
| Biscotti | Cherry Walnut | `product-biscotti.webp` | — | Unmatched — source a representative individual-product photo |
| Brownies & bars | Plain (no fudge, no nut) | `product-brownie.webp` | — | Unmatched — source a representative individual-product photo |
| Brownies & bars | Rocky Road | `product-brownie.webp` | — | Unmatched — source a representative individual-product photo |
| Brownies & bars | Walnut Brownie | `product-brownie.webp` | [Brownie and blondie 4-pack](https://irp.cdn-website.com/59a1f314/dms3rep/multi/4pk+Variety+%284%29.jpg) | Crop candidate — identify subject, verify then crop |
| Brownies & bars | White Chocolate Raspberry | `product-brownie.webp` | — | Unmatched — source a representative individual-product photo |
| Brownies & bars | German Chocolate | `product-brownie.webp` | — | Unmatched — source a representative individual-product photo |
| Brownies & bars | Caramel Pecan Blondie | `product-brownie.webp` | [Brownie and blondie 4-pack](https://irp.cdn-website.com/59a1f314/dms3rep/multi/4pk+Variety+%284%29.jpg) | Crop candidate — identify subject, verify then crop |
| Brownies & bars | Cranberry Granola Bars | `product-brownie.webp` | — | Unmatched — source a representative individual-product photo |
| Brownies & bars | Brownies (any flavor) 4-pack | `product-brownie.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Brownies & bars | Brownies (any flavor) full sheet | `product-brownie.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Brownies & bars | Brownies (any flavor) 1/2 sheet | `product-brownie.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Brownies & bars | Brownies (any flavor) 1/4 sheet | `product-brownie.webp` | — | Unmatched — source a representative individual-product photo (May reuse identical underlying item subject across pack/size variants.) |
| Pies and Desserts | Dutch Apple Pie | `product-pie.webp` | [Dutch apple pie](https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Dutch-Apple-Pie-1-1920w.jpg) | Named candidate — verify then crop/clean |
| Pies and Desserts | Apple Pie | `product-pie.webp` | — | Unmatched — source a representative individual-product photo |
| Pies and Desserts | Cherry Pie | `product-pie.webp` | [IMG_1067 cherry pies](https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1067.jpg) | Crop candidate — identify subject, verify then crop |
| Pies and Desserts | Blueberry Pie | `product-pie.webp` | — | Unmatched — source a representative individual-product photo |
| Pies and Desserts | Pumpkin Pie (seasonal) | `product-pie.webp` | — | Unmatched — source a representative individual-product photo |
| Pies and Desserts | Pecan Pie (seasonal) | `product-pie.webp` | — | Unmatched — source a representative individual-product photo |
| Pies and Desserts | Chocolate Pecan (seasonal) | `product-pie.webp` | — | Unmatched — source a representative individual-product photo |

## 5. Required asset work — categories vs products

1. **23 category header slots:** choose a distinct, relevant header for each group. Source these from Bluepoint's own first-party photos first. Crops/composites from the same source can be used when appropriately accurate, but avoid visibly repeating the same pastry-tray or bread-rack photograph across unrelated categories.
2. **137 product-card slots:** maintain an individual visual for every listing. This does **not** imply 137 unique photographs: duplicates by size, count or wrapping can sometimes correctly share a base image, while genuinely different flavors/toppings/shapes need distinct representations.
3. **First-party retrieval / cleanup:** preserve master source URLs, examine resolution and crop feasibility, correct lighting/color, and avoid replacing the products with overly pristine generated copies. Important caution: the pumpkin-chocolate wrapped slice shows an obsolete printed address; do not publish the old label without review.
4. **Provenance discipline:** keep actual Bluepoint photographs distinct from generated illustrative substitutes. Do not imply an individual SKU was photographed if the source only shows the product family. The user-provided image-search screenshots are intentionally not counted as primary sources here.
5. **Scope boundary:** make later code changes solely to `/breads` and `/pastries` image presentation. Do not modify Homepage, About, Community, Wholesale or any other page without a separate request. `data/photos.ts` is shared and should not be changed globally without page-specific overrides.

## 6. Repo asset counts / structural notes

- Current repo contains 24 studio-cutout WebP files, 21 scene-image files, and 90 illustrative AVIF/WebP files (many of them non-product images). The generated product illustrations represent 39 subjects in `.webp` and `.avif` pairs. These are not 137 independently identified products.
- `docs/PHOTOS.md` mentions a `photos/originals/` directory, but no such directory is present in the current GitHub tree. The first-party CDN links and current processed assets provide the traceable source inventory for this phase.
- The code audit covers declared slots but is not a substitute for scrolling a browser through every visual card and confirming responsive crops. Production deploy is Vercel READY but the public anonymous URL did not resolve through the available web tool.
