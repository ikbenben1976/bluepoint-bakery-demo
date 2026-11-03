# Bluepoint bakery — missing-items reconciliation (3 Nov 2026)

This replaces the overly generous "implemented" assessments in earlier PRs. Presence of a heading or a component is not proof that an agreed visual or commercial function has been delivered. Source review and automated tests are separate from a human visual acceptance review.

## Top-to-bottom reconciliation

| Order | Agreed result | Repository situation entering this pass | This pass |
| --- | --- | --- | --- |
| Header | Original complete Bluepoint identity, readable navigation, working CTA, existing customer ordering/payment | Original JPG header and portals present, PR #2 | Retained; visual balance still needs screenshot review |
| Hero | Copy and real buttons on left, visually compelling assortment on right; no text embedded in image | PR #3 had copy on right and collage on left; contrast and hierarchy unreviewed | Reversed ordering and adjusted responsive balance; kept real HTML buttons and existing bakery imagery |
| Badges | Colorado Proud, minority/family-owned mention; certification never invented | Existing text and Colorado Proud image | Retained; owner must verify current participation, badge rights |
| Benefit message | Three easy-to-scan cards for scratch baking, six-day delivery, human service | Present from PR #3 | Retained |
| Menu pathways | Four large image-led buyer entry points | Present from PR #3 | Retained |
| Commercial inquiry | Buyer describes use, weekly need, planned start, products, contact info | Weekly need wasn't persisted across visits; form could be cleared only by removing items individually | Fixed persistence for all buyer inputs, added clear request, date input and required product selection |
| Samples | Visible sample-interest mechanism, without pretending samples are definitely available | Completely absent despite prior agreement to prototype it | Added homepage **Ask about samples** link and optional checkbox on request, visible in summary, no send or promise |
| B2B purchasing journey | Clear path new prospective buyer vs existing-account login | CTAs existed but no concise explanation of next steps | Added three-step wholesale inquiry guide and direct existing-account ordering link |
| Customer proof | Segmented display like Cake & Bacon, real sourced customer marks and endorsements | Tabs and quotes but no recognizable visual client proof | Added existing Bluepoint-published Mountain Sun/Oskar Blues graphics plus Cherry Cricket name; no fabricated logos |
| Product info | Published size/slicing/lead, missing allergens/case quantities/prices flagged | Specification fields existed; no verified missing data | Retained unknown-data disclosures; no invented SKU photography |
| Willie Ramirez | Respectful story of employee-to-owner transition, source-backed | Research-like wording and repetitive About page | Rewrote homepage/About copy for actual buyers, retaining historical framing |
| Route | Area lookup and geographic visuals with no implied schedule guarantee | Present after PR #3 | Retained |
| Popup / contact | Working phone/email/actions; subtle dismissible notice | Present | Retained |
| Technical | Mobile, accessible components, tests, branch preview | PR #3 passed 16 unit tests, lint/build, browser checks at its final SHA | Added test cases for persistence, sample inquiry, clear/reset, client proof, and screenshots |
| Official production readiness | Live outbound lead integration and accurate commercial claims | Deliberately absent | **Not authorized**; stay in demo-only mode |

## Important residual gaps — **not claimed complete**

1. **Visual approval:** inspect actual desktop/mobile screenshots, not merely source. Compare the design to the previously generated composite hero; no claim of exact photo/layout parity until reviewed.
2. **Authentic imagery:** current catalog has authentic category illustrations, but no verified photograph for every individual SKU. Do not use a group image as proof of an individual item.
3. **Owner approval:** live samples, recipes/allergens, case quantities, pricing, lead-routing, minimum orders, logo permissions, current ownership and area schedules.
4. **Actual lead transmission:** intentionally disabled. This demo can preview an inquiry but must not submit it to a real bakery without approval.
5. **Commercial consulting propositions:** route contribution, waste, SKU margin, retention and sales operations belong in private owner discovery, not on the website as unverified claims.

## Acceptance evidence

- GitHub PR checks run `npm test`, `npm run lint`, `npm run build`, Playwright E2E, accessibility and two viewport screenshots.
- Vercel preview checks whether build/deployment can be produced; it does **not** verify commercial claims or visual quality.
- The PR is reviewable. Do not auto-merge.
