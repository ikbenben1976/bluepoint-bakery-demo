import Image from "next/image";
import Link from "next/link";

// Bread and pastry CATEGORY photography belongs here; finished prepared meals
// are intentionally kept in the separate "What are you making?" journey.
const assortment = [
  { href: "/breads/#buns", name: "Buns & Rolls", src: "/images/studio/sesame-bun.webp", alt: "Sesame-topped hamburger bun" },
  { href: "/breads/#deli-loaves", name: "Breads & Loaves", src: "/images/studio/marble-rye.webp", alt: "Sliced marble rye bread" },
  { href: "/pastries/#croissants", name: "Pastries", src: "/images/studio/croissant.webp", alt: "Golden butter croissant" },
  { href: "/breads/#specialty-breads", name: "Specialty Breads", src: "/images/studio/specialty.webp", alt: "Specialty artisan bread" },
  { href: "/pastries/#muffins", name: "Bakery Essentials", src: "/images/studio/muffins.webp", alt: "Assortment of muffins" },
] as const;

export function AssortmentCards() {
  return (
    <section className="assortment" aria-labelledby="assortment-heading">
      <div className="section-intro">
        <div>
          <p className="eyebrow">The Bluepoint catalog</p>
          <h2 id="assortment-heading">Our Product Assortment</h2>
          <p>Explore the actual wholesale categories, from breads and rolls to pastries and specialty items.</p>
        </div>
        <Link className="text-link" href="/breads">Explore the catalog <span aria-hidden="true">→</span></Link>
      </div>
      <ul className="assortment-grid">
        {assortment.map((group) => (
          <li key={group.href}>
            <Link href={group.href} className="assortment-card">
              <span className="assortment-photo"><Image src={group.src} alt={group.alt} fill sizes="(max-width: 580px) 45vw, (max-width: 1000px) 30vw, 200px" /></span>
              <strong>{group.name}</strong>
              <span className="assortment-arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="assortment-actions">
        <Link href="/breads" className="btn btn-ghost">All breads and rolls</Link>
        <Link href="/pastries" className="btn btn-ghost">All pastries</Link>
      </div>
    </section>
  );
}
