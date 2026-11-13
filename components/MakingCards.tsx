import Link from "next/link";
import Image from "next/image";
import { FramedImage } from "@/components/FramedImage";
import { applicationVisuals } from "@/data/illustrative";
import { PERMISSION_NOTE, platedPhotoFor } from "@/data/usePhotos";
import { makingHref } from "@/data/making";
import { uses } from "@/data/uses";

// Finished dishes on the home cards. Burgers, sandwiches, and breakfast use
// plated photos. Dinner stays illustrative. The bakery assortment is AssortmentCards.
const descriptions: Record<keyof typeof applicationVisuals, string> = {
  burgers: "Find the right foundation for your burgers, from brioche buns to classic Kaisers and sliders.",
  sandwiches: "Build your sandwich menu with deli breads, hoagie rolls, baguettes and more.",
  breakfast: "Round out your morning menu with croissants, muffins, scones and other breakfast favorites.",
  dinner: "From dinner rolls to specialty breads, explore options for the table and catered events.",
};

export function MakingCards() {
  return (
    <section className="making application-section" aria-labelledby="making-heading">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Start with your menu</p>
          <h2 id="making-heading">What are you making?</h2>
          <p>Start with what you&apos;re serving. Find breads and pastries that bring your menu together.</p>
        </div>
      </div>
      <ul className="making-visual-grid">
        {uses.map((use) => {
          const plate = platedPhotoFor(use.slug);
          const example = applicationVisuals[use.slug as keyof typeof applicationVisuals];
          return (
            <li key={use.slug}>
              <Link className="making-visual-link" href={makingHref(use.slug)}>
                <span className="making-photo">
                  {plate ? (
                    <>
                      <span className="making-plate">
                        <Image
                          src={plate.src}
                          alt={plate.alt}
                          fill
                          sizes="(max-width: 650px) 100vw, 50vw"
                          style={{ objectFit: "cover" }}
                        />
                        {plate.aiLabel ? <span className="illustrative-label">{plate.aiLabel}</span> : null}
                      </span>
                      <span className="making-permission">
                        {plate.credit} {PERMISSION_NOTE}
                      </span>
                    </>
                  ) : (
                    <FramedImage
                      webp={example.webp}
                      avif={example.avif}
                      alt={example.alt}
                      width={example.width}
                      height={example.height}
                      sizes="(max-width: 650px) 100vw, (max-width: 1100px) 50vw, 540px"
                      label="Illustrative image"
                    />
                  )}
                </span>
                <span className="making-description">
                  <span className="making-title">{use.title}</span>
                  <span className="making-summary">{descriptions[use.slug as keyof typeof descriptions]}</span>
                  <span className="making-explore">Explore recommended products <span aria-hidden="true">→</span></span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="making-footnote">
        Menu images illustrate serving ideas; they do not identify specific Bluepoint products.
      </p>
    </section>
  );
}
