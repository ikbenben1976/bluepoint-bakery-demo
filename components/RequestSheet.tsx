"use client";

import Image from "next/image";
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
import { visualForProduct } from "@/data/illustrative";
import { QUANTITY_BASES, parseEstimateQty, type Draft, type DraftLine, type QuantityBasis } from "@/lib/draft";
import { requestPricingHref } from "@/lib/requestLink";
import { publishedUnit } from "@/lib/spec";
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

function optionText(line: DraftLine, units: readonly string[]): string {
  const bits: string[] = [];
  if (units.length > 1 && line.unit) bits.push(line.unit);
  if (line.slice) bits.push(`slice ${line.slice}`);
  if (line.wrapped) bits.push("individually wrapped");
  if (line.dipped) bits.push(line.dipped);
  return bits.join(" · ");
}

export function RequestSheetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const openSheet = useCallback(() => setOpen(true), []);
  const closeSheet = useCallback(() => setOpen(false), []);

  return (
    <RequestSheetContext.Provider value={{ openSheet, notifyAdded: openSheet }}>
      {children}
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
    const scrollbar = window.innerWidth - root.clientWidth;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      behavior: root.style.scrollBehavior,
    };
    root.style.scrollBehavior = "auto";
    body.classList.add("request-sheet-open");
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.classList.remove("request-sheet-open");
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
      root.style.scrollBehavior = previous.behavior;
    };
  }, []);

  useEffect(() => {
    const root = panelRef.current;
    const previously = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusables = () => {
      if (!root) return [];
      return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])")].filter(
        (el) => el.tabIndex !== -1 && !el.hasAttribute("disabled"),
      );
    };
    focusables()[0]?.focus({ preventScroll: true });
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

  function patchLine(productId: string, patch: Partial<DraftLine>) {
    write({
      ...draft,
      lines: draft.lines.map((line) => (line.productId === productId ? { ...line, ...patch } : line)),
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
              const visual = visualForProduct(product.id);
              const options = optionText(line, product.units);
              const unit = publishedUnit(product);
              return (
                <li key={line.productId} className="request-line">
                  {visual ? <div className="request-thumb-col">
                    <div className="request-thumb">
                      <Image src={visual.webp} alt={visual.alt} width={96} height={96} className="request-thumb-img" />
                    </div>
                    <p className="request-thumb-note">Illustrative</p>
                  </div> : null}
                  <div className="request-line-copy">
                    <div className="request-line-top">
                      <h3>{product.name}</h3>
                      <button type="button" className="request-remove" onClick={() => removeLine(line.productId)}>
                        Remove
                      </button>
                    </div>
                    {options ? <p className="request-line-options">{options}</p> : null}
                    <label className="request-qty">
                      <span>
                        Estimated quantity
                        {unit ? <span className="qty-unit"> · {unit}</span> : null}
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={9999}
                        inputMode="numeric"
                        value={line.qty ?? ""}
                        aria-label={`Estimated quantity for ${product.name}`}
                        onChange={(event) => patchLine(line.productId, { qty: parseEstimateQty(event.target.value) })}
                      />
                    </label>
                    <label className="request-basis">
                      Estimate basis
                      <select
                        aria-label={`Estimate basis for ${product.name}`}
                        value={line.basis}
                        onChange={(event) => patchLine(line.productId, { basis: event.target.value as QuantityBasis })}
                      >
                        {QUANTITY_BASES.map(([id, label]) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="request-line-note">
                      Delivery preferences or varying needs
                      <textarea
                        rows={2}
                        maxLength={500}
                        aria-label={`Delivery preferences for ${product.name}`}
                        value={line.scheduleNote}
                        onChange={(event) => patchLine(line.productId, { scheduleNote: event.target.value })}
                      />
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="request-sheet-note">These are estimated quantities, not a confirmed order. Bluepoint will confirm pricing and delivery.</p>
        <div className="request-sheet-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Continue browsing
          </button>
          <Link className="btn btn-primary" href={requestPricingHref(count)} onClick={onClose}>
            Review selections
          </Link>
        </div>
      </div>
    </div>
  );
}
