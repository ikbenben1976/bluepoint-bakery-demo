import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path: string) => fs.readFileSync(path, "utf8");

test("the call sheet does not schedule itself and opens from the contact control", () => {
  const notice = read("components/Notice.tsx");
  const contact = read("components/QuickActions.tsx");
  assert.doesNotMatch(notice, /NOTICE_DELAY_MS|setTimeout/);
  assert.match(notice, /useCallSheet/);
  assert.match(contact, /useCallSheet/);
  assert.match(contact, /Contact/);
  assert.doesNotMatch(contact, /setTimeout/);
});

test("phone cards center their titles, descriptions, and arrows", () => {
  const css = read("app/brand.css");
  assert.match(css, /\.assortment-card strong,\s*\.assortment-card \.assortment-line,\s*\.assortment-card \.assortment-arrow \{\s*text-align: center;/);
  assert.match(css, /\.making \.making-title,\s*\.making \.making-summary,\s*\.making \.making-explore \{\s*text-align: center;/);
  assert.match(css, /\.making \.making-permission,\s*\.making \.making-footnote,\s*\.illustrative-label,\s*\.illustrative-note \{\s*text-align: left;/);
  assert.match(css, /\.assortment-grid \{\s*grid-template-columns: 1fr;\s*\}/);
});

test("mobile header keeps a phone link and a tall menu control", () => {
  const header = read("components/Header.tsx");
  const css = read("app/brand.css");
  assert.match(header, /header-call/);
  assert.match(header, /PHONE_TEL/);
  assert.match(header, /scrollY > \(narrow \? 80 : 40\)/);
  assert.match(css, /max-width: 767px\)[\s\S]*\.header-call/);
  assert.match(css, /\.menu-toggle \{[^}]*min-height: 44px/);
});
