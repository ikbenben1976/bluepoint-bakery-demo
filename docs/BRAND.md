# Bluepoint Bakery: Brand Strategy (draft for Ben)

Nov 3, 2026 (MT). Every fact below comes from RESEARCH.md, which has the sources and the Confirmed / Probable / Unknown labels. Nothing here is invented.

---

## 1. Research summary (the 60-second version)

1. **Est. 1987, chef-founded.** Two chefs, Fred Bramhall and Mary Clark, started it. It once included a retail bakery on Sixth Ave and two Bluepoint restaurants. Westword named it Best Bakery in 2000. (Confirmed)
2. **Bakers who stayed.** Rob Lederman, a third-generation baker, joined in 1991 and became a partner. Willie Ramirez worked there for 28 years, then bought 100% with an SBA loan and kept every employee. (Confirmed. Date of the buyout: Unknown)
3. **Owner-run, family- and minority-owned.** That's the site's own claim. Certification: Unknown.
4. **The bread behind burgers and sandwiches.** Cherry Cricket since 1994; Mountain Sun: "Best burger bun in town!"; Oskar Blues; the 2001 Denver Post praised "the triangular-shaped bun". The catalog is mostly buns, rolls and sandwich breads. (Confirmed)
5. **They show up.** They bake and deliver 6 days a week, on overnight driver shifts, from Cheyenne to Fountain to Breckenridge. Lead times are 24 hours for bread and 48 for pastry. Reviewers name their reps (Nicole, Willie, Ricky). (Confirmed)
6. **Community is real and documented.** All the Pie in the Sky pies for Project Angel Heart since 2009, 100 birthday cakes a month, 10,000+ CASA cookies, and the AFP "Outstanding Small Business" award (National Philanthropy Day in Colorado, 2016). (Confirmed)
7. **The brand has drifted.** It went from "the fine art of breads and pastries" (2005) to "Denver's Premier Wholesale Bakery Since 1987" (2018) to a homepage titled "Distributor" (now). The site's fonts and colors don't match the logo. The old address is still on LinkedIn, BBB, Birdeye, Google copies and a product label.
8. **The market just opened up.** Aspen Baking stopped deliveries without warning in March 2026. Hinman Pie closed in May 2026. Grateful Bread now sells wholesale only through Shamrock. (Confirmed)

## 2. Audience segments

| # | Segment | Examples (real) | What they care about |
|---|---|---|---|
| 1 | Burger, sandwich and pub kitchens | Cherry Cricket, Mountain Sun, Oskar Blues | Same bun every day, a bun that holds up, custom sizes, and never missing a delivery |
| 2 | Independent restaurants and delis | A Lakewood Italian restaurant (review) | Quality that matches their menu, a rep who answers, easy reorders |
| 3 | Cafés and espresso bars | "our Coffee Shop for over 10 years" (review) | Fresh pastry and quick breads, small flexible orders, morning drops |
| 4 | Institutions: hotels, country clubs, airport/DIA concessions, universities, caterers | Named on the About page | Volume, consistency, paperwork (food safety, allergens, invoicing), reliability |
| 5 | Mountain and far-route accounts | Breckenridge, Black Hawk, Cheyenne, Colorado Springs | Knowing their delivery days, and a bakery that actually drives that far |
| 6 | Secondary: retail partners, nonprofits, job seekers | Our Butcher, Frank (Longmont); Project Angel Heart; drivers and bakers | A partner story, and pride in working there |

Primary buyer: the chef, owner or kitchen manager who has to trust the bread at 6 AM.

## 3. Positioning

**Statement**
> For Colorado restaurants, pubs and cafés that build their menus on bread, Bluepoint Bakery is the independent, owner-run scratch bakery that has baked and delivered the buns, rolls and loaves behind Denver's favorite burgers and sandwiches since 1987. We deliver six days a week, from Cheyenne to Fountain, and our people know your order by name.

**Short version:** Colorado's bread, baked and delivered since 1987.

**Whitespace (why this works now)**
- **Big and national** (Bimbo, Dawn, distributor catalogs; izzio par-baked): scale, but no local bakery relationship.
- **Small artisans** (Rebel, Urban Bread, panaderias): lovely bread, but metro-only and small capacity.
- **Specialist** (Harvest Moon): buns, sold nationally.
- **Gone or indirect in 2026:** Aspen (stopped deliveries in March), Hinman (closed), Grateful Bread (Shamrock only).
- **Bluepoint's space:** a local, full-line, owner-run bakery with its own trucks and Front Range reach, and 38+ years of not disappearing. (Probable. Confirm current routes.)
- Don't name competitors on the site. Let "since 1987" and "six days a week" do the talking.

## 4. Brand pillars (max 3)

1. **Baked by people who stayed.**
   - Proof: chef-founded in 1987; a third-generation baker joined in 1991; the owner worked his way up over 28 years; family-owned; the Cherry Cricket has been a customer since 1994.
2. **The bread behind the menu.**
   - Proof: burger buns, sandwich rolls and breads make up most of the catalog; "Best burger bun in town!"; the Denver Post's 2001 "crusty, chewy, real bread"; Westword Best Bakery 2000.
3. **We show up: on the route, and for the community.**
   - Proof: we bake and deliver 6 days a week, Cheyenne to Fountain to Breckenridge, with 24/48-hour lead times and reps you know by name. Plus Project Angel Heart pies since 2009 and the AFP 2016 Outstanding Small Business award.

## 5. Personality and voice

Personality: **a steady, warm, plain-spoken head baker.** Proud, but not loud.

| Do | Don't |
|---|---|
| Short, concrete sentences | Generic SEO filler ("Distributor", "delicious baked goods for businesses") |
| Real numbers and names (only verified ones) | Superlatives we can't prove ("best", "leading", "#1") |
| Talk like a partner to a chef | Hype, puns everywhere, exclamation marks |
| "We bake / we deliver" in the first person | Faceless "our company provides solutions" |
| Use the official award names | Inflated award names ("Philanthropist of the Year") |

**Sample headlines (all from facts)**
- "Colorado's bread, since 1987."
- "Baked overnight. Delivered six days a week." (Overnight shifts and 6-day delivery: Confirmed)
- "Serving the Cherry Cricket since 1994." (Needs their OK)
- "From Cheyenne to Fountain to Breckenridge."
- "Order bread by 24 hours ahead, pastry by 48."
- "Every pie in Pie in the Sky, since 2009."
- "From baker to owner." (The Willie Ramirez story, after the bakery confirms it)

## 6. Visual direction

**6.1 Type: two classic families, nothing else**
- **Display headings that resolve to Source Serif 4, weight 600.** The home hero headline is Source Serif 4 at weight 600. So are plain `h2` section headings, and any plain `h1` that is not also matched by a more specific rule (the delivery page title is one). This is the approved direction for those headings. It gives the page warmth and a heritage voice that Franklin alone lacks.
- **Page titles that still render in Libre Franklin.** A plain `h1` is not Franklin. The later `h1, h2` rule sets Source Serif 4, weight 600, and it wins for the hero and for plain headings. These titles stay Franklin because a more specific selector outranks that element rule: About, Breads, Pastries, and Wholesale titles are `.ticket-hero h1` (Libre Franklin, weight 700). The FAQ title, the contact headings, and the community title are Libre Franklin, weight 700, from their page styles. Catalog group titles (`.group-photo h2` and `.group-type h2`) are Libre Franklin, weight 800.
- **Utility headings (h3), nav, buttons, kickers, eyebrows, and labels: Libre Franklin.** Franklin stays on everything you scan: navigation links, button text, kickers, eyebrows, card titles, and h3 subheadings.
- **Body and story: Source Serif 4.** It's a calm, readable classic serif that brings warmth and the heritage note without looking fussy.
- Drop DM Sans, Source Sans, Montserrat and Big Shoulders.
- Rule: one size scale, about 5 sizes total. Serif for sentences, sans for things you scan.

**6.2 Color system (from the logo)**

| Role | Color | Use | Never |
|---|---|---|---|
| Ink | #0D0D25 | Body text, footer, dark sections | — |
| Bluepoint Blue | #2035E8 | Header and nav, links, and map routes in the original strategy | Kickers, eyebrows, and labels (those use Dark Gold). Large text blocks on blue |
| Dark Gold | #6f4b0e | Kickers, eyebrows, labels, active tab indicators | — |
| Oven Orange | #F66631 | ONE accent per screen: the "Order" button, the triangle mark | Body text, backgrounds, decoration |
| Crust Gold | #D1A751 | Heritage only: the "Est. 1987" seal, award marks, thin rules | Text on cream (too low contrast) |
| Cream | #F6F1E8 | Page background (matches the product photos) | — |
| White | #FFFFFF | Cards and forms | — |

Proportion guide: about 70% cream/white, 20% ink, 8% blue, 2% orange and gold.

**6.3 Imagery rules**
- Hero and catalog: the new cut-out product photos on cream with a soft contact shadow, all at the same angle and scale. Ben already likes these.
- One honest real-world photo per section at most (the bakery floor, a truck, a loaf on the blue-and-white cloth). No stock photos.
- Never show the old address (the quick-bread label stays cropped).
- Customer logos and names only with permission.

**6.4 Motion rules (minimal)**
- No ticker, no parallax, no scroll-triggered photo animation, no carousels.
- Allowed: hover and focus states, and a 150–200 ms fade on menus.
- Respect reduced-motion settings.

**6.5 Logo and the checkered cloth**
- The logo (rolling pin, wordmark, orange triangle, "EST. 1987") is the hero mark. Give it room; no new "BP" badge alongside it.
- The checkered cloth is heritage texture, taken from their own bread photos. Use it in one place only: a thin band above the footer, or under the "Our story" photo. Never behind text, and never as a pattern everywhere.

## 7. Homepage story and structure

The story in one line: we've baked Colorado's bread since 1987, here's what we bake, who trusts it, how to order, and where we drive.

1. **Hero.** "Colorado's bread, since 1987." One sentence: scratch-baked in Denver, delivered six days a week from Cheyenne to Fountain. Buttons: "Order online" (orange) and "Become a customer" (blue). One cut-out bun photo.
2. **Proof line** (static, not a ticker): Est. 1987 · Bake and deliver 6 days · Family-owned · 24-hour bread lead time.
3. **What we bake.** Four tiles: Buns · Sandwich rolls and breads · Breakfast and pastry · Desserts. Each one links to its catalog page.
4. **Who we bake for.** Two or three real quotes (Cherry Cricket, Mountain Sun, a café), with permission.
5. **How ordering works.** Three steps: set up an account, order through the portal or your rep (24/48 h), get delivery on your route day.
6. **Where we deliver.** A clean route map plus a table of days. Fix the data first.
7. **Our story.** From 1987 chefs, to a third-generation baker, to an owner who started on the floor. One photo.
8. **Community.** Project Angel Heart, CASA, and the 2016 AFP award, in a short block.
9. **Footer.** 5105 Cook St, Denver CO 80216 · 303-298-1100 · sales@ · office hours Mon–Fri 7–3.

## 8. Open questions for the bakery

1. When did Willie Ramirez buy 100%? Is "Willie" Guillermo Ramirez? Who is Ricky (role)? Can we tell the baker-to-owner story and use names and photos?
2. Founding year: 1987 (logo) vs 1990 (BBB) vs 1991 (current legal entity). Which story do they tell?
3. What is the orange triangle in the logo? Is it the triangular bun?
4. Pie in the Sky total: $100,000 (2017 site) or $1 million (current site)?
5. Minority-owned: any certification (MBE or similar)? Colorado Proud member?
6. Delivery routes and days for each color, including the mountain route color and Keystone. Wholesale minimum order and delivery cutoff times?
7. Which named customers are current, and which may we quote?
8. When did they move to 5105 Cook St? Can we update LinkedIn, BBB, Birdeye, Google and the labels?
9. Headcount and facility size; food safety certifications (e.g., SQF, third-party audits)?
10. Which portal is primary: bakery.software or Wholesail?
11. Any press we missed (DBJ, 5280, TV)?
12. Still active: GrowHaus, Soup for the Soul, CASA cookies?
