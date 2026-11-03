# Bluepoint Bakery demo — agreed improvements, top-to-bottom implementation pass

Updated 3 November 2026. This file records source-code changes, **not** a visual/browser acceptance test or owner sign-off.

## Why the previous PR did not finish the agreed work

PR #2 corrected navigation, branding, copy, and contact visibility, but it did not design the menu-application cards as visual entry points, did not create the segmented testimonial proof module, and did not add a city lookup directly to the homepage. The previous audit confused "a component exists" with "the component meets the agreed design." That was an incomplete implementation.

## Top-to-bottom decision matrix

| Page sequence | Agreed item | Status in this PR |
| --- | --- | --- |
| Header | Preserve original complete logo, accessible links, account order/payment access | Implemented in PR #2; retained |
| Hero | Show assortment, wholesale proposition, clear pricing/catalog actions | Existing authentic bakery photo collage, improved hierarchy, subhead and operational caution in this PR; visual QA needed |
| Brand | Minority/family-owned wording and Colorado Proud image/reference, no invented certification | Existing in PR #2; retained; verify current program status before official launch |
| Three reasons | Scratch baked, six-day delivery, personal service | Existing copy redesigned as three distinct icon-led cards |
| Buyer entry | Four large photographic "What are you making?" pathways | **Implemented in this PR:** burger, sandwich, breakfast, dinner routes with existing bakery product imagery |
| Consultative CTA | "Find the right bread for your business", no unsupported sample promises | Existing; retained |
| Who we serve | Switchable restaurants / cafes / hotels / institutions with verified evidence | **Implemented in this PR:** accessible tab interface; restaurant quotes from Cherry Cricket, Mountain Sun, Oskar Blues; unattributed cafe review clearly labeled; no fictitious hotel logos |
| Founder and ownership story | Fred Bramhall, Mary Clark, Willie Ramirez and dated recognition | Existing in PR #2, linked to sources; retain qualified history and refrain from current ownership assertion |
| Delivery | Published geographic overview and city lookup, with schedule caveats | **Implemented on homepage in this PR** via existing delivery checker next to map |
| Community | Historical community programs and philanthropy | Existing; retained |
| Bread/pastry discovery | Search, category filters, product request CTA and source category photos | Existing; retained |
| Product detail | Published size/slicing/lead time, missing pack specs clearly flagged; no invented performance | Existing, **expanded in this PR** with ingredient/allergen, storage and pricing confirmation fields; per-category photo disclaimer |
| Inquiry | Business name/type/location/contact/quantities/start date/products; non-sending preview | Existing, **hydration bug corrected** so saved draft is available before form mounts; no live sending |
| Sticky actions / original pop-up | Contact widget and dismissible original-site style callout | PR #2; retained |
| Social | Only accounts already publicly associated with Bluepoint | Existing; retained |
| Technical | Demo remains noindexed, includes mobile layout and automated tests | Existing; responsive CSS added; build and browser tests still require verification |

## Left out deliberately

- A **Request Samples** action that suggests samples are actually available or free, because the bakery has not confirmed a sampling process.
- Any named hotel/institution customer logo or endorsement without permission.
- Detailed allergens/ingredients, case quantities, individual wrapping, warehouse performance, price, route promises without reliable SKU/account data.
- A working send button or recipient routing that would imply the demo is Bluepoint's authorized website.
- A user-supplied new composite hero image **as a background** with baked-in text; existing product photographs remain HTML image elements, and all copy/buttons remain accessible HTML.

## Test/release checklist

- [ ] Vercel build on this PR
- [ ] Tests and lint
- [ ] Mobile and desktop browser screenshots
- [ ] Full inquiry save/preview/edit/return flow
- [ ] Buyer tabs keyboard navigation and aria associations
- [ ] Product catalog and delivery map behavior
- [ ] Owner permissions and operational confirmation before production

The repository and source commit represent progress only. No automatic merge.
