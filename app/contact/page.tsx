import type { Metadata } from "next";
import Image from "next/image";
import {
  ADDRESS,
  EMAIL,
  FACEBOOK,
  HOURS,
  INSTAGRAM,
  MAPS_SEARCH_URL,
  ORDER_URL,
  PAY_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/data/site";
import { cookStreetMap } from "@/data/photos";
import { ContactMessage } from "@/components/ContactMessage";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Bluepoint Bakery, 5105 Cook St., Denver, CO 80216. (303) 298-1100. sales@bluepointbakery.com. Office hours Monday–Friday 7:00 AM–3:00 PM.",
  alternates: { canonical: "/contact/" },
  robots: { index: false, follow: false },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        className="contact-hero"
        kicker="Contact"
        title="Let&apos;s talk about your bakery needs"
        lede={<p>Reach our Denver team by phone or email, or find our bakery at {ADDRESS}.</p>}
      />
      <div className="shell contact-page content-page">
        <div className="contact-layout">
        <div className="contact-facts">
          <p>
            <span className="fact-label">Address</span>
            <span className="fact-value">{ADDRESS}</span>
          </p>
          <p>
            <span className="fact-label">Phone</span>
            <a className="fact-value" href={`tel:${PHONE_TEL}`}>
              {PHONE_DISPLAY}
            </a>
          </p>
          <p>
            <span className="fact-label">Email</span>
            <a className="fact-value contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
          <p>
            <span className="fact-label">Office hours</span>
            <span className="fact-value hours-value">
              <span className="hours-days">{HOURS.slice(0, HOURS.indexOf(" "))}</span>
              <span className="hours-time">{HOURS.slice(HOURS.indexOf(" ") + 1)}</span>
            </span>
          </p>
          <p>We bake and deliver 6 days a week.</p>
          <p>
            <a className="underline" href={ORDER_URL} target="_blank" rel="noopener noreferrer">
              Order online (existing customers)
            </a>
          </p>
          <p>
            <a className="underline" href={PAY_URL} target="_blank" rel="noopener noreferrer">
              Pay an invoice
            </a>
          </p>
          <p>
            <a className="underline" href={MAPS_SEARCH_URL} target="_blank" rel="noopener noreferrer">
              Open 5105 Cook St., Denver, CO 80216 in Google Maps
            </a>
          </p>
          <p className="social-row">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Bluepoint Bakery on Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM12 9.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2z" />
              </svg>
              Instagram
            </a>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Bluepoint Bakery on Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
              </svg>
              Facebook
            </a>
          </p>
        </div>
        <figure className="map-frame">
          <Image
            src={cookStreetMap.src}
            alt={cookStreetMap.alt}
            width={cookStreetMap.width}
            height={cookStreetMap.height}
            loading="eager"
          />
          <figcaption>5105 Cook St., Denver, CO 80216. Map data © OpenStreetMap contributors.</figcaption>
        </figure>
        </div>
        <ContactMessage />
      </div>
    </>
  );
}
