import type { Metadata } from "next";
import { faqs, ORDER_URL } from "@/data/site";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions Bluepoint Bakery is asked, including how to become a customer, where they deliver, and how existing customers order.",
  alternates: { canonical: "/faq/" },
  robots: { index: false, follow: false },
};

export default function FaqPage() {
  return (
    <>
      <PageHero kicker="FAQ" title="Questions" lede={<p>Some of the Questions We Are Asked</p>} />
      <div className="shell max-w-3xl py-10">
        {faqs.map((item) => (
          <details key={item.id} className="faq-item" open>
            <summary>{item.q}</summary>
            {item.id === "order" ? (
              <p className="mt-3 max-w-2xl">
                Existing customers can order by calling us at 303-298-1100, emailing sales@bluepointbakery.com, or by ordering through the{" "}
                <a className="text-royal underline" href={ORDER_URL}>
                  existing customer login
                </a>
                .
              </p>
            ) : (
              <p className="mt-3 max-w-2xl">{item.a}</p>
            )}
          </details>
        ))}
        <h2 className="section-title mt-16">Lead times</h2>
        <ul className="mt-4 max-w-xl list-disc space-y-2 pl-5">
          <li>24 hour notice for orders on all breads.</li>
          <li>48 hour notice for orders on all pastries.</li>
          <li>Sourdough Boule: 3 day notice required.</li>
        </ul>
      </div>
    </>
  );
}
