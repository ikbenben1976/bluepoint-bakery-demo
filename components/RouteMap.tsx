"use client";

import { useId, useMemo, useState, type MouseEvent } from "react";
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

export function RouteMap({ preview = false }: { preview?: boolean }) {
  const [query, setQuery] = useState("");
  const [activeName, setActiveName] = useState("Denver");
  const active = findRouteCity(activeName) ?? ROUTE_CITIES.find((city) => city.name === "Denver")!;
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ROUTE_CITIES.filter(
      (city) => city.name.toLowerCase().includes(q) || city.aliases?.some((alias) => alias.toLowerCase().includes(q)),
    ).slice(0, 6);
  }, [query]);

  const clipId = useId().replace(/:/g, "");
  const bakery = project(BAKERY.lon, BAKERY.lat);
  const zones = ZONES.map((zone) => zoneEllipse(zone)).filter((zone) => zone != null);

  function choose(city: RouteCity) {
    setActiveName(city.name);
    setQuery(city.name);
  }

  function pickFromMap(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
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
    if (best) setActiveName(best.name);
  }

  return (
    <div className={`atlas ${preview ? "is-preview" : ""}`}>
      <div className="atlas-frame">
      <div className="atlas-main">
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
          <svg
            viewBox={`0 0 ${BASEMAP.width} ${BASEMAP.height}`}
            aria-hidden="true"
          >
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
              <path
                key={`${road.ref}-${index}`}
                className={`hwy hwy-${road.ref.slice(2)}`}
                d={road.d}
              />
            ))}
            {ROUTE_CITIES.map((city) => {
              const pt = project(city.lon, city.lat);
              const offset = cityLabelOffset(city, preview);
              const label = cityLabelAnchor(city.lon, city.lat, offset.lx, offset.ly);
              const on = city.name === active.name;
              return (
                <g key={city.name}>
                  <circle
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
              <text className="city-label" x={bakery.x + 24} y={bakery.y + (preview ? -28 : DELIVERY_BAKERY_LABEL_DY)} textAnchor="start">
                5105 Cook St
              </text>
            </g>
            </g>
          </svg>
          <div className="map-pointer" onMouseMove={pickFromMap} onClick={pickFromMap} />
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
      </div>
      <div className="atlas-side">
        <article className="atlas-card" aria-live="polite">
        <p className="kicker">On the route</p>
        <h3>{active.name}</h3>
        <p className="route-days">
          <i style={{ background: DAY_SWATCH[active.days] }} />
          {DAY_TEXT[active.days]}
        </p>
        {active.note ? <p>{active.note}</p> : null}
        <p className="route-caveat">{CAVEAT}</p>
        </article>
        {preview ? (
          <p className="atlas-more">
            <a className="btn btn-ghost" href="/delivery/">
              Open the delivery map
            </a>
          </p>
        ) : null}
      </div>
      </div>
      <p className="map-attr">{BASEMAP.attribution}</p>
      {preview ? null : (
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
          {matches.length > 0 ? (
            <ul className="route-suggest" aria-label="Matching cities">
              {matches.map((city) => (
                <li key={city.name}>
                  <button type="button" onClick={() => choose(city)}>
                    {city.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="atlas-phone">
            <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          </p>
        </form>
      )}
    </div>
  );
}
