"use client";

import { useState } from "react";
import Link from "next/link";
import { CAFE_REVIEW, customerComments } from "@/data/site";

const audiences = [
  { id: "restaurants", label: "Restaurants & pubs", title: "Behind Colorado's favorite burgers and sandwiches", href: "/sectors/restaurants", cta: "Explore restaurant breads" },
  { id: "cafes", label: "Cafés & coffee shops", title: "Pastries and breads for the morning rush", href: "/sectors/cafes", cta: "Explore café products" },
  { id: "hotels", label: "Hotels & catering", title: "An assortment for gatherings, dining and service", href: "/sectors/hotels", cta: "Explore catering products" },
  { id: "institutions", label: "Institutions", title: "Wholesale bread for food-service teams", href: "/sectors/institutions", cta: "Explore institution products" },
] as const;

type AudienceId = (typeof audiences)[number]["id"];

export function BuyerProof() {
  const [selected, setSelected] = useState<AudienceId>("restaurants");
  const audience = audiences.find((entry) => entry.id === selected)!;
  return (
    <section aria-labelledby="buyer-proof-heading" className="buyer-proof">
      <div className="section-intro">
        <div>
          <p className="eyebrow">The people we serve</p>
          <h2 id="buyer-proof-heading">Built for food-service businesses.</h2>
          <p>See what Bluepoint's published customer comments say, or browse by the kind of business you run.</p>
        </div>
      </div>
      <div className="buyer-proof-tabs" role="tablist" aria-label="Customer type">
        {audiences.map((entry) => (
          <button key={entry.id} type="button" role="tab"
            id={`audience-tab-${entry.id}`}
            aria-selected={selected === entry.id}
            aria-controls="audience-proof-panel"
            tabIndex={selected === entry.id ? 0 : -1}
            onClick={() => setSelected(entry.id)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const index = audiences.findIndex((item) => item.id === selected);
              const offset = event.key === "ArrowRight" ? 1 : -1;
              const next = audiences[(index + offset + audiences.length) % audiences.length];
              setSelected(next.id);
              document.getElementById(`audience-tab-${next.id}`)?.focus();
            }}
          >{entry.label}</button>
        ))}
      </div>
      <div id="audience-proof-panel" className="buyer-proof-panel" role="tabpanel" aria-labelledby={`audience-tab-${selected}`} tabIndex={0}>
        <div className="buyer-proof-heading">
          <h3>{audience.title}</h3>
          <Link className="btn btn-primary" href={audience.href}>{audience.cta}</Link>
        </div>
        {selected === "restaurants" ? (
          <div className="proof-quotes">
            {customerComments.map((comment) => (
              <blockquote key={comment.name} className="proof-quote">
                <p>“{comment.quote}”</p>
                <footer><strong>{comment.place}</strong> · {comment.name}</footer>
              </blockquote>
            ))}
          </div>
        ) : selected === "cafes" ? (
          <div className="proof-quotes proof-quotes-single">
            <blockquote className="proof-quote">
              <p>“{CAFE_REVIEW.quote}”</p>
              <footer>Published customer review · {CAFE_REVIEW.source}, {CAFE_REVIEW.when}</footer>
            </blockquote>
            <p className="proof-context">This review does not name the coffee shop. We do not attribute it to an invented customer.</p>
          </div>
        ) : (
          <div className="proof-empty">
            <p>Bluepoint lists {selected === "hotels" ? "hotels, country clubs and catering businesses" : "hospitals, universities, airports and corporate dining rooms"} among the food-service businesses it serves.</p>
            <p>Named endorsements for this category have not been provided. Ask Bluepoint about the requirements for your operation.</p>
          </div>
        )}
      </div>
      <p className="buyer-proof-note">Named testimonials are drawn from Bluepoint's published customer comments; no additional customer logos or endorsements have been invented.</p>
    </section>
  );
}
