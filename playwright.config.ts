import fs from "node:fs";

import { defineConfig } from "@playwright/test";

// Use the preinstalled Chromium when present (cloud sandboxes), else Playwright's own.
const pre = "/opt/pw-browsers/chromium";
const executablePath = fs.existsSync(pre) ? pre : undefined;
const PORT = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "off",
    launchOptions: executablePath
      ? { executablePath, args: ["--no-sandbox"] }
      : { args: ["--no-sandbox"] },
  },
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
