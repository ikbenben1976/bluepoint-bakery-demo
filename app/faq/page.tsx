import type { Metadata } from "next";
import { faqs, ORDER_URL } from "@/data/site";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions Bluepoint Bakery is asked, including how to become a customer, where they deliver, and how existing customers order.",
  alternates: { canonical: "/faq/" },
  robots: { index: false, follow: false },
};

const LEAD_TIMES = [
  "Please allow at least 24 hours' notice for bread orders.",
  "Please allow at least 48 hours' notice for pastry orders.",
  "Sourdough Boule requires three days' advance notice.",
] as const;

export default function FaqPage() {
  return (
    <article className={styles.page}>
      <div className={`shell ${styles.column}`}>
        <header className={styles.hero}>
          <h1>Frequently asked questions</h1>
          <p className={styles.intro}>Find answers about products, delivery, ordering and wholesale accounts.</p>
        </header>

        <div className={styles.questions}>
          {faqs.map((item) => (
            <details key={item.id} className={styles.item}>
              <summary className={styles.summary}>
                <span className={styles.question}>{item.q}</span>
                <span className={styles.marker} aria-hidden="true">
                  <PlusIcon />
                  <MinusIcon />
                </span>
              </summary>
              <div className={styles.answer}>
                {item.id === "order" ? (
                  <p>
                    Existing customers can order by calling us at 303-298-1100, emailing sales@bluepointbakery.com, or by ordering through the{" "}
                    <a className="text-royal underline" href={ORDER_URL}>
                      existing customer login
                    </a>
                    .
                  </p>
                ) : (
                  <p>{item.a}</p>
                )}
              </div>
            </details>
          ))}
        </div>

        <section className={styles.lead} aria-labelledby="lead-times-heading">
          <h2 id="lead-times-heading" className={styles.leadHeading}>
            <ClockIcon />
            Lead times
          </h2>
          <ul className={styles.rows}>
            {LEAD_TIMES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

function PlusIcon() {
  return (
    <svg className={styles.plus} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className={styles.minus} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className={styles.clock} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4.5l3 1.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
