import type { FeaturedPublicMention } from "@/data/customers";

export function FeaturedMention({ mention }: { mention: FeaturedPublicMention }) {
  return (
    <aside className="featured-mention">
      <p className="eyebrow">
        {mention.name} · {mention.series} · {mention.when}
      </p>
      <blockquote className="proof-quote proof-quote-featured">
        <p>“{mention.quote}”</p>
        <footer>
          <span className="featured-mention-note">Public post, not a testimonial.</span>
        </footer>
      </blockquote>
    </aside>
  );
}
