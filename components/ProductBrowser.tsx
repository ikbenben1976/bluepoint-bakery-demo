"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FramedImage } from "@/components/FramedImage";
import { visualForProduct } from "@/data/illustrative";
import { bunCatalogPhotoFor } from "@/data/bunCatalogPhotos";
import type { CatalogGroup, Product } from "@/data/products";
import { findAssortment } from "@/data/homeAssortment";
import { catalogViewAllLabel, findMaking, type MakingUse } from "@/data/making";
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
  assortmentParam?: string | null;
  makingParam?: string | null;
};

export function ProductBrowser(props: Props) {
  if (props.onAdd) return <ProductBrowserInner {...props} />;
  return (
    <Suspense fallback={<ProductBrowserInner {...props} />}>
      <ProductBrowserFromUrl {...props} />
    </Suspense>
  );
}

function ProductBrowserFromUrl(props: Props) {
  const searchParams = useSearchParams();
  return (
    <ProductBrowserInner
      {...props}
      assortmentParam={searchParams.get("assortment")}
      makingParam={searchParams.get("making")}
    />
  );
}

function ProductBrowserInner({ groups, onAdd, selectedIds, assortmentParam = null, makingParam = null }: Props) {
  const family = groups[0]?.family ?? null;
  const urlAssortment = onAdd ? null : (findAssortment(assortmentParam ?? null, family)?.id ?? null);
  const urlMaking = onAdd ? null : (findMaking(makingParam ?? null, family)?.slug ?? null);
  const urlKey = `${urlAssortment ?? ""}\n${urlMaking ?? ""}`;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [trackedKey, setTrackedKey] = useState(urlKey);
  const [clearedKey, setClearedKey] = useState<string | null>(null);
  const [storedIds, setStoredIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const pathname = usePathname() || "/";
  const router = useRouter();
  const requestCount = useRequestCount();
  const { openSheet, notifyAdded } = useRequestSheet();
  const catalogPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const showRequestBar = !onAdd && requestCount > 0 && (catalogPath === "/breads" || catalogPath === "/pastries");
  if (trackedKey !== urlKey) {
    setTrackedKey(urlKey);
    setClearedKey(null);
    setCategory("all");
    setQuery("");
  }
  const assortmentId = clearedKey === urlKey ? null : urlAssortment;
  const makingSlug = clearedKey === urlKey ? null : urlMaking;

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
    setClearedKey(urlKey);
    if (!onAdd && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const hadFilter = url.searchParams.has("assortment") || url.searchParams.has("making");
      url.searchParams.delete("assortment");
      url.searchParams.delete("making");
      if (hadFilter) {
        router.replace(url.pathname + url.search + url.hash, { scroll: false });
      }
    }
    setNote("Search and filters cleared.");
  }

  const families = new Set(groups.map((group) => group.family));
  const searchPlaceholder =
    families.size === 1 && families.has("pastries")
      ? "Search pastries"
      : families.size === 1 && families.has("breads")
        ? "Search breads"
        : "Search products";
  const activeAssortment = onAdd ? undefined : findAssortment(assortmentId, family);
  const activeMaking = onAdd ? undefined : findMaking(makingSlug, family);
  const makingGroups = activeMaking
    ? groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.making.some((tag) => tag === activeMaking.slug)),
        }))
        .filter((group) => group.items.length > 0)
    : groups;
  const scopedGroups =
    activeAssortment && !activeMaking
      ? activeAssortment.groupIds
          .map((id) => groups.find((group) => group.id === id))
          .filter((group): group is CatalogGroup => group !== undefined)
      : makingGroups;
  const catalog = groups.flatMap((group) => group.items);
  const compared = compareIds
    .map((id) => catalog.find((product) => product.id === id))
    .filter((product): product is Product => product != null);
  const filtersActive = needle.length > 0 || category !== "all";

  const visible = scopedGroups
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
      {activeMaking ? (
        <ShowingBar use={activeMaking} onViewAll={resetFilters} />
      ) : activeAssortment ? (
        <p className="catalog-assortment-note" data-testid="assortment-filter" role="status">
          Showing <strong>{activeAssortment.name}</strong> products
          <button type="button" onClick={resetFilters}>
            View all {catalogViewAllLabel(activeAssortment.family)}
          </button>
        </p>
      ) : null}
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
          Review my selections
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
        {scopedGroups.map((group) => (
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
          <p>Compare available sizes, specifications and ordering details.</p>
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
              Request a quote for selected products
            </Link>
          </p>
        </section>
      ) : null}
      <div ref={resultsRef}>
      {visible.length === 0 ? (
        <div className="catalog-empty">
          <p>No matching products found. Try a different search or browse another category.</p>
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
              Product images are for illustration; actual products may vary.
            </p>
            <p className="category-notice">{categoryNotice(group.lead)}</p>
            <ul className="product-grid">
              {items.map((product) => {
                const bunPhoto = catalogPath === "/breads" && product.category === "buns"
                  ? bunCatalogPhotoFor(product.id)
                  : undefined;
                const visual = bunPhoto ?? visualForProduct(product.id);
                return (
                <li key={product.id} id={product.id} className={`product-card${selected.has(product.id) ? " is-in-request" : ""}`}>
                  {visual ? <div className="product-photo">
                    <FramedImage
                      webp={visual.webp}
                      avif={visual.avif}
                      alt={visual.alt}
                      width={visual.width}
                      height={visual.height}
                      sizes="(max-width: 699px) 92vw, (max-width: 1023px) 46vw, 300px"
                      label={bunPhoto ? bunPhoto.label : "Illustrative image"}
                    />
                  </div> : null}
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

function ShowingBar({ use, onViewAll }: { use: MakingUse; onViewAll: () => void }) {
  return (
    <p className="catalog-assortment-note" data-testid="assortment-filter" role="status">
      Showing <strong>{use.title}</strong> products
      <button type="button" onClick={onViewAll}>
        View all {catalogViewAllLabel(use.family)}
      </button>
    </p>
  );
}
