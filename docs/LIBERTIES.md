# Liberties taken in the Bluepoint demo

Plain-language notes for Ben, so he can tell the bakery what changed and what they would need to approve. Their current site is the Thryv site at bluepointbakery.com. This demo is not that site, and it has not been published.

Anything marked **Needs their OK** changes how the brand, the route, or their words appear.

## The design’s own signature

These did not come from another bakery’s website. The current pages follow `BRAND.md`.

- **Checked cloth.** Their bread photos are shot on a blue-and-white cloth. The site uses one thin band of that check above the footer. It is not a page background. Source: their photographs.
- **Type.** Libre Franklin for headlines, navigation, and labels. Source Serif 4 for body text and pull quotes. Both are self-hosted. Big Shoulders Display stays loaded only so the “BP” letters in the header lockup do not change.
- **A real Front Range map,** recolored, not a drawing of blobs. On the homepage it is a 600px-tall landscape crop across the full content width, with the legend and route card on the map. The delivery page still shows the whole Cheyenne–Fountain–Breckenridge extent. The hillshade contrast was lifted so the mountains still read at that size. Sources and the license are in the map section.
- **One blue band.** “How ordering works” is a full-width blue section with cream type. Orange is reserved for “Order online.”

Bakeries looked at only as a quality bar, and not copied: Pain d’Avignon wholesale, izzio, Bread Alone. From outside bakeries, and only for the habits above: [Odell Brewing](https://www.odellbrewing.com/), [Counter Culture Coffee](https://counterculturecoffee.com/), [Allagash](https://www.allagash.com/). Cereal magazine was not used.

## Logo

**Their site:** the rolling-pin JPG, “BLUEPOINT BAKERY / EST. 1987”, in the header.

**This demo:** the header and the footer use the same SVG lockup. Navy square, orange bar, white “BP”, a tan pin, then the words Bluepoint and “Bakery · Est. 1987”. On the ink footer the square is cream and the letters are ink, so the mark still reads. It gets smaller in the header after you scroll. The original JPG is not shown.

**Why:** the JPG does not fit a single header row next to eight links, and it does not shrink cleanly.

**Needs their OK.** The badge is new art in their colors. It is not a tracing of the rolling pin. If they want the JPG in the header, that is a swap.

## Map

**Their site:** a scanned distribution map. Yellow Mon–Sat, green Mon/Wed/Fri/Sat, blue Tue/Thu/Sat, red Tue/Sat, purple Mon/Tue/Thu/Fri, plus “This is an overview. Please call us to see if we service your city!”

**This demo:** that scan is not shown. The page shows a shaded-relief map of the same territory: Cheyenne south to Fountain, west to Keystone and Breckenridge, with the mountains, I-25, I-70, I-76, and every town we could read. Washes use their day colors. A line draws out from 5105 Cook St along the real interstates. Hover or tap a town for its days.

Towns and days, read off their scan and not guessed:

- Yellow, Mon–Sat: Denver, Boulder, Longmont, Broomfield, Brighton, Golden, Lakewood, Aurora, Englewood, Centennial, Littleton, Castle Rock, Denver International Airport.
- Green, Mon/Wed/Fri/Sat: Fort Collins, Windsor, Loveland, Greeley.
- Blue, Tue/Thu/Sat: Colorado Springs, Fountain.
- Red, Tue/Sat: Central City, Black Hawk, Keystone, Breckenridge.
- Purple, Mon/Tue/Thu/Fri: Cheyenne.
- Evergreen and Buena Vista are labeled on their map with no colored oval, so the demo says “Call to confirm.”

The overview sentence is still on the page, word for word.

### Source and license

Built by `demo/scripts/build-basemap.py`. Nothing is requested from a map host when someone opens the page. The JPEG and the highway paths ship inside the static export.

- **Terrain.** AWS Terrain Tiles, the Mapzen Terrarium set, zoom 10, from `s3://elevation-tiles-prod`. Mapzen assembled those tiles from public-domain elevation (SRTM and other national DEMs) and released the tiles for use without restriction. We hillshaded them and recolored them (paper plains, tan foothills, navy peaks). The JPEG is that derivative.
- **Roads.** OpenStreetMap motorways, fetched once from the Overpass API and drawn in the image and as vector strokes. © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). The attribution line under the map is required if this page is shown to anyone. Keep it.
- **The state line** at the Colorado–Wyoming border is a straight parallel at 41°N, drawn by the script. It is not a licensed boundary file.
- **Not used:** Google, Mapbox, MapLibre-at-runtime, or any other tile service in the browser.

**Needs their OK** only in the sense that the picture replaces their scan. The days are theirs. The geography is public data.

## Delivery checker

**Their site:** a written list (Denver Metro, Boulder, Fort Collins/Greeley, Colorado Springs, Central City/Blackhawk, the I-70 corridor to Breckenridge, Cheyenne, and, on the about page, Loveland and Summit County) plus the map, which also colors Aurora, Windsor, Fountain, Castle Rock, and DIA.

**This demo:** one list. If the map colors the town, the checker says “We deliver here” and names the days. If the town is only labeled (Evergreen, Buena Vista), it says “Ask us” and “Call to confirm.” Anywhere else (Aspen, Pueblo, Vail) stays “Ask us.”

**Needs their OK.** That is wider than the written paragraph. It matches the colored scan, which is what Ben asked for, but a sales person should confirm before a customer is promised Aurora or Windsor from the website alone.

## Type, color, header

**Their site:** DM Sans-style body, the JPG, and a long header. Order online and Pay an invoice are separate buttons. A phone link.

**This demo:** same brand colors (royal `#2035E8`, navy `#0D0D25`, orange `#F66631`, tan `#D1A751` / `#C09040`), on a cream ground `#F6F1E8`. Libre Franklin and Source Serif 4. One sticky row that condenses. On a phone the nav is a full-screen menu, and the old bottom bar (Call / Order / Become a customer) is gone. Those actions are in the menu, and the header still shows Order online and Pay an invoice.

**Needs their OK** for the typefaces and for retiring the bottom bar. The phone number, the two portal URLs, and the hours are unchanged.

## Words

**Kept as theirs:** the homepage sentence “Scratch-baked bread and pastries for Colorado businesses since 1987”; “We bake and deliver wholesale bread and pastries”; the 24-hour / 48-hour / 3-day notices; the about-page sentences; the FAQ, including “over 30 years”; the community figures they already published (“more than $1 million”, “over $15,000”); the three review quotes; the map caveat.

**Shortened or added by us, and worth a glance:**

- Kicker “Denver · since 1987”. Both facts are theirs. The pairing is ours.
- “Breads and pastries, made from scratch.” Shortens their about line, “made from scratch daily at our spacious facility.”
- “Cheyenne to Fountain, and west to the I-70 corridor.” Describes the map. It is not a sentence from their site.
- The header says “Order online”. The menu still says “Order online (existing customers)”.

No prices, no minimums, no invented awards. The Colorado Proud mark is the program’s own 2019 logo, used because the product finder lists the bakery.

## Questions for the bakery

These are Probable or Unknown in RESEARCH.md. The site either leaves them out or says them carefully.

- Founding year. The logo and the old site say 1987. BBB says the business started in 1990. The current legal entity was formed in 1991. The site uses 1987, which is what Bluepoint prints. Which year should the public story use?
- Willie Ramirez. A lender case study says a baker who worked here 28 years bought the bakery and kept the staff. The site says that without the loan amount or a date. May we use his name, and when did the purchase happen?
- Pie in the Sky total. The 2017 site said more than $100,000. The current site says more than $1 million. The demo states the pies and the birthday cakes, and leaves the dollar total off until you say which figure is right.
- Delivery days. The current map page names the towns on each colored route. It does not print the weekdays. The demo shows those towns and says to call for the days. Keystone, Brighton, Centennial, and Buena Vista are not on that map, so they are not labeled. Is the old weekday schedule still right, and is Keystone still on a route?
- Named customers. Cherry Cricket and Mountain Sun quotes are on the current community page. A 2023 review mentions a coffee shop that has ordered for over 10 years. We do not know which of these accounts are still active, or whether we may keep using the names.
- GrowHaus and Soup for the Soul are on the current site. Whether those gifts are still active is unknown, so the community page keeps the published lines and does not add a date.
- A formal minority-business certification was not found. The About page’s own “minority-owned and family-owned” sentence is repeated as text, not as a badge.
- The mountain route is drawn in a muted rust, not oven orange, so the Order button stays the only bright orange on a screen. The live map uses orange for that route.

## Photographs

**Their site:** product pictures are shot on a blue-and-white checked cloth. Bakery, team, and partner pictures sit on the home, about, and community pages. The full list, with each original URL, is in `PHOTOS.md`.

**This demo:** every public page of bluepointbakery.com was read once (not the order or payment portals). Their photographs are self-hosted. Product shots that were on the cloth were cut out with rembg and BiRefNet, then set on one warm cream studio ground with a soft shadow. The bread and pastry in each picture are theirs. Color, contrast, and sharpness were nudged only slightly. The checked cloth is one thin band above the footer, and nowhere else.

Two of their files could not be used as a clean cutout, and no outside photo was substituted:

- The baguette pile fills the frame, so the cutout came out as a hard rectangle. The French breads card uses their other baguette photograph, the one on the rack (`IMG_2731`).
- The pumpkin-chocolate loaf was sold in the same frame as a wrapped slice. That wrapper’s label still prints the old street, 1721 East 58th Ave. The slice was cropped off. The loaf on the card is theirs. The old address is not shown.

The cookie picture also included wrapped cookies with the cloth still showing through the bag. Those two were left out of the card. The two unwrapped cookies are theirs.

Two pastries in the Danish photograph, and the scored bun, ran off the edge of the original frame. They are still those same photographs. The missing crust was continued a short way from the dough already in the picture so each piece reads as whole, with transparent space around it. No outside photo was used for them.

No Unsplash, Pexels, or other stand-in was used. If a file was too small to enlarge honestly (the 360px home snapshots, the tiny partner marks), it is shown at its real size and noted in `PHOTOS.md`.

The homepage hero is their sesame bun, cut out and set on cream. The before-and-after contact sheet is `photos/before-after.jpg`. The header keeps the BP lockup. The rolling-pin logo sits alone in the footer, with room, and not beside that badge.

**Needs their OK.** Cutting the cloth out, the cream background, and cropping the wrapped slice are changes to their pictures. They should approve that before it is treated as theirs.

## What did not change

The catalog, the lead-time rules, the request builder (nothing is sent), `noindex`, the disclaimer “Demo prepared for review — not the official site”, the address 5105 Cook St (never the old street), the phone, sales@bluepointbakery.com, and the two portal links.

## Open questions

These are not answered on the pages. Nothing below was added to the site.

- Naming the owner. The demo now names Willie Ramirez and links the 44 Business Capital case study. It does not say he is the owner today. The study page shows no date. Whether that ownership is still the structure is Unknown.
- Colorado Proud. The live home, About, and community pages fetched 3 Nov 2026 do not show the badge. The Wayback homepage of 28 Oct 2018 also does not. Other snapshots from 2015–2024 returned HTTP 429 before they could be read. The Colorado Proud product finder does list Bluepoint Bakery at 5105 Cook St., Denver, CO 80216, (303) 298-1100: https://coloradoproud.com/product-finder/ (checked 3 Nov 2026). The mark on the demo is the program’s 2019 logo file, `logo_cp_2019_v4_ct-rgb`, also stored on the bakery’s own site files. It is not a redraw.
- The original homepage HTML has a “Share by” popup and loads a Thryv LiveSite script when the plan id is 1280. The script’s message is not in the page. The visible prompt in the HTML is “Call Us Today!” The demo’s notice uses that, not a guessed promotion.
- Facebook and Instagram are both linked from https://www.bluepointbakery.com/contact-us (checked 3 Nov 2026): https://www.facebook.com/BluepointBakery/ and https://instagram.com/bluepointbakery/. No other social accounts are linked there.
- Contact name, email, and phone stay on the inquiry form so a sales reply is possible. They are not facts about the bakery.
- No stock “application” photos were added. The “What are you making?” cards use catalog text, and the hero is composed from Bluepoint’s own cutouts.
- The header mark keeps the new BP lockup and adds the orange triangle from the original. The full rolling-pin artwork is the original file, shown in the footer, because that artwork does not stay readable in a phone-sized header.
- Whether the customer quotes on the site are still current.
- Whether the bakery offers samples or trials.
- Whether there is a minimum order.
- Whether custom bun sizes are available.
- Whether specs and allergens can be published. The catalog pages do not list them.
