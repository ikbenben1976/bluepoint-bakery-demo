type Kind = "grain" | "truck" | "handshake";

function Icon({ kind }: { kind: Kind }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" {...common}>
      {kind === "grain" ? (
        <>
          <path d="M23 43V7M23 15l-8-7M23 23l-11-8M23 31l-12-8M23 17l8-9M23 25l11-10M23 33l12-9" />
          <path d="M15 8c-4 4-4 9 0 12M11 16c-5 4-5 10 1 14M31 8c4 4 4 9 0 12M35 16c5 4 5 10-1 14M23 6c-4 3-4 7 0 11 4-4 4-8 0-11Z" />
        </>
      ) : kind === "truck" ? (
        <>
          <rect x="3" y="13" width="24" height="19" rx="2" />
          <path d="M27 19h9l8 9v4H27M3 32h5m14 0h12m10 0h-4M29 19v9h15" />
          <circle cx="15" cy="34" r="5" fill="#f6f1e8" />
          <circle cx="37" cy="34" r="5" fill="#f6f1e8" />
        </>
      ) : (
        <>
          <path d="m5 22 9-9 8 5 7-4 14 12-9 11-8-6M5 22l9 13 5-4 10 8a4 4 0 0 0 5-1M15 18l6 5c2 2 4 2 6 1l4-2M22 31l5 5M17 35l5 5" />
          <path d="m3 19 8-9 5 4-9 12ZM35 13l5-4 6 11-7 7Z" />
        </>
      )}
    </svg>
  );
}

const benefits: { kind: Kind; label: string }[] = [
  { kind: "grain", label: "Made from scratch" },
  { kind: "truck", label: "Six-day delivery" },
  { kind: "handshake", label: "Personal service" },
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
