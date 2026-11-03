export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const logo: Photo = {
  src: "/logo.jpg",
  width: 720,
  height: 353,
  alt: "Bluepoint Bakery logo, established 1987",
};

/** Studio plate. The cloth is gone; the loaves are the same photograph. */
export const hero: Photo = {
  src: "/images/studio/parisien-hero.webp",
  width: 1600,
  height: 1000,
  alt: "Golden Parisien loaves",
};

const studio = (slug: string, alt: string): Photo => ({
  src: `/images/studio/${slug}.webp`,
  width: 1200,
  height: 900,
  alt,
});

export const gallery: Photo[] = [
  { src: "/images/scenes/rack-loaves.webp", width: 360, height: 288, alt: "Loaves on a bakery rack" },
  { src: "/images/scenes/sesame-buns-rack.webp", width: 360, height: 288, alt: "Sesame-topped buns" },
  { src: "/images/scenes/baker.webp", width: 360, height: 288, alt: "A baker shaping dough at Bluepoint Bakery" },
  { src: "/images/scenes/baguette-rack.webp", width: 1200, height: 1600, alt: "Baguettes on a rack" },
  { src: "/images/scenes/roll-racks.webp", width: 480, height: 640, alt: "Rolls proofing on bakery racks" },
  { src: "/images/scenes/pastry-trays.webp", width: 594, height: 640, alt: "Pastries on bakery trays" },
  { src: "/images/scenes/pie-filling.webp", width: 480, height: 640, alt: "Pies being filled in the bakery" },
  { src: "/images/scenes/baguette-tray.webp", width: 640, height: 360, alt: "French bread on a tray" },
  { src: "/images/scenes/rolls-tray.webp", width: 480, height: 640, alt: "Rolls on a tray" },
  { src: "/images/scenes/chocolate-pastries.webp", width: 1400, height: 1050, alt: "Chocolate pastries in the bakery" },
  { src: "/images/scenes/bakers-line.webp", width: 900, height: 675, alt: "Bakers working the line at Bluepoint Bakery" },
];

export const distributionMap: Photo = {
  src: "/images/map.jpg",
  width: 1600,
  height: 1200,
  alt: "Bluepoint Bakery distribution map and delivery schedule",
};

export const aboutPhoto: Photo = {
  src: "/images/scenes/cherry-pies.webp",
  width: 640,
  height: 480,
  alt: "Cherry pies on a rack at Bluepoint Bakery",
};

export const cookStreetMap: Photo = {
  src: "/images/cook-st.jpg",
  width: 1100,
  height: 640,
  alt: "Map showing 5105 Cook St., Denver, CO 80216",
};

/** One studio plate per catalog group. Cloth backgrounds have been removed. */
export const categoryPhotos: Record<string, Photo> = {
  buns: studio("sesame-bun", "Sesame hamburger bun"),
  "sandwich-rolls": studio("sandwich-rolls", "Club and Philly rolls"),
  "french-breads": {
    src: "/images/scenes/baguette-rack.webp",
    width: 1200,
    height: 1600,
    alt: "Baguettes on a rack",
  },
  "deli-loaves": studio("marble-rye", "Marble rye"),
  "pan-loaves": studio("pan-loaves", "Pan size loaves"),
  "dinner-rolls": studio("brioche-rolls", "Brioche dinner rolls"),
  "specialty-breads": studio("specialty", "Specialty breads"),
  croissants: studio("croissant", "Butter croissants"),
  danishes: studio("danish", "Danishes"),
  "mini-danish": studio("danish", "Danishes"),
  turnovers: studio("turnover", "Cherry turnover"),
  scones: studio("scones", "Scones"),
  "mini-scones": studio("scones", "Scones"),
  "quick-breads": studio("quick-bread", "Pumpkin chocolate loaf and slice"),
  muffins: studio("muffins", "Muffin variety"),
  "half-size-muffins": studio("muffins", "Muffin variety"),
  "muffin-tops": studio("muffins", "Muffin variety"),
  cookies: studio("cookies", "Cookies"),
  "specialty-cookies": studio("cookies", "Cookies"),
  "cinnamon-rolls": studio("iced-ring", "Iced ring"),
  biscotti: studio("biscotti", "Dipped and undipped biscotti"),
  brownies: studio("brownies", "Brownies and a blondie"),
  pies: studio("pie", "Dutch apple pie"),
};

/** Further photographs for the same group, not repeated as the main plate. */
export const extraPhotos: Record<string, readonly Photo[]> = {
  buns: [studio("round-bun", "Round bun"), studio("split-bun", "Scored round bun")],
  "french-breads": [studio("parisien", "Golden Parisien loaves")],
  "deli-loaves": [studio("marble-slice", "Sliced marble rye")],
  "specialty-breads": [studio("sixteen-loaf", "16x4 loaf")],
  muffins: [studio("muffins-berry", "Blueberry muffins")],
  brownies: [
    {
      src: "/images/scenes/brownie-sheet.webp",
      width: 1200,
      height: 1600,
      alt: "Raspberry white chocolate brownie sheet",
    },
  ],
};

export const communityMarks: Photo[] = [
  { src: "/images/scenes/angel-heart.png", width: 301, height: 415, alt: "Project Angel Heart" },
  { src: "/images/scenes/casa.png", width: 888, height: 568, alt: "CASA of Adams and Broomfield Counties" },
  { src: "/images/scenes/growhaus.webp", width: 300, height: 261, alt: "The GrowHaus" },
  { src: "/images/scenes/soup-for-the-soul.png", width: 612, height: 1482, alt: "Soup for the Soul" },
  { src: "/images/scenes/mountain-sun.webp", width: 350, height: 318, alt: "Mountain Sun Pub and Brewery" },
  { src: "/images/scenes/oskar-blues.webp", width: 174, height: 174, alt: "Oskar Blues Brewery" },
];

export const homeTiles: { href: string; label: string; category: string }[] = [
  { href: "/breads#buns", label: "Buns", category: "buns" },
  { href: "/breads#sandwich-rolls", label: "Sandwich Rolls", category: "sandwich-rolls" },
  { href: "/breads#french-breads", label: "French Breads", category: "french-breads" },
  { href: "/breads#deli-loaves", label: "Deli Loaves", category: "deli-loaves" },
  { href: "/breads#pan-loaves", label: "Pan Loaves", category: "pan-loaves" },
  { href: "/breads#dinner-rolls", label: "Dinner Rolls", category: "dinner-rolls" },
  { href: "/breads#specialty-breads", label: "Specialty", category: "specialty-breads" },
  { href: "/pastries#croissants", label: "Croissants", category: "croissants" },
  { href: "/pastries#danishes", label: "Danish", category: "danishes" },
  { href: "/pastries#scones", label: "Scones", category: "scones" },
  { href: "/pastries#muffins", label: "Muffins", category: "muffins" },
  { href: "/pastries#cookies", label: "Cookies", category: "cookies" },
  { href: "/pastries#brownies", label: "Brownies", category: "brownies" },
  { href: "/pastries#pies", label: "Pies", category: "pies" },
];
