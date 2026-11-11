import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./brand.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { CallSheetProvider } from "@/components/CallSheet";
import { RequestSheetProvider } from "@/components/RequestSheet";
import { Notice } from "@/components/Notice";
import { franklin, sourceSerif } from "@/app/fonts";
import { DISCLAIMER, DEMO_ORIGIN } from "@/data/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F1E8",
};

export const metadata: Metadata = {
  metadataBase: new URL(DEMO_ORIGIN),
  icons: { icon: [{ url: "/icon.png", type: "image/png", sizes: "48x48" }], shortcut: "/icon.png" },
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
        <CallSheetProvider>
          <RequestSheetProvider>
            <a className="skip-link" href="#main">
              Skip to content
            </a>
            {/* The bar sticks while the page scrolls and lets go at the footer. */}
            <div className="sticky-with-content">
              <div className="sticky-stack no-print">
                <p className="demo-ribbon">{DISCLAIMER}</p>
                <Header />
              </div>
              <main id="main">{children}</main>
            </div>
            <Footer />
            <Notice />
            <JsonLd />
          </RequestSheetProvider>
        </CallSheetProvider>
      </body>
    </html>
  );
}
