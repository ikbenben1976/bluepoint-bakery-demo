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

test("mobile header keeps a phone link and a tall menu control", () => {
  const header = read("components/Header.tsx");
  const css = read("app/brand.css");
  assert.match(header, /header-call/);
  assert.match(header, /PHONE_TEL/);
  assert.match(header, /scrollY > \(narrow \? 80 : 40\)/);
  assert.match(css, /max-width: 767px\)[\s\S]*\.header-call/);
  assert.match(css, /\.menu-toggle \{[^}]*min-height: 44px/);
});
