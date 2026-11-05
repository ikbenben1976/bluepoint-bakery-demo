"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CAFE_REVIEW, customerComments } from "@/data/site";
import { customerMarks } from "@/data/photos";
import { publicMentions, type PublicMention } from "@/data/customers";
import { PublishedProof } from "@/components/PublishedProof";

const audiences = [
  { id: "restaurants", label: "Restaurants & pubs", title: "Behind Colorado's favorite burgers and sandwiches", href: "/sectors/restaurants", cta: "Explore restaurant breads" },
  { id: "cafes", label: "Cafés & coffee shops", title: "Pastries and breads for the morning rush", href: "/sectors/cafes", cta: "Explore café products" },
  { id: "hotels", label: "Hotels & catering", title: "An assortment for gatherings, dining and service", href: "/sectors/hotels", cta: "Explore catering products" },
  { id: "institutions", label: "Institutions", title: "Wholesale bread for food-service teams", href: "/sectors/institutions", cta: "Explore institution products" },
] as const;

type AudienceId = (typeof audiences)[number]["id"];

function mentionsFor(audience: AudienceId) {
  return publicMentions.filter((mention) => mention.audience === audience);
}

function PublicMentionCard({ mention }: { mention: PublicMention }) {
  return (
    <div className="verified-client-mark">
      <Image src={mention.src} alt={mention.alt} width={mention.width} height={mention.height} />
      <strong>{mention.name}</strong>
      <small>{mention.caption}</small>
    </div>
  );
}

export function BuyerProof() {
  const [selected, setSelected] = useState<AudienceId>("restaurants");
  const audience = audiences.find((entry) => entry.id === selected)!;
  const mentions = mentionsFor(selected);
  return (
    <section aria-labelledby="buyer-proof-heading" className="buyer-proof">
      <div className="section-intro">
        <div>
          <p className="eyebrow">The people we serve</p>
          <h2 id="buyer-proof-heading">Built for food-service businesses.</h2>
          <p>From neighborhood pubs to catering kitchens, find wholesale breads and pastries suited to your menu.</p>
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
          <div>
            <div className="verified-client-strip" aria-label="Restaurants and pubs named with Bluepoint">
              <div className="verified-client-wordmark">
                <span>The Cherry Cricket</span>
                <small>Quoted on Bluepoint&apos;s community page</small>
              </div>
              {customerMarks.map((mark) => (
                <div key={mark.src} className="verified-client-mark">
                  <Image src={mark.src} alt={mark.alt} width={mark.width} height={mark.height} />
                  {mark.src.includes("oskar-blues") ? (
                    <small>Customer listed on Bluepoint&apos;s community page</small>
                  ) : null}
                </div>
              ))}
              {mentions.map((mention) => (
                <PublicMentionCard key={mention.src} mention={mention} />
              ))}
            </div>
            <div className="proof-quotes">
              {customerComments.map((comment) => (
                <blockquote key={comment.name} className="proof-quote">
                  <p>“{comment.quote}”</p>
                  <footer><strong>{comment.place}</strong> · {comment.name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        ) : selected === "cafes" ? (
          <div>
            {mentions.length > 0 ? (
              <div className="verified-client-strip" aria-label="Cafés and coffee shops named in a public post">
                {mentions.map((mention) => (
                  <PublicMentionCard key={mention.src} mention={mention} />
                ))}
              </div>
            ) : null}
            <PublishedProof source="cafe" />
            <p className="proof-context">
              Croissants, muffins, scones, and danishes are on the pastry list.{" "}
              <Link href="/making/breakfast">Coffee and breakfast</Link>
            </p>
          </div>
        ) : selected === "hotels" ? (
          <div>
            {mentions.length > 0 ? (
              <div className="verified-client-strip" aria-label="Hotels and catering named in a public post">
                {mentions.map((mention) => (
                  <PublicMentionCard key={mention.src} mention={mention} />
                ))}
              </div>
            ) : null}
            <div className="proof-empty">
              <p>Hotels and catered events are named on Bluepoint’s site. The catalog includes dinner rolls, croissants, specialty breads, and pies.</p>
              <p>
                <Link href="/making/dinner">Dinner and catering</Link>
                {" · "}
                <Link href="/making/breakfast">Breakfast pastries</Link>
              </p>
            </div>
          </div>
        ) : (
          <div>
            {mentions.length > 0 ? (
              <div className="verified-client-strip" aria-label="Institutions named in a public post">
                {mentions.map((mention) => (
                  <PublicMentionCard key={mention.src} mention={mention} />
                ))}
              </div>
            ) : null}
            <div className="proof-empty">
              <p>Corporate dining rooms, hospitals, schools, universities, and airports are named on Bluepoint’s site. Sandwich loaves, club rolls, and breakfast pastries are in the catalog.</p>
              <p>
                <Link href="/making/sandwiches">Sandwich breads</Link>
                {" · "}
                <Link href="/pastries">Pastries</Link>
              </p>
            </div>
          </div>
        )}
      </div>
      <p className="buyer-proof-note">Restaurant comments are from Bluepoint’s community page. Cherry Cricket, Mountain Sun, and Oskar Blues stay as published on that page. Other logo cards in these tabs credit a public post and are not testimonials. The café line is a {CAFE_REVIEW.source} review from {CAFE_REVIEW.when}. The GrowHaus public post stays on the Community page. Current account relationships should be confirmed with the bakery.</p>
    </section>
  );
}
