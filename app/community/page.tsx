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
        title="Giving back to the communities we serve"
        lede={<p>Our commitment to Colorado goes beyond the bakery. We&apos;re proud to support organizations that make a difference in our communities.</p>}
        contained
      />
      {/* Intro and partner facts: https://www.bluepointbakery.com/community */}
      <div className="shell community-page content-page">
        <p className="community-intro">
          Through donated baked goods and community fundraising events, Bluepoint has supported causes close to home.
        </p>
        <section className="recognition" id="recognition" aria-labelledby="recognition-heading">
          <h2 id="recognition-heading">Recognized for community giving</h2>
          <p>
            In 2016, the Colorado chapter of the Association of Fundraising Professionals named Bluepoint Bakery Outstanding Small Business at its National Philanthropy Day luncheon. That giving continues today. Since 2009 we&apos;ve baked and donated every pie for Project Angel Heart&apos;s Pie in the Sky, and we support CASA of Adams &amp; Broomfield Counties, The GrowHaus and Soup for the Soul.
          </p>
        </section>
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
              Bluepoint has also supported the FIRE Foundation&apos;s Thanksgiving pie fundraiser, helping bring the community together around a meaningful cause.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
