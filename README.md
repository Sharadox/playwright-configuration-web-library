# @sharadox/playwright-configuration-web-library

Shared [Playwright](https://playwright.dev) configuration for Sharadox Next.js applications.

- **Test files:** `?(*-)end-to-end-test.ts` in `src/`, run on a 1440×900 desktop Chrome and a Pixel 7 phone.
- **Screenshots:** kept in `snapshot/<project>/` beside each test, with animations disabled, reduced motion and a 0.1% pixel tolerance.
- **App server:** the built app starts with `next start` on port 3210 (or `PORT`); a running server is reused locally.
- **In continuous integration:** retries once, forbids `.only` and reports in GitHub's format.
- **Starting storage (optional):** local storage every test starts with, for example a cookie-consent answer so banners stay out of the way.

## Install

```sh
pnpm add -D @playwright/test @sharadox/playwright-configuration-web-library
```

## Use

```ts
// playwright.config.ts
import { definePlaywrightConfiguration } from "@sharadox/playwright-configuration-web-library/playwright-configuration";

export default definePlaywrightConfiguration({
  localStorage: { consent: JSON.stringify({ version: 1, granted: { required: true }, date: "2026-01-01T00:00:00Z" }) },
});
```

## API

`definePlaywrightConfiguration(options?)` from `…/playwright-configuration` returns a `PlaywrightTestConfig`.

| Option                  | Default                          | Meaning                                         |
| ----------------------- | -------------------------------- | ----------------------------------------------- |
| `port`                  | `PORT` or `3210`                 | Where the app under test listens                |
| `testDirectory`         | `"src"`                          | Folder with the tests                           |
| `serverCommand`         | `pnpm exec next start -p <port>` | How to serve the built app                      |
| `localStorage`          | none                             | Entries every test starts with (`name → value`) |
| `continuousIntegration` | `!!process.env.CI`               | Retries, `forbidOnly`, GitHub reporter          |

A test that needs a fresh browser opens its own context: `browser.newContext({ storageState: { cookies: [], origins: [] } })`.

## Develop

`pnpm verify` runs formatting, lint, type-check, tests with 100% coverage and the build. Branches follow `<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## Licence

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the [English translation](LICENSE.md).
