import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/data/photos";

export function PageHero({
  kicker,
  title,
  lede,
  image,
  contained = false,
}: {
  kicker: string;
  title: string;
  lede?: ReactNode;
  image?: Photo;
  /** Use the same column width as `.shell` so the title lines up with the page body. */
  contained?: boolean;
}) {
  // Small files were floating as 110–200px thumbnails. Only a photo that can
  // fill half the header near its native size is shown.
  const showImage = Boolean(image && image.width >= 640);
  return (
    <header className={`ticket-hero${contained ? " shell" : ""}${showImage ? " has-photo" : ""}`}>
      <div>
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {lede ? <div className="sub">{lede}</div> : null}
      </div>
      {showImage && image ? (
        <div className="ticket-photo ticket-photo-half">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(max-width: 860px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      ) : null}
    </header>
  );
}
