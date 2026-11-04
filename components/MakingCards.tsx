import Image from "next/image";
import Link from "next/link";
import { uses } from "@/data/uses";

// Menu applications are illustrative finished dishes, not individual Bluepoint SKUs.
// The actual bakery assortment is displayed separately in AssortmentCards and catalog pages.
const applications: Record<string, { image: string; alt: string; description: string }> = {
  burgers: {
    image: "/images/applications/burgers.webp",
    alt: "Finished cheeseburger with fresh lettuce, tomato and a glossy bun",
    description: "Browse brioche hamburger buns, Kaiser rolls and slider options.",
  },
  sandwiches: {
    image: "/images/applications/sandwiches.webp",
    alt: "Stacked deli sandwich on sliced bread with meat, vegetables and pickle",
    description: "Explore deli loaves, hoagies, Philly rolls, baguettes and sliced breads.",
  },
  breakfast: {
    image: "/images/applications/breakfast.webp",
    alt: "Croissants and breakfast pastries ready to serve at a café",
    description: "Find croissants, muffins, scones, Danish and quick breads.",
  },
  dinner: {
    image: "/images/applications/dinner.webp",
    alt: "Bread rolls presented in a basket on a restaurant table",
    description: "Explore dinner rolls, rustic breads and bread-service options.",
  },
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
          const example = applications[use.slug];
          return (
            <li key={use.slug}>
              <Link className="making-visual-link" href={`/making/${use.slug}`}>
                <span className="making-photo">
                  <Image
                    src={example.image}
                    alt={example.alt}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 540px"
                  />
                </span>
                <span className="making-description">
                  <span className="making-title">{use.title}</span>
                  <span className="making-summary">{example.description}</span>
                  <span className="making-explore">Find matching products <span aria-hidden="true">→</span></span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="making-footnote">Illustrative menu photography. Product choices and specifications are confirmed through the Bluepoint catalog and sales team.</p>
    </section>
  );
}
