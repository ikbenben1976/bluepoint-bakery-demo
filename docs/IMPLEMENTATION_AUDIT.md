# Bluepoint demo — implementation audit (3 November 2026)

This audit compares the agreed **Implement / Design Now** requirements against the repository, not a production acceptance test. The demo is not Bluepoint's official site. No backend integrations or sample offerings are authorized.

## Already implemented in main when audited

| Decision | Implementation inspected | Status |
|---|---|---|
| Wholesale first impression and assortment-led hero | `app/page.tsx` uses an image board with five product photographs and two conversion links | In code; visual quality requires browser review |
| Scratch baking, personal service, six-day delivery | Homepage value points, delivery and FAQ content | Implemented with route qualifications |
| Product discovery and application routes | `data/uses.ts`, `components/MakingCards.tsx`, `app/making/[slug]/page.tsx` | Implemented |
| Search, catalog filtering, product requests | `components/ProductBrowser.tsx` and `components/InquiryForm.tsx` | Implemented; interaction should be tested |
| Wholesale qualification form and non-sending preview | `components/InquiryForm.tsx` | Implemented; production sending intentionally disabled |
| Structured product presentation | Catalog and request components | Implemented with missing specifications identified, not fabricated |
| Sector-specific content and testimonials | `data/sectors.ts`, sector pages, and `data/site.ts` | Implemented |
| Founder and Willie Ramirez history | Homepage and About links to historical sources | Implemented, with current ownership deliberately unconfirmed |
| 2000 bakery award, community involvement | Homepage and Community | Implemented as dated historical recognition |
| Minority-owned text; Colorado Proud | Homepage, footer, original badge image, source link | Implemented; current official membership/certification confirmation still necessary |
| Original logo details | Orange triangular BP monogram plus original rolling-pin logo in footer | Corrected in this PR: original rolling-pin artwork is restored to the header; responsive appearance still needs visual QA |
| Existing customer ordering and payment | Header's Customer login menu, footer | Implemented |
| Call, email, customer routing | Header, footer, quick-action widget | Implemented; sticky visibility corrected in this PR |
| Homepage callout | `components/Notice.tsx` | Implemented; frequency/presentation refined in this PR |
| Social links | Instagram and Facebook in footer | Implemented; verify official account ownership before release |
| Delivery geography and route disclaimer | Delivery page, city checker, route map | Implemented; live route accuracy requires confirmation |
| Demo-only SEO and disclosure | robots noindex, layout meta, disclaimer | Implemented intentionally |
| Test framework | `tests/`, `e2e/`, npm scripts | Present, but tests have not been executed in this connector audit |

## Changes in this pull request

1. **Sticky contact widget** — stop hiding the control when its fixed screen position overlaps content. The prior collision algorithm could hide the entire widget over the hero, catalog, or footer. Keep phone, email and inquiry shortcuts persistently available.
2. **Header navigation and interaction** — reserve the full eight-link desktop navigation for sufficiently wide viewports; give links more room and provide consistent hover/focus-visible feedback.
3. **Homepage pop-up** — show only on the homepage, after a deliberate delay and at most once per session; make storage failures nonfatal.
4. **Homepage copy** — lead with the wholesale proposition and remove internal evidence-audit wording from customer-facing prose.
5. **Logo fidelity** — restore the original rolling-pin JPG to the header with responsive sizing instead of relying on a reconstructed monogram.\n6. **Footer policies** — remove misleading third-party Thryv privacy/terms links from the independent demo.\n7. **Content audit** — this file preserves the status and remaining validation boundaries.

## Remaining work that can be designed now

- **Visual QA:** capture and review desktop/mobile renderings, product imagery composition, full logo visibility, sticky contact and notice overlap, page overflow, color contrast and interactive states. Source inspection is *not* a substitute for these tests.
- **Brand fidelity QA:** the original logo is now in both header and footer. Confirm it is legible and visually balanced at desktop, tablet and mobile sizes.
- **Catalog accuracy:** reconcile every product's packaging, quantity, sizes, slicing and lead times with the published catalog; no inferred 'Unit: each' or unsupported individual-wrapping claims.
- **Photographic fidelity:** continue using clearly attributed bakery images or labeled representative concept imagery, never invented SKU photographs.
- **Legal/production cleanup:** third-party platform policies are removed in this PR. Appropriate production privacy and legal policies require a real deployment and collection arrangement. Keep the concept noindexed and do not send requests.
- **Formal test execution:** run `npm test`, `npm run lint`, `npm run build`, and Playwright device/keyboard flows in a check-out capable environment. Not claimed as passing here.

## Discuss first — not authorized as live features or factual promises

- Current ownership/title and permission to use leadership or staff photographs; confirm the founders' retirement circumstances.
- Current Colorado Proud membership, any minority-business certification and official badge permissions.
- Current customer-logo permission and verified customer relationships.
- Whether samples are available and the process, pricing and service levels.
- Real product ingredients/allergens, weights, pack sizes, shelf life, customization limits and performance recommendations.
- Account-specific pricing, minimum orders, delivery schedules and guaranteed coverage.
- Recipient/integration for live inquiries and contact form privacy/compliance.
- Business-development and finance consulting hypotheses (account acquisition, route contribution, SKU margins, capacity and retail channels).

## Release boundary

This PR is for review. Do not merge or deploy this demo as an official Bluepoint site without authorization, a real browser QA pass, source verification, and approval of operational commitments.