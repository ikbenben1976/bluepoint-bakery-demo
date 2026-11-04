"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CAFE_REVIEW, customerComments } from "@/data/site";
import { customerMarks } from "@/data/photos";

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
            <div className="verified-client-strip" aria-label="Customers named on Bluepoint Bakery's community page">
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
          <div className="proof-quotes proof-quotes-single">
            <blockquote className="proof-quote">
              <p>“{CAFE_REVIEW.quote}”</p>
              <footer>Published customer review · {CAFE_REVIEW.source}, {CAFE_REVIEW.when}</footer>
            </blockquote>
            <p className="proof-context">Explore croissants, muffins, scones and breakfast pastries for coffee-shop and café menus.</p>
          </div>
        ) : (
          <div className="proof-empty">
            <p>{selected === "hotels" ? "From breakfast buffets to catered occasions, explore dinner rolls, croissants, specialty breads and desserts." : "Explore sandwich loaves, hearty rolls and breakfast pastries for busy food-service teams."}</p>
            <p>Bluepoint&apos;s team can discuss suitable assortments, packaging requirements and delivery options for your operation.</p>
          </div>
        )}
      </div>
      <p className="buyer-proof-note">Customer quotations are reproduced from Bluepoint&apos;s published website. Current account relationships should be confirmed with the bakery.</p>
    </section>
  );
}
