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
    (initial[initial.length - 1] ?? root)?.focus({ preventScroll: true });

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
      <button type="button" className="call-notice-backdrop" aria-label="Dismiss call notice" onClick={dismiss} />
      <div
        ref={dialogRef}
        className="call-notice"
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-notice-title"
        data-testid="call-notice"
        tabIndex={-1}
      >
        <p id="call-notice-title">
          <strong>Let&apos;s talk bakery.</strong>
        </p>
        <p>Have questions about products, delivery or a wholesale account? Our team is happy to help. Call {PHONE_DISPLAY}.</p>
        <div className="call-notice-actions">
          <a href={`tel:${PHONE_TEL}`}>Call Bluepoint</a>
          <a href={`mailto:${EMAIL}`}>Email sales</a>
          <Link href={requestPricingHref(requestCount)}>Request a quote</Link>
          <button type="button" onClick={dismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
