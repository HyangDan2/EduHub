# HD2Lab EduHub

**Public site:** https://hyangdan2.github.io/EduHub/

A local-first static learning archive inspired by GameHub. Korean notes, full-text search, subject/type filters, and static detail pages.

**Local preview:** http://127.0.0.1:4174/EduHub/

EDPilot0001 is the only course in the catalog. All initial sample records and the validation draft have been removed. GitHub Actions verifies and deploys main to GitHub Pages.

## Setup

Use Node **24.19.0** (`.nvmrc`), then:

```sh
npm ci
npx playwright install chromium
npm run dev
```

If using nvm, run `nvm install` and `nvm use` first. This machine's default Node 16 is too old. The desktop bundled Node used during implementation is:

```sh
export PATH=/Users/jaehyukshim/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH
npm run dev
```

`dev` builds once and serves `dist/` on port 4174. After source edits, run `npm run build` in another terminal and refresh. There is no automatic watch/reload. Change the preview port with `PORT=4180 npm run dev` if needed. Browser tests use separate port 4175.

## Checks

```sh
npm run verify
npm run check:links
```

`verify` validates, runs unit tests, builds, and tests the production output in Chromium. `test:e2e` by itself uses the existing `dist/`; build first after source changes. `check:links` performs network checks separately.

`npm run verify:hosted` requires an explicitly configured `PUBLIC_URL` and a matching built release. It is reserved for a future authorized deployment.

## Add a record

Follow [EDUHUB_GUIDE.md](EDUHUB_GUIDE.md). Add metadata to `data/entries.json`, optionally write `content/notes/<id>.md`, and record provenance in `docs/onboarding/<id>.md`. Set `sample: true` only for demonstration content; omit it for real records. Do not invent `studiedAt`.

Set `status` to `published` to include a record in the local/public build. `draft` and `archived` records remain excluded. Markdown supports headings, fenced code, lists, and tables. Raw HTML is escaped. Links allow HTTPS destinations or local heading fragments; note images and local asset embeds are not supported in this version.

[Operations](docs/OPERATIONS.md) · [QA evidence](docs/QA.md) · [Change log](docs/CHANGELOG.md)

## Course integration

Navigation: EDPilot0001 ↔ EduHub → Web-HQ. EDPilot0001 is the sole course. Its “학습 시작” action opens the course; “자료 소개” opens the Hub detail.

Before testing the local course, build `../EDPilot0001` in its documented Python/Node environment. The Hub preview server mounts that `output/site` bundle at http://127.0.0.1:4174/EDPilot0001/ and adapts return links in local responses. Production artifacts retain the public HTTPS destinations.

See [Hub integration](EDUHUB_INTEGRATION_GUIDE.md) and [course return](EDUHUB_RETURN_GUIDE.md).
