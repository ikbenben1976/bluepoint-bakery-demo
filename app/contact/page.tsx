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
            <div className={styles.method}>
              <p className={styles.methodLabel}>Call the bakery</p>
              <a className={styles.primaryContact} href={`tel:${PHONE_TEL}`}>
                {PHONE_DISPLAY} <span aria-hidden="true">↗</span>
              </a>
              <p className={styles.methodDetail}>Office hours: {HOURS}</p>
            </div>
            <div className={styles.method}>
              <p className={styles.methodLabel}>Email the bakery</p>
              <a className={styles.primaryContact} href={`mailto:${EMAIL}`}>
                {EMAIL} <span aria-hidden="true">↗</span>
              </a>
              <p className={styles.methodDetail}>Product questions, inquiries and general correspondence</p>
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
            <div className={styles.cardContent}>
              <h3>New wholesale customers</h3>
              <p>
                Looking for a dependable bakery partner? Tell us about your business,
                the products you need, and where you operate. We&apos;ll help you take the next step.
              </p>
              <Link className={styles.textAction} href="/wholesale/">
                Start a wholesale inquiry <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>

          <article className={styles.helpCard}>
            <span className={styles.cardNumber} aria-hidden="true">02</span>
            <div className={styles.cardContent}>
              <h3>Existing customers</h3>
              <p>
                Already working with Bluepoint? Access your ordering account, make a payment,
                or contact our team with questions about an existing order.
              </p>
              <div className={styles.accountActions}>
                <a className={styles.textAction} href={ORDER_URL} target="_blank" rel="noopener noreferrer">
                  Order online <span aria-hidden="true">↗</span>
                </a>
                <a className={styles.textAction} href={PAY_URL} target="_blank" rel="noopener noreferrer">
                  Pay an invoice <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </article>

          <article className={styles.helpCard}>
            <span className={styles.cardNumber} aria-hidden="true">03</span>
            <div className={styles.cardContent}>
              <h3>Questions about delivery?</h3>
              <p>
                Bluepoint serves metro Denver, the Front Range, mountain communities,
                and Cheyenne, Wyoming. Explore our published delivery areas and schedules
                to see where we operate.
              </p>
              <Link href="/delivery/" className={styles.textAction}>
                Explore delivery areas <span aria-hidden="true">↗</span>
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
          <div className={styles.locationGrid}>
            <div className={styles.locationBlock}>
              <h3>Bluepoint Bakery</h3>
              <address>5105 Cook St.<br />Denver, CO 80216</address>
              <a className={styles.textAction} href={MAPS_SEARCH_URL} target="_blank" rel="noopener noreferrer">
                Get directions <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className={styles.locationBlock}>
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
