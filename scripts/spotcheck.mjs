import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = new URL("../out/", import.meta.url);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(html|js|css|txt|xml)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const files = await walk(root.pathname);
const html = [];
let all = "";
for (const file of files) {
  const text = await readFile(file, "utf8");
  all += text;
  if (file.endsWith(".html")) html.push(text);
}
const pages = html.join("\n");
const visible = pages.replace(/<script[\s\S]*?<\/script>/gi, " ");
const dollars = visible.match(/\$\d[\d,]*(?:\s+million)?/g) || [];
const allowed = dollars.filter((hit) => hit === "$1 million" || hit === "$15,000");
const checks = [
  ["noindex meta", pages.includes('content="noindex,nofollow"')],
  ["disclaimer", pages.includes("Demo prepared for review — not the official site")],
  ["5105 Cook St", pages.includes("5105 Cook St")],
  ["phone", pages.includes("(303) 298-1100")],
  ["email", pages.includes("sales@bluepointbakery.com")],
  ["hours", pages.includes("Monday–Friday 7:00 AM–3:00 PM")],
  ["order portal", pages.includes("https://us.bakery.software/app/bluepoint/us/-1/Account/Login")],
  ["pay portal", pages.includes("https://app.paywholesail.com/portal/bluepointbakery")],
  ["viewport", pages.includes("width=device-width")],
  ["no font tags", !pages.toLowerCase().includes("<font")],
  ["no old address", !/1721\s*E/i.test(all) && !/\b58th\b/i.test(all)],
  ["no mailto", !all.toLowerCase().includes("mailto:")],
  ["no analytics", !/gtag\(|google-analytics|googletagmanager/.test(all)],
  ["robots disallow", (await readFile(path.join(root.pathname, "robots.txt"), "utf8")).includes("Disallow: /")],
  ["only known dollar amounts", dollars.length === allowed.length],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed += 1;
}
if (dollars.length) console.log("dollar hits:", dollars);
if (failed) process.exit(1);
