"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV, ORDER_URL, PAY_URL, PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { LogoLockup } from "@/components/Mark";

function normalize(path: string): string {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function Header() {
  const pathname = normalize(usePathname() || "/");
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <>
    <header className={`site-header no-print ${condensed ? "is-condensed" : ""}`}>
      <div className="site-header-row">
        <Link href="/" className="brand">
          <LogoLockup condensed={condensed} />
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
          <Link href="/wholesale" className="btn btn-primary header-pricing">
            Request pricing
          </Link>
          <details className="customer-login">
            <summary>Customer login</summary>
            <div className="customer-login-panel">
              <a href={ORDER_URL} target="_blank" rel="noopener noreferrer">
                Order online
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
        </nav>
        <div className="mobile-menu-actions">
          <Link href="/wholesale">Request pricing</Link>
          <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          <a href={ORDER_URL}>Order online (existing customers)</a>
          <a href={PAY_URL}>Pay an invoice</a>
        </div>
      </div>
    </>
  );
}
