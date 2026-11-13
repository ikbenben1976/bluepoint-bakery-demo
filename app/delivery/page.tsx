import type { Metadata } from "next";
import Image from "next/image";
import { RouteMap } from "@/components/RouteMap";
import { DELIVERY_TRUCK_CAPTION, deliveryTruck } from "@/data/photos";
import { DAY_SWATCH, DAY_TEXT, ROUTE_CITIES, ROUTE_NAME, type DayKey } from "@/data/routes";
import { SERVICE_AREAS } from "@/lib/deliveryArea";

export const metadata: Metadata = {
  title: "Delivery Area",
  description:
    "Bluepoint Bakery delivers across the Denver Metro Area, Boulder, Fort Collins/Greeley, Colorado Springs, Central City/Blackhawk, the I-70 Corridor to Breckenridge, Cheyenne, Wyoming, Loveland, and Summit County.",
  alternates: { canonical: "/delivery/" },
  robots: { index: false, follow: false },
};

const ROUTE_ORDER: DayKey[] = ["mon-sat", "mwfs", "tts", "ts", "mttf"];

function townsFor(key: DayKey): string {
  return ROUTE_CITIES.filter((city) => city.days === key)
    .map((city) => (city.name === "Denver International Airport" ? "DIA" : city.name))
    .join(", ");
}

export default function DeliveryPage() {
  return (
    <div className="shell delivery-page content-page">
      <div className="delivery-intro">
        <div className="delivery-intro-copy">
          <p className="kicker">Delivery area</p>
          <h1>Where we deliver</h1>
          <p className="delivery-lede">
            We bake and deliver six days a week, serving the Denver metro area and communities throughout the Front Range, including Colorado Springs, Fort Collins, Greeley, Loveland, Summit County, Black Hawk and Cheyenne, Wyoming.
          </p>
        </div>
        <figure className="delivery-truck">
          <Image
            src={deliveryTruck.src}
            alt={deliveryTruck.alt}
            width={deliveryTruck.width}
            height={deliveryTruck.height}
            sizes="(max-width: 1023px) 100vw, 520px"
            className="delivery-truck-photo"
          />
          <figcaption>{DELIVERY_TRUCK_CAPTION}</figcaption>
        </figure>
      </div>
      <div className="delivery-layout">
        <RouteMap />
        <div className="delivery-routes">
          <h2>Delivery routes & days</h2>
          <p>Explore published delivery routes and service days for the areas we serve.</p>
          <ul className="route-day-cards">
            {ROUTE_ORDER.map((key) => (
              <li key={key} className="route-day-card">
                <h3>
                  <span className="route-name-lead">
                    <i style={{ background: DAY_SWATCH[key] }} />
                    {ROUTE_NAME[key]}
                  </span>
                </h3>
                <p className="route-days-line">{DAY_TEXT[key]}</p>
                <p className="route-towns">{townsFor(key)}</p>
              </li>
            ))}
          </ul>
          <h2>Areas we serve</h2>
          <ul className="serve-list">
            {SERVICE_AREAS.map((area) => (
              <li key={area.label}>{area.label}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
