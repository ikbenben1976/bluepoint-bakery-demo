import localFont from "next/font/local";

/** Libre Franklin for headlines and UI. Files ship with the repo's npm deps. */
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

/** Source Serif 4 for body copy. */
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
