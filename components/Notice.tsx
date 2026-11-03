"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/site";

const KEY = "bluepoint-demo-notice";

export function Notice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(KEY) === "1") return;
    const seen = Number(window.sessionStorage.getItem("bp-views") || "0") + 1;
    window.sessionStorage.setItem("bp-views", String(seen));
    const timer = window.setTimeout(() => setOpen(true), seen >= 2 ? 400 : 3500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    window.localStorage.setItem(KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <aside className="call-notice" role="region" aria-label="Call Bluepoint" data-testid="call-notice">
      <p>
        <strong>Call us today.</strong> {PHONE_DISPLAY}. A sales professional will help you open an account.
      </p>
      <div>
        <a href={`tel:${PHONE_TEL}`}>Call</a>
        <Link href="/wholesale">Request pricing</Link>
        <button type="button" onClick={dismiss}>
          Dismiss
        </button>
      </div>
    </aside>
  );
}
