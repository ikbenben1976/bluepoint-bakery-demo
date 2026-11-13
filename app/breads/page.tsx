import type { Metadata } from "next";
import { breadGroups } from "@/data/products";
import { categoryPhotos } from "@/data/photos";
import { PageHero } from "@/components/PageHero";
import { ProductBrowser } from "@/components/ProductBrowser";
import { FeaturedProductSpec } from "@/components/FeaturedProductSpec";

export const metadata: Metadata = {
  title: "Breads",
  description:
    "Wholesale breads from Bluepoint Bakery. Please allow at least 24 hours&apos; notice for bread orders. Sourdough Boule requires three days&apos; advance notice.",
  alternates: { canonical: "/breads/" },
  robots: { index: false, follow: false },
};

export default function BreadsPage() {
  return (
    <>
      <PageHero
        kicker="Wholesale"
        title="Breads"
        image={categoryPhotos["french-breads"]}
        lede={
          <>
            <p>24 hour notice for orders on all breads.</p>
            <p>Sourdough Boule: 3 day notice required.</p>
          </>
        }
      />
      <div id="catalog" className="shell py-12 content-page">
        <ProductBrowser groups={breadGroups} />
        <div className="featured-spec-in-catalog"><FeaturedProductSpec /></div>
      </div>
    </>
  );
}
