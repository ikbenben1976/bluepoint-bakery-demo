import type { Metadata } from "next";
import Link from "next/link";
import {
  EMAIL,
  HOURS,
  MAPS_SEARCH_URL,
  ORDER_URL,
  PAY_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/data/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Bluepoint Bakery at (303) 298-1100 or sales@bluepointbakery.com. Find our Denver bakery, request a wholesale account, or access existing customer services.",
  alternates: { canonical: "/contact/" },
  robots: { index: false, follow: false },
};

export default function ContactPage() {
  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <div className={`shell ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Contact Bluepoint Bakery</p>
            <h1>Let&apos;s talk bakery.</h1>
            <p className={styles.intro}>
              Whether you&apos;re interested in becoming a wholesale customer, need help with an
              existing account, or have a question about our products, we&apos;re here to help.
            </p>
          </div>

          <section className={styles.directContact} aria-label="Contact our Denver team">
            <p className={styles.smallLabel}>Reach our Denver team</p>
            <div className={styles.methodCards}>
              <a className={styles.methodCard} href={`tel:${PHONE_TEL}`}>
                <span className={styles.methodIcon} aria-hidden="true">
                  <PhoneIcon />
                </span>
                <span className={styles.methodCopy}>
                  <span className={styles.methodLabel}>Call the bakery</span>
                  <span className={styles.primaryContact}>{PHONE_DISPLAY}</span>
                  <span className={styles.methodDetail}>Office hours: {HOURS}</span>
                </span>
              </a>
              <a className={styles.methodCard} href={`mailto:${EMAIL}`}>
                <span className={styles.methodIcon} aria-hidden="true">
                  <MailIcon />
                </span>
                <span className={styles.methodCopy}>
                  <span className={styles.methodLabel}>Email the bakery</span>
                  <span className={styles.primaryContact}>{EMAIL}</span>
                  <span className={styles.methodDetail}>Product questions, inquiries and general correspondence</span>
                </span>
              </a>
            </div>
          </section>
        </div>
      </header>

      <section className={`shell ${styles.helpSection}`} aria-labelledby="contact-help-heading">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>The right next step</p>
          <h2 id="contact-help-heading">How can we help?</h2>
          <p>Choose the option that fits your needs.</p>
        </div>

        <div className={styles.helpGrid}>
          <article className={styles.helpCard}>
            <span className={styles.cardNumber} aria-hidden="true">01</span>
            <h3>New wholesale customers</h3>
            <p>
              Looking for a dependable bakery partner? Tell us about your business,
              the products you need, and where you operate. We&apos;ll help you take the next step.
            </p>
            <div className={styles.cardFooter}>
              <Link className={styles.cardButton} href="/wholesale/">
                Start a wholesale inquiry
              </Link>
            </div>
          </article>

          <article className={styles.helpCard}>
            <span className={styles.cardNumber} aria-hidden="true">02</span>
            <h3>Existing customers</h3>
            <p>
              Already working with Bluepoint? Access your ordering account, make a payment,
              or contact our team with questions about an existing order.
            </p>
            <div className={styles.cardFooter}>
              <a className={styles.cardButton} href={ORDER_URL} target="_blank" rel="noopener noreferrer">
                Order online <ExternalIcon />
              </a>
              <a className={styles.cardButton} href={PAY_URL} target="_blank" rel="noopener noreferrer">
                Pay an invoice <ExternalIcon />
              </a>
            </div>
          </article>

          <article className={styles.helpCard}>
            <span className={styles.cardNumber} aria-hidden="true">03</span>
            <h3>Questions about delivery?</h3>
            <p>
              Bluepoint serves metro Denver, the Front Range, mountain communities,
              and Cheyenne, Wyoming. Explore our published delivery areas and schedules
              to see where we operate.
            </p>
            <div className={styles.cardFooter}>
              <Link href="/delivery/" className={styles.cardButton}>
                Explore delivery areas
              </Link>
              <p className={styles.finePrint}>
                Our team can confirm availability for your specific business address.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.locationBand} aria-labelledby="contact-location-heading">
        <div className={`shell ${styles.locationSection}`}>
          <div className={styles.locationHeading}>
            <p className={styles.eyebrow}>Our Denver bakery</p>
            <h2 id="contact-location-heading">Find us.</h2>
          </div>
          <div className={styles.locationCard}>
            <div className={styles.locationCol}>
              <h3>Bluepoint Bakery</h3>
              <address>5105 Cook St.<br />Denver, CO 80216</address>
              <a className={styles.cardButton} href={MAPS_SEARCH_URL} target="_blank" rel="noopener noreferrer">
                Get directions <ExternalIcon />
              </a>
            </div>
            <div className={styles.locationCol}>
              <h3>Office hours</h3>
              <p>{HOURS}</p>
              <p className={styles.finePrint}>Bakery production and deliveries operate six days a week.</p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8.2 3.6h2.1c.4 0 .7.3.8.6l.9 2.7a.9.9 0 0 1-.3.9l-1.5 1.1a12.2 12.2 0 0 0 5 5l1.1-1.5a.9.9 0 0 1 .9-.3l2.7.9c.3.1.6.4.6.8v2.1a1.6 1.6 0 0 1-1.7 1.6A16.2 16.2 0 0 1 3.5 6.3a1.6 1.6 0 0 1 1.6-1.7h3.1z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 6.4A2.4 2.4 0 0 1 6.4 4h11.2A2.4 2.4 0 0 1 20 6.4v11.2a2.4 2.4 0 0 1-2.4 2.4H6.4A2.4 2.4 0 0 1 4 17.6V6.4zm1.8.2 6.2 4.4 6.2-4.4H5.8zm12.4 1.3-5.6 4a1.5 1.5 0 0 1-1.7 0l-5.7-4v9.7h13V7.9z"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className={styles.externalIcon} viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
      />
    </svg>
  );
}
