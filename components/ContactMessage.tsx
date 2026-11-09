"use client";

import { useState, type FormEvent } from "react";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { formatPhone } from "@/lib/formatInquiry";

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  acknowledged: boolean;
};

const EMPTY: Fields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  acknowledged: false,
};

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ContactMessage() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: string[] = [];
    if (!fields.firstName.trim()) next.push("Enter a first name.");
    if (!fields.lastName.trim()) next.push("Enter a last name.");
    if (!validEmail(fields.email)) next.push("Enter an email address.");
    if (!fields.message.trim()) next.push("Enter a message.");
    if (!fields.acknowledged) next.push("Confirm that this concept site does not send the message.");
    setErrors(next);
    if (next.length === 0) setDone(true);
  }

  if (done) {
    return (
      <section className="contact-message request-flow" data-testid="contact-message-confirmation">
        <article className="review-card">
          <header className="review-head">
            <div>
              <p className="kicker">Demo only</p>
              <h2>Your message is ready to review</h2>
            </div>
            <p className="demo-badge">Preview only — not submitted</p>
          </header>
          <p>
            Your message has not been sent. Contact Bluepoint directly by phone or email to share your inquiry.
          </p>
          <p>
            For a real reply, call <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a> or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
          <dl className="inquiry-summary">
            <div>
              <dt>Name</dt>
              <dd>
                {fields.firstName.trim()} {fields.lastName.trim()}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{fields.email.trim()}</dd>
            </div>
            {fields.phone.trim() ? (
              <div>
                <dt>Phone</dt>
                <dd>{formatPhone(fields.phone)}</dd>
              </div>
            ) : null}
            <div>
              <dt>Message</dt>
              <dd>{fields.message.trim()}</dd>
            </div>
          </dl>
          <button className="btn btn-ghost" type="button" onClick={() => setDone(false)}>
            Prepare another message
          </button>
        </article>
      </section>
    );
  }

  return (
    <div className="contact-message request-flow">
      <h2>Prepare a message</h2>
      <p className="request-notice" data-testid="contact-demo-notice">
        This demo prepares your message but does not send it.
      </p>
      <form data-testid="contact-message-form" noValidate onSubmit={preview}>
        {errors.length > 0 ? (
          <ul id="contact-message-errors" role="alert" tabIndex={-1}>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}
        <div className="request-grid">
          <label>
            First name
            <input
              id="contact-first-name"
              autoComplete="given-name"
              value={fields.firstName}
              onChange={(event) => update("firstName", event.target.value)}
            />
          </label>
          <label>
            Last name
            <input
              id="contact-last-name"
              autoComplete="family-name"
              value={fields.lastName}
              onChange={(event) => update("lastName", event.target.value)}
            />
          </label>
          <label>
            Email
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              value={fields.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </label>
          <label>
            Phone
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              value={fields.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </label>
        </div>
        <label>
          Message
          <textarea
            id="contact-message"
            rows={5}
            value={fields.message}
            onChange={(event) => update("message", event.target.value)}
          />
        </label>
        <label className="choice-label">
          <input
            id="contact-acknowledge"
            type="checkbox"
            checked={fields.acknowledged}
            onChange={(event) => update("acknowledged", event.target.checked)}
          />
          I understand this is a preview and my message will not be sent automatically
        </label>
        <div className="request-actions">
          <button className="btn btn-primary" type="submit">
            Preview message
          </button>
        </div>
      </form>
    </div>
  );
}
