import Image from "next/image";
import Link from "next/link";
import { breadGroups } from "@/data/products";
import { leadWords, publishedSize } from "@/lib/spec";

const brioche = breadGroups.flatMap((group) => group.items).find((item) => item.name === 'Brioche Bun 4"');

export function FeaturedProductSpec() {
  if (!brioche) return null;
  return (
    <section className="featured-spec" aria-labelledby="featured-spec-heading">
      <div className="section-intro">
        <div>
          <p className="eyebrow">A closer look</p>
          <h2 id="featured-spec-heading">Product details at a glance</h2>
          <p>Explore documented specifications before starting your wholesale request.</p>
        </div>
      </div>
      <div className="featured-spec-card">
        <figure className="featured-spec-image">
          <Image src="/images/studio/sesame-bun.webp" alt="Representative bun from the published bakery photo collection" fill sizes="(max-width: 650px) 75vw, 270px" />
          <figcaption>Representative bun photo — not confirmed as this specific brioche item.</figcaption>
        </figure>
        <div className="featured-spec-info">
          <h3>{brioche.name}</h3>
          <p>{brioche.categoryLabel}</p>
          <p className="featured-spec-label">Wholesale product</p>
          <Link href="/breads/#buns">Explore buns and rolls <span aria-hidden="true">→</span></Link>
        </div>
        <dl className="featured-spec-facts">
          <div><dt>Published size</dt><dd>{publishedSize(brioche.name) ?? "Confirm with bakery"}</dd></div>
          <div><dt>Order lead time</dt><dd>{leadWords(brioche)}</dd></div>
          <div><dt>Case quantity</dt><dd>Confirm with bakery</dd></div>
          <div><dt>Ingredients / allergens</dt><dd>Details available on request</dd></div>
          <div><dt>Pricing</dt><dd>Contact sales</dd></div>
        </dl>
      </div>
    </section>
  );
}
