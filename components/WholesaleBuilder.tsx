"use client";

import { useEffect, useMemo, useState } from "react";
import { catalog, getProduct } from "@/data/products";
import { EMAIL, HOURS, ORDER_URL, PHONE_DISPLAY } from "@/data/site";
import { ProductBrowser } from "@/components/ProductBrowser";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import {
  BUSINESS_TYPES,
  DELIVERY_DAYS,
  addProductLine,
  emptyDraft,
  type Draft,
} from "@/lib/draft";
import { buildEmailPreview, kindsInDraft } from "@/lib/emailPreview";
import {
  earliestDeliveryIso,
  formatLongDate,
  isOnOrAfter,
  leadTimeExplanation,
} from "@/lib/leadTime";
import { clearDraft, loadDraft, saveDraft } from "@/lib/storage";

const AUDIENCE_KEY = "bluepoint-demo-new-customer";

export function WholesaleBuilder() {
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFallback, setCopyFallback] = useState(false);

  useEffect(() => {
    setDraft(loadDraft());
    setStarted(window.sessionStorage.getItem(AUDIENCE_KEY) === "1");
    setNow(new Date());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveDraft(draft);
  }, [draft, ready]);

  const kinds = useMemo(() => kindsInDraft(draft), [draft]);
  const earliest = now && kinds.length > 0 ? earliestDeliveryIso(now, kinds) : "";
  const preview = useMemo(
    () => buildEmailPreview(draft, now ?? new Date("2026-01-01T12:00:00-07:00")),
    [draft, now],
  );

  function startNew() {
    window.sessionStorage.setItem(AUDIENCE_KEY, "1");
    setStarted(true);
    setStep(1);
  }

  function validate(throughStep: number): string[] {
    const next: string[] = [];
    if (throughStep >= 1) {
      if (!draft.businessName.trim()) next.push("Enter the business name.");
      if (!draft.businessType) next.push("Choose a business type.");
      if (!draft.deliveryCity.trim()) next.push("Enter the delivery city.");
      if (draft.days.length === 0) {
        next.push("Choose at least one preferred delivery day (Monday–Saturday).");
      }
    }
    if (throughStep >= 2) {
      if (draft.lines.length === 0) next.push("Add at least one product.");
      for (const line of draft.lines) {
        const product = getProduct(line.productId);
        if (!product) continue;
        if (!Number.isInteger(line.qty) || line.qty < 1) {
          next.push(`Enter a quantity for ${product.name}.`);
        }
        if ((product.sliceOptions?.length ?? 0) > 1 && !line.slice) {
          next.push(`Choose a slice thickness for ${product.name}.`);
        }
        if (product.dippedOption && !line.dipped) {
          next.push(`Choose dipped or undipped for ${product.name}.`);
        }
      }
    }
    if (throughStep >= 3) {
      if (!earliest || !now) {
        next.push("Checking the earliest delivery date.");
      } else if (!draft.firstDelivery) {
        next.push("Choose a first delivery date.");
      } else if (!isOnOrAfter(draft.firstDelivery, earliest)) {
        next.push(
          `That date is before the lead time. The earliest first delivery is ${formatLongDate(earliest)}.`,
        );
      }
    }
    return next;
  }

  function go(nextStep: number) {
    if (nextStep > step) {
      const found = validate(nextStep - 1);
      setErrors(found);
      if (found.length > 0) return;
    }
    setErrors([]);
    setStep(nextStep);
  }

  function updateLine(productId: string, patch: Partial<Draft["lines"][number]>) {
    setDraft((current) => ({
      ...current,
      lines: current.lines.map((line) =>
        line.productId === productId ? { ...line, ...patch } : line,
      ),
    }));
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      setCopyFallback(false);
    } catch {
      setCopied(false);
      setCopyFallback(true);
    }
  }

  if (!ready) {
    return (
      <p className="mx-auto max-w-6xl px-4 py-8" role="status">
        Loading your saved request…
      </p>
    );
  }

  if (!started) {
    return (
      <div className="gate" data-testid="wholesale-gate">
        <p className="gate-lead">
          Existing customers order by phone, email, or online. This request builder is for a new account. It previews an email to {EMAIL} and does not send it.
        </p>
        <div className="gate-actions">
          <a className="gate-choice" href={ORDER_URL}>
            I already order with Bluepoint — Order online
          </a>
          <button type="button" className="gate-choice gate-choice-solid" onClick={startNew}>
            I am a new customer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <div className="progress no-print" aria-hidden="true">
        <span style={{ width: `${(step / 4) * 100}%` }} />
      </div>
      <ol className="stepper no-print" aria-label="Request steps">
        {["Business", "Products", "Timing", "Review"].map((label, index) => {
          const number = index + 1;
          const active = step === number;
          return (
            <li key={label}>
              <button
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => go(number)}
              >
                {number}. {label}
              </button>
            </li>
          );
        })}
      </ol>

      {errors.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 bg-white px-8 py-4 font-semibold" role="alert">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}

      {step === 1 ? (
        <section className="form-narrow step-panel mt-12" data-testid="wholesale-step" data-step="1">
          <h2 className="section-title">Business</h2>
          <p className="mt-2 max-w-3xl">
            Contact fields are optional. They stay in this browser only (localStorage). They are not sent or stored on a server.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="business-name">Business name</label>
              <input
                id="business-name"
                className="mt-1"
                value={draft.businessName}
                onChange={(event) =>
                  setDraft({ ...draft, businessName: event.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="business-type">Business type</label>
              <select
                id="business-type"
                className="mt-1"
                value={draft.businessType}
                onChange={(event) =>
                  setDraft({ ...draft, businessType: event.target.value })
                }
              >
                <option value="">Choose one</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <DeliveryChecker
                idPrefix="wholesale"
                context="wholesale"
                value={draft.deliveryCity}
                onChange={(deliveryCity) => setDraft({ ...draft, deliveryCity })}
              />
            </div>
            <fieldset className="md:col-span-2">
              <legend className="font-semibold">Preferred delivery days</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {DELIVERY_DAYS.map((day) => {
                  const on = draft.days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      className={on ? "btn btn-primary" : "btn btn-ghost"}
                      aria-pressed={on}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          days: DELIVERY_DAYS.filter((item) =>
                            item === day ? !on : draft.days.includes(item),
                          ),
                        })
                      }
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div>
              <label htmlFor="contact-name">Contact name (optional)</label>
              <input
                id="contact-name"
                className="mt-1"
                value={draft.contactName}
                onChange={(event) =>
                  setDraft({ ...draft, contactName: event.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="contact-phone">Contact phone (optional)</label>
              <input
                id="contact-phone"
                className="mt-1"
                inputMode="tel"
                value={draft.contactPhone}
                onChange={(event) =>
                  setDraft({ ...draft, contactPhone: event.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="contact-email">Contact email (optional)</label>
              <input
                id="contact-email"
                className="mt-1"
                inputMode="email"
                value={draft.contactEmail}
                onChange={(event) =>
                  setDraft({ ...draft, contactEmail: event.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="request-notes">Notes (optional)</label>
              <textarea
                id="request-notes"
                value={draft.notes}
                onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
              />
            </div>
          </div>
          <button type="button" className="btn btn-primary mt-6" onClick={() => go(2)}>
            Continue to products
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="step-panel mt-12" data-testid="wholesale-step" data-step="2">
          <h2 className="section-title">Products</h2>
          <p className="mt-2">Quantity per delivery. No prices are collected here.</p>
          <div className="mt-4 space-y-3">
            {draft.lines.map((line) => {
              const product = getProduct(line.productId);
              if (!product) return null;
              return (
                <article key={line.productId} className="line-card mt-4">
                  <h3 className="text-lg font-bold">
                    {product.name}{" "}
                    <span className="font-semibold text-site">({product.categoryLabel})</span>
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label htmlFor={`qty-${product.id}`}>Quantity</label>
                      <input
                        id={`qty-${product.id}`}
                        className="mt-1"
                        type="number"
                        min={1}
                        max={9999}
                        inputMode="numeric"
                        value={line.qty}
                        onChange={(event) =>
                          updateLine(product.id, { qty: Number(event.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`unit-${product.id}`}>Unit</label>
                      {product.units.length > 1 ? (
                        <select
                          id={`unit-${product.id}`}
                          className="mt-1"
                          value={line.unit}
                          onChange={(event) =>
                            updateLine(product.id, { unit: event.target.value })
                          }
                        >
                          {product.units.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p id={`unit-${product.id}`} className="mt-3">
                          {line.unit || "Ask for pack size"}
                        </p>
                      )}
                    </div>
                    {product.sliceOptions && product.sliceOptions.length > 1 ? (
                      <div>
                        <label htmlFor={`slice-${product.id}`}>Slice thickness</label>
                        <select
                          id={`slice-${product.id}`}
                          className="mt-1"
                          value={line.slice}
                          onChange={(event) =>
                            updateLine(product.id, { slice: event.target.value })
                          }
                        >
                          <option value="">Choose</option>
                          {product.sliceOptions.map((slice) => (
                            <option key={slice} value={slice}>
                              {slice}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : product.sliceOptions ? (
                      <p className="self-end">Slice: {product.sliceOptions[0]}</p>
                    ) : null}
                    {product.dippedOption ? (
                      <div>
                        <label htmlFor={`dip-${product.id}`}>Dipped or undipped</label>
                        <select
                          id={`dip-${product.id}`}
                          className="mt-1"
                          value={line.dipped}
                          onChange={(event) =>
                            updateLine(product.id, {
                              dipped: event.target.value as Draft["lines"][number]["dipped"],
                            })
                          }
                        >
                          <option value="">Choose</option>
                          <option value="dipped">Dipped</option>
                          <option value="undipped">Undipped</option>
                        </select>
                      </div>
                    ) : null}
                  </div>
                  {product.individuallyWrapped ? (
                    <label className="mt-3 flex items-center gap-2 font-semibold">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={line.wrapped}
                        onChange={(event) =>
                          updateLine(product.id, { wrapped: event.target.checked })
                        }
                      />
                      Individually wrapped
                    </label>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-ghost mt-3"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        lines: current.lines.filter((item) => item.productId !== product.id),
                      }))
                    }
                  >
                    Remove
                  </button>
                </article>
              );
            })}
          </div>
          <div className="mt-8">
            <ProductBrowser
              groups={catalog}
              selectedIds={draft.lines.map((line) => line.productId)}
              onAdd={(product) => setDraft((current) => addProductLine(current, product))}
            />
          </div>
          <div className="no-print mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => go(1)}>
              Back
            </button>
            <button type="button" className="btn btn-primary" onClick={() => go(3)}>
              Continue to timing
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="form-narrow step-panel mt-12" data-testid="wholesale-step" data-step="3">
          <h2 className="section-title">Timing</h2>
          <p className="mt-2 max-w-3xl">
            Office hours are {HOURS}. Bluepoint bakes and delivers 6 days a week. A sales professional will confirm the route and the day.
          </p>
          {!now || !earliest ? (
            <p className="mt-4" role="status">
              Checking the earliest delivery date…
            </p>
          ) : (
            <>
              <p className="mt-4 font-bold" role="status">
                Earliest first delivery is {formatLongDate(earliest)}. {leadTimeExplanation(kinds)}
              </p>
              <div className="mt-4 max-w-sm">
                <label htmlFor="first-delivery">First delivery date</label>
                <input
                  id="first-delivery"
                  className="mt-1"
                  type="date"
                  min={earliest}
                  value={draft.firstDelivery}
                  onChange={(event) =>
                    setDraft({ ...draft, firstDelivery: event.target.value })
                  }
                />
              </div>
              {draft.lines.some((line) => getProduct(line.productId)?.lead === "3d") ? (
                <p className="mt-3">Sourdough Boule: 3 day notice required.</p>
              ) : null}
              {kinds.some((kind) => kind === "pastry") ? (
                <p className="mt-2">48 hour notice for orders on all pastries.</p>
              ) : null}
              {kinds.every((kind) => kind === "bread") ? (
                <p className="mt-2">24 hour notice for orders on all breads.</p>
              ) : null}
            </>
          )}
          <div className="no-print mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => go(2)}>
              Back
            </button>
            <button type="button" className="btn btn-primary" onClick={() => go(4)}>
              Continue to review
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="form-narrow step-panel mt-12" data-testid="wholesale-step" data-step="4">
          <h2 className="section-title">Review</h2>
          <p className="no-print mt-2 max-w-3xl">
            This is a preview of the email that would go to {EMAIL}. Nothing is sent. Call {PHONE_DISPLAY} if you would rather talk with a sales professional.
          </p>
          <dl className="mt-4 grid gap-3 bg-white p-4 sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Business</dt>
              <dd>{draft.businessName}</dd>
            </div>
            <div>
              <dt className="font-semibold">Type</dt>
              <dd>{draft.businessType}</dd>
            </div>
            <div>
              <dt className="font-semibold">Delivery city</dt>
              <dd>{draft.deliveryCity}</dd>
            </div>
            <div>
              <dt className="font-semibold">Days</dt>
              <dd>{draft.days.join(", ")}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-semibold">First delivery</dt>
              <dd>{draft.firstDelivery ? formatLongDate(draft.firstDelivery) : ""}</dd>
            </div>
          </dl>
          <h3 className="mt-10 text-2xl font-semibold tracking-tight">Email preview</h3>
          <pre
            id="request-preview"
            className="mt-3 overflow-x-auto whitespace-pre-wrap bg-white p-4 text-base"
          >
            {preview}
          </pre>
          {copyFallback ? (
            <p className="mt-3" role="status">
              Clipboard is unavailable in this browser. Select the preview above and copy it.
            </p>
          ) : null}
          {copied ? (
            <p className="mt-3 font-semibold" role="status">
              Summary copied.
            </p>
          ) : null}
          <div className="no-print mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={copySummary}>
              Copy summary
            </button>
            <button type="button" className="btn btn-orange" onClick={() => window.print()}>
              Print / Save as PDF
            </button>
            <button type="button" className="btn" disabled>
              Email {EMAIL} (disabled in this demo)
            </button>
          </div>
          <p className="no-print mt-3">
            The email button is disabled. This demo has no mailto link and does not send email, SMS, or a form.
          </p>
          <div className="no-print mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => go(3)}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                clearDraft();
                setDraft(emptyDraft());
                setStep(1);
                setCopied(false);
              }}
            >
              Clear this request
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
