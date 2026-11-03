import Link from "next/link";
import { uses } from "@/data/uses";

export function MakingCards() {
  return (
    <section className="making">
      <h2>What are you making?</h2>
      <p>Each card opens products already on the catalog. Nothing here is a recommendation beyond those names.</p>
      <ul>
        {uses.map((use) => (
          <li key={use.slug}>
            <Link href={`/making/${use.slug}`}>
              <span>{use.title}</span>
              <small>{use.summary}</small>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
