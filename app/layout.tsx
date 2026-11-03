import type { Metadata, Viewport } from "next";
// Bundle typography from the installed package instead of downloading
// Google Fonts during the Vercel production build.
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "./globals.css";
import "./brand.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Notice } from "@/components/Notice";
import { QuickActions } from "@/components/QuickActions";
import { JsonLd } from "@/components/JsonLd";
import { DISCLAIMER } from "@/data/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F1E8",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bluepoint-bakery-demo.vercel.app"),
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], shortcut: "/icon.svg" },
  title: {
    default: "Bluepoint Bakery",
    template: "%s | Bluepoint Bakery",
  },
  description:
    "Colorado's bread, baked and delivered since 1987. Bluepoint Bakery, 5105 Cook St., Denver, CO 80216.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="sticky-stack no-print">
          <p className="demo-ribbon">{DISCLAIMER}</p>
          <Header />
        </div>
        <main id="main">{children}</main>
        <Footer />
        <Notice />
        <QuickActions />
        <JsonLd />
      </body>
    </html>
  );
}
