import localFont from "next/font/local";

/**
 * Licensed pair (SIL Open Font License, shipped via Fontsource).
 * The later approved hero is a large navy serif, and that display choice
 * outranks the older BRAND.md note that put Libre Franklin on every headline.
 * Source Serif 4 is the display serif and the body text. Libre Franklin stays
 * on navigation, buttons, and labels.
 */

/** Libre Franklin for navigation, buttons, and labels. */
export const franklin = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/libre-franklin/files/libre-franklin-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/libre-franklin/files/libre-franklin-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/libre-franklin/files/libre-franklin-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-franklin",
  display: "swap",
});

/** Source Serif 4 for the hero display and for body copy. */
export const sourceSerif = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});
