import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:43121",
    launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : undefined,
  },
  webServer: {
    command: "python3 -m http.server 43121 --directory out",
    url: "http://127.0.0.1:43121",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
