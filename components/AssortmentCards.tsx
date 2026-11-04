import Image from "next/image";
import Link from "next/link";

// Bread and pastry CATEGORY photography belongs here; finished prepared meals
// are intentionally kept in the separate "What are you making?" journey.
const assortment = [
  { href: "/breads/#buns", name: "Buns & Rolls", src: "/images/scenes/sesame-buns-rack.webp", alt: "Bluepoint sesame-topped buns on a bakery rack" },
  { href: "/breads/#deli-loaves", name: "Breads & Loaves", src: "/images/scenes/rack-loaves.webp", alt: "Freshly baked Bluepoint bread loaves on a rack" },
  { href: "/pastries/#croissants", name: "Pastries", src: "/images/scenes/chocolate-pastries.webp", alt: "Finished chocolate pastries on Bluepoint bakery racks" },
  { href: "/breads/#specialty-breads", name: "Specialty Breads", src: "/images/scenes/baguette-tray.webp", alt: "Bluepoint specialty French breads on a baking tray" },
  { href: "/pastries/", name: "Sweet Bakery Favorites", src: "/images/scenes/cherry-pies.webp", alt: "Fresh cherry pies being prepared at Bluepoint Bakery" },
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
