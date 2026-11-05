"use client";

import { useState } from "react";
import {
  checkDelivery,
  deliveryPhrase,
  deliverySuggestions,
} from "@/lib/deliveryArea";

type Props = {
  idPrefix: string;
  context: "page" | "wholesale";
  value?: string;
  onChange?: (value: string) => void;
};

export function DeliveryChecker({ idPrefix, context, value, onChange }: Props) {
  const [internal, setInternal] = useState("");
  const city = value ?? internal;

  function setCity(next: string) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  const result = checkDelivery(city);
  const suggestions = deliverySuggestions(city);
  const phrase = deliveryPhrase(result.status, context);
  const inputId = `${idPrefix}-city`;

  return (
    <div>
      <label htmlFor={inputId}>Delivery city</label>
      <input
        id={inputId}
        type="text"
        value={city}
        autoComplete="off"
        onChange={(event) => setCity(event.target.value)}
        className="text-field mt-1"
      />
      {suggestions.length > 0 ? (
        <ul className="mt-2 border-2 border-tan-deep bg-white" aria-label="Matching areas">
          {suggestions.map((suggestion) => (
            <li key={suggestion.label}>
              <button
                type="button"
                className="w-full px-3 py-3 text-left font-semibold hover:bg-paper"
                onClick={() => setCity(suggestion.label)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <p role="status" className="mt-3 font-bold">
        {result.status === "empty" ? "Type a city or a listed area." : null}
        {result.status === "yes" ? `${result.area}${result.days ? ` · ${result.days}` : ""}. ${phrase}` : null}
        {result.status === "ask" ? `${phrase}${result.days ? ` · ${result.days}` : ""}` : null}
      </p>
    </div>
  );
}
