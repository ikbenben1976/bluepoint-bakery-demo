"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { useCallSheet } from "@/components/CallSheet";
import { useRequestCount } from "@/components/useRequestCount";
import { requestPricingHref } from "@/lib/requestLink";

export function Notice() {
  const { open, setOpen } = useCallSheet();
  const requestCount = useRequestCount();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = dialogRef.current;

    function focusables(): HTMLElement[] {
      if (!root) return [];
      return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter(
        (element) => element.tabIndex !== -1,
      );
    }

    const initial = focusables();
    (initial[0] ?? root)?.focus({ preventScroll: true });

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && root?.contains(active);
      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus({ preventScroll: true });
    };
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div className="call-notice-layer">
      <button type="button" className="call-notice-backdrop" tabIndex={-1} aria-hidden="true" onClick={dismiss} />
      <div
        ref={dialogRef}
        id="call-notice"
        className="call-notice"
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-notice-title"
        data-testid="call-notice"
        tabIndex={-1}
      >
        <header className="call-notice-header">
          <h2 id="call-notice-title">Contact Bluepoint</h2>
          <button type="button" className="call-notice-close" aria-label="Close" onClick={dismiss}>
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <p>Talk with our Denver bakery about products, delivery, or opening a wholesale account.</p>
        <Link className="btn btn-primary" href={requestPricingHref(requestCount)} onClick={dismiss}>Request a quote</Link>
        <div className="call-notice-actions">
          <a href={`tel:${PHONE_TEL}`}>Call {PHONE_DISPLAY}</a>
          <a href={`mailto:${EMAIL}`}>Email sales</a>
        </div>
      </div>
    </div>
  );
}
