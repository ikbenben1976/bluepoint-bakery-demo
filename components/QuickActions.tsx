"use client";

import { useCallSheet } from "@/components/CallSheet";

export function QuickActions() {
  const { open, setOpen } = useCallSheet();

  return (
    <div className="quick-actions no-print" data-testid="quick-actions">
      <button
        type="button"
        className="quick-toggle"
        aria-expanded={open}
        aria-controls="call-notice"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <PhoneIcon />
        Contact
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
