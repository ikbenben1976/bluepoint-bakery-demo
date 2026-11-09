import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WholesaleRequest } from "@/components/WholesaleRequest";
import { categoryPhotos } from "@/data/photos";

export const metadata: Metadata = {
  title: "Request a wholesale account",
  description:
    "Prepare a new wholesale account request for Bluepoint Bakery. The demo previews an email to sales@bluepointbakery.com and does not send it.",
  alternates: { canonical: "/wholesale/" },
  robots: { index: false, follow: false },
};

export default function WholesalePage() {
  return (
    <>
      <PageHero
        className="wholesale-hero"
        kicker="New accounts"
        title="Request a wholesale account"
        image={categoryPhotos.croissants}
        lede={<p>Tell Bluepoint what you need. At the end, you’ll have an inquiry to email to our sales team.</p>}
      />
      <WholesaleRequest />
    </>
  );
}
