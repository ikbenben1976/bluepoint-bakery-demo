import Image from "next/image";
import Link from "next/link";

// Bread and pastry CATEGORY photography belongs here; finished prepared meals
// are intentionally kept in the separate "What are you making?" journey.
const assortment = [
  { href: "/breads/#buns", name: "Buns & Rolls", line: "Buns and Kaiser rolls", src: "/images/scenes/sesame-buns-rack.webp", alt: "Bluepoint sesame-topped buns on a bakery rack" },
  { href: "/breads/#deli-loaves", name: "Breads & Loaves", line: "Deli loaves, pan loaves, and French breads", src: "/images/scenes/baguette-rack.webp", alt: "Baguettes on a rack at Bluepoint Bakery" },
  { href: "/pastries/#croissants", name: "Pastries", line: "Croissants, Danish, muffins, and other pastries", src: "/images/scenes/chocolate-pastries.webp", alt: "Finished chocolate pastries on Bluepoint bakery racks" },
  { href: "/breads/#specialty-breads", name: "Specialty Breads", line: "Focaccia, rustic rolls, and sourdough boule", src: "/images/scenes/baguette-tray.webp", alt: "Bluepoint specialty French breads on a baking tray" },
  { href: "/pastries/", name: "Desserts & Sweet Treats", line: "Pies, brownies, cookies, and muffins", src: "/images/scenes/brownie-sheet.webp", alt: "A sheet of brownies in the Bluepoint bakery" },
] as const;

export function AssortmentCards() {
  return (
    <section className="assortment" aria-labelledby="assortment-heading">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Baked for your business</p>
          <h2 id="assortment-heading">Explore Our Bakery Products</h2>
          <p>From everyday sandwich breads to specialty rolls and pastries, discover the products behind your menu.</p>
        </div>
        <Link className="text-link" href="/breads">Explore the catalog <span aria-hidden="true">→</span></Link>
      </div>
      <ul className="assortment-grid">
        {assortment.map((group) => (
          <li key={group.href}>
            <Link href={group.href} className="assortment-card">
              <span className="assortment-photo"><Image src={group.src} alt={group.alt} fill sizes="(max-width: 580px) 45vw, (max-width: 1000px) 30vw, 200px" /></span>
              <strong>
                {group.name}
                <span className="assortment-line">{group.line}</span>
              </strong>
              <span className="assortment-arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="assortment-actions">
        <Link href="/breads" className="btn btn-ghost">Browse all breads & rolls</Link>
        <Link href="/pastries" className="btn btn-ghost">Browse all pastries</Link>
      </div>
    </section>
  );
}
