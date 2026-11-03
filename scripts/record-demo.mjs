import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

await mkdir("/tmp/bp-video", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/opt/google/chrome/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: "/tmp/bp-video", size: { width: 1280, height: 800 } },
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:43111/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.evaluate(() => window.scrollTo({ top: 90, behavior: "instant" }));
await page.waitForTimeout(350);
const card = page.locator(".photo-card").nth(2);
await card.scrollIntoViewIfNeeded();
await card.hover();
await page.waitForTimeout(700);
for (let y = 0; y <= 4600; y += 140) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(80);
}
await page.goto("http://127.0.0.1:43111/delivery/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const map = page.locator(".map-pointer");
const box = await map.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width * 0.18, box.y + box.height * 0.64);
  await page.waitForTimeout(500);
  await page.mouse.click(box.x + box.width * 0.72, box.y + box.height * 0.86);
  await page.waitForTimeout(500);
}
for (const name of ["Cheyenne", "Fort Collins", "Breckenridge"]) {
  await page.getByLabel("Find a city on the map").fill(name);
  await page.getByRole("list", { name: "Matching cities" }).getByRole("button", { name, exact: true }).click();
  await page.waitForTimeout(650);
}
const video = page.video();
await context.close();
const path = await video.path();
console.log(path);
await browser.close();
