import { CAFE_REVIEW, customerComments, type ProofTheme } from "@/data/site";

const THEMES: readonly { id: ProofTheme; title: string; lead: string }[] = [
  {
    id: "quality",
    title: "Quality",
    lead: "Comments that talk about the bread itself.",
  },
  {
    id: "service",
    title: "Responsive service",
    lead: "Comments that talk about working with the bakery.",
  },
  {
    id: "longevity",
    title: "Long relationships",
    lead: "Comments that name how long a kitchen has ordered.",
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
        const quotes = items.filter((item) => item.themes.includes(theme.id));
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
