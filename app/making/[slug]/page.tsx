import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductBrowser } from "@/components/ProductBrowser";
import { groupsForUse, publishedBunSizes, uses } from "@/data/uses";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return uses.map((use) => ({ slug: use.slug }));
}

export function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const use = uses.find((item) => item.slug === slug);
    return {
      title: use ? use.title : "Products",
      description: use?.summary ?? "Products from the Bluepoint Bakery catalog.",
    };
  });
}

export default async function MakingPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const use = uses.find((item) => item.slug === slug);
  if (!use) notFound();
  const groups = groupsForUse(slug);
  const sizes = slug === "burgers" ? publishedBunSizes() : [];

  return (
    <div className="shell py-12">
      <p className="kicker">What are you making?</p>
      <h1>{use.title}</h1>
      <p>{use.summary}</p>
      {sizes.length > 0 ? (
        <p>Published sizes on the bun list: {sizes.join(", ")}. Each size is its own item.</p>
      ) : null}
      <ProductBrowser groups={groups} />
    </div>
  );
}
