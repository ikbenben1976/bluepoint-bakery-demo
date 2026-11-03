import Image from "next/image";
import Link from "next/link";
import { uses } from "@/data/uses";

const useImages: Record<string, { src: string; alt: string; note: string }> = {
  burgers: {
    src: "/images/studio/sesame-bun.webp",
    alt: "Sesame-topped hamburger bun from Bluepoint's product photography",
    note: "Buns · Kaiser rolls · Sliders",
  },
  sandwiches: {
    src: "/images/studio/sandwich-rolls.webp",
    alt: "Sandwich rolls from Bluepoint's product photography",
    note: "Hoagies · Deli loaves · Baguettes",
  },
  breakfast: {
    src: "/images/studio/croissant.webp",
    alt: "Croissant from Bluepoint's product photography",
    note: "Croissants · Muffins · Scones",
  },
  dinner: {
    src: "/images/studio/brioche-rolls.webp",
    alt: "Dinner rolls from Bluepoint's product photography",
    note: "Dinner rolls · Specialty breads",
  },
};

export function MakingCards() {
  return (
    <section className="making" aria-labelledby="making-heading">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Find your fit</p>
          <h2 id="making-heading">What are you making?</h2>
          <p>Start with your menu. Explore the breads and pastries Bluepoint already lists in its wholesale catalog.</p>
        </div>
        <Link className="text-link" href="/breads">Browse the full bread catalog <span aria-hidden="true">→</span></Link>
      </div>
      <ul className="making-visual-grid">
        {uses.map((use) => {
          const media = useImages[use.slug];
          return (
            <li key={use.slug}>
              <Link href={`/making/${use.slug}`} className="making-visual-link">
                <span className="making-photo">
                  <Image src={media.src} alt={media.alt} fill sizes="(max-width: 740px) 90vw, (max-width: 1200px) 45vw, 270px" />
                </span>
                <span className="making-description">
                  <span className="making-title">{use.title}</span>
                  <small>{media.note}</small>
                  <span className="making-explore">Explore products <span aria-hidden="true">→</span></span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="making-footnote">Catalog groupings help you browse; product suitability and substitutions can be discussed with Bluepoint's sales team.</p>
    </section>
  );
}
