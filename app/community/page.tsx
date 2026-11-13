import type { Metadata } from "next";
import Image from "next/image";
import { communityMarks, categoryPhotos, type Photo } from "@/data/photos";
import { homeCommunityTiles } from "@/data/homeCommunity";
import styles from "./community.module.css";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Good baking. Good neighbors. Learn how Bluepoint Bakery has supported Project Angel Heart, CASA, The GrowHaus, Soup for the Soul and FIRE Foundation in Colorado.",
  alternates: { canonical: "/community/" },
  robots: { index: false, follow: false },
};

type CommunityPartner = {
  name: string;
  category: string;
  logo: Photo;
  paragraphs: readonly string[];
  href?: string;
  linkText?: string;
  historical?: boolean;
  tallLogo?: boolean;
};

const angelLogo = homeCommunityTiles[0]?.image ?? communityMarks[0];
const casaLogo = homeCommunityTiles[1]?.image ?? communityMarks[1];
const growHausLogo = homeCommunityTiles[2]?.image ?? communityMarks[2];
const soupLogo = homeCommunityTiles[3]?.image ?? communityMarks[3];

// Prefer the homepage's freshly updated nonprofit logos. Fall back to the original
// Bluepoint marks so this page also renders on branches without the new assets.
// Keep copy local so homepage edits don't change Community page content.
const partners: readonly CommunityPartner[] = [
  {
    name: "CASA of Adams & Broomfield Counties",
    category: "Children & families",
    logo: casaLogo,
    paragraphs: [
      "Every child deserves someone in their corner. CASA provides volunteer advocacy and support for at-risk children and youth, helping families navigate difficult circumstances.",
      "Bluepoint has provided holiday sugar cookies and baked goods for CASA's Cookies Count fundraising campaign. The inaugural campaign in December 2013 raised more than $15,000. The bakery has also supported events including the CASA Classic Golf Tournament, Indulge for CASA and Kaleidoscope of Hope.",
    ],
    href: "https://casa17th.org/",
    linkText: "Visit CASA",
  },
  {
    name: "The GrowHaus",
    category: "Food access",
    logo: growHausLogo,
    paragraphs: [
      "Good food should be within everyone's reach. The GrowHaus works to improve access to nutritious food through community-led food distribution, wellness education and neighborhood programs in Denver.",
      "Bluepoint has provided bread to support The GrowHaus' food-box and distribution programs, helping reduce costs and bring fresh food to more neighbors. The GrowHaus also lists Bluepoint among its local bakery producers.",
    ],
    href: "https://www.thegrowhaus.org/",
    linkText: "Visit The GrowHaus",
  },
  {
    name: "Soup for the Soul",
    category: "Compassionate care",
    logo: soupLogo,
    paragraphs: [
      "For more than 15 years, Bluepoint contributed desserts to Soup for the Soul, a Denver fundraising event that brought local restaurants and community members together in support of hospice care.",
      "The event served approximately 700 attendees and featured gourmet food and a charity auction. Proceeds supported programs including Porter Hospice, St. Anthony Hospice and The Butterfly Program, bringing comfort and dignity to patients and their families.",
    ],
    historical: true,
    tallLogo: true,
  },
  {
    name: "FIRE Foundation of Denver",
    category: "Inclusive education",
    logo: {
      src: "/images/customers/fire-foundation.png",
      width: 687,
      height: 182,
      alt: "FIRE Foundation of Denver",
    },
    paragraphs: [
      "Every student deserves the opportunity to learn, belong and thrive. FIRE Foundation of Denver champions the inclusion of students with disabilities in Catholic schools through educational resources, fundraising and a culture of belonging.",
      "Bluepoint has supported the foundation's Thanksgiving pie fundraiser, contributing baked goods to an effort that helps create more welcoming and inclusive learning environments for children of all abilities.",
    ],
    href: "https://firefoundationdenver.org/",
    linkText: "Visit FIRE Foundation",
  },
];

export default function CommunityPage() {
  const piePhoto = categoryPhotos.pies;

  return (
    <article className={styles.page}>
      <header className={styles.intro}>
        <div className={`shell ${styles.introInner}`}>
          <p className={styles.eyebrow}>Community · Colorado Front Range</p>
          <h1 className={styles.introTitle}>Good baking. Good neighbors.</h1>
          <p className={styles.introText}>
            Bread and pastries have a way of bringing people together. At Bluepoint Bakery, that
            spirit extends beyond our ovens. For years, we&apos;ve shared what we bake with
            Colorado organizations working to nourish neighbors, support children and care for families.
          </p>
        </div>
      </header>

      <section className={`shell ${styles.feature}`} aria-labelledby="project-angel-heart">
        <div className={styles.featureHeading}>
          <p className={styles.eyebrow}>Featured partnership</p>
          <h2 id="project-angel-heart">Project Angel Heart</h2>
          <p className={styles.featureSubhead}>Pie in the Sky · A partnership dating to 2009</p>
        </div>
        <div className={styles.featureGrid}>
          <figure className={styles.featurePhoto}>
            <Image
              src={piePhoto.src}
              alt={piePhoto.alt}
              width={piePhoto.width}
              height={piePhoto.height}
              sizes="(max-width: 850px) min(100vw - 40px, 390px), 440px"
            />
            <figcaption>Pies being filled at Bluepoint Bakery.</figcaption>
          </figure>
          <div className={styles.featureCopy}>
            <div className={styles.featureMark}>
              <Image
                src={angelLogo.src}
                alt=""
                width={angelLogo.width}
                height={angelLogo.height}
                sizes="90px"
              />
              <p>Freshly baked support for medically tailored meals in Colorado.</p>
            </div>
            <h3>A little sweetness. A lot of heart.</h3>
            <p>
              Since 2009, Bluepoint Bakery has partnered with Project Angel Heart, an organization
              that prepares and delivers nutritious meals at no cost to Coloradans living with
              serious illnesses.
            </p>
            <p>
              Through its Pie in the Sky fundraiser, Bluepoint has baked and donated fresh pies
              to help support home-delivered meals. The bakery has also provided baked goods and
              birthday cakes, bringing moments of celebration to people facing difficult circumstances.
            </p>

            <aside className={styles.humanStory} aria-label="A note from a Project Angel Heart client">
              <p className={styles.storyLabel}>A moment that matters</p>
              <blockquote>
                &ldquo;I was so surprised and delighted when you sent me the delicious birthday cake.&rdquo;
              </blockquote>
              <cite>Mary, a Project Angel Heart client, as featured on Bluepoint&apos;s original website</cite>
            </aside>

            <div className={styles.stats} aria-label="Project Angel Heart partnership history">
              <div className={styles.stat}>
                <strong>2009</strong>
                <span>Year the Pie in the Sky partnership began</span>
              </div>
              <div className={styles.stat}>
                <strong>$1M+</strong>
                <span>Fundraising revenue credited to the donated pies on Bluepoint&apos;s original website</span>
              </div>
            </div>
            <a
              className={styles.externalLink}
              href="https://www.projectangelheart.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about Project Angel Heart
            </a>
          </div>
        </div>
      </section>

      <section className={styles.partners} aria-labelledby="partners-heading">
        <div className="shell">
          <div className={styles.partnersHeading}>
            <p className={styles.eyebrow}>More ways we give back</p>
            <h2 id="partners-heading">Partnerships that make a difference</h2>
            <p>
              From holiday cookies to fresh bread and fundraising desserts, here&apos;s how
              Bluepoint has supported organizations across our community.
            </p>
          </div>
          <ul className={styles.partnerGrid}>
            {partners.map((partner) => (
              <li key={partner.name}>
                <article className={styles.partnerCard}>
                  <div className={`${styles.partnerLogo} ${partner.tallLogo ? styles.partnerLogoTall : ""}`}>
                    <Image
                      src={partner.logo.src}
                      alt=""
                      width={partner.logo.width}
                      height={partner.logo.height}
                      sizes="230px"
                    />
                  </div>
                  <p className={styles.partnerCategory}>{partner.category}</p>
                  <h3>{partner.name}</h3>
                  {partner.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {partner.href && partner.linkText ? (
                    <a
                      className={styles.externalLink}
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {partner.linkText}
                    </a>
                  ) : null}
                  {partner.historical ? (
                    <p className={styles.historicalNote}>Historical community partnership</p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.award} id="recognition" aria-labelledby="community-award-heading">
        <div className={`shell ${styles.awardInner}`}>
          <div className={styles.awardIcon} aria-hidden="true">
            <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="17" r="10" stroke="currentColor" strokeWidth="2.5" />
              <path d="M19 25 14 42l10-5 10 5-5-17" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="m24 11 1.8 3.8 4.2.6-3 2.9.7 4.1-3.7-2-3.7 2 .7-4.1-3-2.9 4.2-.6L24 11Z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className={`${styles.eyebrow} ${styles.awardEyebrow}`}>National Philanthropy Day</p>
            <h2 id="community-award-heading">2016 Outstanding Small Business</h2>
            <p>
              Bluepoint Bakery was honored by the Association of Fundraising Professionals&apos;
              Colorado Chapter for its commitment to community philanthropy.
            </p>
            <p>
              The recognition was especially meaningful because Project Angel Heart and CASA of
              Adams &amp; Broomfield Counties jointly nominated the bakery, highlighting its
              contributions to their fundraising programs.
            </p>
            <a
              className={styles.externalLink}
              href="https://community.afpglobal.org/coloradothrive/events/npd-overview/past-recipients"
              target="_blank"
              rel="noopener noreferrer"
            >
              View the official award record
            </a>
          </div>
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="community-closing-heading">
        <div className={`shell ${styles.closingInner}`}>
          <h2 id="community-closing-heading">Community is part of who we are.</h2>
          <p>
            We&apos;re grateful for the organizations that serve our neighbors every day and
            proud of the opportunities we&apos;ve had to contribute through the work we love: baking.
          </p>
          <p className={styles.signature}>Bluepoint Bakery · Denver, Colorado · Since 1987</p>
        </div>
      </section>
    </article>
  );
}
