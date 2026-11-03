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
