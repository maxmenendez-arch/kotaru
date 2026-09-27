import { randomUUID } from 'node:crypto';
import { signAccessToken, signGrant } from '@kotaru/gateway';
import { loadConfig } from './config.js';

/**
 * Emite un grant de voz y un token de acceso para PROBAR el servidor mientras no exista
 * el servicio de autenticacion. Lee las mismas claves que el gateway.
 *
 *   npm run dev:token -- <subjectId-uuid> [conversationId-uuid]
 *
 * Imprime JSON. El grant dura 2 minutos y sirve una sola vez; el token de acceso, 15.
 */
const config = loadConfig(process.env);
const subjectId = process.argv[2] ?? randomUUID();
const conversationId = process.argv[3] ?? randomUUID();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuid.test(subjectId) || !uuid.test(conversationId)) {
  console.error('subjectId y conversationId deben ser uuid');
  process.exit(2);
}

const nowSeconds = Math.floor(Date.now() / 1000);
const grant = signGrant(
  {
    subjectId,
    conversationId,
    plan: 'close',
    region: 'us',
    locale: 'es-419',
    sensitivity: 'standard',
    quality: 'balanced',
    budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: config.monthlyHardCapUsd, hardCapUsd: config.monthlyHardCapUsd },
    maxSessionSeconds: 1800,
    aud: config.grantAudience,
  },
  config.grantKeys[0]!,
  { nowSeconds },
);
const accessToken = signAccessToken({ sub: subjectId, aud: config.apiAudience }, config.accessKeys[0]!, { nowSeconds });
console.log(JSON.stringify({ subjectId, conversationId, grant, accessToken }, null, 2));
