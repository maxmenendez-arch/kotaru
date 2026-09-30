import { randomUUID } from 'node:crypto';
import { MemoryStore } from '@kotaru/memory';
import {
  AccountRepository,
  PasskeyRepository,
  ConversationRepository,
  deleteAccount,
  exportAccount,
  exportSubject,
  loadMigrations,
  MIGRATIONS_DIR,
  SqlMetricSink,
} from '@kotaru/persistence';
import { APPLE, GOOGLE, IdTokenVerifier } from './id-token.js';
import { ConfigError, loadConfig } from './config.js';
import { durableStores } from './durable.js';
import { pgClient } from './pg-client.js';
import { buildProviders } from './providers.js';
import { startGatewayServer } from './server.js';

/**
 * Proceso de produccion del gateway.
 *
 * Orden de arranque, y por que:
 * 1. Configuracion: si algo falta, falla aqui con la lista completa.
 * 2. Base de datos: conecta y comprueba que no haya migraciones pendientes. Arrancar con
 *    un esquema viejo produce errores raros a mitad de una conversacion; mejor no arrancar.
 * 3. Proveedores y servidor.
 * 4. Señales: SIGTERM/SIGINT cierran limpio (systemd manda SIGTERM al parar o reiniciar).
 *
 * Todo lo que se imprime es una linea JSON sin contenido de conversacion ni secretos.
 */
function log(event: string, fields: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ at: new Date().toISOString(), event, ...fields }));
}

let config;
try {
  config = loadConfig(process.env);
} catch (error) {
  if (error instanceof ConfigError) {
    console.error(error.message);
    process.exit(2);
  }
  throw error;
}

const sql = pgClient({ connectionString: config.databaseUrl, max: 10 });

const pending = await pendingMigrations();
if (pending.length > 0) {
  log('startup_refused', { reason: 'pending_migrations', pending });
  await sql.close();
  process.exit(3);
}

const now = () => Date.now();
const stores = durableStores(sql, { defaultRetentionDays: config.messageRetentionDays });
const memory = new MemoryStore({ now, newId: randomUUID, repository: stores.memories });
const conversations = new ConversationRepository(sql, { defaultRetentionDays: config.messageRetentionDays });
const sink = new SqlMetricSink(sql);
const providers = buildProviders(config.providers, config.providerSettings, now);

const server = await startGatewayServer({
  port: config.port,
  host: config.host,
  keys: config.grantKeys,
  audience: config.grantAudience,
  grantClaims: stores.grantClaims,
  deps: {
    router: providers.router,
    resolve: providers.resolve,
    moderation: providers.moderation,
    voiceUnavailable: providers.voiceUnavailable,
    voiceChoices: providers.voiceChoices,
    companionVoice: config.companionVoice,
    memory,
    usage: stores.usage,
    conversations: stores.conversations,
    safety: stores.safety,
    sink,
    budget: { hardCapUsd: config.monthlyHardCapUsd, freeCapUsd: Math.min(config.freeMonthlyCapUsd, config.monthlyHardCapUsd) },
    now,
    infraCostUsd: config.infraCostUsdPerTurn,
  },
  api: {
    keys: config.accessKeys,
    audience: config.apiAudience,
    memory,
    now,
    exportSubject: async (subjectId) => ({
      ...(await exportSubject(sql, subjectId, new Date().toISOString())),
      account: await exportAccount(sql, subjectId),
    }),
    retention: {
      get: (subjectId) => conversations.retentionDaysFor(subjectId),
      set: (subjectId, days) => conversations.setRetentionDays(subjectId, days, new Date().toISOString()),
    },
    intimacy: {
      get: (subjectId) => conversations.sensualFlirtingFor(subjectId),
      set: (subjectId, sensual) => conversations.setSensualFlirting(subjectId, sensual, new Date().toISOString()),
    },
    ready: async () => (await sql.query('select 1 as ok')).rows.length === 1,
    corsOrigins: config.corsOrigins,
    signupsPerDay: config.signupsPerDay,
    // La ruta sin parametros (sin ids) y el tipo de error: nada del usuario.
    onError: (route, error) =>
      log('api_error', {
        route: route.replace(/[0-9a-f-]{36}/gi, ':id'),
        error: error instanceof Error ? `${error.name}: ${error.message}`.slice(0, 300) : 'unknown',
      }),
    trustProxy: config.trustProxy,
    trustedProxies: config.trustedProxies,
    ...(config.auth
      ? {
          auth: {
            accounts: new AccountRepository(sql),
            verifiers: {
              ...(config.auth.appleClientIds.length ? { apple: new IdTokenVerifier({ ...APPLE, audiences: config.auth.appleClientIds }) } : {}),
              ...(config.auth.googleClientIds.length ? { google: new IdTokenVerifier({ ...GOOGLE, audiences: config.auth.googleClientIds }) } : {}),
            },
            emailHashKey: config.auth.emailHashKey,
            emailEncryptionKey: config.auth.emailEncryptionKey,
            accessKeys: config.accessKeys,
            apiAudience: config.apiAudience,
            grantKeys: config.grantKeys,
            grantAudience: config.grantAudience,
            monthlyHardCapUsd: config.monthlyHardCapUsd,
            deleteAccount: (accountId: string) => deleteAccount(sql, accountId),
            sensualFlirting: (subjectId: string) => conversations.sensualFlirtingFor(subjectId),
            now,
            ...(config.auth.passkeys
              ? {
                  passkeys: {
                    store: new PasskeyRepository(sql),
                    rpId: config.auth.passkeys.rpId,
                    rpName: 'Kotaru',
                    origins: config.auth.passkeys.origins,
                    onSecurityEvent: (event: string, fields: Record<string, unknown>) => log(event, fields),
                  },
                }
              : {}),
          },
        }
      : {}),
  },
});

log('started', { host: config.host, port: server.port, providers: providers.registered, login: config.auth ? { apple: config.auth.appleClientIds.length > 0, google: config.auth.googleClientIds.length > 0, passkeys: config.auth.passkeys?.rpId ?? false } : 'off' });
// Un proveedor registrado que el router nunca elegira merece un aviso claro al arrancar.
for (const blocked of providers.blocked) log('provider_blocked', blocked);

let stopping = false;
async function shutdown(signal: string): Promise<void> {
  if (stopping) return;
  stopping = true;
  log('stopping', { signal });
  // Si algo se cuelga, systemd no espera para siempre; nosotros tampoco.
  const guard = setTimeout(() => process.exit(1), 10_000);
  guard.unref();
  await server.close();
  await sink.flush();
  await sql.close();
  log('stopped', { metricsWritten: sink.written, metricFailures: sink.failures });
  process.exit(0);
}
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

async function pendingMigrations(): Promise<string[]> {
  const all = loadMigrations(MIGRATIONS_DIR).map((m) => m.id);
  try {
    const { rows } = await sql.query<{ id: string }>('select id from schema_migrations');
    const applied = new Set(rows.map((r) => r.id));
    return all.filter((id) => !applied.has(id));
  } catch {
    return all;
  }
}
