import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { aboutPhoto, gallery, WILLIE_CAPTION, williePortrait } from "@/data/photos";
import { ADDRESS, HOURS, PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { PageHero } from "@/components/PageHero";
import { WhyBluepoint } from "@/components/WhyBluepoint";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bluepoint Bakery is a proud, minority-owned and family-owned bakery headquartered in Denver since 1987. 5105 Cook St., Denver, CO 80216.",
  alternates: { canonical: "/about/" },
  robots: { index: false, follow: false },
};

export default function AboutPage() {
  const rest = [...gallery];
  if (!rest.some((photo) => photo.src === aboutPhoto.src)) rest.push(aboutPhoto);

  return (
    <>
      <PageHero kicker="Our story" title="Baking for Colorado since 1987" lede={<p>Fresh from Denver, serving the Front Range.</p>} contained />
      <article className="shell about-page">
        <div className="about-story">
          <div className="about-copy">
            <div className="willie-story">
              <div className="willie-copy">
                <p className="eyebrow">Our story</p>
                <h2>
                  From the bakery floor to business ownership: <span className="story-name">Willie Ramirez</span>
                </h2>
                <p>
                  Bluepoint Bakery began in Denver in 1987, founded by chefs Fred Bramhall and Mary Clark. Willie Ramirez built his career inside the bakery, spending 28 years baking, managing operations and helping the business grow before becoming its owner.
                </p>
                <p>
                  Today, Bluepoint continues its tradition as a minority-owned, family-owned Colorado bakery, combining scratch baking with dedicated wholesale service. From independent restaurants to institutional kitchens, we focus on dependable delivery, quality products and strong customer relationships.
                </p>
              </div>
              <figure className="about-figure about-portrait willie-portrait">
                <Image
                  src={williePortrait.src}
                  alt={williePortrait.alt}
                  width={williePortrait.width}
                  height={williePortrait.height}
                  className="about-story-photo"
                  sizes="(max-width: 899px) 100vw, 360px"
                />
                <figcaption>{WILLIE_CAPTION}</figcaption>
              </figure>
            </div>
            <p>
              <Link href="/community#recognition">Recognized for giving back — see our community work</Link>
            </p>
            {/* https://www.bluepointbakery.com/about */}
            <p>
              Every day, our Denver bakery prepares fresh breads, pastries and specialty baked goods for food-service businesses throughout the region. Our customers span hospitality and food service, from local cafés and restaurants to hotels, universities and catering operations. Have something specific in mind? Our team can discuss customization options to suit your menu and business needs.
            </p>
            <p>We also deliver to Cheyenne and nearby communities in Wyoming.</p>
            <p>
              {ADDRESS}
              <br />
              <a className="text-royal underline" href={`tel:${PHONE_TEL}`}>
                {PHONE_DISPLAY}
              </a>
              <br />
              Office hours {HOURS}
            </p>
          </div>
        </div>
      </article>
      <WhyBluepoint />
      <div className="shell about-gallery">
          <div className="about-gallery-grid">
            {rest.map((photo) => (
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="eager"
              />
            ))}
          </div>
        </div>
    </>
  );
}
