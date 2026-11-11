import { afterEach, describe, expect, test, vi } from "vitest";
import { definePlaywrightConfiguration } from "@sharadox/playwright-configuration-web-library/playwright-configuration";

afterEach(() => vi.unstubAllEnvs());

describe("definePlaywrightConfiguration", () => {
  test("tests the built app on a desktop and a phone", () => {
    vi.stubEnv("PORT", "");
    vi.stubEnv("CI", "");
    const configuration = definePlaywrightConfiguration({ port: 4000, continuousIntegration: false });
    expect(configuration).toMatchObject({
      testDir: "src",
      testMatch: "**/?(*-)end-to-end-test.ts",
      snapshotPathTemplate: "{testDir}/{testFileDir}/snapshot/{projectName}/{arg}{ext}",
      retries: 0,
      reporter: "list",
      forbidOnly: false,
      use: { baseURL: "http://localhost:4000", reducedMotion: "reduce" },
      webServer: { command: "pnpm exec next start -p 4000", port: 4000, reuseExistingServer: true },
    });
    expect(configuration.projects!.map((project) => project.name)).toEqual(["desktop", "phone"]);
    expect(configuration.projects![0]!.use!.viewport).toEqual({ width: 1440, height: 900 });
    expect(configuration.use).not.toHaveProperty("storageState");
  });

  test("starts every test with the given local storage", () => {
    const configuration = definePlaywrightConfiguration({ port: 4000, localStorage: { consent: "{}" } });
    expect(configuration.use!.storageState).toEqual({
      cookies: [],
      origins: [{ origin: "http://localhost:4000", localStorage: [{ name: "consent", value: "{}" }] }],
    });
  });

  test("reads the port and continuous integration from the environment", () => {
    vi.stubEnv("PORT", "5000");
    vi.stubEnv("CI", "true");
    const configuration = definePlaywrightConfiguration({ serverCommand: "pnpm start", testDirectory: "source" });
    expect(configuration).toMatchObject({
      testDir: "source",
      retries: 1,
      reporter: "github",
      forbidOnly: true,
      use: { baseURL: "http://localhost:5000" },
      webServer: { command: "pnpm start", port: 5000, reuseExistingServer: false },
    });
  });

  test("falls back to port 3210", () => {
    vi.stubEnv("PORT", undefined as unknown as string);
    delete process.env.PORT;
    expect(definePlaywrightConfiguration().use!.baseURL).toBe("http://localhost:3210");
  });
});
