import type { PlaywrightTestConfig } from "@playwright/test";

/** A browser starting state: cookies and storage (Playwright's `storageState` object). */
export type StorageState = Exclude<NonNullable<PlaywrightTestConfig["use"]>["storageState"], string | undefined>;

export interface PlaywrightOptions {
  /** Port of the app under test; `PORT` from the environment wins. 3210 by default. */
  port?: number;
  /** Folder with the tests; `src` by default. */
  testDirectory?: string;
  /** Command that serves the built app on `port`; `pnpm exec next start -p <port>` by default. */
  serverCommand?: string;
  /** Local storage entries every test starts with, for example a cookie-consent answer. */
  localStorage?: Record<string, string>;
  /** Whether running in continuous integration (retries, no `.only`, GitHub reporter); `CI` by default. */
  continuousIntegration?: boolean;
}
