# QuickRouter AI setup

The browser calls the Worker at `/api/*`; the Worker calls QuickRouter server-side. The key never reaches the browser.

Worker variables:

```text
AI_BASE_URL=https://api.quickrouter.ai/v1
AI_MODEL=gpt-5.6-sol
ENVIRONMENT=production
```

Worker Secret:

```text
QUICKROUTER_API_KEY=your QuickRouter key
```

Worker Builds variables:

```text
VITE_API_MODE=remote
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT_MS=30000
```

Redeploy after changing build variables.

Implemented routes:

- `POST /api/agents/:id/chat` calls QuickRouter and returns the website ChatMessage shape.
- `POST /api/interview-sessions/:id/turn` calls QuickRouter and returns the next InterviewTurn question.
- `GET /api/health` reports configuration status without exposing the key.

QuickRouter is called through its OpenAI-compatible `${AI_BASE_URL}/chat/completions` endpoint.
