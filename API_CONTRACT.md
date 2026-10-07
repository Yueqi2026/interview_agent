# v0.4 API Contract

The browser only talks to same-origin `/api/*`. Cloudflare Pages Functions forwards requests to the project API. Never expose the upstream token through `VITE_*` variables.

## Core endpoints

| Method | Browser endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Gateway / environment health |
| POST | `/api/auth/login` | Login or magic-link initiation |
| GET | `/api/agents?q=` | Search Agents |
| GET | `/api/agents/:id` | Agent profile |
| POST | `/api/agents/:id/chat` | RAG Agent chat |
| POST | `/api/contributor/experiences` | Create contributor experience draft |
| POST | `/api/interview-sessions/:id/turn` | AI interview turn |
| POST | `/api/interview-sessions/:id/extract` | Extract structured knowledge |

## Response principles

Errors should use JSON: `{ "code": "...", "message": "..." }` with appropriate HTTP status codes. Agent chat should return `source` as one of `experience`, `public`, `analysis`; future citations can be returned as `citations[]` with label, date and URL.

## Cloudflare secret contract

`PROJECT_API_BASE_URL` — upstream project API origin.

`PROJECT_API_TOKEN` — upstream bearer token; encrypted Cloudflare Secret.

`ENVIRONMENT` — `preview` / `production` / `development`.
