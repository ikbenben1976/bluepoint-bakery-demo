import type { Metadata, Viewport } from "next";
import { Libre_Franklin, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import "./brand.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Notice } from "@/components/Notice";
import { QuickActions } from "@/components/QuickActions";
import { JsonLd } from "@/components/JsonLd";
import { DISCLAIMER } from "@/data/site";

const franklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-franklin",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F1E8",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://demo.invalid"),
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
    <html lang="en" className={`${franklin.variable} ${sourceSerif.variable}`}>
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
