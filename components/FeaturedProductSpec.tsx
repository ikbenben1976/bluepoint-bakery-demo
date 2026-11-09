import Image from "next/image";
import Link from "next/link";
import { breadGroups } from "@/data/products";
import { specRows } from "@/lib/spec";

const brioche = breadGroups.flatMap((group) => group.items).find((item) => item.name === 'Brioche Bun 4"');

export function FeaturedProductSpec() {
  if (!brioche) return null;
  return (
    <section className="featured-spec" aria-labelledby="featured-spec-heading">
      <div className="section-intro">
        <div>
          <p className="eyebrow">A closer look</p>
          <h2 id="featured-spec-heading">Product specifications</h2>
          <p>Review product sizes, available options and ordering details to help plan your purchase.</p>
        </div>
      </div>
      <div className="featured-spec-card">
        <figure className="featured-spec-image">
          <Image src="/images/scenes/sesame-buns-rack.webp" alt="Bluepoint buns on a bakery rack; representative category photograph" fill sizes="(max-width: 650px) 75vw, 270px" />
          <figcaption>Representative product image; appearance may vary.</figcaption>
        </figure>
        <div className="featured-spec-info">
          <h3>{brioche.name}</h3>
          <p>{brioche.categoryLabel}</p>
          <p className="featured-spec-label">Available for wholesale</p>
          <Link href="/breads/#buns">Explore buns and rolls <span aria-hidden="true">→</span></Link>
        </div>
        <dl className="featured-spec-facts">
          {specRows(brioche).map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
