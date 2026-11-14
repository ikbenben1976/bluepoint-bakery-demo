# Bluepoint Bakery — SKU-level object-to-image reconciliation

**14 November 2026. Planning document, not a deployed image change.** Applies only to the Breads and Pastries product pages in the Vercel demo. Reconciles **all 137 product listings** in `data/products.ts` against the actual photographed objects found in the 19 original category images plus seven particularly relevant official-site images. Source files were downloaded in [GitHub Actions run 43623144183](https://github.com/ikbenben1976/bluepoint-bakery-demo/actions/runs/43623144183).

This is **product-by-product assignment research**, not a claim that 137 accurately identified Bluepoint product photos exist. Flavor or dimension is not proven by shape alone. The photo code points to a visibly identified baked good, while the status distinguishes exact evidence from guesses and creative gaps.

## Evidence and crop labels

B01–B07 are the seven original Breads category photos; P01–P12 are the 12 original Pastries photos. Suffix A/B/C/D/E identifies one **visible object in the original photo**, not a manufactured new photo. `ALL` identifies the original group image. Annotated object sheets and unretouched crop pilots have been saved in the conversation.

| Photo code | What is actually visible |
|---|---|
| B01 | Buns and Kaiser Rolls original five-bun assortment: A pale dusted, B smooth golden split, C deeper brown scored, D oat-topped, E golden unscored. |
| B02 | Sandwich Rolls original three-roll assortment: A pale top-left, B pale front, C dark top-right. Filename says Philly/Pumpkin/Club but individual identities are not resolved. |
| B03 | French Breads original photo: three similar scored long loaves; one subject family, not three different products. |
| B04 | Deli Loaves original marble rye: A whole cut loaf, B separate swirl slice; same product. |
| B05 | Pan Size Loaves: A seeded darker loaf, B white loaf, each with one slice. |
| B06 | Dinner Rolls: A three brioche rolls, all same style. |
| B07 | Specialty Breads: A three similar short scored loaves; strongest connection is named 16×4 Vienna. |
| P01 | Croissants: A three similar curved butter croissants. |
| P02 | Danishes: A red fruit filling, B amber fruit filling, C cream-cheese colored filling; exact flavors not printed on photo. |
| P03 | Turnovers: A red cherry turnover, B similar pastry with filling not identifiable. |
| P04 | Scones: A coarse crumb, B dark fruit, C red fruit, D white icing; no explicit SKU names. |
| P05 | Quick Breads: A pumpkin-chocolate loaf; B wrapped slice with possibly obsolete label. |
| P06 | Muffins: A dark oat/crumb, B blueberry-looking crumb, C light poppy-looking, D brown crumb; do not guess flavors as facts. |
| P07 | Muffin Tops: A mixed-fruit, B pale speckled/poppy, C blueberry-like. |
| P08 | Cookies: A colorful candy bits, B sugar/cinnamon, C oatmeal/raisins, D packaged pale cookie. |
| P09 | Cinnamon Rolls: A iced full ring. |
| P10 | Biscotti: A dipped, B undipped; flavors cannot be identified confidently. |
| P11 | Brownies: A dark upper-left, B dark upper-right, C darker nut-studded lower-left, D pale blondie lower-right. |
| P12 | Pies: A Dutch apple crumb-topped pie. |
| O-SES | Official sesame bun (IMG_1053.jpg), single sesame-topped bun, limited 480×640. |
| O-ROUND | Official unscored round bun (IMG_1070.jpg), actual product type unverified. |
| O-PAR | Official 12-inch par-baked baguette photo (12 Par Bk Baguette), no guarantee wheat variant. |
| O-POTATO | Official Potato Rosemary Loaf photo discovered on live homepage, flour-dusted scored loaves on baking racks. |
| O-CHOC | Official chocolate-drizzled pastry production photo (CHOCOLATE 2), plausible chocolate croissant family but not SKU proof. |
| O-SHEET | Official full white-chocolate raspberry brownie sheet image; flavor stated by source filename. |
| O-CHERRY | Official cherry-pie racks and filling production shots (IMG_1067/IMG_0286), not individual plated pie. |

## Confidence/production legend

| Code | Meaning | Production decision |
|---|---|---|
| **C** | Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| **P** | Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| **S** | Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| **N** | Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| **V** | Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |

**Current classification:** 12 named-direct source matches, 23 probable object-to-SKU matches, 37 reference-only matches, 47 listings needing distinct imagery, and 18 packaging or size variants suitable for sharing/composition after a base image is established. These categories are mutually exclusive planning buckets, not counts of unique required image files.

## One row for every catalog listing

| Family | Category | Product listing | Official photo and exact object | Evidence status | Asset plan |
|---|---|---|---|---|---|
| breads | Buns and Kaiser Rolls | Brioche Bun 4" | **B01-B** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Buns and Kaiser Rolls | BP Hamburger Bun 4" | **B01-E** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Buns and Kaiser Rolls | Plain Kaiser 4" | **B01-C** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Buns and Kaiser Rolls | Sesame Kaiser 4" | **O-SES** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| breads | Buns and Kaiser Rolls | Cornmeal Kaiser 4" | **B01-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Buns and Kaiser Rolls | Oat Bun 4" | **B01-D** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| breads | Buns and Kaiser Rolls | Potato Bun 4" | **O-ROUND** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Buns and Kaiser Rolls | Picnic Bun 3.5" | **O-ROUND** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Buns and Kaiser Rolls | Brioche Bun 5" | **B01-B** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Buns and Kaiser Rolls | Premium Brioche Bun | **B01-B** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Buns and Kaiser Rolls | Plain Kaiser 5" | **B01-C** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Buns and Kaiser Rolls | Sesame Topped Kaiser 5" | **O-SES** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| breads | Buns and Kaiser Rolls | Onion Topped Kaiser 5" | **B01-C** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Buns and Kaiser Rolls | Poppy Topped Kaiser 5" | **O-SES** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Buns and Kaiser Rolls | Cornmeal Topped Kaiser 5" | **B01-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Sandwich Rolls | Hot Dog 6" | **B02-B** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Sandwich Rolls | Soft Hoagie 7" | **B02-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Sandwich Rolls | Philly Roll 6" | **B02-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Sandwich Rolls | Club Roll 6" | **B02-C** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Sandwich Rolls | Club Roll 6" sliced | **B02-C** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| breads | Sandwich Rolls | Club Roll 8" | **B02-C** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Sandwich Rolls | Club Roll 8" sliced | **B02-C** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| breads | French Breads | Baguette 6" | **B03-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | French Breads | Baguette 8" | **B03-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | French Breads | Baguette 12" | **B03-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | French Breads | Baguette 24" | **B03-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | French Breads | Lt Baked White Baguette 12" | **O-PAR** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| breads | French Breads | Lt Baked Wheat Baguette 12" | **O-PAR** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | French Breads | Golden Parisien 24" | **B03-A** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| breads | French Breads | Lt Baked Parisien 24" | **B03-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | French Breads | Lt Baked Wheat Parisien 24" | **B03-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Deli Loaves | Vienna White | **B05-B** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Deli Loaves | Cracked Wheat | **B05-A** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| breads | Deli Loaves | Sourdough | **B05-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Deli Loaves | 7 Grain | **B05-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Deli Loaves | Marble Rye | **B04-A** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| breads | Deli Loaves | Light Rye | **B04-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Deli Loaves | Pumpernickel | **B05-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Deli Loaves | Potato Rosemary | **O-POTATO** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| breads | Deli Loaves | Dakota | **B05-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Pan Size Loaves | Vienna White | **B05-B** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| breads | Pan Size Loaves | Cracked Wheat | **B05-A** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| breads | Pan Size Loaves | Sourdough | **B05-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Pan Size Loaves | Marble Rye | **B04-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Pan Size Loaves | Texas Toast (Vienna 3/4") | **B05-B** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| breads | Pan Size Loaves | Egg Bread (Brioche) | **B05-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Dinner Rolls | Brioche (Dozen) | **B06-A** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| breads | Dinner Rolls | Brioche (Case 120) | **B06-A** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| breads | Dinner Rolls | Potato (Dozen) | **B06-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Dinner Rolls | Potato (Case 120) | **B06-A** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| breads | Dinner Rolls | Savory (Dozen) | **B06-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Dinner Rolls | 6x5 Slider Buns (30 count) | **B06-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Specialty Breads | Focaccia precut in 10 pieces | **B07-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Specialty Breads | Focaccia full sheet (2-pack) | **B07-A** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| breads | Specialty Breads | French Rustic Roll | **B07-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Specialty Breads | Potato Rosemary Rustic Roll | **O-POTATO** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| breads | Specialty Breads | 7 Grain Rustic Roll | **B07-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Specialty Breads | Top Split Bun | **B02-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Specialty Breads | Telera Roll | **B02-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Specialty Breads | Sourdough Boule 8 oz | **B04-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| breads | Specialty Breads | 16x4 Vienna | **B07-A** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| breads | Specialty Breads | Brown Bread | **B05-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Croissants | Curved Butter Croissant 3 oz | **P01-A** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| pastries | Croissants | Curved Butter Croissant 1 oz | **P01-A** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Croissants | Chocolate Croissant | **O-CHOC** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Croissants | Raspberry Cream Cheese Croissant | **O-CHOC** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Croissants | Variety Pack (3 Choc, 3 Rasp) | **P01-A** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Danishes | Apple | **P02-B** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Danishes | Cherry | **P02-A** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Danishes | Cream Cheese | **P02-C** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Danishes | Bear Claw | **P02-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Danishes | Variety Pack (2 Apple, 2 Cherry, 2 Cream Cheese) | **P02-ALL** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Mini Danish | Apple | **P02-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Mini Danish | Cherry | **P02-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Mini Danish | Cream Cheese | **P02-C** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Mini Danish | Blueberry | **P02-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Turnovers | Apple | **P03-B** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Turnovers | Cherry | **P03-A** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| pastries | Scones | Double Orange | **P04-D** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Scones | Apricot Almond | **P04-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Scones | Cinnamon Pecan | **P04-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Scones | Blueberry | **P04-B** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Scones | Lemon Cranberry | **P04-C** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Scones | Seasonal | **P04-ALL** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Scones | Variety Pack A (2 Cinn, 2 Apricot) | **P04-ALL** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Scones | Variety Pack B (2 Orange, 2 Blue) | **P04-ALL** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Mini Scones | Double Orange | **P04-D** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Mini Scones | Apricot Almond | **P04-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Mini Scones | Blueberry | **P04-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Mini Scones | Lemon Cranberry | **P04-C** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Quick Breads | Pumpkin Chocolate | **P05-A** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| pastries | Quick Breads | Zucchini Spice | **P05-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Quick Breads | Banana Pecan | **P05-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Quick Breads | Blueberry Lemon | **P05-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Muffins | Apple Cinnamon Crunch | **P06-D** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Muffins | Blueberry | **P06-B** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Muffins | Lemon Poppy | **P06-C** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Muffins | Double Chocolate Chip | **P06-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Muffins | Triple Berry | **P06-B** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Muffins | Variety Pack (Blue, Lemon) | **P06-ALL** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Muffins | Blueberry Coffee Crumb Cake | **P06-B** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Half-size Muffins | Blueberry | **P06-B** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Half-size Muffins | Lemon Poppy | **P06-C** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Muffin Tops | Blueberry | **P07-C** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Muffin Tops | Lemon Poppy | **P07-B** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Muffin Tops | Triple Berry | **P07-A** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Muffin Tops | Seasonal | **P07-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Cookies | Chocolate Chip (no nut) | **P08-D** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Cookies | Oatmeal Raisin | **P08-C** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Cookies | Monster | **P08-A** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Cookies | Snickerdoodle | **P08-B** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Cookies | Seasonal | **P08-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Specialty Cookies | Seasonal Iced Sugar | **P08-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Specialty Cookies | Black and Whites | **P08-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Cinnamon Rolls | Cinnamon Roll Ring 9" (full ring) | **P09-A** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| pastries | Cinnamon Rolls | Cinnamon Rolls 4-pack | **P09-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Biscotti | Almond | **P10-B** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Biscotti | Chocolate Chip | **P10-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Biscotti | Cherry Walnut | **P10-B** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Brownies & bars | Plain (no fudge, no nut) | **P11-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Brownies & bars | Rocky Road | **P11-B** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Brownies & bars | Walnut Brownie | **P11-C** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Brownies & bars | White Chocolate Raspberry | **O-SHEET** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| pastries | Brownies & bars | German Chocolate | **P11-A** | **S** Style/shape reference | Do not claim an exact Bluepoint SKU photo. Build a realistic individual-item illustrative image grounded in this source. |
| pastries | Brownies & bars | Caramel Pecan Blondie | **P11-D** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Brownies & bars | Cranberry Granola Bars | **P11-D** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Brownies & bars | Brownies (any flavor) 4-pack | **P11-ALL** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Brownies & bars | Brownies (any flavor) full sheet | **O-SHEET** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Brownies & bars | Brownies (any flavor) 1/2 sheet | **O-SHEET** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Brownies & bars | Brownies (any flavor) 1/4 sheet | **O-SHEET** | **V** Shared/packaging variant | Reuse the correct underlying product only if appearance is identical, or compose a faithful size/count/packaging variant. |
| pastries | Pies and Desserts | Dutch Apple Pie | **P12-A** | **C** Named direct source | Crop/lightly retouch the official photograph; preserve provenance and verify framing. |
| pastries | Pies and Desserts | Apple Pie | **P12-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Pies and Desserts | Cherry Pie | **O-CHERRY** | **P** Probable visual match | Use this object only after confirming flavor/shape; crop and minimally retouch if supported. |
| pastries | Pies and Desserts | Blueberry Pie | **P12-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Pies and Desserts | Pumpkin Pie (seasonal) | **P12-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Pies and Desserts | Pecan Pie (seasonal) | **P12-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |
| pastries | Pies and Desserts | Chocolate Pecan (seasonal) | **P12-A** | **N** Missing exact photo | Produce a specific illustrative image using the referenced bakery style; do not reuse an unrelated product image. |

## Category-specific identification guardrails

- **Buns and Kaiser Rolls (15):** Five visible buns give at most five distinct starting subjects; photograph does not name which bun is which. The oat-topped bun matches Oat Bun best. A separate sesame-bun photograph is especially valuable. Kaiser-specific toppings (onion/poppy/cornmeal) need new faithful variations.
- **Sandwich Rolls (7):** Three distinct roll shapes/colors; do not infer that the dark third roll is a listed SKU merely from the assortment filename. Club roll sizes and slicing are legitimate variants.
- **French Breads (9):** Keep actual 12-inch par-baked baguette and Golden Parisien photos; other lengths can share underlying shape language, not mislabeled measured scale.
- **Deli Loaves (9):** Marble rye and Potato Rosemary have named original photographs; darker grain loaves and white bread should preserve characteristic crumb/shape but must not be claimed as exact.
- **Pan Size Loaves (6):** White and brown loaves can be separately cropped; slicing thickness and bread type are not proven from photo alone.
- **Dinner Rolls (6):** One official brioche type supports dozen/case versions. Potato, savory and slider group are different products needing faithful separate imagery.
- **Specialty Breads (10):** Mixed-geometry category; avoid using long bread photos to depict focaccia, telera or boule.
- **Croissants (5):** The chocolate-drizzled production pastries differ in appearance from the plain curved croissants; use as inspiration for chocolate line rather than pretending plain croissant photo is that item.
- **Danishes (5):** Three fruit/cheese danishes are visible. Apple/cherry/cream-cheese assignments should be visually checked at original resolution; Bear Claw cannot be sourced by cropping a round Danish.
- **Mini Danish (4):** Mini sizes require smaller-scale representations; simply reusing a full-size crop would be visually misleading if sizes matter.
- **Turnovers (2):** The original source is explicitly Cherry Turnover. Apple should be a new aligned variant without assigning the cherry-filled photo to apple.
- **Scones (8):** Four visually distinct scones; no unambiguous label-to-flavor match. Use as inspiration and crop where visual topping agrees with flavor.
- **Mini Scones (4):** Use the same dough, crumb, fruit pieces and icing as regular Scones but at demonstrably smaller shape/scale.
- **Quick Breads (4):** Pumpkin Chocolate has original loaf and wrapped slice, but label carries an obsolete address; other flavors require faithful variants.
- **Muffins (7):** Four pack contains four distinct finishes, but a single package and reflections. Attempt crops with natural imperfections; identify fruit/topping carefully.
- **Half-size Muffins (2):** Borrow identified muffin flavors, recomposed in genuinely smaller proportions; do not crop a full-size muffin and label as half-size.
- **Muffin Tops (4):** Three visually separated tops can support three candidates after flavor verification; seasonal stays unspecified.
- **Cookies (5):** Four cookies are separable; bag glare can be retained lightly or retouched cautiously, but not altered into nonexistent products.
- **Specialty Cookies (2):** The cookie variety shows none conclusively identifiable as Black and Whites; those require a distinct new faithful reference image.
- **Cinnamon Rolls (2):** Full ring official. A 4-pack should represent four distinct roll portions, not merely a close crop of the ring presented as an authentic pack.
- **Biscotti (3):** Two dipped plus two undipped only proves finishing differences. Ingredient identities like cherry walnut cannot be inferred from a plain biscotti crop.
- **Brownies & bars (11):** Four-bar set has visually different bars, but flavors not all identifiable. White Chocolate Raspberry sheet is officially named; pack/sheet fractions may share product base with correct presentation.
- **Pies and Desserts (7):** Dutch Apple and production cherry pie imagery official; remaining pie types need accurate crust and fillings, not brown crumb pie repeated seven times.

## Practical extraction sequence

1. **Produce source crop master set.** Extract every distinct visible object as an *unaltered crop*, retaining metadata that connects it to the downloaded first-party original, original filename, and normalized crop box. Do not enlarge low-resolution 480×640 images with invented edges.
2. **Rate every crop.** Accept standalone subjects with clean edges; mark overlapping, truncated or packaged items as `needs cleanup` and save the genuine composition before any retouch. Avoid cropping wrappers and then depicting a product as unpackaged if the source does not show what it looks like.
3. **Create accurate illustrative extensions.** For `S`/`N`, use the closest official Bluepoint product photo as shape and texture reference. Match realistic variability, natural surface imperfections, crust/crumb, icing, photography angle and Bluepoint's checkered-cloth setting. Different fillings, toppings and bread types must actually differ.
4. **Compose valid variants.** If only size, slicing or packaging changes, reuse an authentic base image or make a visibly accurate composite. For variety packs, combine the actual included varieties rather than showing six identical items.
5. **Replace page-only mappings.** Keep photo provenance and `photoKind` (`original-crop`, `enhanced-crop`, `illustration`) in a product-page-specific mapping. Do not mutate `data/photos.ts` globally because it is reused on the homepage and other routes.
6. **Visual QA.** Verify all 137 product cards and 23 category headers on desktop and mobile against the actual item name. Check for duplicate subjects across different SKUs, mislabeled flavor, missing images, layout crop problems and image-loading errors before a deployment is considered complete.

## Cross-reference

- [Original image/source inventory](./PRODUCT-IMAGE-INVENTORY-2026-11-14.md)
- [Visual identification and user-search screenshot comparison](./PRODUCT-IMAGE-VISUAL-RECONCILIATION-2026-11-14.md)
- [Original image archive artifact](https://github.com/ikbenben1976/bluepoint-bakery-demo/actions/runs/43623144183/artifacts/14124727708)