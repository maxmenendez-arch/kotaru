import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  ReplayGuard,
  WeakSigningKeyError,
  signGrant,
  verifyGrant,
  type SessionGrant,
  type SigningKey,
} from '../src/index.js';

const key: SigningKey = { kid: 'k1', secret: randomBytes(32) };
const NOW = 1_789_000_000;

const claims: Omit<SessionGrant, 'iat' | 'exp' | 'jti'> = {
  subjectId: 'subj_7f3a',
  conversationId: 'conv_01',
  plan: 'close',
  region: 'us',
  locale: 'es-419',
  sensitivity: 'standard',
  quality: 'balanced',
  budget: { sessionRemainingUsd: 0.5, monthlyRemainingUsd: 120, hardCapUsd: 1000 },
  maxSessionSeconds: 1800,
  aud: 'gateway-prod',
};

describe('grants de sesion', () => {
  it('firma y verifica de ida y vuelta', () => {
    const token = signGrant(claims, key, { nowSeconds: NOW });
    const result = verifyGrant(token, [key], { nowSeconds: NOW + 10, audience: 'gateway-prod' });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.grant.subjectId).toBe('subj_7f3a');
    expect(result.grant.exp).toBe(NOW + 120);
  });

  it('no lleva identidad de la persona', () => {
    const token = signGrant(claims, key, { nowSeconds: NOW });
    const decoded = Buffer.from(token.split('.')[1]!, 'base64url').toString('utf8');
    expect(decoded).not.toMatch(/@/);
    expect(decoded).not.toMatch(/email|name|phone/i);
  });

  it('rechaza una firma manipulada', () => {
    const token = signGrant(claims, key, { nowSeconds: NOW });
    const [header, body, signature] = token.split('.') as [string, string, string];
    const tampered = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionGrant;
    const forged = { ...tampered, budget: { ...tampered.budget, sessionRemainingUsd: 9999 } };
    const forgedBody = Buffer.from(JSON.stringify(forged), 'utf8').toString('base64url');

    const result = verifyGrant(`${header}.${forgedBody}.${signature}`, [key], {
      nowSeconds: NOW + 10,
      audience: 'gateway-prod',
    });
    expect(result).toEqual({ ok: false, reason: 'bad_signature' });
  });

  it('caduca pasado el TTL mas la tolerancia de reloj', () => {
    const token = signGrant(claims, key, { nowSeconds: NOW, ttlSeconds: 60 });
    expect(verifyGrant(token, [key], { nowSeconds: NOW + 80, audience: 'gateway-prod' }).ok).toBe(true);
    expect(verifyGrant(token, [key], { nowSeconds: NOW + 200, audience: 'gateway-prod' })).toEqual({
      ok: false,
      reason: 'expired',
    });
  });

  it('un grant de staging no abre produccion', () => {
    const token = signGrant({ ...claims, aud: 'gateway-staging' }, key, { nowSeconds: NOW });
    expect(verifyGrant(token, [key], { nowSeconds: NOW, audience: 'gateway-prod' })).toEqual({
      ok: false,
      reason: 'wrong_audience',
    });
  });

  it('no se puede usar dos veces', () => {
    const guard = new ReplayGuard();
    const token = signGrant(claims, key, { nowSeconds: NOW });
    const options = { nowSeconds: NOW, audience: 'gateway-prod', replayGuard: guard };

    expect(verifyGrant(token, [key], options).ok).toBe(true);
    expect(verifyGrant(token, [key], options)).toEqual({ ok: false, reason: 'replayed' });
  });

  it('soporta rotacion de claves sin invalidar los grants vivos', () => {
    const oldKey: SigningKey = { kid: 'k1', secret: randomBytes(32) };
    const newKey: SigningKey = { kid: 'k2', secret: randomBytes(32) };
    const token = signGrant(claims, oldKey, { nowSeconds: NOW });

    expect(verifyGrant(token, [newKey, oldKey], { nowSeconds: NOW, audience: 'gateway-prod' }).ok).toBe(true);
    expect(verifyGrant(token, [newKey], { nowSeconds: NOW, audience: 'gateway-prod' })).toEqual({
      ok: false,
      reason: 'bad_signature',
    });
  });

  it('rechaza una clave demasiado corta en vez de firmar igual', () => {
    expect(() => signGrant(claims, { kid: 'debil', secret: randomBytes(16) }, { nowSeconds: NOW }))
      .toThrow(WeakSigningKeyError);
  });

  it('rechaza un token que no tiene tres partes', () => {
    expect(verifyGrant('no-es-un-token', [key], { nowSeconds: NOW, audience: 'gateway-prod' })).toEqual({
      ok: false,
      reason: 'malformed',
    });
  });

  it('el guardia olvida los jti ya caducados', () => {
    const guard = new ReplayGuard();
    guard.claim('a', NOW - 10);
    guard.claim('b', NOW + 600);
    guard.prune(NOW);
    expect(guard.size).toBe(1);
  });
});
