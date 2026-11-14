# Bluepoint Bakery — Brand Guide

Nov 14, 2026 · @Ben Mishkin

Canonical reference for the Bluepoint Bakery visual system. Every value here comes from the deployed `brand.css` and `fonts.ts`. When the CSS and this guide disagree, the CSS wins — update this guide.

Post-cleanup copy, Nov 14, 2026. The secondary button class is `.btn-secondary` (it paints navy, same as `.btn-primary`). `.order-band` is removed. Kicker gold `#6f4b0e` is the canonical color on `.kicker` and `.eyebrow`. `app/brand.css` has one `.cloth-edge` rule.

## Color System

The deployed palette has two layers. The original brand strategy defined Bluepoint Blue (`#2035e8`) and Oven Orange (`#f66631`). The later approved direction overrides primary buttons, links, and kickers to a navy/gold scheme. Both colors still occur in `brand.css`. Later rules win where they target the same element. The ordering band class is gone, and the base kicker color is no longer blue.

### Core palette

| Role | Hex | CSS usage | Notes |
| --- | --- | --- | --- |
| Ink | `#0d0d25` | `body { color }`, footer `background`, dark sections | Near-black with a blue undertone. The primary text color |
| Navy | `#0b2b51` | `.btn-primary`, `.btn-secondary`, links `a { color }`, hero `h1`, focus outlines | The approved primary. Replaced Bluepoint Blue on interactive elements |
| Navy hover | `#071a33` | `.btn-primary:hover`, `.btn-secondary:hover` | Darker navy for hover states |
| Bluepoint Blue | `#2035e8` | Legacy selectors that a later navy or gold rule does not cover: `.atlas-card .kicker`, route and sector accents, some borders | Not the ordering band (that class is removed). Not the canonical `.kicker` / `.eyebrow` color |
| Oven Orange | `#f66631` | Early `.btn-secondary` declaration (overridden to navy) and a handful of decorative borders. Not `.cloth-edge` | Largely replaced by navy and heritage gold. Not the painted secondary button |
| Gold | `#8a5a12` | The one `.cloth-edge` rule (`height: 6px`), `.nav-link[aria-current]` box-shadow, benefit icons | The approved accent replacing orange. Earlier checker and orange `.cloth-edge` rules are removed |
| Warm gold | `#e4c27a` | Footer links on hover, footer sub-text, dark-surface focus outlines | Light gold for dark backgrounds |
| Kicker gold | `#6f4b0e` | `.kicker`, `.eyebrow`, `.fact-label`, active tab borders | Canonical small-text accent. The early `color: #2035e8` on `.kicker, .eyebrow` is removed. Footer, mobile menu, and `.atlas-card .kicker` still use more specific colors |
| Crust Gold | `#d1a751` | Footer `.lockup-bakery`, heritage seal | The original BRAND.md gold. Used sparingly |
| Cream | `#f6f1e8` | `body { background }`, `.framed-photo` background, product photo background | The page background. Matches product photography |
| Warm cream | `#f9f3eb` | `.illustrative-label` background (`rgba` at 0.94 opacity), `.making-permission` | Slightly warmer for overlays |
| Card cream | `#fffaf4` | `.call-notice`, `.atlas-search`, `.route-day-card` | Off-white for elevated cards |
| White | `#ffffff` | `.steps li`, cards, forms, `.route-table` | Clean background for content containers |

### Extended neutrals

| Hex | Usage |
| --- | --- |
| `#3a342c` | Dark warm text (8 uses) |
| `#5c564e` | Muted text — assortment lines, secondary copy |
| `#c9bfae` | Map stage background |
| `#e4d8c4` | Borders — proof line, table rows, section dividers |
| `#e0d4bf` | Card borders — call notice, atlas search |
| `#d4cbbd` | Placeholder borders |
| `#d9c9a8` | Benefit divider lines |
| `#f3eadc` | Hero board background |

### Proportion guide

About 70% cream/white, 20% ink, 8% navy, 2% gold. Orange appears in heritage references only. Blue remains on legacy accent surfaces, not on an ordering band.

### Contrast notes

- Ink on cream (`#0d0d25` on `#f6f1e8`): passes WCAG AAA at all sizes
- Navy on cream (`#0b2b51` on `#f6f1e8`): passes WCAG AAA at all sizes
- Gold on cream (`#d1a751` on `#f6f1e8`): fails WCAG AA — never use for text. Restricted to decorative marks
- Kicker gold on cream (`#6f4b0e` on `#f6f1e8`): 6.94:1, passes WCAG AA at the rendered 12.8px and 13.12px weights of 600
- White on navy (`#fff` on `#0b2b51`): passes WCAG AAA
- Warm gold on ink (`#e4c27a` on `#0d0d25`): 11.16:1, passes WCAG AA at normal text, not only large text

## Typography

Two families, loaded locally from Fontsource via `next/font/local` in `app/fonts.ts`. No other typefaces.

### Libre Franklin (`--font-franklin`)

**Role**: Navigation, buttons, labels, kickers, eyebrows, chips, card labels, footer text, section titles, headings.

**Weights loaded**: 500 (Medium), 600 (SemiBold), 700 (Bold)

**Fallback stack**: `"Franklin Gothic Medium", "Arial Narrow", sans-serif` (some rules omit `"Arial Narrow"`)

**Rules**:

- `text-transform: none` and `letter-spacing: 0` on all heading and label selectors (the old all-caps treatment was removed)
- Exception: `.site-footer .kicker` uses `text-transform: uppercase; letter-spacing: 0.14em`
- Exception: `.kicker, .eyebrow` uses `letter-spacing: 0.04em`

### Source Serif 4 (`--font-serif`)

**Role**: Body text, story copy, pull quotes, hero display headlines (the approved direction uses the serif for the hero `h1`, not the sans).

**Weights loaded**: 400 (Regular), 600 (SemiBold)

**Fallback stack**: `"Source Serif 4", ui-serif, serif`

**Set on**: `body { font-family: var(--font-serif) }` at `1.125rem` / `1.65` line height

### Type scale (deployed values)

| Element | Size | Weight | Line height | Family |
| --- | --- | --- | --- | --- |
| Hero h1 (approved) | `2.75rem` (mobile) | 700 | 1.05 | Serif |
| Page h1 | `clamp(2.1rem, 4.5vw, 3.4rem)` | 700 | 1.15 | Franklin |
| h2 | `clamp(1.6rem, 3vw, 2.1rem)` | 700 | 1.2 | Franklin |
| h3 | `1.15rem` | 600 | implicit | Franklin |
| Product card h3 | `1.2rem` | 600 | 1.25 | Franklin |
| Body | `1.125rem` | 400 | 1.65 | Serif |
| Kicker / Eyebrow | `0.8rem` | 600 | implicit | Franklin |
| Button | `0.95rem` | 600 | implicit | Franklin |
| Footer kicker | `0.75rem` | 600 | implicit | Franklin |
| Illustrative label | `0.75rem` | 700 | 1.25 | Franklin |
| Pull quote | `clamp(1.55rem, 2.3vw, 2.15rem)` | 400 | 1.35 | Serif |
| Pull quote (small) | `clamp(1.35rem, 2vw, 1.7rem)` | 400 | 1.4 | Serif |
| Quote attribution | `0.8–0.85rem` | 600 | implicit | Franklin |

### Rule: serif for sentences, sans for things you scan

Anything a person reads as running prose (body paragraphs, pull quotes, story copy) is Source Serif 4. Anything a person scans to navigate or act (headings, nav links, buttons, labels, chips, metadata) is Libre Franklin. The approved hero is the one exception: a large serif headline reads as a warm, editorial statement rather than a navigation element.

## Spacing and Layout

### Shell (content width)

`.shell`: `width: min(1200px, calc(100% - 2.5rem))`

On mobile (`max-width: 767px`): `width: min(1160px, calc(100% - 1.5rem))`

The shell centers content with `auto` margins. No CSS custom property for the shell width — it's hardcoded.

### Breakpoints

| Breakpoint | Usage |
| --- | --- |
| `max-width: 520px` | Menu guide collapse to single column |
| `max-width: 767px` | Mobile layout: single-column grids, smaller header, hidden utility links |
| `min-width: 600px` | Hide narrow-only line breaks |
| `min-width: 768px` | Desktop `--inner-title-top` (3.25rem vs 2.75rem mobile) |
| `min-width: 800px` | Two-column inquiry grid |
| `min-width: 1024px` | Desktop nav, product grid 3-col, hero side-by-side |
| `min-width: 1100px` | Community grid 4-col |

### Section spacing

`.block`: `padding: 3.25rem 0` — the standard vertical rhythm for full-width sections.

`--inner-title-top`: `2.75rem` (mobile) / `3.25rem` (768px+) — distance from header to inner page title.

### Grid gaps (deployed values)

| Component | Gap |
| --- | --- |
| `.bake-grid` (category tiles) | `1.5rem 1.25rem` (2-col) |
| `.quote-columns` | `1.25rem` |
| `.quote-grid` | `1rem` |
| `.steps` | `1rem` |
| `.card-items` | varies by context |
| `.home-charity-grid` | `1.15rem 0.85rem` (2-col), `1.25rem 1rem` at 1100px+ (4-col) |
| `.product-grid` (mobile) | `0.85rem` |
| `.story-row`, `.split`, `.quote-feature` | `1.5–1.75rem` |

### Aspect ratios

| Element | Ratio | Notes |
| --- | --- | --- |
| `.bake-frame` (category tile photo) | `1 : 1` | Square |
| `.product-photo` | `4 : 3` | Product card photo area |
| `.making-photo` | `4 : 3` | Use photo (customer food) |
| `.cafe-pull-photo` | `4 : 3` | Cafe pull quote photo |
| `.quote-photo` | `1 : 1` | Quote card headshot |
| `.home-charity-media` | `4 : 3` | Community partner logos |

### Paragraph and heading margins

- `p`: `margin: 0 0 0.9rem`
- `h1`: `margin: 0 0 0.75rem`
- `h2`: `margin: 0 0 0.6rem`
- `h3`: `margin: 0 0 0.35rem`
- `.kicker, .eyebrow`: `margin: 0 0 0.5rem`

## Components

### Buttons

Base `.btn`: `font-family: var(--font-franklin); font-weight: 600; font-size: 0.95rem; border-radius: 4px; padding: 0.65rem 1.5rem; letter-spacing: 0.01em; transition: background 120ms ease, box-shadow 120ms ease`.

| Variant | Background | Text | Border | Hover |
| --- | --- | --- | --- | --- |
| `.btn-primary` | `#0b2b51` (navy) | `#fff` | navy | `#071a33` |
| `.btn-secondary` | `#0b2b51` (navy) | `#fff` | navy | `#071a33` |
| `.btn-ghost` | transparent | `#0d0d25` | `1px solid #0d0d25` | `background: #0d0d25; color: #fff` |

Note: `.btn-secondary` still has an early Oven Orange declaration. The approved rule overrides it to navy, so it paints the same as `.btn-primary`. It is not an outlined variant.

### Cards and frames

`.bake-card`: Product category tile. Contains `.bake-frame` (square photo, `aspect-ratio: 1`) and `.bake-info` (name + description below).

`.product-photo`: `aspect-ratio: 4/3; overflow: hidden; background: #f6f1e8` — the cream background shows while the image loads or as the product cutout base.

`.framed-photo`: `position: relative; display: block; width: 100%; height: 100%; background: #f6f1e8` — wrapper for photos that carry an illustrative label.

`.illustrative-label`: `position: absolute; left: 0.45rem; bottom: 0.45rem; font-size: 0.75rem; font-weight: 700; font-family: var(--font-franklin); background: rgba(249,243,235,0.94); padding: 0.15rem 0.45rem; border-radius: 3px` — marks AI-generated imagery.

### Proof and trust elements

`.proof-line`: Horizontal rule with `border-color: #e4d8c4` (crust gold tint) — used to separate trust/proof content.

`.buyer-proof`: Social proof strip. Franklin, small caps feel.

`.fact-label`: `font-weight: 700; font-family: var(--font-franklin); color: #6f4b0e` (kicker gold) — labels for proof statistics.

### Kicker / eyebrow

`.kicker, .eyebrow`: `font-size: 0.8rem; font-weight: 600; letter-spacing: 0.04em; font-family: var(--font-franklin); color: #6f4b0e`. Kicker gold is canonical. The early blue color declaration is removed. Footer and mobile-menu kickers are cream; `.atlas-card .kicker` stays Bluepoint Blue. `.section-intro .eyebrow` uppercases and sets `letter-spacing: 0.08em`. The base rule itself is `text-transform: none`.

### Surfaces

| Surface | Background | Text color | Usage |
| --- | --- | --- | --- |
| Page body | `#f6f1e8` (cream) | `#0d0d25` (ink) | Default |
| Card cream | `#f9f3eb` | ink | Card interiors |
| Ordering guide | `#0d0d25` (ink) | `#f6f1e8` (cream) | `.ordering-guide`. The old `.order-band` is removed |
| Footer | `#0d0d25` (ink) | `#fff` | Site footer |
| Mobile menu | `#0d0d25` (ink) | `#fff` | Overlay nav |
| Route table | `#fff` | ink | Data table |
| Warm cream | `#fffaf4` | ink | Subtle card backgrounds |

## Navigation and Footer

### Header

Desktop (`min-width: 1024px`): horizontal nav bar with lockup left, nav links center, utility links right.

Mobile (`max-width: 1023px`): hamburger menu, overlay panel with `background: #0d0d25; transition: opacity 180ms ease`.

**Lockup**: Mark (square logo) + text stack ("BLUEPOINT" name + "BAKERY" descriptor).

- Desktop: mark `36×36px`, name `1.02rem`, bakery descriptor `0.58rem; color: #3c4ba6`
- Mobile header: mark `40×40px`, min-height `60px`

**Nav links**: `font-family: var(--font-franklin); font-weight: 600; font-size: 0.88rem; letter-spacing: 0.02em; text-transform: uppercase`.

Active page indicator: `box-shadow: inset 0 -3px 0 #8a5a12` (warm gold underline).

Hover: `color: #2035e8` (Bluepoint Blue).

### Cloth edge

A thin decorative band above the footer: one rule in `app/brand.css`, `height: 6px; background: #8a5a12`. The earlier checkerboard rule and the solid orange rule are removed. Do not add a second `.cloth-edge`.

### Footer

`background: #0d0d25` (ink), `color: #fff`.

Footer lockup: mark `56×56px` (larger than header).

Layout: lockup and tagline left, nav columns right (desktop); stacked on mobile.

Links inherit white; `:focus-visible { outline-color: #e4c27a }` (crust gold on dark).

Bottom line: copyright, fine print. `font-size: 0.82rem; color: #aaa`.

### Hero

`min-height: calc(100vh - 6.5rem)` — fills the viewport minus the header.

Hero headline: `font-family: var(--font-serif); font-size: 2.75rem; font-weight: 600; line-height: 1.05; color: #0b2b51` (navy). This is the one place Source Serif 4 appears at display scale — everywhere else, headings use Franklin.

Hero body: Source Serif 4 at body size.

Hero CTA: `.btn-primary` (navy button).

Desktop (`min-width: 1024px`): two-column layout, text left, photo right. Mobile: stacked, text first.

## Voice and Tone

### Brand personality

Bluepoint speaks as a steady, warm, plain-spoken head baker — someone who knows their craft and respects yours. The voice is confident without boasting, warm without being cutesy, and direct without being curt.

### Voice principles

**Plain-spoken.** Short sentences, concrete nouns, active verbs. Say "we bake" not "our baking process leverages." Prefer one-syllable words when they'll do.

**Warm but not sweet.** Friendly, never saccharine. No exclamation marks in body copy. One per page maximum in a CTA, if earned.

**Craft-proud.** Talk about the work — the sourdough schedule, the butter ratio, the oven timing. Specifics build trust better than adjectives.

**Respectful of the buyer.** These are wholesale and café buyers, not impulse consumers. They care about consistency, delivery windows, and margin. Speak to their business, not just their palate.

### Copy patterns

| Element | Pattern | Example |
| --- | --- | --- |
| Headlines | Short, declarative, no articles | "Bread worth the drive" |
| Kickers | Two to four words, uppercase | "BAKED DAILY" |
| Body paragraphs | Two to three sentences max | — |
| CTAs | Verb-first, specific | "See the menu" not "Learn more" |
| Product names | Proper case, no trademark symbols | Bluepoint Sourdough |

### Words we use

bake, craft, dough, oven, crust, loaf, hearth, batch, daily, fresh, local, route, deliver, partner, wholesale

### Words we avoid

artisanal (overused), hand-crafted (vague), passion (tell, don't claim), journey (not a bakery word), curated, elevated, experience, leverage, utilize, synergy

## Logo and Heritage Marks

### The lockup

The Bluepoint lockup is a horizontal pairing: the **mark** (a square containing the heritage B) sits left of a **text stack** ("BLUEPOINT" over "BAKERY").

| Context | Mark size | Name size | Bakery size | Bakery color |
| --- | --- | --- | --- | --- |
| Header (desktop) | `36×36px` | `1.02rem` | `0.58rem` | `#3c4ba6` |
| Header (mobile) | `40×40px` | — | — | — |
| Footer | `56×56px` | — | — | — |

The mark scales in three fixed sizes — it is never stretched, rotated, or used without the text stack in the header or footer.

### Mark specifications

The mark is rendered as an inline SVG component (`Mark.tsx`). It uses the heritage B letterform inside a square with rounded corners. Fill color adapts to context: ink on cream, white on dark surfaces.

### Clear space

Minimum clear space around the lockup equals the width of the mark on all sides. No other element should crowd the lockup.

### Usage rules

- Always pair mark + text stack in navigation contexts.
- The mark alone (without text) may appear as a favicon or app icon.
- Never place the lockup on a busy photographic background without a solid backing.
- The "BAKERY" descriptor uses the muted blue-violet (`#3c4ba6`) on cream surfaces; on dark surfaces it inherits white.

## Motion and Interaction

### Transition defaults

Buttons and links: `transition: background 120ms ease, box-shadow 120ms ease`.

Mobile menu overlay: `transition: opacity 180ms ease`.

Reveal animations (`.reveal`): `transition: opacity 0.5s ease, transform 0.5s ease` with a slight upward translate on entry.

### Timing principles

- **Fast** (80–120ms): hover states, focus rings, color changes. Immediate feedback.
- **Medium** (150–200ms): menu open/close, panel slides. Perceptible but brisk.
- **Slow** (400–600ms): scroll-triggered reveals, page section entrances. Gentle, never sluggish.

Easing: `ease` for most transitions. No bouncing, springing, or elastic effects — the bakery is steady, not playful.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` disables transitions on: mobile menu, buttons, nav links, anchors, and any element with a transition. Rule: `transition: none !important`.

Reveal animations should also respect this preference by removing the transform and showing content in its final state immediately.

### Scroll behavior

`html { scroll-behavior: smooth }` for anchor links. Disabled under reduced-motion.

### Hover and focus states

| Element | Hover | Focus |
| --- | --- | --- |
| `.btn-primary` | `background: #071a33` | `outline: 3px solid #0b2b51; outline-offset: 3px` |
| `.btn-ghost` | `background: #0d0d25; color: #fff` | same outline |
| Nav links | `color: #2035e8` | same outline |
| Footer links | inherit | `outline-color: #e4c27a` (gold on dark) |
| Text links | `color: #0b2b51` | same outline |

## Accessibility

### Target standard

WCAG 2.1 AA across the entire site.

### Color contrast

| Pairing | Ratio | Rating | Notes |
| --- | --- | --- | --- |
| Ink `#0d0d25` on Cream `#f6f1e8` | \~15.5:1 | AAA | Body text |
| Navy `#0b2b51` on Cream `#f6f1e8` | \~10.5:1 | AAA | Links, headings |
| Kicker gold `#6f4b0e` on Cream `#f6f1e8` | 6.94:1 | AA | Kickers and eyebrows at 12.8px / 13.12px, weight 600 |
| White `#fff` on Ink `#0d0d25` | \~19:1 | AAA | Footer text |
| White `#fff` on Navy `#0b2b51` | \~11.5:1 | AAA | Primary buttons |
| Cream `#f6f1e8` on Ink `#0d0d25` | ~16.9:1 | AAA | Ordering guide and footer text. The blue order band is removed |

There is no `.order-band`. The dark ordering surface is `.ordering-guide` on ink. Cream and light gold on that ink pass AA at the sizes that render there.

### Focus indicators

All interactive elements: `outline: 3px solid #0b2b51; outline-offset: 3px`.

On dark surfaces (footer, mobile menu): `outline-color: #e4c27a` (crust gold).

Focus indicators must never be removed or hidden. The `outline-offset: 3px` ensures the ring doesn't overlap the element's visual boundary.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` applies `transition: none !important` to all animated elements. Scroll-triggered reveals show content in final position without animation.

### Semantic structure

- One `<h1>` per page (the hero headline or page title).
- Heading hierarchy follows visual hierarchy without skipping levels.
- Navigation uses `<nav>` with `aria-label`.
- Current page indicated by `aria-current="page"` on the active nav link.
- Interactive elements (buttons, links) have descriptive text or `aria-label`.
- Images carry `alt` text; decorative images use `alt=""`.
- The `.illustrative-label` on AI-generated photos also needs `aria-label` or equivalent so screen readers announce it.

### Touch targets

Minimum `44×44px` tap target for all interactive elements on mobile. Nav links, buttons, and menu items must meet this minimum.

### Font sizing

Base font size is `1.125rem` (18px) — generous for readability. Line height `1.65` provides comfortable reading measure. The site does not block user font scaling.

## Dark Surfaces

The site uses two dark surface contexts. Each inverts the color logic.

### Footer (`#0d0d25` ink)

| Element | Value |
| --- | --- |
| Background | `#0d0d25` |
| Primary text | `#fff` |
| Secondary text | `#aaa` |
| Links | inherit white |
| Focus ring | `#e4c27a` (crust gold) |
| Lockup mark | white fill, `56×56px` |
| Dividers | `rgba(255,255,255,0.15)` |

### Mobile menu overlay (`#0d0d25` ink)

| Element | Value |
| --- | --- |
| Background | `#0d0d25` |
| Text | `#fff` |
| Close button | white |
| Nav links | white, uppercase Franklin |
| Transition | `opacity 180ms ease` |

### Ordering guide (`#0d0d25` ink)

`.order-band` is removed. It is not in the markup. The buying-process band is `.ordering-guide`.

| Element | Value |
| --- | --- |
| Background | `#0d0d25` |
| Headings | `#f6f1e8` (cream), Source Serif 4 where the later `h2` rule wins |
| Eyebrow | The later gold rule sets `#e4c27a`, but the eyebrow is a `p` inside `.section-intro`, so `.ordering-guide .section-intro p` (`#e5e2ee`) wins |
| Step numbers | `#e4c27a` |
| Step body | `#edeaf4` |
| Focus ring | `#e4c27a` |

### Rules for new dark surfaces

1. Use ink (`#0d0d25`) or navy (`#0b2b51`) as the dark background — never pure black.
2. Primary text is always white (`#fff`).
3. Focus rings switch to crust gold (`#e4c27a`).
4. Avoid the kicker gold (`#6f4b0e`) on dark — it lacks contrast. Use crust gold (`#e4c27a`) instead.
5. Buttons on dark: use `.btn-ghost` with white/cream border, or invert `.btn-primary` to cream background with navy text.
6. Test all pairings to WCAG AA minimum (4.5:1 for normal text, 3:1 for large).
