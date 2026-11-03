import Image from "next/image";
import Link from "next/link";
import { MakingCards } from "@/components/MakingCards";
import { BuyerProof } from "@/components/BuyerProof";
import { RouteMap } from "@/components/RouteMap";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { categoryPhotos, gallery } from "@/data/photos";
import {
  COLORADO_PROUD,
  RAMIREZ_STUDY,
  WESTWORD_2000,
  WESTWORD_FOUNDING,
} from "@/data/site";

const board = [
  { src: "/images/studio/marble-rye.webp", alt: "Marble rye from Bluepoint Bakery’s catalog photographs", className: "piece-rye" },
  { src: "/images/studio/parisien.webp", alt: "", className: "piece-baguette" },
  { src: "/images/studio/sandwich-rolls.webp", alt: "", className: "piece-rolls" },
  { src: "/images/studio/sesame-bun.webp", alt: "", className: "piece-bun" },
  { src: "/images/studio/croissant.webp", alt: "", className: "piece-croissant" },
];

export default function HomePage() {
  const baker = gallery.find((photo) => photo.src.endsWith("baker.webp"))!;

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <figure className="hero-board">
            {board.map((piece) => (
              <span key={piece.className} className={piece.className}>
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  fill
                  sizes="40vw"
                  priority={piece.className === "piece-bun"}
                  className="object-contain"
                />
              </span>
            ))}
          </figure>
          <figcaption className="hero-caption">
            Bluepoint’s own photographs: marble rye, Parisien loaves, sandwich rolls, a sesame bun, and croissants.
          </figcaption>
        </div>
        <div className="hero-copy">
          <p className="hero-kicker">Denver-made wholesale bakery · Est. 1987</p>
          <h1>Scratch-baked for Colorado&apos;s kitchens since 1987.</h1>
          <p className="lede">
            Wholesale buns, breads, rolls, and pastries from Denver bakers who deliver six days a week.
          </p>
          <p>Real ingredients, personal service, and an assortment built for food-service businesses. Delivery schedules vary by route.</p>
          <div className="hero-actions">
            <Link href="/wholesale" className="btn btn-primary">
              Build a wholesale request
            </Link>
            <Link href="/breads" className="btn btn-ghost">
              Explore products
            </Link>
          </div>
          <p className="hero-reassurance">24-hour bread notice · 48-hour pastry notice. Confirm requirements with our sales team.</p>
        </div>
      </section>

      <p className="proof-line">
        <Image src="/images/colorado-proud.jpg" alt="Colorado Proud" width={48} height={48} />
        <span>
          A proud, minority-owned and family-owned business headquartered in Denver, Colorado.{" "}
          <a href={COLORADO_PROUD}>Listed in the Colorado Proud product finder.</a>
        </span>
      </p>

      <section className="block">
        <div className="shell">
          <h2>More than great bread. A bakery you can count on.</h2>
          <ul className="value-points">
            <li>
              <span className="value-icon" aria-hidden="true">✳</span>
              <h3>Made from scratch</h3>
              <p>All of our breads, pastries, and treats are made from scratch daily.</p>
            </li>
            <li>
              <span className="value-icon" aria-hidden="true">↗</span>
              <h3>Delivered six days a week</h3>
              <p>We bake and deliver 6 days a week. Delivery days depend on the route.</p>
            </li>
            <li>
              <span className="value-icon" aria-hidden="true">♡</span>
              <h3>Real people, real service</h3>
              <p>Knowledgeable sales professionals. A sales professional will help you open an account.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="block">
        <div className="shell">
          <MakingCards />
        </div>
      </section>

      <section className="block consult">
        <div className="shell">
          <h2>Let&apos;s find the right bread for your business.</h2>
          <p>Tell us what you&apos;re making, where you&apos;re located, and approximately what you need.</p>
          <p>
            Looking for something specific? Ask about customization. Bluepoint describes custom orders on its About page; ask what is available for your business.
          </p>
          <div className="hero-actions">
            <Link href="/breads" className="btn btn-primary">
              Explore products
            </Link>
            <Link href="/wholesale" className="btn btn-ghost">
              Request pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="block buyer-proof-block">
        <div className="shell">
          <BuyerProof />
        </div>
      </section>

      <section className="block">
        <div className="shell split">
          <figure className="split-photo">
            <Image src={baker.src} alt={baker.alt} width={baker.width} height={baker.height} loading="lazy" />
            <figcaption>Bluepoint bakery production photograph; not presented as a portrait of Willie Ramirez.</figcaption>
          </figure>
          <div>
            <p className="eyebrow">Our story</p>
            <h2>From baker to owner: Willie Ramirez</h2>
            <p className="pull-text">
              Founded in 1987 by chefs Fred Bramhall and Mary Clark, Bluepoint grew from its retail bakery roots into a wholesale supplier serving Colorado&apos;s food-service community.
            </p>
            <p>
              <a href={WESTWORD_FOUNDING}>Westword</a> tells that founding. In its Best of Denver 2000 list, the award is{" "}
              <a href={WESTWORD_2000}>Best Bakery</a>.
            </p>
            <p>
              Willie Ramirez spent 28 years working in and managing the bakery before acquiring full ownership.{" "}
              <a href={RAMIREZ_STUDY}>44 Business Capital’s case study</a> tells that story. The page does not show a publication date, and it is not a statement of today’s ownership.
            </p>
            <p>We are a proud, minority-owned and family-owned business headquartered in Denver, Colorado.</p>
            <Link href="/about" className="btn btn-primary">
              About the bakery
            </Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="shell">
          <div className="section-head">
            <h2>Where we deliver</h2>
            <p>From Cheyenne to Fountain to Breckenridge. Call us for the days on your route.</p>
          </div>
          <RouteMap preview />
          <div className="home-delivery-check">
            <div>
              <h3>Wondering about your location?</h3>
              <p>Look up a published delivery area, then confirm the exact address, route days and order requirements with Bluepoint.</p>
            </div>
            <DeliveryChecker idPrefix="home-delivery" context="page" />
            <Link className="text-link" href="/delivery">Full delivery map and details →</Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="shell split">
          <div>
            <h2>Community</h2>
            <p className="pull-text">Since 2009 we have baked all the pies for Project Angel Heart&apos;s Pie in the Sky.</p>
            <p>
              In 2016 the AFP Colorado Chapter named Bluepoint Outstanding Small Business at National Philanthropy Day.
            </p>
            <Link href="/community" className="btn btn-primary">
              Community partners
            </Link>
          </div>
          <div className="split-photo">
            <Image
              src={categoryPhotos.pies.src}
              alt={categoryPhotos.pies.alt}
              width={categoryPhotos.pies.width}
              height={categoryPhotos.pies.height}
              loading="eager"
            />
          </div>
        </div>
      </section>
    </>
  );
}
