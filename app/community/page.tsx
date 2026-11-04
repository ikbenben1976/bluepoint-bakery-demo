import type { Metadata } from "next";
import Image from "next/image";
import { communityPartners } from "@/data/site";
import { PublishedProof } from "@/components/PublishedProof";
import { communityMarks, gallery } from "@/data/photos";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Bluepoint Bakery community partners, including Project Angel Heart, CASA of Adams & Broomfield Counties, The GrowHaus, and Soup for the Soul.",
  alternates: { canonical: "/community/" },
  robots: { index: false, follow: false },
};

export default function CommunityPage() {
  const line = gallery.find((photo) => photo.src.endsWith("pie-filling.webp"));
  const nonprofitMarks = communityMarks.filter((mark) => !/mountain-sun|oskar-blues/i.test(mark.src));
  return (
    <>
      <PageHero
        kicker="Community"
        title="Partners"
        lede={
          <p>
            Outstanding Small Business, National Philanthropy Day in Colorado, 2016. Given by the AFP Colorado Chapter.
          </p>
        }
      />
      <div className="shell py-10 content-page">
        <ul className="partner-marks">
          {nonprofitMarks.map((mark) => (
            <li key={mark.src}>
              <Image src={mark.src} alt={mark.alt} width={mark.width} height={mark.height} loading="eager" />
            </li>
          ))}
        </ul>
        {line ? (
          <figure className="community-line">
            <Image src={line.src} alt={line.alt} width={line.width} height={line.height} loading="eager" className="community-scene" />
          </figure>
        ) : null}
        <ul className="grid gap-6 md:grid-cols-2">
          {communityPartners.map((partner) => (
            <li key={partner.name} className="partner-card">
              <h2>{partner.name}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {partner.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <h2 className="section-title mt-20">From customers, on Bluepoint&apos;s site</h2>
        <div className="mt-8">
          <PublishedProof />
        </div>
      </div>
    </>
  );
}
