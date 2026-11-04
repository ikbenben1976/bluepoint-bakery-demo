import Image from "next/image";

type Props = {
  webp: string;
  avif: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  label?: string;
  priority?: boolean;
  className?: string;
};

export function FramedImage({ webp, avif, alt, width, height, sizes, label, priority, className }: Props) {
  return (
    <span className={className ? `framed-photo ${className}` : "framed-photo"}>
      <picture>
        <source srcSet={avif} type="image/avif" />
        <Image
          src={webp}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover" }}
        />
      </picture>
      {label ? <span className="illustrative-label">{label}</span> : null}
    </span>
  );
}
