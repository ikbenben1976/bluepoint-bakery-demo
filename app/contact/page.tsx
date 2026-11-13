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

type IconName = "phone" | "mail" | "store" | "package" | "truck" | "pin" | "clock";

function ContactIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    phone: (
      <path d="M7 3h3l1.5 4-2.1 1.3a13 13 0 0 0 6.3 6.3L16 12.5l5 1.5v3a3 3 0 0 1-3.2 3A16 16 0 0 1 4 6.2 3 3 0 0 1 7 3Z" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    store: (
      <>
        <path d="M3 10h18l-2-6H5l-2 6Zm0 0v10h18V10M8 20v-7h8v7" />
        <path d="M3 10c0 2 4.5 2 4.5 0 0 2 4.5 2 4.5 0s4.5 2 4.5 0S21 12 21 10" />
      </>
    ),
    package: (
      <>
        <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4m-9 4v10M7.5 5l9 4" />
      </>
    ),
    truck: (
      <>
        <path d="M3 5h12v13H3V5Zm12 5h4l3 4v4h-7v-8Z" />
        <circle cx="7.5" cy="18" r="2" />
        <circle cx="18.5" cy="18" r="2" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  };

  return (
    <svg
      className={styles.icon}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export default function ContactPage() {
  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Contact Bluepoint Bakery</p>
          <h1>Let&apos;s talk bakery.</h1>
          <p className={styles.intro}>
            Whether you&apos;re interested in becoming a wholesale customer, need help with an
            existing account, or have a question about our products, we&apos;re here to help.
          </p>

          <section className={styles.directContact} aria-label="Contact our Denver team">
            <p className={styles.smallLabel}>Talk directly with our team</p>
            <div className={styles.method}>
              <span className={styles.methodIcon}><ContactIcon name="phone" /></span>
              <div className={styles.methodDetails}>
                <h2><a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></h2>
                <p>Office hours: {HOURS}</p>
              </div>
              <a href={`tel:${PHONE_TEL}`} className={styles.methodAction}>Call Bluepoint <span aria-hidden="true">→</span></a>
            </div>
            <div className={styles.method}>
              <span className={styles.methodIcon}><ContactIcon name="mail" /></span>
              <div className={styles.methodDetails}>
                <h2><a href={`mailto:${EMAIL}`} className={styles.email}>{EMAIL}</a></h2>
                <p>Product questions, inquiries and general correspondence</p>
              </div>
              <a href={`mailto:${EMAIL}`} className={styles.methodAction}>Email the bakery <span aria-hidden="true">→</span></a>
            </div>
          </section>
        </div>
      </header>

      <section className={`shell ${styles.helpSection}`} aria-labelledby="contact-help-heading">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Find the right next step</p>
          <h2 id="contact-help-heading">How can we help?</h2>
          <p>Choose the option that best describes what you need.</p>
        </div>

        <div className={styles.helpGrid}>
          <article className={styles.helpCard}>
            <span className={styles.cardIcon}><ContactIcon name="store" /></span>
            <h3>New wholesale customers</h3>
            <p>
              Looking for a dependable bakery partner? Tell us about your business,
              the products you need, and where you operate. We&apos;ll help you take the next step.
            </p>
            <Link className={styles.cardAction} href="/wholesale/">
              Start a wholesale inquiry <span aria-hidden="true">→</span>
            </Link>
          </article>

          <article className={styles.helpCard}>
            <span className={styles.cardIcon}><ContactIcon name="package" /></span>
            <h3>Existing customers</h3>
            <p>
              Already working with Bluepoint? Access your ordering account, make a payment,
              or contact our team with questions about an existing order.
            </p>
            <div className={styles.accountActions}>
              <a href={ORDER_URL} target="_blank" rel="noopener noreferrer">
                Order online <span aria-hidden="true">↗</span>
              </a>
              <a href={PAY_URL} target="_blank" rel="noopener noreferrer">
                Pay an invoice <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.deliveryBand} aria-labelledby="contact-delivery-heading">
        <div className={`shell ${styles.deliveryInner}`}>
          <span className={styles.deliveryIcon}><ContactIcon name="truck" /></span>
          <div>
            <h2 id="contact-delivery-heading">Questions about delivery?</h2>
            <p>
              Bluepoint serves metro Denver, the Front Range, mountain communities, and
              Cheyenne, Wyoming. Explore our published delivery areas and schedules to
              see where we operate.
            </p>
            <Link href="/delivery/" className={styles.textAction}>
              Explore delivery areas <span aria-hidden="true">→</span>
            </Link>
            <p className={styles.finePrint}>
              Our team can confirm availability for your specific business address.
            </p>
          </div>
        </div>
      </section>

      <section className={`shell ${styles.locationSection}`} aria-labelledby="contact-location-heading">
        <h2 id="contact-location-heading">Find our Denver bakery</h2>
        <div className={styles.locationGrid}>
          <div className={styles.locationBlock}>
            <span className={styles.locationIcon}><ContactIcon name="pin" /></span>
            <div>
              <h3>Bluepoint Bakery</h3>
              <address>5105 Cook St.<br />Denver, CO 80216</address>
              <a className={styles.textAction} href={MAPS_SEARCH_URL} target="_blank" rel="noopener noreferrer">
                Get directions <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className={styles.locationBlock}>
            <span className={styles.locationIcon}><ContactIcon name="clock" /></span>
            <div>
              <h3>Office hours</h3>
              <p>{HOURS}</p>
              <p className={styles.finePrint}>Bakery production and deliveries operate six days a week.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.closing} aria-label="About Bluepoint Bakery">
        <div className="shell">
          <h2>Proudly baking in Denver since 1987.</h2>
          <p>Locally owned. Scratch-baked. Committed to the businesses we serve.</p>
        </div>
      </section>
    </article>
  );
}
