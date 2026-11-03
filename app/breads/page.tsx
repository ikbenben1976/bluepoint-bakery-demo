import type { Metadata } from "next";
import { breadGroups } from "@/data/products";
import { categoryPhotos } from "@/data/photos";
import { PageHero } from "@/components/PageHero";
import { MakingCards } from "@/components/MakingCards";
import { ProductBrowser } from "@/components/ProductBrowser";

export const metadata: Metadata = {
  title: "Breads",
  description:
    "Wholesale breads from Bluepoint Bakery. 24 hour notice for orders on all breads. Sourdough Boule: 3 day notice required.",
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
      <div className="shell py-12">
        <MakingCards />
        <ProductBrowser groups={breadGroups} />
      </div>
    </>
  );
}
