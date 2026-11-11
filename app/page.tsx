import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MakingCards } from "@/components/MakingCards";
import { AssortmentCards } from "@/components/AssortmentCards";
import { BuyerProof } from "@/components/BuyerProof";
import { HeroBenefits } from "@/components/HeroBenefits";
import { RouteMap } from "@/components/RouteMap";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { heroDesktop, heroMobile } from "@/data/illustrative";
import { categoryPhotos } from "@/data/photos";
import { COLORADO_PROUD, ORDER_URL } from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return (
    <>
      <section className="hero approved-hero seamless-hero" aria-labelledby="approved-hero-title">
        <div className="hero-copy">
          <div className="hero-intro">
            <p className="hero-kicker">Denver-baked. Denver&apos;s wholesale bakery since 1987.</p>
            <h1 id="approved-hero-title">
              Fresh, <span className="hero-keep">Scratch-Baked</span><span className="hero-balance"></span> Breads, Rolls &amp; Pastries
            </h1>
            <p className="lede">
              Fresh breads, rolls and pastries baked in Denver for restaurants, cafés, hotels and food-service businesses across the Front Range.
            </p>
          </div>
          <HeroBenefits />
          <div className="hero-actions">
            <Link href="/breads" className="btn btn-primary approved-hero-primary">Explore Our Products <span aria-hidden="true">→</span></Link>
            <Link href="/wholesale" className="btn btn-ghost approved-hero-secondary">Request a Wholesale Account</Link>
          </div>
          <ul className="hero-lead-times" aria-label="Order notice">
            <li>Order breads at least 24 hours ahead.</li>
            <li>Order pastries at least 48 hours ahead.</li>
          </ul>
        </div>
        <figure className="hero-figure seamless-hero-media">
          <picture>
            <source media="(min-width: 1024px)" srcSet={heroDesktop.avif} type="image/avif" />
            <source media="(min-width: 1024px)" srcSet={heroDesktop.webp} type="image/webp" />
            <source srcSet={heroMobile.avif} type="image/avif" />
            <Image
              src={heroMobile.webp}
              alt={heroMobile.alt}
              width={heroMobile.width}
              height={heroMobile.height}
              priority
              sizes="(max-width: 1023px) 100vw, 58vw"
              className="hero-photo seamless-hero-photo"
              style={{ objectFit: "cover" }}
            />
          </picture>
          <figcaption className="illustrative-note">Illustrative image</figcaption>
        </figure>
      </section>

      {/*
        Trust strip, public facts only.
        Colorado Proud product directory lists Bluepoint Bakery, 5105 Cook St., Denver, CO 80216, (303) 298-1100.
        https://coloradoproud.com/product-finder/ (checked 2026-11-04).
        “We are a proud, minority-owned and family-owned business headquartered in Denver, Colorado.”
        https://www.bluepointbakery.com/about
        The NMSDC Certified MBE badge is shown because Ben approved it as on the current bakery site.
        The homepage and about HTML checked for this demo did not include an NMSDC image file, so the
        mark is the supplied badge with the page background and a stray corner removed.
      */}
      <section className="brand-trust" aria-label="Bluepoint Bakery credentials">
        <div className="shell brand-trust-inner">
          <ul className="trust-credential-list">
            <li className="trust-credential trust-colorado">
              <Image src="/images/colorado-proud.jpg" alt="Colorado Proud program emblem" width={62} height={62} />
              <div className="trust-credential-copy">
                <strong>Colorado Proud</strong>
                <span>Made in Colorado</span>
                <a href={COLORADO_PROUD}>View our listing <span aria-hidden="true">→</span></a>
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
                <span>Denver, Colorado</span>
              </div>
            </li>
            <li className="trust-credential trust-mbe">
              <Image
                src="/images/brand/nmsdc-mbe.png"
                alt="NMSDC Certified Minority Business Enterprise badge"
                width={341}
                height={382}
              />
              <div className="trust-credential-copy">
                <strong>NMSDC Certified Minority Business Enterprise</strong>
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
          <h2>The right bread for your menu starts here.</h2>
          <p>Tell us about your menu, location and anticipated volume. We&apos;ll help you explore products suited to your operation.</p>
          <p>
            Need something specific? Ask our team about specialty products and available customization options.
          </p>
          <div className="hero-actions">
            <Link href="/breads" className="btn btn-primary">
              Explore products
            </Link>
            <Link href="/wholesale" className="btn btn-ghost">
              Request a quote
            </Link>
            <Link href="/wholesale/#sample-request" className="btn btn-ghost">
              Ask about samples
            </Link>
          </div>
        </div>
      </section>

      <section className="ordering-guide" aria-labelledby="ordering-guide-heading">
        <div className="shell">
          <div className="section-intro">
            <div>
              <p className="eyebrow">Getting started with Bluepoint</p>
              <h2 id="ordering-guide-heading">From first conversation to first order.</h2>
              <p>New to Bluepoint? Share what your business needs, explore the options and connect with our sales team.</p>
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
        <div className="shell">
          <div className="section-head">
            <h2>Delivery across the Front Range</h2>
            <p>Daily metro delivery, with routes reaching <span className="keep-together">Fort Collins</span>, Greeley, <span className="keep-together">Colorado Springs</span>, Breckenridge, <span className="keep-together">Black Hawk</span>, and Cheyenne. <Link href="/delivery/">See the map</Link>.</p>
          </div>
          <RouteMap preview />
          <div className="home-delivery-check">
            <div>
              <h3>Do we deliver to your area?</h3>
              <p>Find your city and explore our delivery coverage. Our team can confirm service to your address and available delivery days.</p>
            </div>
            <DeliveryChecker idPrefix="home-delivery" context="page" />
            <Link className="text-link" href="/delivery">View delivery areas and routes →</Link>
          </div>
        </div>
      </section>

      <section className="block home-community">
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
