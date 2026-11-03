"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/site";

const KEY = "bluepoint-demo-notice";

export function Notice() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // The original homepage callout should not interrupt every interior page.
    if (pathname !== "/") {
      return;
    }
    try {
      if (window.localStorage.getItem(KEY) === "1") return;
      if (window.sessionStorage.getItem("bp-notice-shown") === "1") return;
      const timer = window.setTimeout(() => {
        window.sessionStorage.setItem("bp-notice-shown", "1");
        setOpen(true);
      }, 5000);
      return () => window.clearTimeout(timer);
    } catch {
      // Storage can be unavailable in privacy-restricted browsers.
      const timer = window.setTimeout(() => setOpen(true), 5000);
      return () => window.clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      // Dismissal remains functional even when browser storage is disabled.
    }
    setOpen(false);
  }

  if (!open || pathname !== "/") return null;

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
