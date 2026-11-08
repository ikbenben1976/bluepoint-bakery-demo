import type { Metadata } from "next";
import Image from "next/image";
import { aboutPhoto, gallery, WILLIE_CAPTION, williePortrait } from "@/data/photos";
import { ADDRESS, HOURS, PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { PageHero } from "@/components/PageHero";

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
      <PageHero kicker="Since 1987" title="About" lede={<p>Denver</p>} contained />
      <article className="shell about-page">
        <div className="about-story">
          <div className="about-copy">
            <div className="willie-story">
              <div className="willie-copy">
                <p className="eyebrow">Our story</p>
                <h2>
                  From baker to owner: <span className="story-name">Willie Ramirez</span>
                </h2>
                <p>
                  Bluepoint Bakery opened in Denver in 1987, founded by chefs Fred Bramhall and Mary Clark. Willie Ramirez started in the kitchen and spent 28 years baking for and running the bakery before taking full ownership.
                </p>
                <p>
                  Today Bluepoint is a proud minority-owned, family-owned business. We still bake from scratch with high-quality ingredients and deliver to restaurants, cafés, hotels, hospitals, schools and catering kitchens up and down the Front Range. Reliable, on-time delivery and clear communication are how we work with every account.
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
            {/*
              The 2016 award appears only in this story.
              PR Newswire, 11 Oct 2016, Association of Fundraising Professionals, Colorado Chapter:
              “Outstanding Small Business: Bluepoint Bakery (Denver)” at the National Philanthropy Day in Colorado Luncheon on 10 Nov 2016.
              https://www.prnewswire.com/news-releases/outstanding-colorado-philanthropists-honored-300342380.html
              bluepointbakery.com/community says “2016 Colorado Small Business Philanthropist of the Year.” That wording is not used here.
            */}
            <p>
              In 2016, the Association of Fundraising Professionals, Colorado Chapter (AFP Colorado Chapter) named Bluepoint Bakery Outstanding Small Business at its National Philanthropy Day in Colorado luncheon on November 10.
            </p>
            {/* https://www.bluepointbakery.com/about */}
            <p>
              All of our breads, pastries, and treats are made from scratch daily at our spacious facility. We are trusted by companies and industries that include restaurants, cafes, hotels, country clubs, airports, universities, and catering businesses. Orders can be customized to meet clients&apos; personality, characteristics, or vision.
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
        <div className="about-gallery">
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
      </article>
    </>
  );
}
