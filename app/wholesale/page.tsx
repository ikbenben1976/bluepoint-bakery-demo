import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { categoryPhotos } from "@/data/photos";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Become a wholesale customer",
  description:
    "Prepare a new wholesale account request for Bluepoint Bakery. The demo previews an email to sales@bluepointbakery.com and does not send it.",
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
      <InquiryForm />
    </>
  );
}
