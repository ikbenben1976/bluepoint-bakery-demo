import Image from "next/image";
import Link from "next/link";
import { uses } from "@/data/uses";

// Menu applications are illustrative finished dishes, not individual Bluepoint SKUs.
// The actual bakery assortment is displayed separately in AssortmentCards and catalog pages.
const applications: Record<string, { image: string; alt: string; description: string }> = {
  burgers: {
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1050&q=80",
    alt: "Finished cheeseburger with fresh lettuce, tomato and a glossy bun",
    description: "Browse brioche hamburger buns, Kaiser rolls and slider options.",
  },
  sandwiches: {
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1050&q=80",
    alt: "Stacked deli sandwich on sliced bread with meat, vegetables and pickle",
    description: "Explore deli loaves, hoagies, Philly rolls, baguettes and sliced breads.",
  },
  breakfast: {
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1050&q=80",
    alt: "Croissants and breakfast pastries ready to serve at a café",
    description: "Find croissants, muffins, scones, Danish and quick breads.",
  },
  dinner: {
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1050&q=80",
    alt: "Fresh bread ready for dinner or catered service",
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
      <p className="making-footnote">Illustrative application photos, not photographs of Bluepoint products. Browse the actual Bluepoint assortment below.</p>
    </section>
  );
}
