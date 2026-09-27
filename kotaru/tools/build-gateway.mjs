#!/usr/bin/env node
/**
 * Empaqueta el gateway para produccion: un archivo .mjs por punto de entrada, con todo el
 * codigo de @kotaru/* dentro. Las dependencias de terceros (pg, ws) quedan fuera y se
 * instalan en el servidor con `npm install --omit=dev`.
 *
 * Resultado en dist/gateway/:
 *   bin/gateway.mjs   el servidor
 *   bin/migrate.mjs   aplica migraciones
 *   bin/retention.mjs trabajo de retencion
 *   bin/token.mjs     emite grant y token de acceso de prueba
 *   bin/smoke.mjs     prueba de humo contra el gateway en marcha
 *   migrations/       los .sql (bin/ los busca en ../migrations)
 *   package.json      solo las dependencias de terceros (pg, ws, SDK de Polly)
 */
import { build } from 'esbuild';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const out = 'dist/gateway';
rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/bin`, { recursive: true });

// Fuera del paquete: se instalan en el servidor. El SDK de AWS es CommonJS con require()
// dinamicos que un .mjs empaquetado no puede resolver.
const external = ['pg', 'ws', 'pg-native', '@aws-sdk/client-polly'];
await build({
  entryPoints: {
    gateway: 'apps/gateway/src/main.ts',
    migrate: 'apps/gateway/src/migrate-cli.ts',
    retention: 'apps/gateway/src/retention-cli.ts',
    token: 'apps/gateway/src/token-cli.ts',
    smoke: 'apps/gateway/src/smoke-cli.ts',
  },
  outdir: `${out}/bin`,
  outExtension: { '.js': '.mjs' },
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  external,
  sourcemap: true,
  legalComments: 'none',
  logLevel: 'warning',
});

cpSync('packages/persistence/migrations', `${out}/migrations`, { recursive: true });

const app = JSON.parse(readFileSync('apps/gateway/package.json', 'utf8'));
const polly = JSON.parse(readFileSync('packages/ai-adapters-polly/package.json', 'utf8'));
const pick = (name) => app.dependencies[name] ?? polly.dependencies[name];
writeFileSync(
  `${out}/package.json`,
  JSON.stringify(
    {
      name: 'kotaru-gateway-release',
      private: true,
      type: 'module',
      engines: { node: '>=22' },
      dependencies: { pg: pick('pg'), ws: pick('ws'), '@aws-sdk/client-polly': pick('@aws-sdk/client-polly') },
    },
    null,
    2,
  ) + '\n',
);
console.log(`listo: ${out}`);
