# Bluepoint Bakery brand audit

Nov 14, 2026. The follow-up on this branch resolved three no-visual items: dead `#2035e8` / `#f66631` declarations that lose at every breakpoint, meaningful alt text on the request-sheet illustrative image and the sector thumbnails (the visible "Illustrative" note and product names stay), and the type table in `docs/BRAND-GUIDE.md` (plain `h1` and `h2` are Source Serif 4, weight 600).

## Sources

The brand guide was read in full from `/cursor/stores/bot/bluepoint/BRAND-GUIDE-2026-11-14.md` (Ben Mishkin, Nov 14, 2026). An updated copy that matches the post-cleanup CSS is `docs/BRAND-GUIDE.md`. This audit uses that updated copy as the authority for color.

The photography guide (`https://claude.ai/artifact/AwDrevrrtuGSZ5SSWw7Q5m`) was not readable. The public artifact URL returns a Claude shell with no guide text, and the file was not supplied. Photography findings below are from the checklist, the brand guide, and the code. Nothing in this file is a quotation from that photography guide.

`docs/BRAND.md` is the older strategy draft. Where it still names Bluepoint Blue and Oven Orange as the primary system, the Nov 14 brand guide wins.

Hexes the guide documents are approved, including values the checklist called retired: `#2035e8`, `#f66631`, `#d1a751`, and the extended neutrals `#3a342c`, `#5c564e`, `#c9bfae`, `#e4d8c4`, `#e0d4bf`, `#d4cbbd`, `#d9c9a8`, `#f3eadc`, plus `#f9f3eb`, `#fffaf4`, `#3c4ba6`, and `#aaa`. A checklist miss on those is not a violation.

Marks are one checklist section per file. ✅ meets the guide or the checklist. ⚠️ is a deliberate later rule, dead code, an undocumented near-palette, or a guide row that still disagrees with computed CSS. ❌ is a live miss of a guide rule the guide does not approve.

## Files that do not exist

Every listed path exists: `app/brand.css`, `components/routeMap.module.css`, the components under `components/`, `app/page.tsx`, `app/about/page.tsx`, `app/breads/page.tsx`, `app/community/page.tsx`, `app/contact/page.tsx`, `app/delivery/page.tsx`, `app/faq/page.tsx`, `app/pastries/page.tsx`, `app/wholesale/page.tsx`, `data/photos.ts`, `data/usePhotos.ts`, `app/fonts.ts`, `app/layout.tsx`.

Also present and reviewed because they render: `app/not-found.tsx`, `app/sectors/[slug]/page.tsx`, `app/globals.css`, `app/contact/contact.module.css`, `app/faq/faq.module.css`, `app/community/community.module.css`, `data/illustrative.ts`.

## Measured type and contrast

Rendered in Chrome at 1440 and 390, after fonts loaded.

| Text | Family | Weight | Size | Color | Background |
| --- | --- | --- | --- | --- | --- |
| Home hero `h1` | Source Serif 4 | 600 | 52.56px / 25.35px | `#0b2b51` | `#f9f3eb` |
| Delivery `h1` (plain `h1`) | Source Serif 4 | 600 | 86.4px / 48px | `#0d0d25` | `#f6f1e8` |
| Breads, wholesale `h1` (`.ticket-hero h1`) | Libre Franklin | 700 | 54.4px / 28–33.6px | `#0d0d25` | `#f6f1e8` |
| FAQ `h1` | Libre Franklin | 700 | 54.4px / 34.4px | `#0b2b51` | `#f6f1e8` |
| Home and delivery `h2` | Source Serif 4 | 600 | 33.6px / 25.6px | `#0d0d25` or cream on the ordering guide | section background |
| Catalog `.group-photo h2` | Libre Franklin | 800 | 38.4px / 24.8px | `#102e50` | `#f7f0e6` |
| `.section-intro .eyebrow` | Libre Franklin | 600 | 13.12px, `0.08em`, uppercase | `#6f4b0e` | see below |
| Delivery `.kicker` | Libre Franklin | 600 | 12.8px, `0.04em`, not uppercase | `#6f4b0e` | `#f6f1e8` |
| `.atlas-card .kicker` | Libre Franklin | 600 | 12.8px | `#2035e8` | `#ffffff` |
| Home `.hero-kicker` | Libre Franklin | 800 | 12.96px / 11.04px, uppercase | `#73530c` | `#f9f3eb` |
| Footer `.kicker` | Libre Franklin | 600 | 12px, `0.14em`, uppercase | `#f6f1e8` | `#0d0d25` |
| `.cloth-edge` | — | — | height 6px | background `#8a5a12` | — |

`#6f4b0e` contrast, weight 600, under 18.67px, so the AA bar is 4.5:1. All pass.

| Background | Where it is used | Ratio | AA |
| --- | --- | --- | --- |
| `#f6f1e8` cream | Delivery kicker, making eyebrow, featured-spec eyebrow | 6.94:1 | Pass |
| `#f5f0e7` | Assortment eyebrow | 6.88:1 | Pass |
| `#eae8e3` | Buyer-proof eyebrow | 6.38:1 | Pass |
| `#ffffff` | Not observed under `#6f4b0e` | 7.81:1 | Pass if used |

`.fact-label` is not in the markup. No rendered fact label to measure.

Ordering guide on `#0d0d25`:

| Element | Color | Size / weight | Ratio | AA |
| --- | --- | --- | --- | --- |
| Eyebrow | `#e5e2ee` (not `#e4c27a`) | 13.12px / 600 | 14.93:1 | Pass |
| Intro paragraph | `#e5e2ee` | 18px / 400 | 14.93:1 | Pass |
| `h2` | `#f6f1e8` | 33.6px / 600 | 16.95:1 | Pass |
| `h3` | `#f6f1e8` | 18.4px / 600 | 16.95:1 | Pass |
| Step body | `#edeaf4` | 15.2px / 400 | 16.05:1 | Pass |
| Step number | `#e4c27a` | 32px / 700 | 11.16:1 | Pass |
| Step link | `#f6f1e8` | 18px / 700 | 16.95:1 | Pass |

The eyebrow is a `p` inside `.section-intro`. `.ordering-guide .section-intro p` (`app/brand.css` around the ordering-guide block) outranks `.ordering-guide .eyebrow { color: #e4c27a }`.

Other pairs: hero kicker `#73530c` on `#f9f3eb` is 6.41:1 (pass). Atlas kicker `#2035e8` on white is 7.68:1 (pass). Cream `#f6f1e8` on ink is 16.95:1. White on ink is 19.07:1.

## app/brand.css

### 1 Color

⚠️ Guide colors are used, and so are many hexes the guide does not name (`#f5f0e7`, `#eae8e3`, `#f7f0e6`, `#73530c`, `#e5e2ee`, `#edeaf4`, `#102e50`, and others). Treat the unnamed warm neutrals as later section colors, not as a new palette. `#2035e8` and `#f66631` remain. Classification is in the grep section of the PR notes. Live blue that the updated guide allows: `.atlas-card .kicker` (`app/brand.css` grouped with `.route-caveat`). Live orange borders: `.why-card` (`border-top: 8px solid #f66631`), `.proof-quote`, `.community-page .partner-card`, `.delivery-page .serve-list li`.

### 2 Typography

⚠️ The later `h1, h2` rule sets Source Serif 4 weight 600 and wins for the hero, plain `h2`, and the delivery `h1`. `.ticket-hero h1` stays Franklin weight 700 because that selector is more specific. Catalog `.group-photo h2` stays Franklin weight 800. `h3` stays Franklin. Body is Source Serif 4 at `1.125rem` / `1.65` (`app/brand.css` `body`). `font-display: swap` is in `app/fonts.ts`, not this file. Base `.kicker, .eyebrow` is `letter-spacing: 0.04em` and `text-transform: none`, not uppercase. `.section-intro .eyebrow` is uppercase at `0.08em`. Footer kickers are uppercase at `0.14em`. Hero tracking that wins is `-0.035em` on `.seamless-hero h1`, not `-0.037em`.

### 3 Spacing

⚠️ Base `.shell` is `min(1200px, calc(100% - 2.5rem))` (`app/brand.css` `.shell`). At `max-width: 767px` it becomes `min(1160px, calc(100% - 1.5rem))`, which the guide documents. `.block` is `padding: 3.25rem 0`. `.bake-grid` gap is `1.5rem 1.25rem`. Proof borders of `1px solid #e4d8c4` are used. The rendered home hero is `.seamless-hero.approved-hero.hero`: `min-height: clamp(650px, 50vw, 780px)`, then `min-height: 0` from 1024px up. The early `.hero { min-height: calc(100vh - 6.5rem) }` does not paint the current hero.

### 4 Components

✅ `.btn` radius is 4px. The approved `.btn-primary` / `.btn-secondary` pair is navy `#0b2b51`, white text, hover `#071a33`. `.bake-frame` is `aspect-ratio: 1`. `.framed-photo` background is `#f6f1e8`. Winning focus is `outline: 3px solid #0b2b51; outline-offset: 3px`, with `#e4c27a` on footer, mobile menu, and ordering guide. ⚠️ An earlier focus rule still says `#2035e8` and `outline-offset: 2px`. It loses to the later rule of equal specificity. Globals `.btn` supplies `min-height: 44px`. This file does not remove it.

### 5 Nav and footer

✅ Active link is `box-shadow: inset 0 -3px 0 #8a5a12`. Footer background is `#0d0d25`. Footer mark is 56×56. Mobile menu background is `#0d0d25` with `transition: opacity 180ms ease`. Dark focus is `#e4c27a`. ⚠️ The guide still says nav hover is `#2035e8`. The rule that wins is `.site-header .nav-link:hover { color: #0b2b51 }`. Header bakery color `#3c4ba6` is in the guide.

### 6 Photography

⚠️ Two label classes: `.illustrative-label` and `.illustrative-note`. Both are Franklin on a warm cream chip. The label class does not say the word "Illustrative" by itself. The pages do.

### 7 Voice

✅ This file has no marketing copy.

### 8 Motion

⚠️ `.reveal`, `.marquee-track`, and `.kenburns` are `animation: none !important`. Reduced motion sets `transition: none !important` on `.mobile-menu`, `.btn`, `.nav-link`, and `a`, plus separate blocks for assortment cards, making photos, the request sheet, and hero buttons. It is not one rule for every transition. Hover scale on `.hero .hero-board img` is inside `prefers-reduced-motion: no-preference`. No parallax or carousel.

### 9 Accessibility

✅ Winning focus ring and the measured text pairs pass AA. ⚠️ `.menu-toggle` is `min-height: 36px` inside `max-width: 767px`, and a later `max-width: 1023px` rule sets 44px. At phone width both match, so 44px wins. The 36px declaration is dead there.

### 10 Dark surfaces

✅ Footer, mobile menu, and ordering guide use cream or light gold on ink, not white body text on blue. ⚠️ Ordering-guide eyebrow paints `#e5e2ee`, which the guide does not name. Contrast passes.

## app/globals.css

Loaded before `brand.css`. Not in the original file list. Included because it still paints anything `brand.css` does not override.

### 1 Color

⚠️ Early `.btn-secondary` is still Oven Orange here, and `.kicker` is still `#2035e8`. `brand.css` wins for both. `.cloth-edge` here is still the blue/white checker. The single `brand.css` rule wins (`height: 6px; background: #8a5a12`). Dead for the rendered site.

### 2–10

⚠️ `.shell` here is `min(1160px, calc(100% - 2.25rem))`. `brand.css` replaces it. `.btn` `min-height: 44px` is live and useful. Other sections inherit or are overridden. No second violation beyond the dead legacy layer.

## app/fonts.ts

### 2 Typography

✅ Libre Franklin 500/600/700 and Source Serif 4 400/600, both `display: "swap"`. No other family is loaded. The comment no longer narrates an older `BRAND.md` note.

### Other sections

✅ No color, spacing, components, photos, voice, motion, or dark surfaces.

## app/layout.tsx

### 7 Voice / chrome

✅ Demo ribbon uses `DISCLAIMER`. `robots` is `noindex, nofollow`, and a `<meta name="robots" content="noindex,nofollow" />` is in `<head>`.

### 9 Accessibility

✅ Skip link, `<html lang="en">`, `<main id="main">`.

### Other sections

✅ No local palette. Fonts are applied as CSS variables.

## app/page.tsx

### 2 Typography

✅ One `h1` (hero, serif 600). Section `h2`s follow. Eyebrows are Franklin.

### 6 Photography

✅ Hero uses `<picture>` with AVIF and WebP (`app/page.tsx` hero figure) and `figcaption.illustrative-note` "Illustrative image". ⚠️ The class is `.illustrative-note`, not `.illustrative-label`. Colorado Proud is a real mark via `next/image`, not a picture element.

### 7 Voice

✅ No exclamation marks in headlines. Observations only: headlines are concrete ("Fresh, Scratch-Baked Breads, Rolls & Pastries", "What are you making?"). Copy was not edited.

### Other sections

✅ Ordering guide is the dark band. No local color. Customer-photo notes live in the child cards.

## app/about/page.tsx

✅ `PageHero` title, one story `h2`, Willie portrait with `WILLIE_CAPTION`, gallery alts from `photos.ts`. No illustrative label on the portrait (it is a real photo). ✅ noindex in metadata. ⚠️ Page title renders Franklin 700 because it is `.ticket-hero h1`.

## app/breads/page.tsx and app/pastries/page.tsx

✅ `PageHero` plus `ProductBrowser`. ✅ noindex. ⚠️ Titles are Franklin 700 (`.ticket-hero h1`). Catalog group titles are Franklin 800. Illustrative product frames are labeled in `ProductBrowser`.

## app/community/page.tsx and app/community/community.module.css

### 1 Color

❌ `community.module.css` `.eyebrow` is `#2035e8` (line 12). That is an eyebrow, and the guide's canonical eyebrow color is `#6f4b0e`. More `#2035e8` accents: lines 132, 136, 167, 192, 233, 301, 336. `#73530c` appears as a gold-like accent the guide does not name (warning).

### 2 Typography

⚠️ `.introTitle` is Libre Franklin weight 700. It outranks the element `h1` serif rule. Partner `h2`s follow the page `h1`.

### 6 Photography

✅ Partner logos use their alts. No illustrative label on nonprofit marks.

### 7 Voice

✅ No exclamation in the `h1` or `h2`s. Copy was not edited.

### 9 Accessibility

⚠️ Focus and link colors in the module use `#2035e8` rather than the guide's navy focus ring.

## app/contact/page.tsx and app/contact/contact.module.css

### 1 Color

❌ Live `#2035e8` on focus (`contact.module.css` line 16), borders, and filled controls (lines 93, 104, 112, 233, 235). The guide's focus ring and primary buttons are navy `#0b2b51`.

### 2 Typography

⚠️ `.page :is(h1, h2, h3)` is Libre Franklin weight 700. The `h1` is not the serif display rule.

### 7 Voice

✅ "Let's talk bakery." has no exclamation mark. Not edited.

### 9 Accessibility

❌ Focus outline is `#2035e8`, not `#0b2b51`.

## app/delivery/page.tsx

✅ Kicker "Delivery area" is `#6f4b0e` on cream (6.94:1). Plain `h1` is Source Serif 4 weight 600. Truck photo is a real photograph with `DELIVERY_TRUCK_CAPTION`, not an illustrative label. ✅ noindex. ⚠️ `.atlas-card .kicker` "On the route" is `#2035e8` on white. The updated guide allows that accent. Serve-list cards use a live `#f66631` left border (`app/brand.css`).

## app/faq/page.tsx and app/faq/faq.module.css

### 1 Color

❌ `.summary:focus-visible` is `outline: 3px solid #2035e8` (`faq.module.css` line 91). Marker color is `#2035e8` (line 112).

### 2 Typography

⚠️ `.hero h1` is Libre Franklin weight 700. The "Lead times" `h2` is Franklin. Questions are `<summary>` text, not extra heading levels. One `h1`.

### 9 Accessibility

❌ Focus ring color. The 3px width and offset match the guide. The color does not. Summary min-height is 3.25rem (52px), so the hit target is at least 44px.

## app/wholesale/page.tsx

✅ `PageHero` plus the request flow. ✅ noindex. ⚠️ Title is Franklin 700. Step `h2`s are serif 600. Illustrative thumbs are in `WholesaleRequest` / `RequestSheet`.

## app/not-found.tsx

✅ One `h1.section-title`. Kicker "Demo". ⚠️ The `h1` stays Franklin because `.section-title` outranks the element serif rule.

## app/sectors/[slug]/page.tsx

✅ Category thumbnails use the photo registry alt (`app/sectors/[slug]/page.tsx`). The visible product name stays in the link. ⚠️ Related links use the live `#2035e8` chip in `app/brand.css` (`.sector-related li a`).

## app/robots.ts, app/sitemap.ts, app/template.tsx

✅ No visual system. `robots.ts` stays noindex. Not scored as design sections.

## components/Header.tsx

✅ Franklin nav, `aria-expanded`, `aria-controls`, `aria-current` is applied by the nav links. Mobile menu kicker is cream on ink when open. ✅ `hidden` when closed. ⚠️ Globals `.mobile-menu` uses opacity and `pointer-events` rather than relying on `hidden` alone. Author CSS does not set `display`, so the `hidden` attribute still applies `display: none` from the user agent unless a later author `display` wins. Computed `display` on the closed menu kicker was `block` in one capture, with the menu's opacity at 0 when closed. Worth a look, not a restyle in this pass.

## components/Footer.tsx

✅ `cloth-edge`, ink footer, 56×56 mark, cream kickers, Colorado Proud alt. No second cloth pattern.

## components/FramedImage.tsx

✅ `<picture>` with AVIF source and WebP `Image`. Props are `webp`, `avif`, `alt`, `width`, `height`, `sizes`, optional `label`. Label renders `.illustrative-label`. Cream frame comes from CSS.

## components/MakingCards.tsx

✅ Dinner card uses `FramedImage` with `label="Illustrative image"`. Plated cards show `credit` and `PERMISSION_NOTE`. Burgers, sandwiches, and breakfast are not labeled illustrative.

## components/CafePull.tsx

✅ Illustrative label only when `aiLabel` is set. Permission note is on the plated photo.

## components/ProductBrowser.tsx

✅ Illustrative catalog shots use `FramedImage` with `label="Illustrative image"`. Real category photos use `next/image` and are not labeled illustrative.

## components/RequestSheet.tsx

✅ Illustrative thumbs use `visual.alt` (it begins with "Illustrative image of"). The visible `request-thumb-note` still says "Illustrative". ⚠️ That note is not the shared `.illustrative-label` class. The product name stays in the adjacent `h3`.

## components/PageHero.tsx

✅ Kicker plus one `h1`. The kicker is `display: none` via `.ticket-hero > div > .kicker`, so those kickers do not paint. Photos use `next/image` with the registry alt.

## components/RouteMap.tsx and components/routeMap.module.css

✅ Tooltip background is ink at 0.96 alpha, text white. ⚠️ Tooltip secondary text is `#f2e7d4` (`routeMap.module.css` line 36), which the guide does not name. It is light on ink, so contrast is in the same band as cream on ink. `RouteMap.tsx` still has one `#2035e8` (route stroke). The guide allows blue on map routes.

## components/AssortmentCards.tsx, BuyerProof.tsx, FeaturedMention.tsx, FeaturedProductSpec.tsx, WhyBluepoint.tsx

✅ Eyebrows render `#6f4b0e` at 13.12px / 600. `h2`s are serif 600. Featured spec facts are `dt`/`dd`, not `.fact-label`. Buyer-proof tabs that are selected resolve to `#6f4b0e` (the later rule beats the earlier `#2035e8`).

## components/WholesaleRequest.tsx

✅ Step `h2`s, Franklin buttons, no local palette. Illustrative product art is delegated to framed images and the request sheet.

## components/Notice.tsx, QuickActions.tsx, CallSheet.tsx, DeliveryChecker.tsx, HeroBenefits.tsx, PublishedProof.tsx, Reveal.tsx, Marquee.tsx, Mark.tsx, JsonLd.tsx

✅ No local hex. `Marquee` is a static proof line. CSS forces `.marquee-track { animation: none !important }`. `Reveal` is forced visible with no animation. `Notice` is a dialog with a labeled title, not an auto-opening ticker. Buttons use `.btn` / `.btn-primary` / `.btn-ghost`.

## data/photos.ts

✅ 25 `src` paths, zero missing files under `public`. Alts are concrete. Truck and Willie entries are marked as real photographs in comments and captions. ⚠️ `public/images` has many files that are not in this registry. Illustrative files are registered in `data/illustrative.ts` instead. A basename scan found brand and customer files that no source string names (`/images/brand/hero-desktop.jpg`, `/images/customers/cafe-180.png`, and others). Those are orphan files on disk, not missing registry entries.

## data/usePhotos.ts

✅ All three entries have `credit`. Files exist, including the unused `west-main-reuben.jpg` the comment describes. `PERMISSION_NOTE` is the customer-photo permission line, and `MakingCards` / `CafePull` render it.

## data/illustrative.ts

Not in the original list. Reviewed because photography depends on it. ✅ Every shot sets `illustrative: true` and an alt that starts with "Illustrative image of". AVIF and WebP paths are paired. Consumers that show these shots pass a visible "Illustrative" label.

## Checklist cross-check

1. Color. Guide hexes are approved. ❌ live non-navy focus and the community eyebrow in the page modules. ⚠️ undocumented neutrals and live orange borders the guide still allows as heritage orange.
2. Typography. ✅ The guide type table now matches computed CSS: a plain `h1` or `h2` is Source Serif 4 weight 600. `.ticket-hero h1` and the page-module titles stay Franklin. `h3`, nav, buttons, kickers, and eyebrows are Franklin. Body is serif `1.125rem` / `1.65`. `font-display: swap`.
3. Spacing. ⚠️ Shell, section padding, and bake-grid gap match the base rules. The rendered hero does not use `calc(100vh - 6.5rem)`.
4. Components. ✅ Navy buttons, 4px radius, square bake frame, framed photos on cream, winning focus ring. ❌ module focus rings.
5. Nav and footer. ✅ Lockup, Franklin nav, gold active indicator, ink footer, 56×56 mark, ink mobile menu, 180ms opacity, gold focus on dark. ⚠️ Guide hover color is stale.
6. Photography. ✅ Illustrative shots that render carry an "Illustrative" label. Real truck, portrait, and plated photos are not labeled illustrative. Plated photos carry the permission note. ⚠️ Not every image is AVIF+WebP in a `<picture>`. ⚠️ `.illustrative-note` duplicates `.illustrative-label`.
7. Voice. ✅ No headline exclamation marks on the pages reviewed. Observations only. Copy was not changed.
8. Motion. ✅ No parallax, scroll-triggered gallery, or carousel. Marquee animation is forced off. ⚠️ Reduced motion is a set of selectors, not every transition in one rule.
9. Accessibility. Measured text pairs pass AA. ❌ contact and FAQ focus color. ⚠️ empty alts on decorative-in-a-named-link images. Heading order on the reviewed pages is `h1` then `h2` then `h3` without a skip. Buttons use the 44px `.btn` minimum.
10. Dark surfaces. ✅ Footer, mobile menu, and ordering guide are cream or gold on ink. No white body text on blue. ⚠️ Ordering eyebrow is `#e5e2ee`, not `#e4c27a`.

## Summary counts

Counts are the marks in the file-by-file sections above. The legend and the cross-check are not counted again.

| | Count |
| --- | --- |
| ✅ Pass | 42 |
| ⚠️ Warning | 27 |
| ❌ Violation | 5 |

The five violation marks are three problems: the community eyebrow (`community.module.css:12`), the contact module's blue focus and controls (marked under color and again under accessibility), and the FAQ summary focus ring (marked the same way). Community blue links are called out in that color section. They are not a fourth page.

## Priority

Accessibility first, then visual consistency, then dead code.

1. Contact and FAQ focus rings paint `#2035e8` (`contact.module.css:16`, `faq.module.css:91`). Visual change to move them to `#0b2b51` / `#e4c27a`.
2. Community eyebrow is `#2035e8` (`community.module.css:12`). Visual change to use `#6f4b0e`.
3. Ordering-guide eyebrow paints `#e5e2ee` because a `p` rule beats `.eyebrow`. Contrast already passes. Changing it to `#e4c27a` is a visual change.
4. Request-sheet illustrative alt text is resolved. The visible "Illustrative" note was kept.
5. Sector thumbnail alt text is resolved. The visible product name was kept.
6. Live `#f66631` card borders (why cards, proof quotes, community partners, delivery list). Removing them is a visual change. The guide still allows Oven Orange as heritage.
7. `.atlas-card .kicker` stays `#2035e8`. The updated guide allows it. Recoloring it is a design decision and a visual change.
8. Home `.hero-kicker` is `#73530c`, not `#6f4b0e`. Visual change to recolor.
9. Dead early `#2035e8` / `#f66631` declarations that lose at every breakpoint were removed from `app/brand.css` and `app/globals.css`, including the globals `.kicker` color, the globals `.cloth-edge` checker, and the early orange `.btn-secondary` rules. Declarations that still win were kept.
10. The guide type table now says plain `h1` and `h2` are Source Serif 4 weight 600.

## Next steps

### Quick fixes (no visual change)

- The dead cascade colors listed here were removed. What remains of `#2035e8` and `#f66631` in `app/brand.css` and `app/globals.css` still wins for its selector, or is an unreferenced custom property.
- Point the brand guide's type scale and nav-hover row at the computed CSS.
- Give the request thumb a real `alt` and keep the visible "Illustrative" label.
- Leave `.order-band` deleted. It has no markup.

### Needs a design decision (these change how the site looks)

- Recolor contact, FAQ, and community blue focus, links, and eyebrows to navy or kicker gold.
- Decide whether `.atlas-card .kicker` and sector chips stay Bluepoint Blue.
- Decide whether Oven Orange borders stay.
- Decide whether the ordering-guide eyebrow should actually be `#e4c27a`.
- Decide whether page titles in `.ticket-hero` should become Source Serif 4. That is a visual change. Do not do it as a cleanup.
- Decide whether `.btn-secondary` should ever look different from `.btn-primary`. It is navy on purpose today.
- The photography guide is still unavailable. Do not restyle photos from guesswork.
