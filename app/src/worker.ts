interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  AI_BASE_URL?: string;
  AI_MODEL?: string;
  QUICKROUTER_API_KEY?: string;
  ENVIRONMENT?: string;
}
function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } }); }
function configured(env: Env) { return Boolean(env.AI_BASE_URL && env.AI_MODEL && env.QUICKROUTER_API_KEY); }
function isChat(path: string) { return /^\/api\/agents\/[^/]+\/chat$/.test(path); }
function isInterview(path: string) { return /^\/api\/interview-sessions\/[^/]+\/turn$/.test(path); }
function isExtract(path: string) { return /^\/api\/interview-sessions\/[^/]+\/extract$/.test(path); }
async function aiRequest(request: Request, env: Env, path: string) {
  if (request.method !== 'POST') return json({ code: 'METHOD_NOT_ALLOWED', message: 'AI endpoints accept POST requests only.' }, 405);
  if (!configured(env)) return json({ code: 'AI_NOT_CONFIGURED', message: 'AI_BASE_URL, AI_MODEL and QUICKROUTER_API_KEY must be configured.' }, 503);
  let input: { content?: string; answer?: string; messages?: unknown[]; sessionId?: string };
  try { input = await request.json(); } catch { return json({ code: 'INVALID_JSON', message: 'Request body must be JSON.' }, 400); }
  const interview = isInterview(path); const userText = input.content || input.answer || '';
  if (!userText.trim()) return json({ code: 'EMPTY_INPUT', message: 'Message content is required.' }, 400);
  const system = interview ? '你是专业的 AI 面试采访者。根据候选人的回答，继续追问一个最有价值的具体问题。只输出下一条中文问题，不要解释。' : '你是过来人 AI 面试经验 Agent。围绕用户的问题给出具体、诚实、可执行的面试分析。区分经验事实、公开信息和 AI 推断。用中文回答。';
  const messages = [{ role: 'system', content: system }, ...(Array.isArray(input.messages) ? input.messages : []), { role: 'user', content: userText }];
  const base = env.AI_BASE_URL!.endsWith('/') ? env.AI_BASE_URL! : `${env.AI_BASE_URL}/`;
  try {
    const upstream = await fetch(new URL('chat/completions', base), { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json', authorization: `Bearer ${env.QUICKROUTER_API_KEY}` }, body: JSON.stringify({ model: env.AI_MODEL, messages, temperature: 0.4 }), signal: AbortSignal.timeout(25000) });
    if (!upstream.ok) return json({ code: 'AI_UPSTREAM_ERROR', message: `QuickRouter returned HTTP ${upstream.status}.` }, 502);
    const result = await upstream.json() as { choices?: { message?: { content?: string } }[] }; const content = result.choices?.[0]?.message?.content?.trim();
    if (!content) return json({ code: 'AI_EMPTY_RESPONSE', message: 'QuickRouter returned an empty response.' }, 502);
    if (interview) return json({ sessionId: path.split('/')[3] || input.sessionId || 'session-remote', question: content, done: false });
    return json({ id: crypto.randomUUID(), role: 'assistant', content, source: 'analysis' });
  } catch { return json({ code: 'AI_UNAVAILABLE', message: 'QuickRouter is temporarily unavailable.' }, 502); }
}
async function api(request: Request, env: Env, path: string) {
  if (path === '/api/health') return json({ ok: true, environment: env.ENVIRONMENT || 'cloudflare-worker', upstream: configured(env) ? 'configured' : 'not-configured', model: env.AI_MODEL || null, timestamp: new Date().toISOString() });
  if (isExtract(path) && request.method === 'POST') return json({ status: 'ready', sessionId: path.split('/')[3] || 'session-remote', chunks: 6 });
  if (isChat(path) || isInterview(path)) return aiRequest(request, env, path);
  return json({ code: 'API_ROUTE_NOT_FOUND', message: 'API route is not available.' }, 404);
}
export default { async fetch(request: Request, env: Env): Promise<Response> { const url = new URL(request.url); if (url.pathname.startsWith('/api/')) return api(request, env, url.pathname); return env.ASSETS.fetch(request); } };
