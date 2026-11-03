import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:43121",
    launchOptions: { executablePath: "/opt/google/chrome/chrome" },
  },
  webServer: {
    command: "npx --yes serve out -l 43121",
    url: "http://127.0.0.1:43121",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
