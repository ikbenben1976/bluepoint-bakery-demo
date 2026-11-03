import Image from "next/image";
import Link from "next/link";
import {
  ADDRESS,
  DISCLAIMER,
  COLORADO_PROUD,
  EMAIL,
  FACEBOOK,
  HOURS,
  INSTAGRAM,
  NAV,
  ORDER_URL,
  PAY_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="cloth-edge" aria-hidden="true" />
      <div className="shell footer-grid">
        <div>
          <figure className="original-mark">
            <Image
              src="/logo.jpg"
              alt="The original Bluepoint Bakery mark: a rolling pin, the word Bluepoint, and an orange triangle"
              width={220}
              height={108}
            />
            <figcaption className="sr-only">Bluepoint Bakery original rolling-pin and triangle logo</figcaption>
          </figure>
        </div>
        <div>
          <p className="kicker">Bakery</p>
          <p className="footer-address">{ADDRESS}</p>
          <p>
            <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          </p>
          <p>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
          <p className="footer-hours">Office hours {HOURS}</p>
          <p className="footer-hours">We bake and deliver 6 days a week.</p>
        </div>
        <div>
          <p className="kicker">Pages</p>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <p className="footer-hours">This concept website does not submit wholesale requests. Policies for any future official site require Bluepoint approval.</p>
        </div>
        <div>
          <p className="kicker">Accounts</p>
          <p>
            <a href={ORDER_URL} target="_blank" rel="noopener noreferrer">
              Order online (existing customers)
            </a>
          </p>
          <p>
            <a href={PAY_URL} target="_blank" rel="noopener noreferrer">
              Pay an invoice
            </a>
          </p>
          <p>
            <Link href="/wholesale">Become a wholesale customer</Link>
          </p>
          <p className="social-row">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Bluepoint Bakery on Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM12 9.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2z"
                />
              </svg>
            </a>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Bluepoint Bakery on Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
              </svg>
            </a>
          </p>
          <p>
            <Image src="/images/colorado-proud.jpg" alt="Colorado Proud" width={64} height={64} />
          </p>
          <p>
            <a href={COLORADO_PROUD}>Colorado Proud product finder</a>
          </p>
        </div>
      </div>
      <div className="footer-base">
        <div className="shell">
          <p>© Bluepoint Bakery</p>
          <p>{DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
