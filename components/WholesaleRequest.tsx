"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { catalog, getProduct, type Product } from "@/data/products";
import { EMAIL, HOURS, ORDER_URL, PAY_URL, PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { CUSTOM_FAMILIES, CUSTOMER_TYPES, DELIVERY_DAYS, addProductLine, emptyDraft, type Draft } from "@/lib/draft";
import { deliverySuggestions } from "@/lib/deliveryArea";
import { buildEmailPreview } from "@/lib/emailPreview";
import { formatCustomerType, formatPhone, formatStartDate } from "@/lib/formatInquiry";
import { leadWords } from "@/lib/spec";
import {
  PUBLISHED_CUSTOM_LINE,
  SAMPLE_QUESTION,
  areaSummary,
  dateStatus,
  extraProductNote,
  isExactPublishedPlace,
  lineSummary,
  showWrappedChoice,
  validateStep,
} from "@/lib/requestFlow";
import { clearDraft, loadDraft, saveDraft } from "@/lib/storage";

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

export function WholesaleRequest() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFallback, setCopyFallback] = useState(false);
  const [pickerId, setPickerId] = useState("");

  useEffect(() => {
    const saved = loadDraft();
    setDraft(saved);
    setNow(new Date());
    if (window.location.hash === "#sample-request") setStep(2);
    else setStep(readStep());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveDraft(draft);
  }, [draft, ready]);

  useEffect(() => {
    if (!ready) return;
    window.sessionStorage.setItem(STEP_KEY, String(step));
    document.body.classList.toggle("showing-preview", step === 4);
    return () => document.body.classList.remove("showing-preview");
  }, [step, ready]);

  useEffect(() => {
    if (!ready || step !== 2 || window.location.hash !== "#sample-request") return;
    document.getElementById("sample-request")?.scrollIntoView({ block: "start" });
  }, [ready, step]);

  const clock = now ?? new Date();
  const preview = buildEmailPreview(draft, clock);
  const extraNote = extraProductNote(draft);
  const timingNote = dateStatus(draft, clock);

  function focusErrors() {
    requestAnimationFrame(() => document.getElementById("request-errors")?.focus());
  }

  function failAtFirstInvalid(steps: readonly (1 | 2 | 3)[]): boolean {
    for (const current of steps) {
      const found = validateStep(draft, current, clock);
      if (found.length > 0) {
        setErrors(found);
        setStep(current);
        focusErrors();
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
    setStep(step + 1);
    window.scrollTo(0, 0);
  }

  function goTo(next: number) {
    if (next === 4 && failAtFirstInvalid([1, 2, 3])) return;
    setErrors([]);
    setCopied(false);
    setStep(next);
    window.scrollTo(0, 0);
  }

  function clearRequest() {
    clearDraft();
    window.sessionStorage.removeItem(STEP_KEY);
    setDraft(emptyDraft());
    setErrors([]);
    setCopied(false);
    setCopyFallback(false);
    setPickerId("");
    setStep(1);
    window.scrollTo(0, 0);
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
    <div className="shell request-flow" data-testid="request-flow">
      {step < 4 ? (
        <>
          <AccountPaths />
          <p className="request-notice">This concept site does not submit wholesale requests.</p>
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
              <p className="request-help">What you type stays in this browser until you clear it.</p>
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
              <p className="request-help">A rough note for the conversation.</p>
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
              <p className="request-help">Options appear only when that product publishes them.</p>
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
                          <small>{leadWords(product)}</small>
                        </div>
                        <div className="request-line-grid">
                          <label>
                            Quantity
                            <input
                              aria-label={`Quantity for ${product.name}`}
                              type="number"
                              min={1}
                              max={9999}
                              inputMode="numeric"
                              value={line.qty}
                              onChange={(event) => updateLine(product.id, { qty: Number(event.target.value) })}
                            />
                          </label>
                          {product.units.length > 1 ? (
                            <label>
                              Pack size
                              <select
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
              <label>
                Other products or requirements
                <textarea
                  id="inquiry-products"
                  rows={3}
                  value={draft.productsText}
                  onChange={(event) => setDraft({ ...draft, productsText: event.target.value })}
                />
              </label>
              <p className="request-help">Kept together with the catalog lines above.</p>
              <fieldset className="custom-interest">
                <legend>Customization to discuss</legend>
                <p>
                  Bluepoint&apos;s About page says: &ldquo;{PUBLISHED_CUSTOM_LINE}&rdquo; Examples to discuss.
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
                    Size or dimensions to discuss
                    <input
                      id="inquiry-custom-size"
                      value={draft.customSize}
                      onChange={(event) => setDraft({ ...draft, customSize: event.target.value })}
                    />
                  </label>
                </div>
                <label>
                  Packaging or other requirements to discuss
                  <textarea
                    id="inquiry-custom-packaging"
                    rows={2}
                    value={draft.customPackaging}
                    onChange={(event) => setDraft({ ...draft, customPackaging: event.target.value })}
                  />
                </label>
              </fieldset>
              <fieldset className="sample-interest" id="sample-request">
                <legend>Ask about samples</legend>
                <label className="choice-label">
                  <input
                    type="checkbox"
                    checked={draft.askAboutSamples}
                    onChange={(event) => setDraft({ ...draft, askAboutSamples: event.target.checked })}
                  />
                  {SAMPLE_QUESTION}
                </label>
                <p>Availability, cost, and fulfillment are not published on bluepointbakery.com.</p>
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
              <div className="request-actions">
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
              <h2>Delivery and timing</h2>
              <p className="request-help">
                Office hours are {HOURS}. Bluepoint bakes and delivers 6 days a week. A preferred day or date is a question for the bakery, not a reserved route.
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
                <legend>Preferred days to discuss</legend>
                <p className="request-help">
                  These are preferences to discuss, not a reserved stop. The delivery map lists a weekday overview for each color. Leave every day unselected if you do not have a preference.
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
              <label htmlFor="inquiry-start">Desired first date</label>
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
                I understand this concept site does not submit this request
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
                <p className="kicker">Review your details</p>
                <h2>Your request</h2>
              </div>
              <p className="demo-badge">Demo: not sent</p>
            </header>
            <p id="send-notice">
              This is a preview only. No message has been sent to Bluepoint Bakery. This concept site does not submit wholesale requests.
            </p>
            <p>
              You can discuss this draft with the bakery at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or {PHONE_DISPLAY}.
            </p>
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
                    : "No day selected. That is allowed."}
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
                    Examples to discuss. {PUBLISHED_CUSTOM_LINE}
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
                <strong>Samples:</strong> Please advise whether samples are available, and any cost or conditions.
                {draft.sampleInterest.trim() ? ` Products to ask about: ${draft.sampleInterest.trim()}.` : ""}
              </p>
            ) : null}
            {draft.lines.length > 0 || extraNote ? (
              <div>
                <h3>Products</h3>
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
            <h3>Email preview</h3>
            <pre id="request-preview">{preview}</pre>
            {copyFallback ? (
              <p role="status">Clipboard is unavailable in this browser. Select the preview above and copy it.</p>
            ) : null}
            {copied ? (
              <p className="request-help" role="status">
                Summary copied.
              </p>
            ) : null}
            <div className="request-actions">
              <button type="button" className="btn btn-primary" onClick={copySummary}>
                Copy summary
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
                Print
              </button>
              <button type="button" className="btn" disabled aria-describedby="send-notice">
                Send to Bluepoint (demo: not connected)
              </button>
            </div>
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
      <h2 id="account-paths-title">Existing customers and new accounts</h2>
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
          <strong>New accounts</strong> use the request on this page. A sales professional will assist you.
        </p>
      </div>
    </section>
  );
}
