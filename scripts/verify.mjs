import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.env.BASE_URL || "http://127.0.0.1:43111";
const shotDir = "/workspace/business_ideas/bluepoint/screenshots";
const proofDir = "/workspace/business_ideas/bluepoint/proof";
await mkdir(shotDir, { recursive: true });
await mkdir(proofDir, { recursive: true });

const pages = ["/", "/breads/", "/pastries/", "/delivery/", "/about/", "/community/", "/faq/", "/contact/", "/wholesale/"];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/opt/google/chrome/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const report = { consoleErrors: {}, externalRequests: {}, httpErrors: {}, pages: {} };

async function watch(page, bucket) {
  const errors = [];
  const external = [];
  const httpErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("request", (req) => {
    const url = req.url();
    if (url.startsWith("data:") || url.startsWith("blob:")) return;
    let host = "";
    try {
      host = new URL(url).host;
    } catch {
      external.push(url);
      return;
    }
    if (host !== "127.0.0.1:43111" && host !== "localhost:43111") external.push(`${req.method()} ${url}`);
    if (req.method() !== "GET" && req.method() !== "HEAD") external.push(`NON-GET ${req.method()} ${url}`);
  });
  page.on("response", (res) => {
    if (res.status() >= 400) httpErrors.push(`${res.status()} ${res.url()}`);
  });
  report.consoleErrors[bucket] = errors;
  report.externalRequests[bucket] = external;
  report.httpErrors[bucket] = httpErrors;
}

async function shot(page, name) {
  const file = path.join(shotDir, `${name}.jpg`);
  await page.screenshot({ path: file, fullPage: true, type: "jpeg", quality: 62 });
  return file;
}

for (const width of [1280, 390]) {
  const context = await browser.newContext({
    viewport: { width, height: width === 390 ? 844 : 800 },
    deviceScaleFactor: 1,
  });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const page = await context.newPage();
  await watch(page, `browse-${width}`);

  for (const route of pages) {
    const key = `${route}-${width}`;
    await page.goto(base + route, { waitUntil: "networkidle" });
    report.pages[key] = page.url();
    if (route === "/wholesale/") {
      await shot(page, `wholesale-gate-${width}`);
    } else {
      const slug = route === "/" ? "home" : route.replaceAll("/", "");
      await shot(page, `${slug}-${width}`);
    }
  }

  await page.goto(base + "/wholesale/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "I am a new customer" }).click();
  await page.getByTestId("wholesale-step").waitFor();
  await shot(page, `wholesale-step1-${width}`);

  await page.getByLabel("Business name").fill("Demo Restaurant");
  await page.getByLabel("Business type").selectOption("restaurant");
  await page.getByLabel("Delivery city").fill("Boulder");
  await page.getByRole("button", { name: "Monday", exact: true }).click();
  await page.getByRole("button", { name: "Continue to products" }).click();
  await page.getByRole("heading", { name: "Products", exact: true }).waitFor();

  async function addProduct(name) {
    await page.getByLabel("Search products").fill(name);
    const card = page.locator("li").filter({ has: page.getByRole("heading", { name, exact: true }) });
    await card.getByRole("button", { name: "Add to request" }).click();
  }
  await addProduct('Plain Kaiser 4"');
  await addProduct("Curved Butter Croissant 1 oz");
  await addProduct("Sourdough Boule 8 oz");
  await shot(page, `wholesale-step2-${width}`);

  await page.getByRole("button", { name: "Continue to timing" }).click();
  await page.getByLabel("First delivery date").waitFor();
  await shot(page, `wholesale-step3-${width}`);
  const min = await page.getByLabel("First delivery date").getAttribute("min");
  report.pages[`earliest-${width}`] = min;
  await page.getByLabel("First delivery date").fill(min);
  await page.getByRole("button", { name: "Continue to review" }).click();
  await page.getByRole("heading", { name: "Email preview" }).waitFor();
  await shot(page, `wholesale-step4-${width}`);
  await page.getByRole("button", { name: "Copy summary" }).click();
  await page.getByText("Summary copied.").waitFor();
  const disabled = await page.getByRole("button", { name: /disabled in this demo/ }).isDisabled();
  report.pages[`send-disabled-${width}`] = disabled;

  await context.close();
}

await browser.close();

const consoleFlat = Object.values(report.consoleErrors).flat();
const externalFlat = Object.values(report.externalRequests).flat();
const httpFlat = Object.values(report.httpErrors).flat();
const summary = {
  consoleErrorCount: consoleFlat.length,
  consoleErrors: consoleFlat,
  externalRequestCount: externalFlat.length,
  externalRequests: externalFlat,
  httpErrorCount: httpFlat.length,
  httpErrors: httpFlat,
  pages: report.pages,
};
await writeFile(path.join(proofDir, "browser.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (consoleFlat.length || externalFlat.length || httpFlat.length) process.exitCode = 1;
