# Operations

## Current scope

Repository: `HyangDan2/EduHub`. Public URL: https://hyangdan2.github.io/EduHub/. Publishing branch: main. Pages source: GitHub Actions. Only EDPilot0001 is registered; initial examples have been deleted. User authorization includes commits, pushes, and deployment of both Hub and course integration.

Workflow: `.github/workflows/pages.yml`. PRs validate only; successful main builds upload only dist/ and deploy through the github-pages environment. Build jobs have read-only permissions; deployment receives pages/write and OIDC. Current Pages workflow requirements checked against official GitHub documentation on 2026-10-20.

## Local workflow

Use Node 24.19.0 and `npm ci`. Install Chromium with `npx playwright install chromium`; Linux CI may need `--with-deps` when introduced.

- `npm run dev`: validate/build once, then serve `dist/` at http://127.0.0.1:4174/EduHub/.
- `npm run build`: regenerate static output after edits; refresh the preview afterward.
- `npm run verify`: validation, deterministic tests, build, Chromium checks.
- `npm run check:links`: bounded external-link checks separate from local verification.
- `npm run test:e2e`: use the existing build on test-owned port 4175.
- `npm run verify:hosted`: hosted checks; requires `PUBLIC_URL`.

Do not run concurrent builds or multiple test runs owning port 4175. Stop the preview with Ctrl-C when no longer needed. The server binds only to loopback and serves only `dist/` beneath `/EduHub/`; it does not expose source notes or use an SPA fallback. It also serves the explicit sibling EDPilot0001 output/site bundle under /EDPilot0001/ for local round-trip acceptance.

`data/search.json` contains only published metadata and body text. Operational evidence, source paths, drafts, and archived records are omitted. Only branding assets are copied; per-entry assets are not supported yet. The build generates `release.json` with a public-content digest for later release matching.

## Troubleshooting

- Node errors: activate the pinned runtime; the system Node 16 on the initial host is insufficient.
- Stale pages: rebuild, then refresh. The preview intentionally has no file watcher.
- Missing records: check status, validation output, and active filters.
- Port in use: stop the prior owned server or choose `PORT` for preview; port 4175 is reserved for tests.
- Source access fails: record the failure; do not call the source verified.
- `verify:hosted` refuses to run: set PUBLIC_URL and build the matching release.

## Deployment and recovery

Build with `PUBLIC_URL=https://hyangdan2.github.io/EduHub/` so canonical URLs are generated. Run verify and check:links, inspect the diff, commit, and push main. Wait for the exact commit's Actions run. Run verify:hosted against the matching build, then inspect the actual Hub → course → Hub round trip. Do not call an artifact upload a completed deployment.

Rollback by reverting the faulty commit, pushing through the same workflow, and verifying the recovered public site. Do not modify generated output as a permanent fix or clear browser storage.

## Navigation update

EduHub owns the Web-HQ header link. Course returns target the Hub card. Local preview response rewriting is described in EDUHUB_INTEGRATION_GUIDE.md; dist files keep production URLs. Build the sibling course before running integration tests.
