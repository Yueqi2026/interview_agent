# 过来人 AI · v0.4 API-ready

v0.4 upgrades the v0.3 prototype into a deployment-oriented React/TypeScript application with a refreshed blue-violet UI, richer motion, a redesigned login experience, and a Cloudflare Pages Functions API gateway.

## What is new

- Fresh blue / indigo / violet visual system with responsive layouts and lightweight motion.
- Redesigned authentication page and mock login flow.
- Loading skeletons, route transitions, hover feedback and chat typing states.
- Central API client with timeout, normalized errors and one retry for transient 5xx responses.
- `/api/health` and same-origin Cloudflare Pages Functions gateway.
- Mock / remote API switching without rewriting pages.
- Contributor interview extraction endpoint reserved for the project API.
- Security response headers and a clear secrets boundary.

## Run locally

```bash
cd app
npm install
npm run dev
```

The app defaults to mock mode. To exercise Pages Functions locally, copy `.dev.vars.example` to `.dev.vars`, configure the upstream API, set `VITE_API_MODE=remote`, then run:

```bash
npm run pages:dev
```

## Deploy to Cloudflare Workers

The `app/` project can deploy as a Worker with static assets. From `app/`, run `npm install`, then `npm run worker:deploy`. The root `wrangler.toml` configures the Worker entry point and serves the Vite `dist/` output through Workers Static Assets. For Git-connected builds, use `npm run build` as the build command and `npm run worker:deploy` as the deploy command, with `app` as the root directory.

Configure `PROJECT_API_BASE_URL` and `ENVIRONMENT` as Worker variables and `PROJECT_API_TOKEN` as an encrypted Worker Secret. `PROJECT_API_TOKEN` must never be exposed through a `VITE_*` variable.

## Important security boundary

Never put upstream API keys in `.env` variables prefixed with `VITE_`; Vite exposes them to browser code. Browser traffic should call `/api/*`, and the Pages Function should attach the upstream credential server-side.

## Demo

Open the root-level `demo.html` directly in a browser for a zero-dependency visual/product demo. The deployable source is under `app/`.

## v0.4.1 UI / interaction fix

This patch fixes the self-contained demo navigation: `创建 Agent`, `创建我的 Agent`, and `我的空间` now open real interactive views. The standalone demo also includes a contributor form, AI interview flow, and a privacy/knowledge dashboard so the main navigation no longer contains dead controls.

The homepage was redesigned around a product-first structure: clear search intent, real Agent previews, two-sided marketplace paths, a detailed explanation of the knowledge/consent model, and a future Interview Intelligence section. Three career/workplace photographs are loaded from Unsplash and are free-use images under the Unsplash License; a production release should download/optimize them into local assets or Cloudflare Images instead of relying on remote hotlinks.

Image references used in this prototype:
- Vitaly Gariev — professional working in office: https://unsplash.com/photos/g4alfdYk8hs
- Vitaly Gariev — professional at laptop: https://unsplash.com/photos/Mt1ul01a-00
- Gabre Cameron — career learning workspace: https://unsplash.com/photos/CAAFsWZT9cY
