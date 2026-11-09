"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCallSheet } from "@/components/CallSheet";
import { LogoLockup } from "@/components/Mark";
import { NAV, ORDER_URL, PAY_URL, PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { requestPricingHref } from "@/lib/requestLink";
import { useRequestCount } from "@/components/useRequestCount";

function normalize(path: string): string {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function Header() {
  const pathname = normalize(usePathname() || "/");
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const { open: contactOpen, setOpen: setContactOpen } = useCallSheet();
  const requestCount = useRequestCount();
  const pricingHref = requestPricingHref(requestCount);
  const pricingCurrent = pathname === "/wholesale" ? "page" : undefined;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const onScroll = () => {
      const narrow = media.matches;
      setCondensed(window.scrollY > (narrow ? 80 : 40));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    media.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      media.removeEventListener("change", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <header className={`site-header no-print ${condensed ? "is-condensed" : ""}`}>
      <div className="site-header-row">
        <button type="button" className="header-call" aria-label="Contact" aria-haspopup="dialog"
          aria-expanded={contactOpen} aria-controls="call-notice" onClick={() => setContactOpen(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M7 3h3l1.5 4-2 1.2a12 12 0 0 0 6.3 6.3L17 12.5 21 14v3a2 2 0 0 1-2.2 2A16 16 0 0 1 5 6.2 2 2 0 0 1 7 3z"
            />
          </svg>
        </button>
        <Link href="/" className="brand">
          <LogoLockup inverse={open} />
        </Link>
        <nav aria-label="Primary" className="desk-nav">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="nav-link" aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
          <Link href={pricingHref} className="nav-link" aria-current={pricingCurrent}>
            Request a quote
          </Link>
        </nav>
        <div className="util">
          <a className="util-phone" href={`tel:${PHONE_TEL}`}>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path
                fill="currentColor"
                d="M7 3h3l1.5 4-2 1.2a12 12 0 0 0 6.3 6.3L17 12.5 21 14v3a2 2 0 0 1-2.2 2A16 16 0 0 1 5 6.2 2 2 0 0 1 7 3z"
              />
            </svg>
            {PHONE_DISPLAY}
          </a>
          <details className="customer-login">
            <summary>Customer login</summary>
            <div className="customer-login-panel">
              <a href={ORDER_URL} target="_blank" rel="noopener noreferrer">
                Order online (existing customers)
              </a>
              <a href={PAY_URL} target="_blank" rel="noopener noreferrer">
                Pay an invoice
              </a>
            </div>
          </details>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} hidden={!open}>
        <p className="kicker">Bluepoint Bakery</p>
        <nav aria-label="Mobile">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href={pricingHref}>Request a quote</Link>
        </nav>
        <div className="mobile-menu-actions">
          <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          <a href={ORDER_URL}>Order online (existing customers)</a>
          <a href={PAY_URL}>Pay an invoice</a>
        </div>
      </div>
    </>
  );
}
