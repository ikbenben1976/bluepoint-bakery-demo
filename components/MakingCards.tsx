import Link from "next/link";
import { FramedImage } from "@/components/FramedImage";
import { applicationVisuals } from "@/data/illustrative";
import { uses } from "@/data/uses";

// Menu applications are illustrative finished dishes, not individual Bluepoint SKUs.
// The actual bakery assortment is displayed separately in AssortmentCards and catalog pages.
const descriptions: Record<keyof typeof applicationVisuals, string> = {
  burgers: "Browse brioche hamburger buns, Kaiser rolls and slider options.",
  sandwiches: "Explore deli loaves, hoagies, Philly rolls, baguettes and sliced breads.",
  breakfast: "Find croissants, muffins, scones, Danish and quick breads.",
  dinner: "Explore dinner rolls, rustic breads and bread-service options.",
};

export function MakingCards() {
  return (
    <section className="making application-section" aria-labelledby="making-heading">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Start with your menu</p>
          <h2 id="making-heading">What are you making?</h2>
          <p>Choose the dish or service you have in mind. We&apos;ll help you explore relevant breads and pastries.</p>
        </div>
      </div>
      <ul className="making-visual-grid">
        {uses.map((use) => {
          const example = applicationVisuals[use.slug as keyof typeof applicationVisuals];
          return (
            <li key={use.slug}>
              <Link className="making-visual-link" href={`/making/${use.slug}`}>
                <span className="making-photo">
                  <FramedImage
                    webp={example.webp}
                    avif={example.avif}
                    alt={example.alt}
                    width={example.width}
                    height={example.height}
                    sizes="(max-width: 650px) 100vw, (max-width: 1100px) 50vw, 540px"
                    label="Illustrative image"
                  />
                </span>
                <span className="making-description">
                  <span className="making-title">{use.title}</span>
                  <span className="making-summary">{descriptions[use.slug as keyof typeof descriptions]}</span>
                  <span className="making-explore">Find matching products <span aria-hidden="true">→</span></span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="making-footnote">
        Illustrative images, not photographs of Bluepoint products. The bakery&apos;s own products are in Our Product
        Assortment, above.
      </p>
    </section>
  );
}
