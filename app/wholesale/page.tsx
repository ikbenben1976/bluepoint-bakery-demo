import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WholesaleRequest } from "@/components/WholesaleRequest";
import { categoryPhotos } from "@/data/photos";

export const metadata: Metadata = {
  title: "Let&apos;s get your wholesale account started",
  description:
    "Prepare a new wholesale account request for Bluepoint Bakery. The demo previews an email to sales@bluepointbakery.com and does not send it.",
  alternates: { canonical: "/wholesale/" },
  robots: { index: false, follow: false },
};

export default function WholesalePage() {
  return (
    <>
      <PageHero
        kicker="New accounts"
        title="Become a wholesale customer"
        image={categoryPhotos.croissants}
        lede={<p>Tell us about your business, the products you&apos;re interested in and your anticipated needs. Our sales team can help with the next steps.</p>}
      />
      <WholesaleRequest />
    </>
  );
}
