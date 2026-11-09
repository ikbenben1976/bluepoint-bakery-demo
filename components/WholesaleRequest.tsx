"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { catalog, getProduct, type Product } from "@/data/products";
import { EMAIL, ORDER_URL, PAY_URL, PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { CUSTOM_FAMILIES, CUSTOMER_TYPES, DELIVERY_DAYS, QUANTITY_BASES, addProductLine, emptyDraft, parseEstimateQty, type Draft, type QuantityBasis } from "@/lib/draft";
import { deliverySuggestions } from "@/lib/deliveryArea";
import { buildEmailPreview } from "@/lib/emailPreview";
import { formatCustomerType, formatPhone, formatStartDate } from "@/lib/formatInquiry";
import { publishedUnit } from "@/lib/spec";
import {
  SAMPLE_QUESTION,
  SAMPLE_REVIEW,
  areaSummary,
  dateStatus,
  extraProductNote,
  isExactPublishedPlace,
  firstInvalidFieldId,
  lineSummary,
  showWrappedChoice,
  validateStep,
} from "@/lib/requestFlow";
import { headerClearance, scrollBehavior, scrollBelowHeader } from "@/lib/scrollPage";
import { REQUEST_CHANGE_EVENT, clearDraft, loadDraft, saveDraft } from "@/lib/storage";

const STEP_KEY = "bluepoint-demo-request-step";

const STEPS = [
  { id: 1, slug: "business", label: "Business" },
  { id: 2, slug: "products", label: "Products" },
  { id: 3, slug: "delivery", label: "Delivery" },
  { id: 4, slug: "review", label: "Review" },
] as const;

function RequestProgress({ step, onGo }: { step: number; onGo: (next: number) => void }) {
  const current = STEPS[step - 1];
  return (
    <nav className="request-progress" aria-label="Request steps">
      <p className="request-progress-title">
        Step {step} of 4 · {current.label}
      </p>
      <ol>
        {STEPS.map((item) => {
          const place = item.id < step ? "complete" : item.id === step ? "current" : "upcoming";
          return (
            <li key={item.slug} data-index={item.id} className={`step-${place}`}>
              <button
                type="button"
                aria-current={item.id === step ? "step" : undefined}
                onClick={() => onGo(item.id)}
              >
                <span className="step-name">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function readStep(): number {
  const raw = window.sessionStorage.getItem(STEP_KEY);
  const step = Number(raw);
  return step >= 1 && step <= 4 ? step : 1;
}

function stepForHash(hash: string): number | null {
  if (hash === "#sample-request" || hash === "#request-lines") return 2;
  if (hash === "#wholesale-request") return 1;
  return null;
}

function samePath(a: string, b: string): boolean {
  const normalize = (path: string) => (path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path);
  return normalize(a) === normalize(b);
}

type ScrollIntent = { kind: "step" } | { kind: "hash" } | { kind: "field"; fieldId: string };

function fieldAnchor(field: HTMLElement): HTMLElement {
  const wrapped = field.closest("label");
  if (wrapped instanceof HTMLElement) return wrapped;
  if (field.id) {
    const explicit = document.querySelector(`label[for="${CSS.escape(field.id)}"]`);
    if (explicit instanceof HTMLElement) return explicit;
  }
  return field;
}

function pillLimit(): number {
  const pill = document.querySelector("[data-testid='quick-actions']");
  if (!(pill instanceof HTMLElement)) return window.innerHeight;
  const box = pill.getBoundingClientRect();
  return box.height > 0 ? box.top : window.innerHeight;
}

/** Step circles and the step heading sit just under the sticky header. */
function scrollToStep(behavior: ScrollBehavior) {
  const progress = document.querySelector(".request-progress");
  if (!(progress instanceof HTMLElement)) return;
  scrollBelowHeader(progress, behavior);
  const current = progress.querySelector("button[aria-current='step']");
  if (current instanceof HTMLElement) current.focus({ preventScroll: true });
}

/**
 * Hash landings. On a phone, #wholesale-request keeps the account intro when
 * the step heading still clears the contact button. Otherwise the circles
 * come up under the header. On a wider screen the page heading stays clear
 * of the nav and the circles remain in view.
 */
function landHash(hash: string, behavior: ScrollBehavior) {
  if (hash === "#sample-request" || hash === "#request-lines") {
    const target = document.getElementById(hash.slice(1));
    if (target) scrollBelowHeader(target, behavior);
    return;
  }
  if (hash !== "#wholesale-request") return;
  const anchor = document.getElementById("wholesale-request");
  if (!anchor) return;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  if (!narrow) {
    const pageHeading = document.querySelector(".ticket-hero h1");
    if (pageHeading instanceof HTMLElement && pageHeading.getBoundingClientRect().height > 0) {
      scrollBelowHeader(pageHeading, behavior, anchor);
      return;
    }
  }
  const intro = document.getElementById("account-paths-title");
  const visible = intro instanceof HTMLElement ? intro : anchor;
  const heading = document.querySelector("[data-testid='wholesale-step'] h2");
  const progress = document.querySelector(".request-progress");
  if (heading instanceof HTMLElement && progress instanceof HTMLElement) {
    const visibleDoc = visible.getBoundingClientRect().top + window.scrollY;
    const rough = Math.max(0, visibleDoc - 140);
    const dest = Math.max(0, visibleDoc - headerClearance(rough));
    const headingBottom = heading.getBoundingClientRect().bottom - (dest - window.scrollY);
    if (headingBottom > pillLimit() - 16) {
      scrollBelowHeader(progress, behavior, anchor);
      return;
    }
  }
  scrollBelowHeader(visible, behavior, anchor);
}

export function WholesaleRequest() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFallback, setCopyFallback] = useState(false);
  const [pickerId, setPickerId] = useState("");
  const writing = useRef(false);
  const intent = useRef<ScrollIntent | null>(null);
  const openedHash = useRef(false);
  const parkedScroll = useRef<number | null>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    const saved = loadDraft();
    setDraft(saved);
    setNow(new Date());
    const hashStep = stepForHash(window.location.hash);
    setStep(hashStep ?? readStep());
    setReady(true);
    const onHash = () => {
      const hash = window.location.hash;
      const next = stepForHash(hash);
      if (!next) return;
      if (next === stepRef.current) {
        landHash(hash, scrollBehavior());
        return;
      }
      intent.current = { kind: "hash" };
      setStep(next);
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (!samePath(url.pathname, window.location.pathname)) return;
      const next = stepForHash(url.hash);
      if (!next) return;
      event.preventDefault();
      event.stopPropagation();
      if (`${url.pathname}${url.search}${url.hash}` !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
        window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
      if (next === stepRef.current) {
        landHash(url.hash, scrollBehavior());
        return;
      }
      intent.current = { kind: "hash" };
      setStep(next);
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("click", onClick, true);
    const correctHashLanding = () => {
      const hash = window.location.hash;
      const expected = stepForHash(hash);
      if (!expected || stepRef.current !== expected) return;
      if (parkedScroll.current != null && Math.abs(window.scrollY - parkedScroll.current) > 120) return;
      const headerBottom = document.querySelector(".sticky-stack")?.getBoundingClientRect().bottom ?? 0;
      if (hash === "#sample-request" || hash === "#request-lines") {
        const target = document.getElementById(hash.slice(1));
        const top = target?.getBoundingClientRect().top ?? 0;
        if (target && top >= headerBottom - 4 && top < headerBottom + 40) return;
      }
      if (hash === "#wholesale-request") {
        const heading = document.querySelector("[data-testid='wholesale-step'] h2");
        const progress = document.querySelector(".request-progress");
        if (!(heading instanceof HTMLElement) || !(progress instanceof HTMLElement)) return;
        const headingBox = heading.getBoundingClientRect();
        const progressBox = progress.getBoundingClientRect();
        const limit = pillLimit();
        const covered =
          headingBox.top < headerBottom - 2 ||
          headingBox.bottom > limit - 12 ||
          progressBox.top < headerBottom - 2 ||
          progressBox.bottom > limit - 12;
        if (!covered) return;
      }
      landHash(hash, "instant");
      parkedScroll.current = window.scrollY;
    };
    const scheduleCorrection = () => requestAnimationFrame(correctHashLanding);
    document.fonts?.ready.then(scheduleCorrection);
    const photo = document.querySelector(".ticket-hero img");
    if (photo instanceof HTMLImageElement && !photo.complete) {
      photo.addEventListener("load", scheduleCorrection, { once: true });
    }
    window.addEventListener("load", scheduleCorrection);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("load", scheduleCorrection);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    writing.current = true;
    saveDraft(draft);
    writing.current = false;
  }, [draft, ready]);

  useEffect(() => {
    const onChange = () => {
      if (writing.current) return;
      const saved = loadDraft();
      setDraft((current) => (JSON.stringify(current) === JSON.stringify(saved) ? current : saved));
    };
    window.addEventListener(REQUEST_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(REQUEST_CHANGE_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.sessionStorage.setItem(STEP_KEY, String(step));
  }, [step, ready]);

  useLayoutEffect(() => {
    if (!ready) return;
    document.body.classList.toggle("showing-preview", step === 4);
    const pending = intent.current;
    intent.current = null;
    const behavior = scrollBehavior();
    if (pending?.kind === "field") {
      const field = document.getElementById(pending.fieldId);
      const fallback = document.getElementById("request-errors");
      const focusTarget = field ?? fallback;
      if (focusTarget) {
        scrollBelowHeader(field ? fieldAnchor(field) : focusTarget, behavior);
        focusTarget.focus({ preventScroll: true });
      }
    } else if (pending?.kind === "step") {
      scrollToStep(behavior);
    } else if (!openedHash.current) {
      openedHash.current = true;
      const hash = window.location.hash;
      if (stepForHash(hash)) {
        landHash(hash, "instant");
        parkedScroll.current = window.scrollY;
      }
    } else if (pending?.kind === "hash") {
      landHash(window.location.hash, behavior);
    }
    return () => document.body.classList.remove("showing-preview");
  }, [ready, step, errors]);

  const clock = now ?? new Date();
  const preview = buildEmailPreview(draft, clock);
  const extraNote = extraProductNote(draft);
  const timingNote = dateStatus(draft, clock);

  function failAtFirstInvalid(steps: readonly (1 | 2 | 3)[]): boolean {
    for (const current of steps) {
      const found = validateStep(draft, current, clock);
      if (found.length > 0) {
        const fieldId = firstInvalidFieldId(draft, current, clock) ?? "request-errors";
        intent.current = { kind: "field", fieldId };
        setErrors(found);
        setStep(current);
        return true;
      }
    }
    return false;
  }

  function continueForward() {
    const steps = ([1, 2, 3] as const).filter((item) => item <= step);
    if (failAtFirstInvalid(steps)) return;
    setErrors([]);
    setCopied(false);
    intent.current = { kind: "step" };
    setStep(step + 1);
  }

  function goTo(next: number) {
    if (next === 4 && failAtFirstInvalid([1, 2, 3])) return;
    setErrors([]);
    setCopied(false);
    intent.current = { kind: "step" };
    setStep(next);
    if (next === stepRef.current) {
      intent.current = null;
      scrollToStep(scrollBehavior());
    }
  }

  function clearRequest() {
    clearDraft();
    window.sessionStorage.removeItem(STEP_KEY);
    setDraft(emptyDraft());
    setErrors([]);
    setCopied(false);
    setCopyFallback(false);
    setPickerId("");
    intent.current = { kind: "step" };
    setStep(1);
    if (stepRef.current === 1) {
      intent.current = null;
      scrollToStep(scrollBehavior());
    }
  }

  function updateLine(productId: string, patch: Partial<Draft["lines"][number]>) {
    setDraft((current) => ({
      ...current,
      lines: current.lines.map((line) => (line.productId === productId ? { ...line, ...patch } : line)),
    }));
  }

  function addProduct(product: Product) {
    setDraft((current) => addProductLine(current, product));
    setPickerId("");
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
      <div className="shell request-flow" role="status">
        Loading your saved request…
      </div>
    );
  }

  const suggestions = isExactPublishedPlace(draft.deliveryCity)
    ? []
    : deliverySuggestions(draft.deliveryCity);

  return (
    <div id="wholesale-request" className="shell request-flow" data-testid="request-flow">
      {step < 4 ? (
        <>
          <AccountPaths />
          <p className="request-notice">
            Demo preview: Your information is not submitted. You can review and copy your inquiry to share with Bluepoint directly.
          </p>
        </>
      ) : null}
      {step < 4 ? (
        <form
          data-testid="inquiry-form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            continueForward();
          }}
        >
          {errors.length > 0 ? (
            <ul id="request-errors" role="alert" tabIndex={-1}>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}
          {step === 1 ? (
            <section data-testid="wholesale-step" data-step="business">
              <RequestProgress step={1} onGo={goTo} />
              <h2>Business</h2>
              <p className="request-help">Your progress is saved in this browser so you can return to it later.</p>
              <div className="request-grid">
                <label>
                  Business name
                  <input
                    id="inquiry-business"
                    value={draft.businessName}
                    autoComplete="organization"
                    onChange={(event) => setDraft({ ...draft, businessName: event.target.value })}
                  />
                </label>
                <label>
                  Customer type
                  <select
                    id="inquiry-type"
                    value={draft.businessType}
                    onChange={(event) => setDraft({ ...draft, businessType: event.target.value })}
                  >
                    <option value="">Choose one</option>
                    {CUSTOMER_TYPES.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Contact name
                  <input
                    id="inquiry-contact"
                    value={draft.contactName}
                    autoComplete="name"
                    onChange={(event) => setDraft({ ...draft, contactName: event.target.value })}
                  />
                </label>
                <label>
                  Email
                  <input
                    id="inquiry-email"
                    type="email"
                    value={draft.contactEmail}
                    autoComplete="email"
                    onChange={(event) => setDraft({ ...draft, contactEmail: event.target.value })}
                  />
                </label>
                <label>
                  Phone
                  <input
                    id="inquiry-phone"
                    type="tel"
                    value={draft.contactPhone}
                    autoComplete="tel"
                    onChange={(event) => setDraft({ ...draft, contactPhone: event.target.value })}
                  />
                </label>
                <label>
                  Approximate weekly needs
                  <input
                    id="inquiry-quantity"
                    value={draft.weeklyQuantity}
                    onChange={(event) => setDraft({ ...draft, weeklyQuantity: event.target.value })}
                  />
                </label>
              </div>
              <p className="request-help">An estimate is fine—we can discuss the details later.</p>
              <label>
                Notes for the bakery
                <textarea
                  id="inquiry-notes"
                  rows={3}
                  value={draft.notes}
                  onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
                />
              </label>
              <div className="request-actions">
                <button className="btn btn-primary" type="submit">
                  Continue to products
                </button>
                <button className="btn btn-ghost" type="button" onClick={clearRequest}>
                  Clear request
                </button>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section data-testid="wholesale-step" data-step="products">
              <RequestProgress step={2} onGo={goTo} />
              <h2>Products and options</h2>
              <p className="request-help">Available options are shown for each product.</p>
              <section className="inquiry-catalog compact-inquiry-picker" aria-labelledby="inquiry-picker-title">
                <h3 id="inquiry-picker-title">Add a product to your request</h3>
                <p>
                  Or <Link href="/breads">browse breads</Link> and <Link href="/pastries">pastries</Link>.
                </p>
                <div className="inquiry-picker-controls">
                  <label htmlFor="inquiry-picker-product">Product</label>
                  <select
                    id="inquiry-picker-product"
                    value={pickerId}
                    onChange={(event) => setPickerId(event.target.value)}
                  >
                    <option value="">Choose a product…</option>
                    {catalog.map((group) => (
                      <optgroup key={group.id} label={group.label}>
                        {group.items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!pickerId}
                    onClick={() => {
                      const product = getProduct(pickerId);
                      if (product) addProduct(product);
                    }}
                  >
                    Add selected product
                  </button>
                </div>
              </section>
              <div id="request-lines">
              <p className="request-help">Enter your estimated needs for each product.</p>
              {draft.lines.length > 0 ? (
                <ul className="request-lines">
                  {draft.lines.map((line) => {
                    const product = getProduct(line.productId);
                    if (!product) return null;
                    const slices = product.sliceOptions ?? [];
                    return (
                      <li key={line.productId} className="request-line">
                        <div>
                          <span className="line-name">{product.name}</span>
                        </div>
                        <div className="request-line-grid">
                          <label>
                            <span>
                              Estimated quantity
                              {publishedUnit(product) ? <span className="qty-unit"> {publishedUnit(product)}</span> : null}
                            </span>
                            <input
                              id={`inquiry-qty-${product.id}`}
                              aria-label={`Estimated quantity for ${product.name}`}
                              type="number"
                              min={1}
                              max={9999}
                              inputMode="numeric"
                              value={line.qty ?? ""}
                              onChange={(event) => updateLine(product.id, { qty: parseEstimateQty(event.target.value) })}
                            />
                          </label>
                          <label>
                            Estimate basis
                            <select
                              aria-label={`Estimate basis for ${product.name}`}
                              value={line.basis}
                              onChange={(event) => updateLine(product.id, { basis: event.target.value as QuantityBasis })}
                            >
                              {QUANTITY_BASES.map(([id, label]) => (
                                <option key={id} value={id}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Delivery preferences or varying needs
                            <textarea
                              rows={2}
                              maxLength={500}
                              aria-label={`Delivery preferences for ${product.name}`}
                              value={line.scheduleNote}
                              onChange={(event) => updateLine(product.id, { scheduleNote: event.target.value })}
                            />
                          </label>
                          {product.units.length > 1 ? (
                            <label>
                              Pack size
                            <select
                              id={`inquiry-unit-${product.id}`}
                              aria-label={`Pack size for ${product.name}`}
                              value={line.unit}
                                onChange={(event) => updateLine(product.id, { unit: event.target.value })}
                              >
                                <option value="">Choose a published pack size</option>
                                {product.units.map((unit) => (
                                  <option key={unit} value={unit}>
                                    {unit}
                                  </option>
                                ))}
                              </select>
                            </label>
                          ) : product.units[0] ? (
                            <p className="request-help">Pack size: {product.units[0]}</p>
                          ) : null}
                          {slices.length > 1 ? (
                            <label>
                              Slice thickness
                            <select
                              id={`inquiry-slice-${product.id}`}
                              aria-label={`Slice thickness for ${product.name}`}
                              value={line.slice}
                                onChange={(event) => updateLine(product.id, { slice: event.target.value })}
                              >
                                <option value="">Choose a published thickness</option>
                                {slices.map((slice) => (
                                  <option key={slice} value={slice}>
                                    {slice}
                                  </option>
                                ))}
                              </select>
                            </label>
                          ) : slices.length === 1 ? (
                            <p className="request-help">Published slice: {slices[0]}.</p>
                          ) : null}
                          {product.dippedOption ? (
                            <label>
                              Dipped or undipped
                              <select
                                aria-label={`Dipped or undipped for ${product.name}`}
                                value={line.dipped}
                                onChange={(event) =>
                                  updateLine(product.id, {
                                    dipped: event.target.value as Draft["lines"][number]["dipped"],
                                  })
                                }
                              >
                                <option value="">Not chosen</option>
                                <option value="dipped">Dipped</option>
                                <option value="undipped">Undipped</option>
                              </select>
                            </label>
                          ) : null}
                        </div>
                        {showWrappedChoice(product) ? (
                          <label className="choice-label">
                            <input
                              type="checkbox"
                              checked={line.wrapped}
                              onChange={(event) => updateLine(product.id, { wrapped: event.target.checked })}
                            />
                            Mention individual wrapping for {product.name}
                          </label>
                        ) : null}
                        {showWrappedChoice(product) ? (
                          <p className="request-help">The catalog lists this as available individually wrapped.</p>
                        ) : null}
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              lines: current.lines.filter((item) => item.productId !== product.id),
                            }))
                          }
                        >
                          Remove {product.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              </div>
              <label>
                Other products or requirements
                <textarea
                  id="inquiry-products"
                  rows={3}
                  value={draft.productsText}
                  onChange={(event) => setDraft({ ...draft, productsText: event.target.value })}
                />
              </label>
              <p className="request-help">Include any additional products, special requests or questions here.</p>
              <fieldset className="custom-interest">
                <legend>Special requests &amp; customization</legend>
                <p>
                  Have a specific product, size or packaging requirement in mind? Tell us what you&apos;re looking for.
                </p>
                <div className="request-grid">
                  <label>
                    Product family to discuss
                    <select
                      id="inquiry-custom-family"
                      value={draft.customFamily}
                      onChange={(event) => setDraft({ ...draft, customFamily: event.target.value })}
                    >
                      <option value="">Not specified</option>
                      {CUSTOM_FAMILIES.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Preferred size or dimensions
                    <input
                      id="inquiry-custom-size"
                      value={draft.customSize}
                      onChange={(event) => setDraft({ ...draft, customSize: event.target.value })}
                    />
                  </label>
                </div>
                <label>
                  Packaging &amp; other requirements
                  <textarea
                    id="inquiry-custom-packaging"
                    rows={2}
                    value={draft.customPackaging}
                    onChange={(event) => setDraft({ ...draft, customPackaging: event.target.value })}
                  />
                </label>
              </fieldset>
              <fieldset className="sample-interest" id="sample-request">
                <legend>Samples</legend>
                <label className="choice-label">
                  <input
                    type="checkbox"
                    checked={draft.askAboutSamples}
                    onChange={(event) => setDraft({ ...draft, askAboutSamples: event.target.checked })}
                  />
                  {SAMPLE_QUESTION}
                </label>
                <p>Ask Bluepoint&apos;s sales team about sample availability and any applicable conditions.</p>
                {draft.askAboutSamples ? (
                  <label>
                    Products you want to ask about
                    <textarea
                      id="inquiry-sample-products"
                      rows={2}
                      value={draft.sampleInterest}
                      onChange={(event) => setDraft({ ...draft, sampleInterest: event.target.value })}
                    />
                  </label>
                ) : null}
              </fieldset>
              <div className="request-actions sample-actions">
                <button className="btn btn-ghost" type="button" onClick={() => goTo(1)}>
                  Back
                </button>
                <button className="btn btn-primary" type="submit">
                  Continue to delivery
                </button>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section data-testid="wholesale-step" data-step="delivery">
              <RequestProgress step={3} onGo={goTo} />
              <h2>Delivery preferences</h2>
              <p className="request-help">
                Bluepoint bakes and delivers six days a week. Select your preferred timing; the bakery will confirm availability and route details.
              </p>
              <label htmlFor="inquiry-delivery">Delivery city</label>
              <input
                id="inquiry-delivery"
                value={draft.deliveryCity}
                autoComplete="off"
                onChange={(event) => setDraft({ ...draft, deliveryCity: event.target.value })}
              />
              {suggestions.length > 0 ? (
                <ul className="area-suggestions" aria-label="Matching areas">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.label}>
                      <button type="button" onClick={() => setDraft({ ...draft, deliveryCity: suggestion.label })}>
                        {suggestion.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p role="status" data-testid="delivery-status">
                {areaSummary(draft.deliveryCity)}{" "}
                <Link href="/delivery">See the delivery map</Link>.
              </p>
              <fieldset className="day-fieldset">
                <legend>Preferred delivery days</legend>
                <p className="request-help">
                  Select preferred delivery days, or leave this blank if you&apos;re flexible. Final scheduling is subject to confirmation.
                </p>
                <div className="day-choices">
                  {DELIVERY_DAYS.map((day) => {
                    const on = draft.days.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        className="chip"
                        aria-pressed={on}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            days: DELIVERY_DAYS.filter((item) => (item === day ? !on : draft.days.includes(item))),
                          })
                        }
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <label htmlFor="inquiry-start">When would you like to start?</label>
              <input
                id="inquiry-start"
                type="date"
                value={draft.firstDelivery}
                onChange={(event) => setDraft({ ...draft, firstDelivery: event.target.value })}
              />
              <p role="status" data-testid="date-status">
                {timingNote}
              </p>
              <label className="choice-label">
                <input
                  id="inquiry-consent"
                  type="checkbox"
                  checked={draft.consent}
                  onChange={(event) => setDraft({ ...draft, consent: event.target.checked })}
                />
                I understand this is a preview and my information will not be sent automatically
              </label>
              <div className="request-actions">
                <button className="btn btn-ghost" type="button" onClick={() => goTo(2)}>
                  Back
                </button>
                <button className="btn btn-primary" type="submit">
                  Preview request
                </button>
              </div>
            </section>
          ) : null}
        </form>
      ) : (
        <section data-testid="inquiry-confirmation" data-step="review" id="inquiry-confirmation">
          <RequestProgress step={4} onGo={goTo} />
          <article className="review-card">
            <header className="review-head">
              <div>
                <p className="kicker">Review your wholesale inquiry</p>
                <h2>Your request</h2>
              </div>
              <p className="demo-badge">Preview only — not submitted</p>
            </header>
            <p id="send-notice">
              Nothing has been submitted or ordered. Copy your inquiry to share it with Bluepoint.
            </p>
            <p>
              Share this summary with the bakery at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or {PHONE_DISPLAY}.
            </p>
            <div className="request-actions">
              <button type="button" className="btn btn-primary" onClick={copySummary}>
                Copy inquiry
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
                Print
              </button>
            </div>
            {copyFallback ? (
              <p role="status">Clipboard is unavailable in this browser. Select the inquiry summary below and copy it.</p>
            ) : null}
            {copied ? (
              <p className="request-help" role="status">
                Summary copied.
              </p>
            ) : null}
            <dl className="inquiry-summary">
              <div>
                <dt>Business</dt>
                <dd>{draft.businessName}</dd>
              </div>
              <div>
                <dt>Customer type</dt>
                <dd>{formatCustomerType(draft.businessType)}</dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>
                  {draft.contactName}
                  <br />
                  {draft.contactEmail}
                  <br />
                  {formatPhone(draft.contactPhone)}
                </dd>
              </div>
              {draft.weeklyQuantity.trim() ? (
                <div>
                  <dt>Approximate weekly needs</dt>
                  <dd>{draft.weeklyQuantity.trim()}</dd>
                </div>
              ) : null}
              <div>
                <dt>City</dt>
                <dd>
                  {draft.deliveryCity}
                  <br />
                  {areaSummary(draft.deliveryCity)}
                </dd>
              </div>
              <div>
                <dt>Preferred days</dt>
                <dd>
                  {draft.days.length
                    ? `${draft.days.join(", ")} (preferences, not a confirmed route)`
                    : "Flexible — no preferred delivery day selected."}
                </dd>
              </div>
              <div>
                <dt>Desired first date</dt>
                <dd>
                  {draft.firstDelivery ? formatStartDate(draft.firstDelivery) : "No date chosen."}
                  <br />
                  {timingNote}
                </dd>
              </div>
              {draft.notes.trim() ? (
                <div>
                  <dt>Notes</dt>
                  <dd>{draft.notes.trim()}</dd>
                </div>
              ) : null}
              {draft.customFamily || draft.customSize.trim() || draft.customPackaging.trim() ? (
                <div>
                  <dt>Customization to discuss</dt>
                  <dd>
                    Customization requests are subject to Bluepoint&apos;s review and availability.
                    {draft.customFamily ? (
                      <>
                        <br />
                        Family: {CUSTOM_FAMILIES.find(([id]) => id === draft.customFamily)?.[1]}
                      </>
                    ) : null}
                    {draft.customSize.trim() ? (
                      <>
                        <br />
                        Size or dimensions: {draft.customSize.trim()}
                      </>
                    ) : null}
                    {draft.customPackaging.trim() ? (
                      <>
                        <br />
                        Packaging or other requirements: {draft.customPackaging.trim()}
                      </>
                    ) : null}
                  </dd>
                </div>
              ) : null}
            </dl>
            {draft.askAboutSamples ? (
              <p>
                <strong>Samples:</strong> {SAMPLE_REVIEW}
                {draft.sampleInterest.trim() ? ` Products to ask about: ${draft.sampleInterest.trim()}.` : ""}
              </p>
            ) : null}
            {draft.lines.length > 0 || extraNote ? (
              <div>
                <h3>Products</h3>
                <p className="request-help">Estimated quantities only; pricing and delivery are subject to confirmation.</p>
                <ul className="product-chips">
                  {draft.lines.map((line) => {
                    const product = getProduct(line.productId);
                    if (!product) return null;
                    return <li key={line.productId}>{lineSummary(line, product)}</li>;
                  })}
                  {extraNote ? <li>{extraNote}</li> : null}
                </ul>
              </div>
            ) : null}
            <h3>Your inquiry summary</h3>
            <pre id="request-preview">{preview}</pre>
            <div className="request-actions">
              <button type="button" className="btn btn-ghost" onClick={() => goTo(1)}>
                Edit business
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => goTo(2)}>
                Edit products
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => goTo(3)}>
                Edit delivery
              </button>
              <button type="button" className="btn btn-ghost" onClick={clearRequest}>
                Clear request
              </button>
            </div>
          </article>
        </section>
      )}
    </div>
  );
}

function AccountPaths() {
  return (
    <section className="account-paths" aria-labelledby="account-paths-title">
      <h2 id="account-paths-title">Already a customer?</h2>
      <div className="account-path-grid">
        <p className="account-path">
          <strong>Existing customers</strong> order by phone at <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>, by email at{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, or through{" "}
          <a href={ORDER_URL} target="_blank" rel="noopener noreferrer">
            Order online (existing customers)
          </a>
          {". "}
          <a href={PAY_URL} target="_blank" rel="noopener noreferrer">Pay an invoice</a> is a separate login.
        </p>
        <p className="account-path">
          <strong>New to Bluepoint?</strong> Start by preparing your wholesale inquiry below. Contact the bakery to discuss next steps.
        </p>
      </div>
    </section>
  );
}
