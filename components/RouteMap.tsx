"use client";

import { useId, useMemo, useState, type MouseEvent } from "react";
import mapStyles from "./routeMap.module.css";
import { BASEMAP } from "@/data/basemap";
import {
  BAKERY,
  CAVEAT,
  DAY_SWATCH,
  DAY_TEXT,
  ROUTE_NAME,
  ROUTE_CITIES,
  findRouteCity,
  type DayKey,
  type RouteCity,
} from "@/data/routes";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { checkDelivery, deliveryPhrase, deliverySuggestions } from "@/lib/deliveryArea";
import { DELIVERY_BAKERY_LABEL_DY, cityLabelAnchor, cityLabelOffset } from "@/lib/deliveryMapLabels";
import { project } from "@/lib/project";

const LEGEND: { key: DayKey; label: string }[] = (
  ["mon-sat", "mwfs", "tts", "ts", "mttf"] as const
).map((key) => ({ key, label: ROUTE_NAME[key] }));

const ZONES = ["cheyenne", "north", "metro", "springs", "summit", "canyon"] as const;

function zoneEllipse(zone: string): { cx: number; cy: number; rx: number; ry: number; fill: string } | null {
  const cities = ROUTE_CITIES.filter((city) => city.zone === zone);
  if (cities.length === 0) return null;
  const pts = cities.map((city) => project(city.lon, city.lat));
  const xs = pts.map((pt) => pt.x);
  const ys = pts.map((pt) => pt.y);
  const pad = cities.length === 1 ? 64 : 50;
  return {
    cx: (Math.min(...xs) + Math.max(...xs)) / 2,
    cy: (Math.min(...ys) + Math.max(...ys)) / 2,
    rx: Math.max(58, (Math.max(...xs) - Math.min(...xs)) / 2 + pad),
    ry: Math.max(42, (Math.max(...ys) - Math.min(...ys)) / 2 + pad),
    fill: DAY_SWATCH[cities[0].days],
  };
}

function labelOf(city: RouteCity): string {
  return city.name === "Denver International Airport" ? "DIA" : city.name;
}

function cityForLabel(label: string): RouteCity | undefined {
  const exact = findRouteCity(label);
  if (exact) return exact;
  const query = label.trim().toLowerCase();
  if (!query) return undefined;
  return ROUTE_CITIES.find((city) => {
    const names = [city.name, ...(city.aliases ?? [])];
    return names.some((name) => query.includes(name.toLowerCase()));
  });
}

export function RouteMap() {
  const [query, setQuery] = useState("");
  const [activeName, setActiveName] = useState("Denver");
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const active = findRouteCity(activeName) ?? ROUTE_CITIES.find((city) => city.name === "Denver")!;
  const hovered = hoveredName ? findRouteCity(hoveredName) : undefined;
  const hoverPoint = hovered ? project(hovered.lon, hovered.lat) : undefined;
  const result = checkDelivery(query);
  const phrase = deliveryPhrase(result.status, "page");
  const suggestions = useMemo(() => deliverySuggestions(query), [query]);

  const clipId = useId().replace(/:/g, "");
  const bakery = project(BAKERY.lon, BAKERY.lat);
  const zones = ZONES.map((zone) => zoneEllipse(zone)).filter((zone) => zone != null);

  function choose(label: string) {
    setQuery(label);
    const city = cityForLabel(label);
    if (city) setActiveName(city.name);
  }

  function nearestCity(event: MouseEvent<HTMLDivElement>): RouteCity | null {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const x = ((event.clientX - rect.left) / rect.width) * BASEMAP.width;
    const y = ((event.clientY - rect.top) / rect.height) * BASEMAP.height;
    let best: RouteCity | null = null;
    let bestDistance = 64 * 64;
    for (const city of ROUTE_CITIES) {
      const pt = project(city.lon, city.lat);
      const distance = (pt.x - x) ** 2 + (pt.y - y) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = city;
      }
    }
    return best;
  }

  function hoverFromMap(event: MouseEvent<HTMLDivElement>) {
    const best = nearestCity(event);
    setHoveredName(best?.name ?? null);
    if (best) setActiveName(best.name);
  }

  function clickFromMap(event: MouseEvent<HTMLDivElement>) {
    const best = nearestCity(event);
    setHoveredName(best?.name ?? null);
    if (best) {
      setActiveName(best.name);
      setQuery(best.name);
    }
  }

  return (
    <div className="atlas">
      <div className="atlas-frame">
        <div className="atlas-stage">
          <div className="atlas-fit">
            {/* Plain img: the basemap is already a built JPEG, and next/image would not resize it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BASEMAP.src}
              alt="Shaded-relief map of cities named on Bluepoint’s delivery map. Highways are geography only. No driving route is drawn."
              width={BASEMAP.width}
              height={BASEMAP.height}
              loading="eager"
              decoding="async"
            />
            <svg viewBox={`0 0 ${BASEMAP.width} ${BASEMAP.height}`} aria-hidden="true">
              <defs>
                <clipPath id={clipId}>
                  <rect width={BASEMAP.width} height={BASEMAP.height} />
                </clipPath>
              </defs>
              <g clipPath={`url(#${clipId})`}>
                {zones.map((zone) => (
                  <ellipse
                    key={`${zone.cx}-${zone.cy}`}
                    cx={zone.cx}
                    cy={zone.cy}
                    rx={zone.rx}
                    ry={zone.ry}
                    fill={zone.fill}
                    opacity={0.22}
                  />
                ))}
                {BASEMAP.roads.map((road, index) => (
                  <path key={`${road.ref}-${index}`} className={`hwy hwy-${road.ref.slice(2)}`} d={road.d} />
                ))}
                {ROUTE_CITIES.map((city) => {
                  const pt = project(city.lon, city.lat);
                  const offset = cityLabelOffset(city, false);
                  const label = cityLabelAnchor(city.lon, city.lat, offset.lx, offset.ly);
                  const on = city.name === active.name;
                  return (
                    <g key={city.name}>
                      <circle
                        data-city={city.name}
                        cx={pt.x}
                        cy={pt.y}
                        r={on ? 16 : 11}
                        fill={DAY_SWATCH[city.days]}
                        stroke="#0D0D25"
                        strokeWidth={on ? 2.4 : 1.2}
                      />
                      <text className="city-label" x={label.x} y={label.y} textAnchor={label.anchor}>
                        {labelOf(city)}
                      </text>
                    </g>
                  );
                })}
                <g>
                  <circle cx={bakery.x} cy={bakery.y} r="18" fill="#2035E8" stroke="#0D0D25" strokeWidth="2" />
                  <text className="bakery-letters" x={bakery.x} y={bakery.y + 4} textAnchor="middle" fill="#FFFFFF">
                    BP
                  </text>
                  <text className="city-label" x={bakery.x + 24} y={bakery.y + DELIVERY_BAKERY_LABEL_DY} textAnchor="start">
                    5105 Cook St
                  </text>
                </g>
              </g>
            </svg>
            <div
              className="map-pointer"
              onMouseMove={hoverFromMap}
              onClick={clickFromMap}
              onMouseLeave={() => setHoveredName(null)}
            />
            {hovered && hoverPoint ? (
              <div
                className={`${mapStyles.tooltip} ${hoverPoint.y < BASEMAP.height * 0.15 ? mapStyles.below : ""}`}
                style={{
                  left: `${Math.min(72, Math.max(28, (hoverPoint.x / BASEMAP.width) * 100))}%`,
                  top: `${(hoverPoint.y / BASEMAP.height) * 100}%`,
                }}
                aria-hidden="true"
                data-testid="map-hover-tooltip"
              >
                <strong>{hovered.name}</strong>
                <span>{DAY_TEXT[hovered.days].replaceAll(", ", " · ")}</span>
              </div>
            ) : null}
          </div>
        </div>
        <ul className="map-legend map-legend-card">
          {LEGEND.map((item) => (
            <li key={item.key}>
              <i style={{ background: DAY_SWATCH[item.key] }} />
              <span className="legend-copy">
                {item.label}
                <span className="legend-days">{DAY_TEXT[item.key]}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="map-attr">{BASEMAP.attribution}</p>
        <div className="atlas-side">
          <article className="atlas-card" aria-live="polite">
            <p className="kicker">On the route</p>
            <h3>{active.name}</h3>
            <p className="route-days">
              <i style={{ background: DAY_SWATCH[active.days] }} />
              {DAY_TEXT[active.days]}
            </p>
            {active.note ? <p>{active.note}</p> : null}
          </article>
        </div>
      </div>
      <form className="atlas-search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="route-lookup">Find a city on the map</label>
        <input
          id="route-lookup"
          value={query}
          autoComplete="off"
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            const exact = findRouteCity(next);
            if (exact) setActiveName(exact.name);
          }}
        />
        {suggestions.length > 0 ? (
          <ul className="route-suggest" aria-label="Matching cities">
            {suggestions.map((suggestion) => (
              <li key={suggestion.label}>
                <button type="button" onClick={() => choose(suggestion.label)}>
                  {suggestion.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p role="status" className="atlas-result">
          {result.status === "empty" ? "Enter your city to see available delivery information." : null}
          {result.status === "yes" ? `${result.area}${result.days ? ` · ${result.days}` : ""}. ${phrase}` : null}
          {result.status === "ask" ? `${phrase}${result.days ? ` · ${result.days}` : ""}` : null}
        </p>
        <p className="atlas-phone">
          <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
        </p>
        <p className="delivery-overview">{CAVEAT}</p>
      </form>
    </div>
  );
}
