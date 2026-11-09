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
    heading: "Buns for every burger",
    body: "Choose from hamburger buns and Kaiser rolls in 4-inch and 5-inch sizes, plus a 3.5-inch picnic bun. Explore slider options below. Allow at least 24 hours' notice for bread orders.",
    picks: [
      { category: "buns", name: 'Brioche Bun 4"' },
      { category: "buns", name: 'Picnic Bun 3.5"' },
      { category: "buns", name: 'Sesame Topped Kaiser 5"' },
      { category: "dinner-rolls", name: "6x5 Slider Buns (30 count)" },
    ],
  },
  sandwiches: {
    heading: "Find the right bread for every sandwich",
    body: "From soft hoagie and Philly rolls to sliced deli loaves and French baguettes, find breads to suit your sandwich menu. Compare sizes and slicing options in the listings below.",
    picks: [
      { category: "sandwich-rolls", name: 'Soft Hoagie 7"' },
      { category: "sandwich-rolls", name: 'Club Roll 6" sliced' },
      { category: "deli-loaves", name: "Vienna White" },
      { category: "french-breads", name: 'Baguette 12"' },
    ],
  },
  breakfast: {
    heading: "Start the day with something fresh",
    body: "Build your morning selection with butter croissants, Danish pastries, scones, muffins and quick breads. Individual wrapping is available on select items; please allow at least 48 hours' notice.",
    picks: [
      { category: "croissants", name: "Curved Butter Croissant 3 oz" },
      { category: "danishes", name: "Cream Cheese" },
      { category: "scones", name: "Double Orange" },
      { category: "muffins", name: "Blueberry" },
    ],
  },
  dinner: {
    heading: "Breads for the table and beyond",
    body: "Explore dinner rolls, rustic breads and focaccia for table service or catered events. Check individual product listings for pack sizes and lead times; Sourdough Boule requires three days' notice.",
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
        <p>Available bun sizes include {sizes.join(", ")}. Explore individual products below for details.</p>
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
