type Kind = "grain" | "truck" | "handshake";

function Icon({ kind }: { kind: Kind }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" {...common}>
      {kind === "grain" ? (
        <>
          <path d="M24 44V16" />
          <path d="M24 40c-8-1.5-11-8-8-13 4 1.2 8 6 8 13zM24 40c8-1.5 11-8 8-13-4 1.2-8 6-8 13z" />
          <path d="M24 16c-1.2-3.2-1-6.4.2-8.6" />
          <ellipse cx="24" cy="7.5" rx="2.3" ry="3.4" />
          <ellipse cx="19.2" cy="10.6" rx="2.2" ry="3.2" transform="rotate(-32 19.2 10.6)" />
          <ellipse cx="28.8" cy="10.6" rx="2.2" ry="3.2" transform="rotate(32 28.8 10.6)" />
          <ellipse cx="17.6" cy="15.2" rx="2.2" ry="3.1" transform="rotate(-28 17.6 15.2)" />
          <ellipse cx="30.4" cy="15.2" rx="2.2" ry="3.1" transform="rotate(28 30.4 15.2)" />
        </>
      ) : kind === "truck" ? (
        <>
          <path d="M4 16h26v16H4z" />
          <path d="M30 22h8l6 7v3H30V22z" />
          <path d="M30 29h14" />
          <circle cx="13" cy="35.5" r="3.4" />
          <circle cx="36" cy="35.5" r="3.4" />
          <path d="M8 22h18" />
        </>
      ) : (
        <>
          <path d="M6 24c1.5-7 7-9 9-5l4 3 5-2c2-1 4.5 0 6 2l7 5" />
          <path d="M8 26l7 11c1.6 2.2 4.6 2.4 6.4.3l2.2-2.6" />
          <path d="M19 22l6 5c1.4 1.2 3.4 1.2 4.6-.1l3-3" />
          <path d="M31 20l8-6 5 4-7 8" />
          <path d="M24 30l4 4M18 33l4 4" />
        </>
      )}
    </svg>
  );
}

const benefits: { kind: Kind; label: string }[] = [
  { kind: "grain", label: "Made from Scratch" },
  { kind: "truck", label: "Six-Day Delivery" },
  { kind: "handshake", label: "Personal Service" },
];

export function HeroBenefits() {
  return (
    <ul className="approved-hero-benefits" aria-label="Why businesses choose Bluepoint Bakery">
      {benefits.map(({ kind, label }) => (
        <li key={kind}>
          <Icon kind={kind} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
