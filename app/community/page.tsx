import type { Metadata } from "next";
import Image from "next/image";
import { communityPartners } from "@/data/site";
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
  return (
    <>
      <PageHero
        kicker="Community"
        title="Partners"
        lede={<p>Bluepoint Bakery is active in the Front Range community.</p>}
        contained
      />
      {/* Intro and partner facts: https://www.bluepointbakery.com/community */}
      <div className="shell community-page content-page">
        <p className="community-intro">
          We&apos;re proud to have ongoing relationships with several local charity organizations, including the following.
        </p>
        <ul className="partner-marks" aria-label="Community partners">
          {communityMarks.map((mark) => (
            <li key={mark.src}>
              <Image src={mark.src} alt={mark.alt} width={mark.width} height={mark.height} loading="eager" />
            </li>
          ))}
        </ul>
        {line ? (
          <figure className="community-line">
            <Image src={line.src} alt={line.alt} width={line.width} height={line.height} loading="eager" className="community-scene" />
            <figcaption>Pies being filled in the bakery.</figcaption>
          </figure>
        ) : null}
        <ul className="partner-list">
          {communityPartners.map((partner) => (
            <li key={partner.name} className="partner-card">
              <h2>{partner.name}</h2>
              {partner.points.map((point) => (
                <p key={point}>{point}</p>
              ))}
              <ul className="partner-links">
                {partner.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <aside className="community-mention">
          <Image
            src="/images/customers/fire-foundation.png"
            alt="FIRE Foundation of Denver"
            width={687}
            height={182}
          />
          <div>
            <h2>FIRE Foundation</h2>
            <p>
              Bluepoint has supported the FIRE Foundation Thanksgiving pie fundraiser.
              Pie in the Sky, above, is the Project Angel Heart program.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
