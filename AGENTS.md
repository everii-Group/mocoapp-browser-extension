# AGENTS.md

MOCO browser extension (Chrome MV3 + Firefox WebExtension) built with webpack + Babel, React 19, SCSS. Package manager: **yarn 1 (classic)** — do not use npm or modify the lockfile with another tool. Dev env: direnv `.envrc` (nix flake), mise pins Node 25, `.nvmrc` says lts/iron.

## Commands

- `yarn start:chrome` / `yarn start:firefox` — watch-mode dev builds; output to `build/chrome` / `build/firefox`. `yarn start` = chrome.
- `yarn build` — full production build of both browsers + source zips.
- `yarn test` — Jest (roots: `test/` only; `test/jest.setup.js` mocks `global.chrome`). Single suite: `yarn test test/utils/TimeInputParser.test.js`.
- No lint script exists — run `npx eslint .` manually. Prettier is enforced as ESLint error (`prettier/prettier`), and **semicolons are banned** (`semi: never`); format new code with Prettier or CI-style review will fail.

## Gotchas

- `webpack.config` uses `dotenv` — `.env` is loaded at build time. Firefox **production** builds throw unless `APPLICATION_ID` is set (stable id, e.g. `APPLICATION_ID=my@company.com yarn build:firefox`).
- `USE_LOCAL_MOCO=true` in `.env` adds `http://*.mocoapp.localhost/*` host permission, but **only in development mode**.
- Version comes from `package.json`; bundle filenames and `manifest.json` are version-suffixed (`content.<version>.js`) via `[version]` replacement. Bump version in `package.json`, update `CHANGELOG.md`, then `yarn build` (README release flow).
- Manifests in `src/manifest.chrome.json` / `src/manifest.firefox.json` (NOTE: icon/background paths use literal `[version]` placeholder during copy; web_accessible_resources references `src/images/*`).

## Architecture

- Entry points: `src/js/background.js` (service worker, owns API client + timer logic), `src/js/content.js` (page bubble), `src/js/popup.js`, `src/js/options.js`.
- **Imports are root-relative to `src/js`** (`resolve.modules` includes it) — e.g. `import ApiClient from "api/Client"`, `import { isChrome } from "utils/browser"`. Do not use relative `../` imports for src code.
- Messaging between contexts uses `webext-bridge` (`sendMessage`/`onMessage`), not raw `chrome.runtime`.
- Browser API calls go through `webextension-polyfill` (`import browser from "webextension-polyfill"`); the `chrome` global is also used in some spots.
- Remote services (Trello, Jira, Notion, GitHub…) are configured declaratively in `src/js/remoteServices.js` (MOCO-maintained) and `src/js/remoteServicesCommunity.js` (community). Schema documented in README — URL patterns use `url-pattern` package syntax; `:host:` is replaced with the service host.
- REST client: `src/js/api/Client.js` talks to `https://<subdomain>.mocoapp.com/api/browser_extensions` with `x-api-key` header.
