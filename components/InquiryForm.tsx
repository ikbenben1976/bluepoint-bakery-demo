"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ProductBrowser } from "@/components/ProductBrowser";
import { catalog, getProduct, type Product } from "@/data/products";
import { EMAIL } from "@/data/site";
import { leadWords } from "@/lib/spec";
import { addProductLine, emptyDraft, type Draft } from "@/lib/draft";
import { clearDraft, loadDraft, saveDraft } from "@/lib/storage";

const CUSTOMER_TYPES = [
  "restaurant",
  "cafe",
  "hotel",
  "grocery/retail",
  "institution",
  "other",
] as const;

type Summary = {
  businessName: string;
  customerType: string;
  delivery: string;
  contactName: string;
  email: string;
  phone: string;
  products: string[];
  quantity: string;
  startDate: string;
  notes: string;
  askAboutSamples: boolean;
};

export function InquiryForm() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    setDraft(loadDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveDraft(draft);
  }, [draft, hydrated]);

  useEffect(() => {
    document.body.classList.toggle("showing-preview", Boolean(summary));
    if (summary) window.scrollTo(0, 0);
    return () => document.body.classList.remove("showing-preview");
  }, [summary]);

  function add(product: Product) {
    setDraft((current) => addProductLine(current, product));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const next: string[] = [];
    if (!value("businessName")) next.push("Enter the business name.");
    if (!value("customerType")) next.push("Choose a customer type.");
    if (!value("delivery")) next.push("Enter a city or ZIP.");
    if (!value("contactName")) next.push("Enter a contact name.");
    if (!draft.lines.length && !value("productsText")) next.push("Select or describe at least one product.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) next.push("Enter a valid email address.");
    if (value("phone").replace(/\D/g, "").length < 7) next.push("Enter a phone number.");
    for (const line of draft.lines) {
      const product = getProduct(line.productId);
      if (!product) continue;
      if (!Number.isInteger(line.qty) || line.qty < 1) next.push(`Enter a quantity for ${product.name}.`);
    }
    setErrors(next);
    if (next.length > 0) return;

    const productLines = draft.lines
      .map((line) => {
        const product = getProduct(line.productId);
        if (!product) return "";
        const unit = line.unit ? ` ${line.unit}` : "";
        return `${product.name} — ${line.qty}${unit}`;
      })
      .filter(Boolean);
    const typed = value("productsText");
    const products = [...productLines, ...(typed ? [typed] : [])];

    setDraft((current) => ({
      ...current,
      businessName: value("businessName"),
      businessType: value("customerType"),
      deliveryCity: value("delivery"),
      contactName: value("contactName"),
      contactEmail: value("email"),
      contactPhone: value("phone"),
      productsText: typed,
      notes: value("notes"),
      firstDelivery: value("startDate"),
      weeklyQuantity: value("weeklyQuantity"),
    }));
    setSummary({
      businessName: value("businessName"),
      customerType: value("customerType"),
      delivery: value("delivery"),
      contactName: value("contactName"),
      email: value("email"),
      phone: value("phone"),
      products,
      quantity: value("weeklyQuantity"),
      startDate: value("startDate"),
      notes: value("notes"),
      askAboutSamples: draft.askAboutSamples,
    });
  }

  // Wait for the saved draft before mounting uncontrolled form fields. Otherwise
  // defaultValue binds to the initial empty state and silently ignores saved data.
  if (!hydrated) {
    return <div className="shell inquiry" role="status">Loading your saved request…</div>;
  }

  function saveField(name: string, value: string) {
    const key = ({
      businessName: "businessName",
      customerType: "businessType",
      delivery: "deliveryCity",
      contactName: "contactName",
      email: "contactEmail",
      phone: "contactPhone",
      weeklyQuantity: "weeklyQuantity",
      startDate: "firstDelivery",
      productsText: "productsText",
      notes: "notes",
    } as const)[name as "businessName"];
    if (key) setDraft((current) => ({ ...current, [key]: value }));
  }

  function clearRequest() {
    clearDraft();
    setDraft(emptyDraft());
    setFormVersion((value) => value + 1);
    setErrors([]);
    setSummary(null);
  }

  if (summary) {
    return (
      <section className="shell inquiry" id="inquiry-confirmation" data-testid="inquiry-confirmation">
        <article className="review-card">
          <header className="review-head">
            <div>
              <p className="kicker">Review your details</p>
              <h2>Your request</h2>
            </div>
            <p className="demo-badge">Demo: not sent</p>
          </header>
          <p>This is a preview only. No message has been sent to Bluepoint Bakery.</p>
          <p>You can discuss this draft with the bakery at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. This prototype does not transmit your information or promise samples, pricing, or delivery.</p>
          <dl className="inquiry-summary">
            <div>
              <dt>Business</dt>
              <dd>{summary.businessName}</dd>
            </div>
            <div>
              <dt>Customer type</dt>
              <dd>{summary.customerType}</dd>
            </div>
            <div>
              <dt>City or ZIP</dt>
              <dd>{summary.delivery}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>
                {summary.contactName}
                <br />
                {summary.email}
                <br />
                {summary.phone}
              </dd>
            </div>
            {summary.quantity ? (
              <div>
                <dt>Approximate weekly needs</dt>
                <dd>{summary.quantity}</dd>
              </div>
            ) : null}
            {summary.startDate ? (
              <div>
                <dt>Desired start date</dt>
                <dd>{summary.startDate}</dd>
              </div>
            ) : null}
            {summary.notes ? (
              <div>
                <dt>Special requirements</dt>
                <dd>{summary.notes}</dd>
              </div>
            ) : null}
          </dl>
          {summary.askAboutSamples ? <p><strong>Samples:</strong> Please advise whether samples are available, and any cost or conditions. No samples are promised by this demo.</p> : null}
          {summary.products.length > 0 ? (
            <div>
              <h3>Products</h3>
              <ul className="product-chips">
                {summary.products.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="review-actions">
            <button type="button" className="btn btn-disabled" disabled>
              Send to Bluepoint (demo: not connected)
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setSummary(null)}>
              Edit request
            </button>
            <button type="button" className="btn btn-ghost" onClick={clearRequest}>Clear request</button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <div className="shell inquiry">
      <form key={formVersion} data-testid="inquiry-form" onSubmit={submit} onChange={(event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) {
          saveField(target.name, target.value);
        }
      }} noValidate>
        <h2>Request pricing</h2>
        <p>This demo does not send the form. It stays in this browser.</p>
        {errors.length > 0 ? (
          <ul role="alert">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}
        <div className="inquiry-grid">
          <label>
            Business name
            <input id="inquiry-business" name="businessName" defaultValue={draft.businessName} required autoComplete="organization" />
          </label>
          <label>
            Customer type
            <select id="inquiry-type" name="customerType" defaultValue={draft.businessType} required>
              <option value="">Choose one</option>
              {CUSTOMER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            City or ZIP
            <input id="inquiry-delivery" name="delivery" defaultValue={draft.deliveryCity} required autoComplete="address-level2" />
          </label>
          <label>
            Contact name
            <input id="inquiry-contact" name="contactName" defaultValue={draft.contactName} required autoComplete="name" />
          </label>
          <label>
            Email
            <input id="inquiry-email" name="email" type="email" defaultValue={draft.contactEmail} required autoComplete="email" />
          </label>
          <label>
            Phone
            <input id="inquiry-phone" name="phone" type="tel" defaultValue={draft.contactPhone} required autoComplete="tel" />
          </label>
          <label>
            Approximate weekly needs
            <input id="inquiry-quantity" name="weeklyQuantity" defaultValue={draft.weeklyQuantity} placeholder="e.g., 20 dozen buns each week" />
          </label>
          <label>
            Desired start date
            <input id="inquiry-start" name="startDate" type="date" defaultValue={draft.firstDelivery} autoComplete="off" />
          </label>
        </div>
        <fieldset className="inquiry-products">
          <legend>Products of interest</legend>
          <p>Ordering units confirmed by sales.</p>
          {draft.lines.length > 0 ? (
            <ul>
              {draft.lines.map((line) => {
                const product = getProduct(line.productId);
                if (!product) return null;
                return (
                  <li key={line.productId}>
                    <span className="line-name">{product.name}</span>
                    <small>{leadWords(product)}</small>
                    <label>
                      Quantity
                      <input
                        aria-label={`Quantity for ${product.name}`}
                        type="number"
                        min={1}
                        value={line.qty}
                        onChange={(event) => {
                          const qty = Number(event.target.value);
                          setDraft((current) => ({
                            ...current,
                            lines: current.lines.map((item) =>
                              item.productId === line.productId ? { ...item, qty } : item,
                            ),
                          }));
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          lines: current.lines.filter((item) => item.productId !== line.productId),
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
            Other products or custom requirements
            <textarea
              id="inquiry-products"
              name="productsText"
              rows={3}
              defaultValue={draft.productsText}
              placeholder="Optional: additional products, sizes, slicing or packaging questions"
            />
          </label>
        </fieldset>
        <label>
          Special requirements
          <textarea id="inquiry-notes" name="notes" rows={3} defaultValue={draft.notes} />
        </label>
        <fieldset className="sample-interest" id="sample-request">
          <legend>Interested in trying products first?</legend>
          <label className="sample-interest-choice">
            <input type="checkbox" checked={draft.askAboutSamples} onChange={(event) => setDraft((current) => ({ ...current, askAboutSamples: event.target.checked }))} />
            Ask the bakery whether samples are available
          </label>
          <p>Sample availability, eligibility, cost and fulfillment are not confirmed. This is a question to include in the request preview—not a sample order.</p>
        </fieldset>
        <div className="inquiry-form-actions">
          <button className="btn btn-primary" type="submit">Preview request</button>
          <button className="btn btn-ghost" type="button" onClick={clearRequest}>Clear saved request</button>
        </div>
      </form>
      <section className="inquiry-catalog">
        <h2>Add from the catalog</h2>
        <p>Items you add here are saved in this browser and listed above.</p>
        <ProductBrowser groups={catalog} onAdd={add} selectedIds={draft.lines.map((line) => line.productId)} />
      </section>
    </div>
  );
}
