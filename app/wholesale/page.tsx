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
        kicker="New accounts"
        title="Request a wholesale account"
        image={categoryPhotos.croissants}
        lede={<p>Build a wholesale inquiry in four steps. Then copy it and email it to Bluepoint’s sales team to discuss account setup.</p>}
      />
      <WholesaleRequest />
    </>
  );
}
