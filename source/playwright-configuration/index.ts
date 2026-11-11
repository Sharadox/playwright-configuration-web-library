import { devices, type PlaywrightTestConfig } from "@playwright/test";
import type {
  PlaywrightOptions,
  StorageState,
} from "@sharadox/playwright-configuration-web-library/playwright-configuration/type";

/**
 * The Playwright configuration of a Next.js application: `?(*-)end-to-end-test.ts` files in `src/`, a 1440×900
 * desktop and a Pixel 7 phone, screenshots kept in `snapshot/<project>/` beside each test with animations off and
 * reduced motion, and the built app started with `next start`.
 *
 * @example
 * // playwright.config.ts
 * import { definePlaywrightConfiguration } from "@sharadox/playwright-configuration-web-library/playwright-configuration";
 * export default definePlaywrightConfiguration({ localStorage: { consent: JSON.stringify(answer) } });
 */
export function definePlaywrightConfiguration({
  port = Number(process.env.PORT ?? 3210),
  testDirectory = "src",
  serverCommand,
  localStorage,
  continuousIntegration = !!process.env.CI,
}: PlaywrightOptions = {}): PlaywrightTestConfig {
  const baseURL = `http://localhost:${port}`;
  const storageState: StorageState | undefined = localStorage && {
    cookies: [],
    origins: [
      { origin: baseURL, localStorage: Object.entries(localStorage).map(([name, value]) => ({ name, value })) },
    ],
  };
  return {
    testDir: testDirectory,
    timeout: 120_000,
    testMatch: "**/?(*-)end-to-end-test.ts",
    snapshotPathTemplate: "{testDir}/{testFileDir}/snapshot/{projectName}/{arg}{ext}",
    fullyParallel: true,
    forbidOnly: continuousIntegration,
    retries: continuousIntegration ? 1 : 0,
    reporter: continuousIntegration ? "github" : "list",
    expect: { toHaveScreenshot: { animations: "disabled", maxDiffPixelRatio: 0.001 } },
    use: { baseURL, reducedMotion: "reduce", trace: "retain-on-failure", ...(storageState ? { storageState } : {}) },
    projects: [
      { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
      { name: "phone", use: { ...devices["Pixel 7"] } },
    ],
    webServer: {
      command: serverCommand ?? `pnpm exec next start -p ${port}`,
      port,
      reuseExistingServer: !continuousIntegration,
    },
  };
}
