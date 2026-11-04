import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { products } from "@/data/products";
import { categoryPhotos } from "@/data/photos";
import { sectors } from "@/data/sectors";
import { CAFE_REVIEW } from "@/data/site";
import { PublishedProof } from "@/components/PublishedProof";

type Params = { slug: string };

const SERVED =
  "Bluepoint serves businesses in this area. Contact the bakery to confirm your address, delivery days, and ordering requirements.";

const featured: Record<string, { category: string; name: string }[]> = {
  restaurants: [
    { category: "buns", name: 'Brioche Bun 4"' },
    { category: "buns", name: 'Sesame Kaiser 4"' },
    { category: "sandwich-rolls", name: 'Club Roll 6"' },
    { category: "sandwich-rolls", name: 'Soft Hoagie 7"' },
  ],
  cafes: [
    { category: "croissants", name: "Curved Butter Croissant 3 oz" },
    { category: "muffins", name: "Blueberry" },
    { category: "scones", name: "Double Orange" },
    { category: "danishes", name: "Cream Cheese" },
  ],
  hotels: [
    { category: "dinner-rolls", name: "Brioche (Dozen)" },
    { category: "specialty-breads", name: "French Rustic Roll" },
    { category: "pies", name: "Dutch Apple Pie" },
    { category: "croissants", name: "Curved Butter Croissant 3 oz" },
  ],
  institutions: [
    { category: "deli-loaves", name: "Vienna White" },
    { category: "pan-loaves", name: "Vienna White" },
    { category: "sandwich-rolls", name: 'Club Roll 8"' },
    { category: "muffins", name: "Blueberry" },
  ],
};

const heroes: Record<string, string> = {
  restaurants: "buns",
  cafes: "croissants",
  hotels: "dinner-rolls",
  institutions: "deli-loaves",
};

export function generateStaticParams(): Params[] {
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const sector = sectors.find((item) => item.slug === slug);
    return {
      title: sector ? sector.title : "Who we bake for",
      description: sector?.description ?? "Who Bluepoint Bakery says it serves.",
      alternates: { canonical: `/sectors/${slug}/` },
      robots: { index: false, follow: false },
    };
  });
}

export default async function SectorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const sector = sectors.find((item) => item.slug === slug);
  if (!sector) notFound();
  const photo = categoryPhotos[heroes[slug] ?? "buns"];
  const cards = (featured[slug] ?? [])
    .map((item) => products.find((product) => product.category === item.category && product.name === item.name))
    .filter((product) => product != null);
  const quotes =
    slug === "cafes"
      ? [{ quote: CAFE_REVIEW.quote, by: `${CAFE_REVIEW.source}, ${CAFE_REVIEW.when}` }]
      : [];

  return (
    <>
      <PageHero kicker="Who we bake for" title={sector.title} image={photo} lede={<p>{sector.body[0]}</p>} />
      <div className="shell sector-page content-page">
        {sector.body.slice(1).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <ul className="sector-products">
          {cards.map((product) => {
            const shot = categoryPhotos[product.category];
            const href = product.family === "pastries" ? "/pastries" : "/breads";
            return (
              <li key={product.id}>
                <Link href={`${href}#${product.id}`}>
                  {shot ? (
                    <Image src={shot.src} alt="" width={160} height={120} />
                  ) : null}
                  <span>{product.name}</span>
                  <small>{product.categoryLabel}</small>
                </Link>
              </li>
            );
          })}
        </ul>
        {slug === "restaurants" ? <PublishedProof /> : null}
        {quotes.length > 0 ? (
          <div className="quote-columns">
            {quotes.map((quote) => (
              <blockquote key={quote.by}>
                <p>&ldquo;{quote.quote}&rdquo;</p>
                <footer>{quote.by}</footer>
              </blockquote>
            ))}
          </div>
        ) : null}
        <nav className="sector-related" aria-label={`Explore more for ${sector.title}`}>
          <h2>Explore products for your business</h2>
          <ul>
            {sector.links.map((item) => (
              <li key={item.href}><Link href={item.href}>{item.label} <span aria-hidden="true">→</span></Link></li>
            ))}
          </ul>
        </nav>
        <p>{SERVED}</p>
        <div className="hero-actions">
          <Link href="/breads" className="btn btn-primary">
            Explore products
          </Link>
          <Link href="/wholesale" className="btn btn-ghost">
            Request pricing
          </Link>
        </div>
      </div>
    </>
  );
}
