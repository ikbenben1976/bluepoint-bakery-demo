import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WholesaleRequest } from "@/components/WholesaleRequest";
import { categoryPhotos } from "@/data/photos";

export const metadata: Metadata = {
  title: "Become a wholesale customer",
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
        lede={<p>Tell us what you are making and where you are. A sales professional will assist you.</p>}
      />
      <WholesaleRequest />
    </>
  );
}
