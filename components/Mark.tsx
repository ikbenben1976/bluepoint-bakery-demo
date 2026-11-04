import Image from "next/image";

/**
 * Official Bluepoint Bakery mark from public/logo.jpg: rolling pin, orange
 * triangle, wordmark, and Est. 1987. The white field is removed so the mark
 * sits on cream. It is the header logo and the footer logo. It is not drawn
 * again inside the hero.
 */
export function LogoLockup({ inverse = false }: { condensed?: boolean; inverse?: boolean }) {
  return (
    <span className={`heritage-lockup ${inverse ? "is-inverse" : ""}`}>
      <Image
        className="heritage-logo"
        src="/images/brand/bluepoint-logo.png"
        alt="Bluepoint Bakery, established 1987"
        width={701}
        height={280}
      />
    </span>
  );
}
