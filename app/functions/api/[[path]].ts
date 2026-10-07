interface Env {
  PROJECT_API_BASE_URL?: string;
  PROJECT_API_TOKEN?: string;
  ENVIRONMENT?: string;
  ALLOWED_ORIGIN?: string;
}

type Ctx = {
  request: Request;
  env: Env;
  params: { path?: string | string[] };
};

function json(data: unknown, status = 200, headers: Record<string,string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
  });
}

export const onRequest = async ({ request, env, params }: Ctx) => {
  const tail = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  const incoming = new URL(request.url);

  if (tail === 'health') {
    return json({
      ok: true,
      environment: env.ENVIRONMENT || 'cloudflare-pages',
      upstream: env.PROJECT_API_BASE_URL ? 'configured' : 'not-configured',
      timestamp: new Date().toISOString()
    });
  }

  if (!env.PROJECT_API_BASE_URL) {
    return json({ code: 'UPSTREAM_NOT_CONFIGURED', message: 'PROJECT_API_BASE_URL is not configured.' }, 503);
  }

  const base = env.PROJECT_API_BASE_URL.endsWith('/') ? env.PROJECT_API_BASE_URL : `${env.PROJECT_API_BASE_URL}/`;
  const target = new URL(`api/${tail}${incoming.search}`, base);
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('cookie');
  headers.set('accept', 'application/json');
  headers.set('x-forwarded-client', 'guolairen-web-v0.4');
  if (env.PROJECT_API_TOKEN) headers.set('authorization', `Bearer ${env.PROJECT_API_TOKEN}`);

  try {
    const upstream = await fetch(target.toString(), {
      method: request.method,
      headers,
      body: ['GET','HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow'
    });
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.set('cache-control', 'no-store');
    responseHeaders.set('x-content-type-options', 'nosniff');
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    return json({ code: 'UPSTREAM_UNAVAILABLE', message: 'Upstream API is unavailable.' }, 502);
  }
};
