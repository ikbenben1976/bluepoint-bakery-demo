"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CatalogGroup, Product } from "@/data/products";
import { categoryPhotos, extraPhotos } from "@/data/photos";
import { addProductLine } from "@/lib/draft";
import { leadWords, publishedSize } from "@/lib/spec";
import { loadDraft, saveDraft } from "@/lib/storage";

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

  useEffect(() => {
    if (onAdd) return;
    setStoredIds(loadDraft().lines.map((line) => line.productId));
  }, [onAdd]);

  const selected = new Set([...(selectedIds ?? []), ...storedIds]);
  const needle = query.trim().toLowerCase();

  function add(product: Product) {
    if (onAdd) {
      onAdd(product);
      setNote(`${product.name} added to your request.`);
      return;
    }
    const next = addProductLine(loadDraft(), product);
    saveDraft(next);
    setStoredIds(next.lines.map((line) => line.productId));
    setNote(`${product.name} added to your request.`);
  }

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
        <div className="min-w-[16rem] flex-1">
          <label htmlFor="product-search">Search products</label>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Link href="/wholesale" className="btn btn-ghost">
          Open your request
        </Link>
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
      {visible.length === 0 ? <p>No products match that search.</p> : null}
      {visible.map(({ group, items }) => {
        const photo = categoryPhotos[group.id];
        return (
          <section key={group.id} id={group.id} className="section-anchor">
            {photo ? (
              <div className="group-photo">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 1100px"
                  className="object-contain"
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
            <p className="catalog-photo-note">Category photography is illustrative; the image above does not identify every individual product or variation.</p>
            <ul className="product-grid">
              {items.map((product) => (
                <li key={product.id} id={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <p className="meta">{leadWords(product)}</p>
                  <div className="badges">
                    {product.individuallyWrapped ? <span className="badge">Individually wrapped</span> : null}
                    {product.seasonal ? <span className="badge">Seasonal</span> : null}
                  </div>
                  {product.detail ? <p className="meta">{product.detail}</p> : null}
                  <details className="spec" data-testid="spec">
                    <summary>Specifications</summary>
                    <dl>
                      <div>
                        <dt>Published size</dt>
                        <dd>{publishedSize(product.name) ?? "Confirm with bakery"}</dd>
                      </div>
                      <div>
                        <dt>Category</dt>
                        <dd>{product.categoryLabel}</dd>
                      </div>
                      {product.sliceOptions ? (
                        <div>
                          <dt>Slicing</dt>
                          <dd>{product.sliceOptions.join(", ")}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt>Order lead time</dt>
                        <dd>{leadWords(product)}</dd>
                      </div>
                      <div>
                        <dt>Pack size</dt>
                        <dd>{product.units.length > 0 ? product.units.join(" or ") : "Confirm with bakery"}</dd>
                      </div>
                      <div>
                        <dt>Ingredients / allergens</dt>
                        <dd>Request current product information from the bakery</dd>
                      </div>
                      <div>
                        <dt>Shelf life / storage</dt>
                        <dd>Confirm with bakery</dd>
                      </div>
                      <div>
                        <dt>Wholesale pricing</dt>
                        <dd>Ask sales for a quote</dd>
                      </div>
                    </dl>
                  </details>
                  {selected.has(product.id) ? (
                    <p className="font-semibold">In your request</p>
                  ) : (
                    <button type="button" className="btn btn-ghost" onClick={() => add(product)}>
                      Add to request
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
