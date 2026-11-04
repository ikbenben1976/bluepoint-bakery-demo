import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBrowser } from "@/components/ProductBrowser";
import { products } from "@/data/products";
import { groupsForUse, publishedBunSizes, uses } from "@/data/uses";
import { cardFacts } from "@/lib/spec";

type Params = { slug: string };

const guides: Record<string, { heading: string; body: string; picks: { category: string; name: string }[] }> = {
  burgers: {
    heading: "Buns, Kaisers, and sliders",
    body: "The bun list publishes 4 inch and 5 inch hamburger buns and Kaiser rolls, plus a 3.5 inch picnic bun. Premium Brioche Bun has no size printed on that list. Slider buns are the 6x5, 30 count, 1.5 oz line. Breads need 24 hour notice.",
    picks: [
      { category: "buns", name: 'Brioche Bun 4"' },
      { category: "buns", name: 'Picnic Bun 3.5"' },
      { category: "buns", name: 'Sesame Topped Kaiser 5"' },
      { category: "dinner-rolls", name: "6x5 Slider Buns (30 count)" },
    ],
  },
  sandwiches: {
    heading: "Rolls, loaves, and French breads",
    body: "Sandwich rolls include a 7 inch soft hoagie, a 6 inch Philly roll, and club rolls at 6 and 8 inches, including sliced club rolls. Deli loaves publish 1/2, 5/8, and 3/4 inch slices, with Potato Rosemary at 3/4 inch only and Dakota without a 5/8 inch slice. French breads run from a 6 inch baguette to a 24 inch Parisien.",
    picks: [
      { category: "sandwich-rolls", name: 'Soft Hoagie 7"' },
      { category: "sandwich-rolls", name: 'Club Roll 6" sliced' },
      { category: "deli-loaves", name: "Vienna White" },
      { category: "french-breads", name: 'Baguette 12"' },
    ],
  },
  breakfast: {
    heading: "Pastry for the morning",
    body: "Croissants are marked pure butter. The pastry page also lists danishes, scones, muffins, muffin tops, and quick breads. Pastries need 48 hour notice. An asterisk on the pastry page is shown here as individually wrapped.",
    picks: [
      { category: "croissants", name: "Curved Butter Croissant 3 oz" },
      { category: "danishes", name: "Cream Cheese" },
      { category: "scones", name: "Double Orange" },
      { category: "muffins", name: "Blueberry" },
    ],
  },
  dinner: {
    heading: "Rolls and breads for service",
    body: "Dinner rolls are 1.5 oz. Brioche and potato rolls are listed by the dozen and by the case of 120. Specialty breads include rustic rolls, focaccia, and a sourdough boule that needs 3 day notice. Pies are on the pastry list.",
    picks: [
      { category: "dinner-rolls", name: "Brioche (Dozen)" },
      { category: "dinner-rolls", name: "Brioche (Case 120)" },
      { category: "specialty-breads", name: "French Rustic Roll" },
      { category: "pies", name: "Dutch Apple Pie" },
    ],
  },
};

export function generateStaticParams(): Params[] {
  return uses.map((use) => ({ slug: use.slug }));
}

export function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const use = uses.find((item) => item.slug === slug);
    return {
      title: use ? use.title : "Products",
      description: use?.summary ?? "Products from the Bluepoint Bakery catalog.",
      alternates: { canonical: `/making/${slug}/` },
      robots: { index: false, follow: false },
    };
  });
}

export default async function MakingPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const use = uses.find((item) => item.slug === slug);
  if (!use) notFound();
  const groups = groupsForUse(slug);
  const guide = guides[slug];
  const sizes = slug === "burgers" ? publishedBunSizes() : [];
  const onPage = new Set(groups.flatMap((group) => group.items.map((item) => item.id)));

  return (
    <div className="shell py-12 content-page">
      <p className="kicker">What are you making?</p>
      <h1>{use.title}</h1>
      <p>{use.summary}</p>
      {sizes.length > 0 ? (
        <p>Published sizes on the bun list: {sizes.join(", ")}. Each size is its own item.</p>
      ) : null}
      {guide ? (
        <section className="menu-guide" aria-labelledby="menu-guide-heading">
          <h2 id="menu-guide-heading">{guide.heading}</h2>
          <p>{guide.body}</p>
          <ul>
            {guide.picks.map((pick) => {
              const product = products.find((item) => item.category === pick.category && item.name === pick.name);
              if (!product) return null;
              const href = onPage.has(product.id)
                ? `#${product.id}`
                : `/${product.family === "pastries" ? "pastries" : "breads"}/#${product.id}`;
              return (
                <li key={product.id}>
                  <Link href={href}>
                    <span>{product.name}</span>
                    <small>{cardFacts(product)}</small>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
      <ProductBrowser groups={groups} />
    </div>
  );
}
