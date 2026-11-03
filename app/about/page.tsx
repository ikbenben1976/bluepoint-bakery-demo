import type { Metadata } from "next";
import Image from "next/image";
import { aboutPhoto, gallery } from "@/data/photos";
import { ADDRESS, HOURS, PHONE_DISPLAY, PHONE_TEL, RAMIREZ_STUDY, WESTWORD_2000, WESTWORD_FOUNDING } from "@/data/site";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bluepoint Bakery is a proud, minority-owned and family-owned bakery headquartered in Denver since 1987. 5105 Cook St., Denver, CO 80216.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero kicker="Since 1987" title="About" lede={<p>Denver</p>} />
      <div className="shell grid gap-10 py-10 md:grid-cols-[1.15fr_0.85fr] md:items-start">
        <div className="max-w-xl space-y-6 text-lg">
          <p>We are a proud, minority-owned and family-owned business headquartered in Denver, Colorado.</p>
          <p>
            Founded in 1987 by chefs Fred Bramhall and Mary Clark, Bluepoint grew from its retail bakery roots into a wholesale supplier serving Colorado&apos;s food-service community.{" "}
            <a href={WESTWORD_FOUNDING}>Westword</a> is the source for that founding. Its 2000 Best of Denver list names Bluepoint{" "}
            <a href={WESTWORD_2000}>Best Bakery</a>.
          </p>
          <p>
            One of Bluepoint’s most compelling stories is Willie Ramirez’s journey from long-serving baker and manager to owner. After 28 years with the bakery, he acquired the business, as described in{" "}
            <a href={RAMIREZ_STUDY}>44 Business Capital’s acquisition story</a>.
          </p>
          <p>
            All of our breads, pastries, and treats are made from scratch daily at our spacious facility. We are trusted by companies and industries that include restaurants, cafes, hotels, country clubs, airports, universities, and catering businesses. Orders can be customized to meet clients&apos; personality, characteristics, or vision.
          </p>
          <p>
            The bakery’s wholesale assortment serves food-service teams across the Front Range, from independent restaurants and cafés to corporate dining, institutions, hotels and catering operations.
          </p>
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
        <figure>
          <Image
            src={aboutPhoto.src}
            alt={aboutPhoto.alt}
            width={aboutPhoto.width}
            height={aboutPhoto.height}
            className="h-auto w-full"
            loading="eager"
          />
          <figcaption className="mt-2 text-sm text-site">From the Bluepoint Bakery about page.</figcaption>
        </figure>
      </div>
      <div className="shell grid gap-4 pb-16 sm:grid-cols-3">
        {gallery.map((photo) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="h-auto w-full"
            loading="eager"
          />
        ))}
      </div>
    </>
  );
}
