import type { Metadata } from "next";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { RouteMap } from "@/components/RouteMap";
import { CAVEAT, DAY_SWATCH, DAY_TEXT, ROUTE_CITIES, ROUTE_NAME, type DayKey } from "@/data/routes";
import { SERVICE_AREAS } from "@/lib/deliveryArea";

export const metadata: Metadata = {
  title: "Delivery Area",
  description:
    "Bluepoint Bakery delivers across the Denver Metro Area, Boulder, Fort Collins/Greeley, Colorado Springs, Central City/Blackhawk, the I-70 Corridor to Breckenridge, Cheyenne, Wyoming, Loveland, and Summit County.",
  alternates: { canonical: "/delivery/" },
  robots: { index: false, follow: false },
};

const ROUTE_ORDER: DayKey[] = ["mon-sat", "mwfs", "tts", "ts", "mttf"];

export default function DeliveryPage() {
  return (
    <div className="shell delivery-page content-page">
      <p className="kicker">Delivery area</p>
      <h1>Where we deliver</h1>
      <p className="delivery-lede">
        We bake and deliver 6 days a week. Deliveries are available from Denver Metro Area; Colorado Springs; Fort Collins; Greeley; Loveland; Summit County; Blackhawk; and Cheyenne, Wyoming. {CAVEAT}
      </p>
      <div className="delivery-layout">
      <RouteMap />
      <div className="delivery-lower">
        <div className="delivery-routes">
          <h2>Colors and weekdays</h2>
          <p>
            Weekdays follow the bakery’s distribution map. Cities are the ones named on the published map.
            {" "}{CAVEAT}
          </p>
          <table className="route-table">
            <caption className="sr-only">Delivery routes and towns</caption>
            <thead>
              <tr>
                <th scope="col">Color</th>
                <th scope="col">Towns</th>
              </tr>
            </thead>
            <tbody>
              {ROUTE_ORDER.map((key) => {
                const [first, ...rest] = ROUTE_NAME[key].split(" ");
                return (
                  <tr key={key}>
                    <th scope="row">
                      <span className="route-name-lead">
                        <i style={{ background: DAY_SWATCH[key] }} />
                        {first}
                      </span>
                      {rest.length > 0 ? ` ${rest.join(" ")}` : null}
                      <span className="route-days-line">{DAY_TEXT[key]}</span>
                    </th>
                    <td>
                      {ROUTE_CITIES.filter((city) => city.days === key)
                        .map((city) => (city.name === "Denver International Airport" ? "DIA" : city.name))
                        .join(", ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h2>Service areas</h2>
          <ul className="serve-list">
            {SERVICE_AREAS.map((area) => (
              <li key={area.label}>{area.label}</li>
            ))}
          </ul>
        </div>
        <aside className="delivery-check">
          <h2>Check a city</h2>
          <p>Same towns as the map, with the weekdays from the distribution map. Call to confirm the city. Breads need 24 hour notice, pastries need 48 hour notice, and Sourdough Boule needs 3 day notice.</p>
          <DeliveryChecker idPrefix="delivery-page" context="page" />
        </aside>
      </div>
      </div>
    </div>
  );
}
