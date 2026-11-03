export function LogoLockup({ condensed = false, inverse = false }: { condensed?: boolean; inverse?: boolean }) {
  const ground = inverse ? "#F6F1E8" : "#0D0D25";
  const letter = inverse ? "#F6F1E8" : "#FFFFFF";
  return (
    <span className={`lockup ${condensed ? "is-small" : ""} ${inverse ? "is-inverse" : ""}`}>
      <svg className="lockup-mark" viewBox="0 0 72 72" aria-hidden="true">
        <rect width="72" height="72" rx="8" fill={ground} />
        <polygon points="8,10 64,10 36,66" fill="#F66631" />
        <text
          x="36"
          y="40"
          textAnchor="middle"
          fill={letter}
          fontFamily="var(--font-franklin), Franklin Gothic Medium, sans-serif"
          fontSize="18"
          fontWeight="700"
        >
          BP
        </text>
      </svg>
      <span className="lockup-type">
        <span className="lockup-name">Bluepoint</span>
        <span className="lockup-bakery">Bakery · Est. 1987</span>
      </span>
    </span>
  );
}

export function Monogram({ size = 40, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="72" height="72" rx="8" fill="#0D0D25" />
      <polygon points="8,10 64,10 36,66" fill="#F66631" />
      <text
        x="36"
        y="40"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="var(--font-franklin), Franklin Gothic Medium, sans-serif"
        fontSize="18"
        fontWeight="700"
      >
        BP
      </text>
    </svg>
  );
}
