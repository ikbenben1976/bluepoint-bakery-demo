"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { EMAIL, PHONE_TEL } from "@/data/site";

export function QuickActions() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const root = document.querySelector("[data-testid='quick-actions']") as HTMLElement | null;
    if (!root) return;
    const place = () => {
      root.style.visibility = "visible";
      root.style.transform = "translateY(0)";
      const blocks = document.querySelectorAll(
        ".catalog-tools, .hero-board, .hero-caption, .hero-copy, .review-card, .site-footer, .cloth-edge, .ticket-hero",
      );
      let shift = 0;
      for (let step = 0; step < 14; step += 1) {
        root.style.transform = `translateY(-${shift}px)`;
        const box = root.getBoundingClientRect();
        if (box.top < 80) {
          root.style.visibility = "hidden";
          return;
        }
        let blockerTop = Number.POSITIVE_INFINITY;
        for (const el of blocks) {
          const rect = el.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2) continue;
          const clear =
            box.right < rect.left || rect.right < box.left || box.bottom < rect.top || rect.bottom < box.top;
          if (!clear) blockerTop = Math.min(blockerTop, rect.top);
        }
        if (blockerTop === Number.POSITIVE_INFINITY) return;
        shift += box.bottom - blockerTop + 12;
      }
      root.style.visibility = "hidden";
    };
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  return (
    <div className={`quick-actions no-print ${open ? "is-open" : ""}`} data-testid="quick-actions">
      <div className="quick-panel" id={panelId} hidden={!open}>
        <a href={`tel:${PHONE_TEL}`}>
          <PhoneIcon /> Call
        </a>
        <a href={`mailto:${EMAIL}`}>
          <MailIcon /> Email
        </a>
        <Link href="/wholesale">
          <NoteIcon /> Request pricing
        </Link>
      </div>
      <button
        type="button"
        className="quick-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <PhoneIcon />
        {open ? "Close" : "Contact"}
      </button>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 3h3l1.5 4-2 1.2a12 12 0 0 0 6.3 6.3L17 12.5 21 14v3a2 2 0 0 1-2.2 2A16 16 0 0 1 5 6.2 2 2 0 0 1 7 3z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="currentColor" d="M3 6h18v12H3V6zm9 7 8-5H4l8 5z" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="currentColor" d="M6 3h9l5 5v13H6V3zm8 1.5V9h4.5L14 4.5zM8 12h8v1.5H8V12zm0 3h6v1.5H8V15z" />
    </svg>
  );
}
