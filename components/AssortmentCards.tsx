import Image from "next/image";
import Link from "next/link";
import { assortmentHref, homeAssortment } from "@/data/homeAssortment";

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
        {homeAssortment.map((group) => (
          <li key={group.id}>
            <Link href={assortmentHref(group)} className="assortment-card">
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
