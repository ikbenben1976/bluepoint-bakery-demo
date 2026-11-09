import { CAFE_REVIEW, customerComments, type ProofTheme } from "@/data/site";

const THEMES: readonly { id: ProofTheme; title: string; lead: string }[] = [
  {
    id: "quality",
    title: "Quality",
    lead: "What customers say about the quality of our breads and baked goods.",
  },
  {
    id: "service",
    title: "Responsive service",
    lead: "What customers value about working with our team.",
  },
  {
    id: "longevity",
    title: "Long relationships",
    lead: "Some customer relationships go back decades.",
  },
];

type Item = {
  quote: string;
  name: string;
  place: string;
  themes: readonly ProofTheme[];
};

export function PublishedProof({ source = "community" }: { source?: "community" | "cafe" }) {
  const items: Item[] =
    source === "cafe"
      ? [
          {
            quote: CAFE_REVIEW.quote,
            name: CAFE_REVIEW.source,
            place: CAFE_REVIEW.when,
            themes: CAFE_REVIEW.themes,
          },
        ]
      : [...customerComments];

  return (
    <div className="proof-groups">
      {THEMES.map((theme) => {
        const quotes = items.filter((item) => {
          if (!item.themes.includes(theme.id)) return false;
          const first = THEMES.find((entry) => item.themes.includes(entry.id));
          return first?.id === theme.id;
        });
        if (quotes.length === 0) return null;
        return (
          <section key={theme.id} aria-labelledby={`proof-${theme.id}`}>
            <h3 id={`proof-${theme.id}`}>{theme.title}</h3>
            <p className="proof-group-lead">{theme.lead}</p>
            <div className="proof-quotes">
              {quotes.map((quote) => (
                <blockquote key={`${theme.id}-${quote.name}`} className="proof-quote">
                  <p>“{quote.quote}”</p>
                  <footer>
                    <strong>{quote.place}</strong> · {quote.name}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
