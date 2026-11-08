"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { customerComments } from "@/data/site";
import { publicMentions, type PublicMention } from "@/data/customers";
import { CafePull } from "@/components/CafePull";
import { PublishedProof } from "@/components/PublishedProof";

const audiences = [
  { id: "restaurants", label: "Restaurants & pubs", title: "Behind Colorado's favorite burgers and sandwiches", href: "/sectors/restaurants", cta: "Explore restaurant breads", strip: "Restaurants and pubs" },
  { id: "cafes", label: "Cafés & coffee shops", title: "Pastries and breads for the morning rush", href: "/sectors/cafes", cta: "Explore café products", strip: "Cafés and coffee shops" },
  { id: "hotels", label: "Hotels & catering", title: "An assortment for gatherings, dining and service", href: "/sectors/hotels", cta: "Explore catering products", strip: "Hotels and catering" },
  { id: "institutions", label: "Institutions", title: "Wholesale bread for food-service teams", href: "/sectors/institutions", cta: "Explore institution products", strip: "Institutions" },
] as const;

type AudienceId = (typeof audiences)[number]["id"];

function mentionsFor(audience: AudienceId) {
  return publicMentions.filter((mention) => mention.audience === audience);
}

function PublicMentionCard({ mention }: { mention: PublicMention }) {
  const ink = mention.surface === "ink";
  return (
    <div className={ink ? "verified-client-mark is-ink" : "verified-client-mark"}>
      <div className="verified-client-well">
        <Image src={mention.src} alt={mention.alt} width={mention.width} height={mention.height} />
      </div>
      <strong>{mention.name}</strong>
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
          <h2 id="buyer-proof-heading">Built for <span className="title-break">food-service businesses.</span></h2>
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
        {mentions.length > 0 ? (
          <div className="verified-client-strip" aria-label={audience.strip}>
            {mentions.map((mention) => (
              <PublicMentionCard key={mention.src} mention={mention} />
            ))}
          </div>
        ) : null}
        {selected === "cafes" ? <CafePull /> : null}
        {selected === "restaurants" ? (
          <div className="proof-quotes">
            {customerComments.map((comment) => (
              <blockquote key={comment.name} className={comment.quote.length < 80 ? "proof-quote proof-quote-short" : "proof-quote"}>
                <p>“{comment.quote}”</p>
                <footer><strong>{comment.place}</strong> · {comment.name}</footer>
              </blockquote>
            ))}
          </div>
        ) : null}
        {selected === "cafes" ? (
          <>
            <PublishedProof source="cafe" />
            <p className="proof-context">
              Croissants, muffins, scones, and danishes are on the pastry list.{" "}
              <Link href="/making/breakfast">Coffee and breakfast</Link>
            </p>
          </>
        ) : null}
      </div>
    </section>
  );
}
