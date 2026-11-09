"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FramedImage } from "@/components/FramedImage";
import { visualForProduct } from "@/data/illustrative";
import type { CatalogGroup, Product } from "@/data/products";
import { categoryPhotos, extraPhotos } from "@/data/photos";
import { addProductLine } from "@/lib/draft";
import { categoryNotice, specChips, specRows } from "@/lib/spec";
import { REQUEST_CHANGE_EVENT, loadDraft, saveDraft } from "@/lib/storage";
import { requestBarLabel, requestPricingHref } from "@/lib/requestLink";
import { useRequestCount } from "@/components/useRequestCount";
import { useRequestSheet } from "@/components/RequestSheet";

type Props = {
  groups: readonly CatalogGroup[];
  onAdd?: (product: Product) => void;
  selectedIds?: readonly string[];
};

export function ProductBrowser({ groups, onAdd, selectedIds }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [storedIds, setStoredIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const pathname = usePathname() || "/";
  const requestCount = useRequestCount();
  const { openSheet, notifyAdded } = useRequestSheet();
  const catalogPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const showRequestBar = !onAdd && requestCount > 0 && (catalogPath === "/breads" || catalogPath === "/pastries");

  useEffect(() => {
    if (onAdd) return;
    const read = () => setStoredIds(loadDraft().lines.map((line) => line.productId));
    read();
    window.addEventListener(REQUEST_CHANGE_EVENT, read);
    return () => window.removeEventListener(REQUEST_CHANGE_EVENT, read);
  }, [onAdd]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    resultsRef.current?.scrollIntoView({ block: "nearest" });
  }, [category]);

  const selected = new Set([...(selectedIds ?? []), ...storedIds]);
  const needle = query.trim().toLowerCase();

  function add(product: Product) {
    if (onAdd) {
      onAdd(product);
      notifyAdded();
      return;
    }
    const before = loadDraft();
    const next = addProductLine(before, product);
    if (next.lines.length === before.lines.length) return;
    saveDraft(next);
    setStoredIds(next.lines.map((line) => line.productId));
    notifyAdded();
  }

  function toggleCompare(product: Product) {
    if (compareIds.includes(product.id)) {
      setCompareIds(compareIds.filter((id) => id !== product.id));
      setNote(`${product.name} removed from the comparison.`);
      return;
    }
    if (compareIds.length >= 3) {
      setNote("Compare up to 3 products.");
      return;
    }
    setCompareIds([...compareIds, product.id]);
    setNote(`${product.name} added to the comparison.`);
  }

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setNote("Search and filters cleared.");
  }

  const families = new Set(groups.map((group) => group.family));
  const searchPlaceholder =
    families.size === 1 && families.has("pastries")
      ? "Search pastries"
      : families.size === 1 && families.has("breads")
        ? "Search breads"
        : "Search products";
  const catalog = groups.flatMap((group) => group.items);
  const compared = compareIds
    .map((id) => catalog.find((product) => product.id === id))
    .filter((product): product is Product => product != null);
  const filtersActive = needle.length > 0 || category !== "all";

  const visible = groups
    .filter((group) => category === "all" || group.id === category)
    .map((group) => ({
      group,
      items: group.items.filter((item) =>
        needle ? `${item.name} ${item.categoryLabel}`.toLowerCase().includes(needle) : true,
      ),
    }))
    .filter((entry) => entry.items.length > 0);

  return (
    <div>
      <div className="catalog-tools">
        <div className="search-field">
          <label htmlFor="product-search">Search products</label>
          <div className="search-control">
            <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16 16.5 20.5 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              id="product-search"
              type="search"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <Link href={requestPricingHref(requestCount)} className="btn btn-ghost catalog-request">
          Open your request
        </Link>
        {filtersActive ? (
          <button type="button" className="btn btn-ghost" onClick={resetFilters}>
            Reset search and filters
          </button>
        ) : null}
      </div>
      <div className="chips" role="group" aria-label="Filter by category">
        <button
          type="button"
          className="chip"
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          All
        </button>
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            className="chip"
            aria-pressed={category === group.id}
            onClick={() => setCategory(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>
      <p role="status" className="mt-4 min-h-6 text-sm font-semibold text-site">
        {note}
      </p>
      {compared.length > 0 ? (
        <section className="compare-panel" aria-label="Compare products" data-testid="compare-panel">
          <h2>Compare</h2>
          <p>Published catalog fields only.</p>
          <div className="compare-grid">
            {compared.map((product) => (
              <article key={product.id} className="compare-card">
                <h3>{product.name}</h3>
                <dl>
                  {specRows(product).map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="card-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => toggleCompare(product)}>
                    Remove from comparison
                  </button>
                  {selected.has(product.id) ? (
                    <button type="button" className="in-request" onClick={openSheet}>In your request</button>
                  ) : (
                    <button type="button" className="btn btn-primary" onClick={() => add(product)}>
                      Add to request
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p>
            <Link className="btn btn-primary" href="/wholesale">
              Request pricing for these
            </Link>
          </p>
        </section>
      ) : null}
      <div ref={resultsRef}>
      {visible.length === 0 ? (
        <div className="catalog-empty">
          <p>No products match that search.</p>
          <button type="button" className="btn btn-ghost" onClick={resetFilters}>
            Reset search and filters
          </button>
        </div>
      ) : null}
      {visible.map(({ group, items }) => {
        const photo = categoryPhotos[group.id];
        return (
          <section key={group.id} id={group.id} className="section-anchor">
            {photo ? (
              <div className="group-photo" style={{ ["--photo-cap" as string]: `${Math.round(photo.width * 1.2)}px` }}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={`(max-width: 700px) 100vw, ${Math.round(photo.width * 1.2)}px`}
                  className="object-cover"
                  loading="eager"
                />
                <div className="copy">
                  <h2>{group.label}</h2>
                  {group.note ? <p>{group.note}</p> : null}
                </div>
              </div>
            ) : (
              <div className="group-type">
                <h2>{group.label}</h2>
                {group.note ? <p>{group.note}</p> : null}
              </div>
            )}
            {extraPhotos[group.id]?.length ? (
              <ul className="extra-photos">
                {extraPhotos[group.id].map((shot) => (
                  <li key={shot.src}>
                    <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="eager" />
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="catalog-photo-note">
              The category photograph above is Bluepoint&apos;s own. Each product photo below is an illustrative image, not a verified photograph of that item.
            </p>
            <p className="category-notice">{categoryNotice(group.lead)}</p>
            <ul className="product-grid">
              {items.map((product) => {
                const visual = visualForProduct(product.id);
                return (
                <li key={product.id} id={product.id} className={`product-card${selected.has(product.id) ? " is-in-request" : ""}`}>
                  <div className="product-photo">
                    <FramedImage
                      webp={visual.webp}
                      avif={visual.avif}
                      alt={visual.alt}
                      width={visual.width}
                      height={visual.height}
                      sizes="(max-width: 699px) 92vw, (max-width: 1023px) 46vw, 300px"
                      label="Illustrative image"
                    />
                  </div>
                  <h3>{product.name}</h3>
                  {specChips(product).length > 0 ? (
                    <ul className="spec-chips">
                      {specChips(product).map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="badges">
                    {product.individuallyWrapped ? <span className="badge">Individually wrapped</span> : null}
                    {product.seasonal ? <span className="badge">Seasonal</span> : null}
                  </div>
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      aria-pressed={compareIds.includes(product.id)}
                      onClick={() => toggleCompare(product)}
                    >
                      {compareIds.includes(product.id) ? "In comparison" : "Compare"}
                    </button>
                    {selected.has(product.id) ? (
                      <button type="button" className="in-request" onClick={openSheet}>In your request</button>
                    ) : (
                      <button type="button" className="btn btn-ghost" onClick={() => add(product)}>
                        Add to request
                      </button>
                    )}
                  </div>
                </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      </div>
      {showRequestBar ? (
        <div className="view-request-bar no-print">
          <button type="button" onClick={openSheet}>
            {requestBarLabel(requestCount)}
          </button>
        </div>
      ) : null}
    </div>
  );
}
