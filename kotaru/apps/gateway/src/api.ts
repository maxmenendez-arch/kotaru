import type { IncomingMessage, ServerResponse } from 'node:http';
import { verifyAccessToken, type SigningKey } from '@kotaru/gateway';
import type { Memory, MemoryStore } from '@kotaru/memory';
import { AuthHttpError, deleteOwnAccount, handleLogin, issueGrant, type AuthDeps } from './auth.js';

/**
 * API HTTP del centro de memoria, la exportacion y los ajustes de retencion.
 *
 * Reglas que valen para todas las rutas:
 * - Autenticacion con token de acceso (Bearer). El usuario es el `sub` del token; nunca
 *   un parametro de la URL o del cuerpo. Asi no hay forma de pedir datos de otro.
 * - Un recuerdo ajeno responde 404, no 403: no se confirma que exista.
 * - Cuerpos de 16 KB como maximo, JSON estricto, y limite de peticiones por usuario.
 * - Nunca se registra contenido. Las respuestas de error no repiten lo que se envio.
 */
export interface ApiDeps {
  /**
   * Registro de errores internos (500): solo el tipo y el mensaje del error, nunca el
   * cuerpo de la peticion. Sin el, un 500 no deja rastro.
   */
  readonly onError?: (route: string, error: unknown) => void;
  /** Cupo diario de cuentas nuevas (passkey) para todo el servidor. */
  readonly signupsPerDay?: number;
  readonly keys: readonly SigningKey[];
  readonly audience: string;
  readonly memory: MemoryStore;
  readonly now: () => number;
  /** Exportacion completa de los datos del usuario. Sin ella, /v1/export responde 501. */
  readonly exportSubject?: (subjectId: string) => Promise<unknown>;
  readonly retention?: {
    get(subjectId: string): Promise<number>;
    set(subjectId: string, days: number | null): Promise<void>;
  };
  /** Comprobacion de la base para /readyz. */
  readonly ready?: () => Promise<boolean>;
  readonly rateLimit?: { readonly capacity: number; readonly refillPerSecond: number };
  /**
   * Origenes web permitidos (CORS). Vacio por defecto: la app nativa no lo necesita, y
   * abrir la API a cualquier origen permitiria a una web ajena usar el token de otro.
   */
  readonly corsOrigins?: readonly string[];
  /** Cuentas: login con Apple/Google, renovacion, grants de voz, borrado. */
  readonly auth?: AuthDeps;
  /**
   * Detras de un proxy propio (Caddy), todas las peticiones llegan desde 127.0.0.1: el
   * limite por IP seria uno solo para todo el mundo. Con esto se usa X-Forwarded-For.
   * Solo activarlo si el proxy existe: si no, cualquiera inventa su IP.
   */
  readonly trustProxy?: boolean;
  /**
   * IPs del proxy (p. ej. la del contenedor de Caddy). Si hay lista, X-Forwarded-For solo se
   * cree cuando la conexion viene de una de ellas: otro programa del mismo servidor que
   * hable directamente con el gateway no puede inventarse la IP para saltarse los limites.
   */
  readonly trustedProxies?: readonly string[];
}

const MAX_BODY_BYTES = 16 * 1024;
const MAX_MEMORY_TEXT = 500;

class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
  }
}

/**
 * Devuelve un manejador de peticiones HTTP. Responde true si la ruta era suya; false para
 * que el servidor siga con otra cosa (o responda 404).
 */
export function createApiHandler(deps: ApiDeps): (req: IncomingMessage, res: ServerResponse) => Promise<boolean> {
  const limiter = new TokenBuckets(deps.rateLimit ?? { capacity: 60, refillPerSecond: 1 }, deps.now);
  // Aparte del limite por usuario: un aluvion de logins no puede vaciar los cubos de nadie.
  const loginLimiter = new TokenBuckets({ capacity: 20, refillPerSecond: 0.2 }, deps.now);
  // Crear cuentas es mas barato que entrar en una: cada cuenta nueva trae minutos de voz
  // gratis que pagamos. Por IP, 3 seguidas y luego 1 cada 20 minutos; y en total, un cupo
  // diario para todo el servidor (30 por defecto), para que ni muchas IPs juntas puedan
  // agotar el tope de gasto mensual con cuentas de usar y tirar.
  const signupsPerDay = deps.signupsPerDay ?? 30;
  const signupPerIp = new TokenBuckets({ capacity: 3, refillPerSecond: 1 / 1200 }, deps.now);
  const signupGlobal = new TokenBuckets({ capacity: signupsPerDay, refillPerSecond: signupsPerDay / 86_400 }, deps.now);

  const cors = new Set(deps.corsOrigins ?? []);

  return async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://internal');
    const path = url.pathname;
    const method = req.method ?? 'GET';

    const origin = req.headers.origin;
    if (origin && cors.has(origin)) {
      res.setHeader('access-control-allow-origin', origin);
      res.setHeader('vary', 'origin');
      if (method === 'OPTIONS') {
        res.writeHead(204, {
          'access-control-allow-methods': 'GET, POST, PATCH, PUT, DELETE',
          'access-control-allow-headers': 'authorization, content-type',
          'access-control-max-age': '600',
        });
        res.end();
        return true;
      }
    }

    if (path === '/healthz' && method === 'GET') {
      send(res, 200, { ok: true });
      return true;
    }
    if (path === '/readyz' && method === 'GET') {
      const ready = deps.ready ? await deps.ready().catch(() => false) : true;
      send(res, ready ? 200 : 503, { ok: ready });
      return true;
    }
    if (!path.startsWith('/v1/')) return false;

    // Login y renovacion: sin token (es lo que se viene a buscar), pero con limite por IP.
    if (path.startsWith('/v1/auth/')) {
      try {
        if (!deps.auth) throw new HttpError(501, 'not_available');
        if (method !== 'POST') throw new HttpError(405, 'method_not_allowed');
        const ip = clientIp(req, deps.trustProxy === true, deps.trustedProxies);
        if (!loginLimiter.take(ip)) throw new HttpError(429, 'rate_limited');
        if (path === '/v1/auth/passkey/register/options' && (!signupPerIp.take(ip) || !signupGlobal.take('all'))) {
          throw new HttpError(429, 'signup_rate_limited');
        }
        send(res, 200, await handleLogin(path, await readJson(req), deps.auth));
      } catch (error) {
        if (error instanceof HttpError || error instanceof AuthHttpError) send(res, error.status, { error: error.code });
        else {
          deps.onError?.(path, error);
          send(res, 500, { error: 'internal' });
        }
      }
      return true;
    }

    try {
      const subjectId = authenticate(req, deps);
      if (!limiter.take(subjectId)) throw new HttpError(429, 'rate_limited');
      await route(method, path, url, req, res, subjectId, deps);
    } catch (error) {
      if (error instanceof HttpError || error instanceof AuthHttpError) send(res, error.status, { error: error.code });
      else {
        deps.onError?.(path, error);
        send(res, 500, { error: 'internal' });
      }
    }
    return true;
  };
}

async function route(
  method: string,
  path: string,
  url: URL,
  req: IncomingMessage,
  res: ServerResponse,
  subjectId: string,
  deps: ApiDeps,
): Promise<void> {
  if (path === '/v1/memories') {
    if (method !== 'GET') throw new HttpError(405, 'method_not_allowed');
    const companion = url.searchParams.get('companion');
    const all = await deps.memory.list(subjectId);
    const memories = companion ? all.filter((m) => m.companionId === companion) : all;
    send(res, 200, {
      memories: memories.map(present),
      approvedCount: all.filter((m) => m.status === 'approved').length,
      atCapacity: await deps.memory.isAtCapacity(subjectId),
    });
    return;
  }

  const match = /^\/v1\/memories\/([0-9a-f-]{36})(?:\/(approve|reject))?$/i.exec(path);
  if (match) {
    const [, id, action] = match as unknown as [string, string, string | undefined];
    const memory = await deps.memory.get(id);
    // Ajeno o inexistente: la misma respuesta.
    if (!memory || memory.subjectId !== subjectId) throw new HttpError(404, 'not_found');

    if (action === 'approve') {
      if (method !== 'POST') throw new HttpError(405, 'method_not_allowed');
      const result = await deps.memory.approve(id);
      if (!result.ok) throw new HttpError(result.reason === 'not_found' ? 404 : 409, result.reason);
      send(res, 200, { memory: present(result.memory) });
      return;
    }
    if (action === 'reject') {
      if (method !== 'POST') throw new HttpError(405, 'method_not_allowed');
      const rejected = await deps.memory.reject(id);
      if (!rejected) throw new HttpError(404, 'not_found');
      send(res, 200, { memory: present(rejected) });
      return;
    }

    if (method === 'DELETE') {
      await deps.memory.forget(id);
      res.writeHead(204).end();
      return;
    }
    if (method === 'PATCH') {
      const body = await readJson(req);
      if (typeof body !== 'object' || body === null || Array.isArray(body)) throw new HttpError(400, 'invalid_body');
      const { text, pinned, ...rest } = body as Record<string, unknown>;
      if (Object.keys(rest).length > 0) throw new HttpError(400, 'unknown_field');
      if (text === undefined && pinned === undefined) throw new HttpError(400, 'nothing_to_change');

      let current: Memory = memory;
      if (text !== undefined) {
        if (typeof text !== 'string' || text.trim().length === 0 || text.length > MAX_MEMORY_TEXT) {
          throw new HttpError(400, 'invalid_text');
        }
        const edited = await deps.memory.edit(id, text);
        if (!edited.ok) throw new HttpError(edited.reason === 'not_found' ? 404 : 422, edited.reason);
        current = edited.memory;
      }
      if (pinned !== undefined) {
        if (typeof pinned !== 'boolean') throw new HttpError(400, 'invalid_pinned');
        const updated = await deps.memory.setPinned(id, pinned);
        if (!updated) throw new HttpError(404, 'not_found');
        current = updated;
      }
      send(res, 200, { memory: present(current) });
      return;
    }
    throw new HttpError(405, 'method_not_allowed');
  }

  if (path === '/v1/session/grant') {
    if (!deps.auth) throw new HttpError(501, 'not_available');
    if (method !== 'POST') throw new HttpError(405, 'method_not_allowed');
    const body = req.headers['content-length'] === '0' || !req.headers['content-type'] ? {} : await readJson(req);
    send(res, 200, await issueGrant(subjectId, body, deps.auth));
    return;
  }

  if (path === '/v1/account') {
    if (!deps.auth) throw new HttpError(501, 'not_available');
    if (method !== 'DELETE') throw new HttpError(405, 'method_not_allowed');
    await deleteOwnAccount(subjectId, deps.auth);
    res.writeHead(204).end();
    return;
  }

  if (path === '/v1/export') {
    if (method !== 'GET') throw new HttpError(405, 'method_not_allowed');
    if (!deps.exportSubject) throw new HttpError(501, 'not_available');
    const data = await deps.exportSubject(subjectId);
    res.setHeader('content-disposition', 'attachment; filename="kotaru-export.json"');
    send(res, 200, data);
    return;
  }

  if (path === '/v1/settings/retention') {
    if (!deps.retention) throw new HttpError(501, 'not_available');
    if (method === 'GET') {
      send(res, 200, { messageRetentionDays: await deps.retention.get(subjectId) });
      return;
    }
    if (method === 'PUT') {
      const body = await readJson(req);
      const days = (body as { days?: unknown } | null)?.days;
      if (!(days === null || (typeof days === 'number' && Number.isInteger(days) && days >= 1 && days <= 3650))) {
        throw new HttpError(400, 'invalid_days');
      }
      await deps.retention.set(subjectId, days);
      send(res, 200, { messageRetentionDays: await deps.retention.get(subjectId) });
      return;
    }
    throw new HttpError(405, 'method_not_allowed');
  }

  throw new HttpError(404, 'not_found');
}

/**
 * IP del cliente para el limite de logins. Con proxy de confianza se toma la ULTIMA entrada
 * de X-Forwarded-For (la que anadio nuestro proxy): las anteriores las escribe el cliente y
 * se pueden inventar. Las IPv6 se agrupan por /64, que es lo que suele tener un solo hogar.
 */
export function clientIp(
  req: Pick<IncomingMessage, 'headers'> & { socket: { remoteAddress?: string | undefined } },
  trustProxy: boolean,
  trustedProxies: readonly string[] = [],
): string {
  let ip = req.socket.remoteAddress ?? '?';
  const peer = ip.startsWith('::ffff:') && ip.includes('.') ? ip.slice(7) : ip;
  if (trustProxy && (trustedProxies.length === 0 || trustedProxies.includes(peer))) {
    const header = req.headers['x-forwarded-for'];
    const last = (Array.isArray(header) ? header.join(',') : header)?.split(',').at(-1)?.trim();
    if (last) ip = last;
  }
  if (ip.startsWith('::ffff:') && ip.includes('.')) return ip.slice(7);
  if (ip.includes(':')) return ipv6Prefix64(ip);
  return ip;
}

/**
 * Los primeros 64 bits de una IPv6, con la direccion expandida: `2001:db8::5:1:2:3` y
 * `2001:db8:0:0:6::1` comparten /64 aunque escritas no lo parezcan. Una red /64 suele ser
 * de una sola persona o casa, asi que cuenta como una sola IP para los limites.
 */
export function ipv6Prefix64(ip: string): string {
  const bare = ip.split('%')[0]!.toLowerCase();
  const [head = '', tail] = bare.split('::');
  const left = head ? head.split(':') : [];
  const right = tail !== undefined && tail !== '' ? tail.split(':') : [];
  // Una IPv4 incrustada al final ocupa dos grupos; para el /64 no importa.
  const groups = tail === undefined ? left : [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill('0'), ...right];
  const prefix = groups.slice(0, 4).map((g) => (Number.parseInt(g || '0', 16) || 0).toString(16));
  while (prefix.length < 4) prefix.push('0');
  return `${prefix.join(':')}::/64`;
}

function authenticate(req: IncomingMessage, deps: ApiDeps): string {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new HttpError(401, 'unauthenticated');
  const result = verifyAccessToken(header.slice(7), deps.keys, {
    nowSeconds: Math.floor(deps.now() / 1000),
    audience: deps.audience,
  });
  if (!result.ok) throw new HttpError(401, result.reason === 'expired' ? 'token_expired' : 'unauthenticated');
  return result.claims.sub;
}

/** Lo que ve la app. Sin subjectId: el usuario ya sabe quien es. */
function present(m: Memory) {
  return {
    id: m.id,
    companionId: m.companionId,
    kind: m.kind,
    text: m.text,
    status: m.status,
    pinned: m.pinned,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    useCount: m.useCount,
    ...(m.lastUsedAt !== undefined ? { lastUsedAt: m.lastUsedAt } : {}),
    ...(m.expiresAt !== undefined ? { expiresAt: m.expiresAt } : {}),
  };
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const type = req.headers['content-type'] ?? '';
  if (!type.toLowerCase().startsWith('application/json')) throw new HttpError(415, 'json_required');
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).byteLength;
    if (size > MAX_BODY_BYTES) throw new HttpError(413, 'body_too_large');
    chunks.push(chunk as Buffer);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpError(400, 'invalid_json');
  }
}

function send(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  res.end(payload);
}

/**
 * Limite de peticiones por usuario, en memoria. Con varias instancias el limite real es
 * N veces este; suficiente para frenar un cliente desbocado, no un ataque distribuido
 * (eso es trabajo del proxy de delante).
 */
class TokenBuckets {
  readonly #buckets = new Map<string, { tokens: number; at: number }>();

  constructor(
    private readonly config: { readonly capacity: number; readonly refillPerSecond: number },
    private readonly now: () => number,
  ) {}

  take(key: string): boolean {
    const now = this.now();
    const bucket = this.#buckets.get(key) ?? { tokens: this.config.capacity, at: now };
    const refilled = Math.min(
      this.config.capacity,
      bucket.tokens + ((now - bucket.at) / 1000) * this.config.refillPerSecond,
    );
    if (refilled < 1) {
      this.#buckets.set(key, { tokens: refilled, at: now });
      return false;
    }
    // Reinsertar mantiene el Map en orden de uso: los primeros son los mas viejos.
    this.#buckets.delete(key);
    this.#buckets.set(key, { tokens: refilled - 1, at: now });
    if (this.#buckets.size > 100_000) {
      // Se olvidan los menos recientes, no todos: vaciar el mapa entero regalaria un cubo
      // lleno a quien provocara el vaciado.
      let drop = 10_000;
      for (const old of this.#buckets.keys()) {
        if (drop-- === 0) break;
        this.#buckets.delete(old);
      }
    }
    return true;
  }
}
