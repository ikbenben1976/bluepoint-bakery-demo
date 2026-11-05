import Image from "next/image";
import { PERMISSION_NOTE, usePhotos, type UseAudience } from "@/data/usePhotos";

export function UseShots({ audience }: { audience: UseAudience }) {
  const shots = usePhotos.filter((shot) => shot.audience === audience);
  if (shots.length === 0) return null;
  return (
    <div className="use-shots">
      {shots.map((shot) => (
        <figure key={shot.src} className="use-shot">
          <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
          <figcaption>
            <strong>{shot.name}</strong>
            <span>
              {shot.credit} {PERMISSION_NOTE}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
