import type { Metadata } from "next";
import { pastryGroups } from "@/data/products";
import { categoryPhotos } from "@/data/photos";
import { PageHero } from "@/components/PageHero";
import { MakingCards } from "@/components/MakingCards";
import { ProductBrowser } from "@/components/ProductBrowser";

export const metadata: Metadata = {
  title: "Pastries",
  description:
    "Wholesale pastries from Bluepoint Bakery. 48 hour notice for orders on all pastries. Many are available individually wrapped.",
};

export default function PastriesPage() {
  return (
    <>
      <PageHero
        kicker="Wholesale"
        title="Pastries"
        image={categoryPhotos.croissants}
        lede={
          <>
            <p>48 hour notice for orders on all pastries.</p>
            <p>Available Individually Wrapped — marked on those items.</p>
          </>
        }
      />
      <div className="shell py-12">
        <MakingCards />
        <ProductBrowser groups={pastryGroups} />
      </div>
    </>
  );
}
