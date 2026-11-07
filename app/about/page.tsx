import type { Metadata } from "next";
import Image from "next/image";
import { aboutPhoto, gallery, WILLIE_CAPTION, williePortrait } from "@/data/photos";
import { ADDRESS, HOURS, PHONE_DISPLAY, PHONE_TEL, RAMIREZ_STUDY, WESTWORD_2000, WESTWORD_FOUNDING } from "@/data/site";
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
            {/* https://www.bluepointbakery.com/about */}
            <p>We are a proud, minority-owned and family-owned business headquartered in Denver, Colorado.</p>
            {/*
              Westword location page, wording only:
              “Bluepoint Bakery, founded in 1987 by chefs Fred Bramhall and Mary Clark, was once one of the town’s top retail bakeries, with a storefront that exuded good smells up and down Sixth Avenue. Today, Bluepoint continues to bake from its wholesale spot in north Denver…”
              https://www.westword.com/location/bluepoint-bakery-5170644/
              Best of Denver 2000: “Best Bakery – Bluepoint Bakery”
              https://www.westword.com/news/best-of-denver-winners-from-2000-5834471/
              The location page still prints 1721 E. 58th Ave. That address is not used here.
            */}
            <p>
              Bluepoint Bakery was founded in 1987 by chefs Fred Bramhall and Mary Clark.{" "}
              <a href={WESTWORD_FOUNDING}>Westword</a> describes it as once one of the town&apos;s top retail bakeries, with a storefront on Sixth Avenue, and today a wholesale bakery in north Denver.
            </p>
            <p>
              In Westword&apos;s Best of Denver 2000, Bluepoint is named <a href={WESTWORD_2000}>Best Bakery</a>.
            </p>
            <h2>Willie Ramirez, from baker to owner</h2>
            {/*
              44 Business Capital, “From Baker to Manager to Owner. Long-time Employee Acquires Bakery Business with $2,675,000 SBA Loan.”
              “After 28 years of working in and managing Bluepoint Bakery, Willie Ramirez needed a bank and lender that would enable him to acquire full ownership of the bakery.”
              The financing “left all of the employees and the entire operation intact.” The page gives no date.
              The loan amount in the headline is not repeated on this page.
              https://www.44businesscapital.com/business-loan-story/from-baker-to-manager-to-owner-long-time-employee-acquires-bakery-business-with-2675000-sba-loan/
            */}
            <p>
              After 28 years of working in and managing Bluepoint Bakery, Willie Ramirez acquired full ownership.{" "}
              <a href={RAMIREZ_STUDY}>44 Business Capital</a> says the employees and the operation were left intact, and that family members surround him in the bakery.
            </p>
            <blockquote className="about-quote">
              <p>
                &ldquo;Now that I own 100% of the bakery, I can focus on growing the business to meet the needs of my customers, namely providing the best breads to the best restaurants in Colorado.&rdquo;
              </p>
              <footer>Willie Ramirez, quoted by 44 Business Capital</footer>
            </blockquote>
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
          <figure className="about-figure about-portrait">
            <Image
              src={williePortrait.src}
              alt={williePortrait.alt}
              width={williePortrait.width}
              height={williePortrait.height}
              className="about-story-photo"
              sizes="(max-width: 899px) 100vw, 480px"
              priority
            />
            <figcaption>{WILLIE_CAPTION}</figcaption>
          </figure>
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
