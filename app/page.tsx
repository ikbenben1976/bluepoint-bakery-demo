import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MakingCards } from "@/components/MakingCards";
import { AssortmentCards } from "@/components/AssortmentCards";
import { BuyerProof } from "@/components/BuyerProof";
import { HeroBenefits } from "@/components/HeroBenefits";
import { RouteMap } from "@/components/RouteMap";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { categoryPhotos, gallery } from "@/data/photos";
import {
  COLORADO_PROUD,
  RAMIREZ_STUDY,
  WESTWORD_2000,
  WESTWORD_FOUNDING,
  ORDER_URL,
} from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
};

export default function HomePage() {
  const production = gallery.find((photo) => photo.src.endsWith("bakers-line.webp"))!;

  return (
    <>
      <section className="hero approved-hero seamless-hero" aria-labelledby="approved-hero-title">
        <div className="hero-copy">
          <div className="hero-intro">
            <p className="hero-kicker">Colorado&apos;s wholesale bakery</p>
            <h1 id="approved-hero-title">Fresh, Scratch-Baked Breads, Rolls &amp; Pastries</h1>
            <p className="lede">
              For restaurants, cafés, hotels, hospitals and more across the Colorado Front Range — for over 30 years.
            </p>
          </div>
          <HeroBenefits />
          <div className="hero-actions">
            <Link href="/breads" className="btn btn-primary approved-hero-primary">Explore Our Products <span aria-hidden="true">→</span></Link>
            <Link href="/wholesale" className="btn btn-ghost approved-hero-secondary">Request a Wholesale Account</Link>
          </div>
        </div>
        <figure className="hero-figure seamless-hero-media">
          <picture>
            <source media="(min-width: 1024px)" srcSet="/images/brand/hero-desktop.avif" type="image/avif" />
            <source media="(min-width: 1024px)" srcSet="/images/brand/hero-desktop.jpg" type="image/jpeg" />
            <source srcSet="/images/brand/hero-mobile.avif" type="image/avif" />
            <img
              src="/images/brand/hero-mobile.jpg"
              alt="Illustrative assortment of wholesale breads, rolls and pastries on a bakery counter."
              width={1600}
              height={1200}
              className="hero-photo seamless-hero-photo"
            />
          </picture>
          <figcaption className="illustrative-note">Illustrative photo</figcaption>
        </figure>
      </section>

      {/*
        Trust strip, public facts only.
        Colorado Proud product directory lists Bluepoint Bakery, 5105 Cook St., Denver, CO 80216, (303) 298-1100.
        https://coloradoproud.com/product-finder/ (checked 2026-11-04).
        “We are a proud, minority-owned and family-owned business headquartered in Denver, Colorado.”
        https://www.bluepointbakery.com/about
        No certification is claimed for minority-owned or family-owned.
      */}
      <section className="brand-trust" aria-label="Bluepoint Bakery credentials">
        <div className="shell brand-trust-inner">
          <ul className="trust-credential-list">
            <li className="trust-credential trust-colorado">
              <Image src="/images/colorado-proud.jpg" alt="Colorado Proud program emblem" width={62} height={62} />
              <div className="trust-credential-copy">
                <strong>Colorado Proud</strong>
                <span>Listed in the product directory</span>
                <a href={COLORADO_PROUD}>Find Bluepoint <span aria-hidden="true">→</span></a>
              </div>
            </li>
            <li className="trust-credential">
              <span className="trust-line-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 24 19-17 19 17v17H5V24Z" />
                  <path d="M18 41V27h12v14M13 23h5M30 23h5" />
                </svg>
              </span>
              <div className="trust-credential-copy">
                <strong>Family-owned</strong>
                <span>Headquartered in Denver, Colorado</span>
              </div>
            </li>
            <li className="trust-credential">
              <span className="trust-line-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 24 10-10 9 8 9-8 10 10-10 11-9-7-9 7L5 24Z"/>
                  <path d="m15 14 5-4h8l5 4M17 28l7 6 7-6"/>
                </svg>
              </span>
              <div className="trust-credential-copy">
                <strong>Minority-owned</strong>
                <span>The bakery&apos;s description, not a certification</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="block assortment-section" aria-labelledby="assortment-heading">
        <div className="shell">
          <AssortmentCards />
        </div>
      </section>

      <section className="block application-block">
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
            <Link href="/wholesale/#sample-request" className="btn btn-ghost">
              Ask about samples
            </Link>
          </div>
          <p className="consult-disclaimer">The bakery must confirm whether samples are offered, along with any costs and conditions.</p>
        </div>
      </section>

      <section className="ordering-guide" aria-labelledby="ordering-guide-heading">
        <div className="shell">
          <div className="section-intro">
            <div>
              <p className="eyebrow">How wholesale inquiries work</p>
              <h2 id="ordering-guide-heading">From your menu to the right order.</h2>
              <p>New to Bluepoint? Prepare the details a sales professional will need, without guessing prices or case quantities.</p>
            </div>
          </div>
          <ol className="ordering-steps">
            <li><span>01</span><h3>Explore the assortment</h3><p>Browse by menu application, bread category or pastry category.</p><Link href="/breads">Explore breads</Link></li>
            <li><span>02</span><h3>Build your request</h3><p>Select products, approximate quantities, location and desired start date.</p><Link href="/wholesale">Prepare a request</Link></li>
            <li><span>03</span><h3>Confirm with sales</h3><p>Review your draft and contact Bluepoint for availability, pricing, delivery details and account setup.</p><Link href="/contact">Contact the bakery</Link></li>
          </ol>
          <p className="existing-order-link">Already a customer? <a href={ORDER_URL} target="_blank" rel="noopener noreferrer">Go to the existing ordering portal</a>.</p>
        </div>
      </section>

      <section className="block buyer-proof-block" id="customers">
        <div className="shell">
          <BuyerProof />
        </div>
      </section>

      <section className="block">
        <div className="shell split">
          <figure className="split-photo">
            <Image src={production.src} alt={production.alt} width={production.width} height={production.height} loading="lazy" />
            <figcaption>Bakers on the line at the Denver bakery.</figcaption>
          </figure>
          <div>
            <p className="eyebrow">Our story</p>
            <h2>From baker to owner: Willie Ramirez</h2>
            {/*
              Same Westword wording as the About page.
              https://www.westword.com/location/bluepoint-bakery-5170644/
              https://www.westword.com/news/best-of-denver-winners-from-2000-5834471/
            */}
            <p className="pull-text">
              Bluepoint Bakery was founded in 1987 by chefs Fred Bramhall and Mary Clark.
            </p>
            <p>
              <a href={WESTWORD_FOUNDING}>Westword</a> describes the retail bakery on Sixth Avenue and the wholesale bakery in north Denver. In its Best of Denver 2000 list, Bluepoint is named{" "}
              <a href={WESTWORD_2000}>Best Bakery</a>.
            </p>
            <p>
              After 28 years of working in and managing the bakery, Willie Ramirez acquired full ownership, as told by{" "}
              <a href={RAMIREZ_STUDY}>44 Business Capital</a>. The account does not give a date.
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
            <p>We bake and deliver 6 days a week. Published areas include Denver, Colorado Springs, Fort Collins, Greeley, Loveland, Summit County, Blackhawk, and Cheyenne, Wyoming.</p>
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
            <p className="pull-text">Since 2009, Bluepoint has prepared and donated all the pies for Project Angel Heart&apos;s Pie in the Sky.</p>
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
