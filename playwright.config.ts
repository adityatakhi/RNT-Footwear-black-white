import { defineConfig, devices } from "@playwright/test";
const port = Number(process.env.PORT ?? 3000);
const baseURL = `http://localhost:${port}`;

export default defineConfig({ testDir: "./tests/e2e", fullyParallel: true, reporter: "list", use: { baseURL, trace: "retain-on-failure" }, projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }], webServer: { command: `npm run dev -- --port ${port}`, url: baseURL, reuseExistingServer: !process.env.CI, timeout: 120_000 } });
