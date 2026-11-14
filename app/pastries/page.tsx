import type { Metadata } from "next";
import { pastryGroups } from "@/data/products";
import { categoryPhotos } from "@/data/photos";
import { PageHero } from "@/components/PageHero";
import { ProductBrowser } from "@/components/ProductBrowser";

export const metadata: Metadata = {
  title: "Pastries",
  description:
    "Wholesale pastries from Bluepoint Bakery. Please allow at least 48 hours&apos; notice for pastry orders. Many are available individually wrapped.",
  alternates: { canonical: "/pastries/" },
  robots: { index: false, follow: false },
};

export default function PastriesPage() {
  return (
    <>
      <PageHero
        className="catalog-hero"
        kicker="Wholesale"
        title="Pastries"
        image={categoryPhotos.croissants}
        lede={
          <>
            <p>48 hour notice for orders on all pastries.</p>
            <p>Individual wrapping is available on select pastries. Look for the label on eligible products.</p>
          </>
        }
      />
      <div id="catalog" className="shell py-12 content-page">
        <ProductBrowser groups={pastryGroups} />
      </div>
    </>
  );
}
