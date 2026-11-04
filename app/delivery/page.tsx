import type { Metadata } from "next";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { RouteMap } from "@/components/RouteMap";
import { CAVEAT, DAY_SWATCH, ROUTE_CITIES, ROUTE_NAME, type DayKey } from "@/data/routes";
import { SERVICE_AREAS } from "@/lib/deliveryArea";

export const metadata: Metadata = {
  title: "Delivery Area",
  description:
    "Bluepoint Bakery delivers across the Denver Metro Area, Boulder, Fort Collins/Greeley, Colorado Springs, Central City/Blackhawk, the I-70 Corridor to Breckenridge, Cheyenne, Wyoming, Loveland, and Summit County.",
};

const ROUTE_ORDER: DayKey[] = ["mon-sat", "mwfs", "tts", "ts", "mttf"];

export default function DeliveryPage() {
  return (
    <div className="shell delivery-page">
      <p className="kicker">The route</p>
      <h1>Where we deliver</h1>
      <p className="delivery-lede">
        We bake and deliver six days a week, from Cheyenne to Fountain to Breckenridge. {CAVEAT}
      </p>
      <div className="delivery-layout">
      <RouteMap />
      <div className="delivery-lower">
        <div className="delivery-routes">
          <h2>Routes named on the current map</h2>
          <p>Call us for the days on your route. The weekday schedule is not printed on the current map page.</p>
          <table className="route-table">
            <caption className="sr-only">Delivery routes and towns</caption>
            <thead>
              <tr>
                <th scope="col">Route</th>
                <th scope="col">Towns</th>
              </tr>
            </thead>
            <tbody>
              {ROUTE_ORDER.map((key) => (
                <tr key={key}>
                  <th scope="row">
                    <i style={{ background: DAY_SWATCH[key] }} />
                    {ROUTE_NAME[key]}
                  </th>
                  <td>
                    {ROUTE_CITIES.filter((city) => city.days === key)
                      .map((city) => (city.name === "Denver International Airport" ? "DIA" : city.name))
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Also named in writing</h2>
          <ul className="serve-list">
            {SERVICE_AREAS.map((area) => (
              <li key={area.label}>{area.label}</li>
            ))}
          </ul>
        </div>
        <aside className="delivery-check">
          <h2>Check a city</h2>
          <p>Same towns as the map. We will tell you the days when you call.</p>
          <DeliveryChecker idPrefix="delivery-page" context="page" />
        </aside>
      </div>
      </div>
    </div>
  );
}
