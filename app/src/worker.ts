interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  PROJECT_API_BASE_URL?: string;
  PROJECT_API_TOKEN?: string;
  ENVIRONMENT?: string;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

async function api(request: Request, env: Env, path: string) {
  if (path === '/api/health') {
    return json({
      ok: true,
      environment: env.ENVIRONMENT || 'cloudflare-worker',
      upstream: env.PROJECT_API_BASE_URL ? 'configured' : 'not-configured',
      timestamp: new Date().toISOString()
    });
  }
  if (!env.PROJECT_API_BASE_URL) {
    return json({ code: 'UPSTREAM_NOT_CONFIGURED', message: 'PROJECT_API_BASE_URL is not configured.' }, 503);
  }
  const incoming = new URL(request.url);
  const base = env.PROJECT_API_BASE_URL.endsWith('/') ? env.PROJECT_API_BASE_URL : `${env.PROJECT_API_BASE_URL}/`;
  const target = new URL(`api/${path.slice('/api/'.length)}${incoming.search}`, base);
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('cookie');
  headers.set('accept', 'application/json');
  headers.set('x-forwarded-client', 'guolairen-web-v0.4');
  if (env.PROJECT_API_TOKEN) headers.set('authorization', `Bearer ${env.PROJECT_API_TOKEN}`);
  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow'
    });
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.set('cache-control', 'no-store');
    responseHeaders.set('x-content-type-options', 'nosniff');
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return json({ code: 'UPSTREAM_UNAVAILABLE', message: 'Upstream API is unavailable.' }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return api(request, env, url.pathname);
    const response = await env.ASSETS.fetch(request);
    return new Response(response.body, { status: response.status, headers: response.headers });
  }
};
