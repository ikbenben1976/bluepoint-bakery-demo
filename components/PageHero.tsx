import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/data/photos";

export function PageHero({
  kicker,
  title,
  lede,
  image,
  className,
}: {
  kicker: string;
  title: string;
  lede?: ReactNode;
  image?: Photo;
  className?: string;
}) {
  // Small files were floating as 110–200px thumbnails. Only a photo that can
  // fill half the header near its native size is shown.
  const showImage = Boolean(image && image.width >= 640);
  return (
    <header className={`ticket-hero${showImage ? " has-photo" : ""}${className ? ` ${className}` : ""}`}>
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
