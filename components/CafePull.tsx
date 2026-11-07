import Image from "next/image";
import { URBAN_EGG_PULL_CREDIT, URBAN_EGG_PULL_QUOTE } from "@/data/customers";
import { PERMISSION_NOTE, platedPhotoFor } from "@/data/usePhotos";

export function CafePull() {
  const plate = platedPhotoFor("breakfast");
  if (!plate) return null;
  return (
    <aside className="cafe-pull">
      <blockquote className="proof-quote cafe-pull-quote">
        <p>“{URBAN_EGG_PULL_QUOTE}”</p>
        <footer>{URBAN_EGG_PULL_CREDIT}</footer>
      </blockquote>
      <figure className="cafe-pull-photo">
        <Image
          src={plate.src}
          alt={plate.alt}
          width={plate.width}
          height={plate.height}
          sizes="(max-width: 799px) 100vw, 480px"
        />
        {plate.aiLabel ? <span className="illustrative-label">{plate.aiLabel}</span> : null}
        <figcaption className="making-permission">
          {plate.credit} {PERMISSION_NOTE}
        </figcaption>
      </figure>
    </aside>
  );
}
