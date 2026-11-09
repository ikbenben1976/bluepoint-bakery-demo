"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getProduct } from "@/data/products";
import type { Draft, DraftLine } from "@/lib/draft";
import { requestPricingHref } from "@/lib/requestLink";
import { REQUEST_CHANGE_EVENT, loadDraft, saveDraft } from "@/lib/storage";

type RequestSheetValue = {
  openSheet: () => void;
  notifyAdded: () => void;
};

const RequestSheetContext = createContext<RequestSheetValue | null>(null);

export function useRequestSheet(): RequestSheetValue {
  const value = useContext(RequestSheetContext);
  if (!value) throw new Error("useRequestSheet requires RequestSheetProvider");
  return value;
}

function optionText(line: DraftLine): string {
  const bits: string[] = [];
  if (line.unit) bits.push(line.unit);
  if (line.slice) bits.push(`slice ${line.slice}`);
  if (line.wrapped) bits.push("individually wrapped");
  if (line.dipped) bits.push(line.dipped);
  return bits.join(" · ");
}

export function RequestSheetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<number | null>(null);
  const titleId = useId();

  const openSheet = useCallback(() => {
    setToast(false);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setOpen(true);
  }, []);

  const closeSheet = useCallback(() => setOpen(false), []);

  const notifyAdded = useCallback(() => {
    setToast(true);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 4500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <RequestSheetContext.Provider value={{ openSheet, notifyAdded }}>
      {children}
      {toast && !open ? (
        <div className="request-toast no-print" role="status">
          <p>Added to your request</p>
          <button type="button" onClick={openSheet}>
            View request
          </button>
        </div>
      ) : null}
      {open ? <RequestPanel titleId={titleId} onClose={closeSheet} /> : null}
    </RequestSheetContext.Provider>
  );
}

function RequestPanel({ titleId, onClose }: { titleId: string; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<Draft>(() => loadDraft());

  useEffect(() => {
    const read = () => setDraft(loadDraft());
    window.addEventListener(REQUEST_CHANGE_EVENT, read);
    return () => window.removeEventListener(REQUEST_CHANGE_EVENT, read);
  }, []);

  useEffect(() => {
    const y = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      behavior: root.style.scrollBehavior,
    };
    body.classList.add("request-sheet-open");
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    root.style.scrollBehavior = "auto";
    return () => {
      body.classList.remove("request-sheet-open");
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, y);
      root.style.scrollBehavior = previous.behavior;
    };
  }, []);

  useEffect(() => {
    const root = panelRef.current;
    const previously = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusables = () => {
      if (!root) return [];
      return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])")].filter(
        (el) => el.tabIndex !== -1 && !el.hasAttribute("disabled"),
      );
    };
    focusables()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previously?.focus({ preventScroll: true });
    };
  }, [onClose]);

  function write(next: Draft) {
    setDraft(next);
    saveDraft(next);
  }

  function updateQty(productId: string, value: string) {
    const parsed = Math.round(Number(value));
    const qty = Number.isFinite(parsed) ? Math.min(9999, Math.max(1, parsed)) : 1;
    write({
      ...draft,
      lines: draft.lines.map((line) => (line.productId === productId ? { ...line, qty } : line)),
    });
  }

  function removeLine(productId: string) {
    write({ ...draft, lines: draft.lines.filter((line) => line.productId !== productId) });
  }

  const count = draft.lines.length;

  return (
    <div className="request-sheet-layer no-print">
      <div className="request-sheet-backdrop" onClick={onClose} />
      <div
        ref={panelRef}
        className="request-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="request-sheet"
      >
        <div className="request-sheet-head">
          <h2 id={titleId}>Your request</h2>
          <button type="button" className="request-sheet-close" onClick={onClose}>
            Close
          </button>
        </div>
        {count === 0 ? (
          <p className="request-sheet-empty">Nothing is in your request yet.</p>
        ) : (
          <ul className="request-sheet-list">
            {draft.lines.map((line) => {
              const product = getProduct(line.productId);
              if (!product) return null;
              const options = optionText(line);
              return (
                <li key={line.productId}>
                  <div>
                    <h3>{product.name}</h3>
                    {options ? <p>{options}</p> : null}
                  </div>
                  <label>
                    Quantity
                    <input
                      type="number"
                      min={1}
                      max={9999}
                      inputMode="numeric"
                      value={line.qty}
                      aria-label={`Quantity for ${product.name}`}
                      onChange={(event) => updateQty(line.productId, event.target.value)}
                    />
                  </label>
                  <button type="button" className="btn btn-ghost" onClick={() => removeLine(line.productId)}>
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <div className="request-sheet-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Keep browsing
          </button>
          <Link className="btn btn-primary" href={requestPricingHref(count)} onClick={onClose}>
            Continue to request
          </Link>
        </div>
      </div>
    </div>
  );
}
