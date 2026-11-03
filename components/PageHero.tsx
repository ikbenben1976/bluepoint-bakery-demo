import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/data/photos";

export function PageHero({
  kicker,
  title,
  lede,
  image,
}: {
  kicker: string;
  title: string;
  lede?: ReactNode;
  image?: Photo;
}) {
  return (
    <header className="ticket-hero">
      <div>
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {lede ? <div className="sub">{lede}</div> : null}
      </div>
      {image ? (
        <div className="ticket-photo">
          <Image
            src={image.src}
            alt=""
            fill
            priority
            sizes="(max-width: 860px) 100vw, 45vw"
            className="object-contain"
          />
        </div>
      ) : null}
    </header>
  );
}
