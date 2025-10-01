import { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS?: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

const parseAllowedOrigins = (env: Env): string[] => {
  const raw = env.ALLOWED_ORIGINS || '';
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
};

const buildCorsHeaders = (origin: string | null, env: Env) => {
  const allowed = parseAllowedOrigins(env);
  const allowOrigin = origin && (allowed.includes('*') || allowed.includes(origin)) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  } as Record<string, string>;
};

const json = (data: unknown, init: ResponseInit = {}, origin: string | null, env: Env) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    ...buildCorsHeaders(origin, env),
    ...(init.headers || {}),
  } as Record<string, string>;
  return new Response(JSON.stringify(data), { ...init, headers });
};

const noContent = (origin: string | null, env: Env) =>
  new Response(null, {
    status: 204,
    headers: buildCorsHeaders(origin, env),
  });

const badRequest = (message: string, origin: string | null, env: Env) =>
  json({ error: message }, { status: 400 }, origin, env);
const notFound = (origin: string | null, env: Env) =>
  json({ error: 'Not Found' }, { status: 404 }, origin, env);
const serverError = (message: string, origin: string | null, env: Env) =>
  json({ error: message }, { status: 500 }, origin, env);

const parseUrl = (request: Request) => new URL(request.url);
const getOrigin = (request: Request) => request.headers.get('Origin');

const readBody = async <T>(request: Request): Promise<T | null> => {
  try {
    const text = await request.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const method = request.method as HttpMethod;
    const url = parseUrl(request);
    const origin = getOrigin(request);

    // CORS preflight
    if (method === 'OPTIONS') {
      return noContent(origin, env);
    }

    // Health
    if (url.pathname === '/api/health' && method === 'GET') {
      return json({ ok: true }, { status: 200 }, origin, env);
    }

    /*
     * CRUD de tareas deshabilitado temporalmente
     *
     * // Tasks collection
     * if (url.pathname === '/api/tasks' && method === 'GET') { ... }
     * if (url.pathname === '/api/tasks' && method === 'POST') { ... }
     *
     * // Task by id
     * const taskIdMatch = url.pathname.match(/^\/api\/tasks\/(.+)$/);
     * if (taskIdMatch) {
     *   if (method === 'GET') { ... }
     *   if (method === 'PUT') { ... }
     *   if (method === 'DELETE') { ... }
     * }
     */

    // Users endpoints
    if (url.pathname === '/api/users' && method === 'POST') {
      type CreateUserBody = { id?: string };
      const body = await readBody<CreateUserBody>(request);
      if (!body || !body.id) {
        return badRequest('id is required', origin, env);
      }
      const userId = body.id.trim();
      const role = 'client';
      try {
        await env.DB.prepare(
          'INSERT INTO users (id, role, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, NULL)'
        )
          .bind(userId, role)
          .run()
          .catch(async () => {
            await env.DB.prepare(
              'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
            )
              .bind(role, userId)
              .run();
          });
        const user = await env.DB.prepare(
          'SELECT id, role, created_at, updated_at FROM users WHERE id = ?'
        )
          .bind(userId)
          .first();
        return json({ data: user }, { status: 201 }, origin, env);
      } catch {
        return serverError('DB error upserting user', origin, env);
      }
    }

    const userIdMatch = url.pathname.match(/^\/api\/users\/(.+)$/);
    if (userIdMatch && method === 'GET') {
      const userId = userIdMatch[1];
      try {
        const user = await env.DB.prepare(
          'SELECT id, role, created_at, updated_at FROM users WHERE id = ?'
        )
          .bind(userId)
          .first();
        if (!user) return notFound(origin, env);
        return json({ data: user }, { status: 200 }, origin, env);
      } catch {
        return serverError('DB error fetching user', origin, env);
      }
    }

    if (url.pathname === '/api/users' && method === 'GET') {
      const limit = Math.max(0, Math.min(Number(url.searchParams.get('limit') ?? 20), 100));
      const offset = Math.max(0, Number(url.searchParams.get('offset') ?? 0));
      try {
        const { results } = await env.DB.prepare(
          'SELECT id, role, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
        )
          .bind(limit, offset)
          .all();
        const totalRow = (await env.DB.prepare('SELECT COUNT(*) as count FROM users').first()) as {
          count: number;
        } | null;
        const total = totalRow?.count ?? 0;
        return json({ data: results, total }, { status: 200 }, origin, env);
      } catch {
        return serverError('DB error fetching users', origin, env);
      }
    }

    return notFound(origin, env);
  },
};

export default worker;
