import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { NoViableRouteError, type ProviderContext } from '@kotaru/ai-contracts';
import { loadConfig } from '../src/config.js';
import { buildProviders } from '../src/providers.js';

const ctx: ProviderContext = {
  requestId: 'r', subjectId: 's', region: 'us', locale: 'es-419', sensitivity: 'standard',
  budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: 50, hardCapUsd: 50 }, deadlineMs: 5000,
  signal: new AbortController().signal,
};
const select = (set: ReturnType<typeof buildProviders>, capability: 'stt' | 'llm' | 'tts') =>
  set.router.select({ capability, quality: 'balanced', ctx, predicted: { audioSeconds: 10, inputTokens: 1000, outputTokens: 100, characters: 300 } });

const base = {
  DATABASE_URL: 'postgres://u:p@127.0.0.1/k',
  KOTARU_GRANT_KEYS: `g:${randomBytes(32).toString('base64')}`,
  KOTARU_ACCESS_KEYS: `a:${randomBytes(32).toString('base64')}`,
};
const real = {
  ...base,
  KOTARU_PROVIDERS: 'assemblyai,gemini,polly',
  ASSEMBLYAI_API_KEY: 'k1',
  GEMINI_API_KEY: 'k2',
  AWS_ACCESS_KEY_ID: 'AKIA_PRUEBA',
  AWS_SECRET_ACCESS_KEY: 'secreto',
};

describe('proveedores del gateway', () => {
  it('por defecto, solo simulados', () => {
    const config = loadConfig(base);
    const set = buildProviders(config.providers, config.providerSettings, Date.now);
    expect(set.registered).toEqual(['mock-stt', 'mock-llm', 'mock-tts']);
    expect(select(set, 'stt').providerId).toBe('mock-stt');
    // Todo simulado (desarrollo): la voz de prueba sigue disponible.
    expect(set.voiceUnavailable).toBe(false);
  });

  it('pedir reales exige sus claves, y Polly las credenciales de AWS', () => {
    expect(() => loadConfig({ ...base, KOTARU_PROVIDERS: 'assemblyai,gemini,polly' })).toThrow(
      /falta ASSEMBLYAI_API_KEY[\s\S]*falta GEMINI_API_KEY[\s\S]*polly necesita AWS_ACCESS_KEY_ID/,
    );
    expect(() => loadConfig({ ...base, KOTARU_PROVIDERS: 'openai' })).toThrow(/proveedor desconocido "openai"/);
  });

  it('sin las confirmaciones del operador, los reales se registran pero el router no los elige', () => {
    const config = loadConfig(real);
    const set = buildProviders(config.providers, config.providerSettings, Date.now);
    expect(set.registered).toEqual(['assemblyai-stt', 'gemini-3.1-flash-lite', 'polly-neural']);
    expect(set.blocked.map((b) => b.id)).toEqual(['assemblyai-stt', 'gemini-3.1-flash-lite', 'polly-neural']);
    for (const capability of ['stt', 'llm', 'tts'] as const) {
      expect(() => select(set, capability)).toThrow(NoViableRouteError);
    }
  });

  it('con las confirmaciones, el router elige los reales y no mezcla simulados', () => {
    const config = loadConfig({
      ...real,
      KOTARU_ASSEMBLYAI_ZERO_RETENTION_CONFIRMED: 'true',
      KOTARU_GEMINI_PAID_TIER_CONFIRMED: 'true',
      KOTARU_POLLY_AI_OPT_OUT_CONFIRMED: 'true',
      KOTARU_POLLY_COMMERCIAL_TERMS_REVIEWED: 'true',
    });
    const set = buildProviders(config.providers, config.providerSettings, Date.now);
    expect(set.blocked).toEqual([]);
    expect(select(set, 'stt').providerId).toBe('assemblyai-stt');
    expect(select(set, 'llm').providerId).toBe('gemini-3.1-flash-lite');
    expect(select(set, 'tts').providerId).toBe('polly-neural');
    expect(select(set, 'llm').estimate).toMatchObject({ basis: 'verified', verifiedAt: '2026-09-27' });
  });

  it('una confirmacion mal escrita es un error, no un "no"', () => {
    expect(() => loadConfig({ ...real, KOTARU_GEMINI_PAID_TIER_CONFIRMED: 'si' })).toThrow(/debe ser true o false/);
  });

  it('gemini,mock-voice: el chat usa Gemini de verdad; oido y voz simulados, sin LLM simulado', () => {
    const config = loadConfig({
      ...base,
      KOTARU_PROVIDERS: 'gemini,mock-voice',
      GEMINI_API_KEY: 'k2',
      KOTARU_GEMINI_PAID_TIER_CONFIRMED: 'true',
    });
    const set = buildProviders(config.providers, config.providerSettings, Date.now);
    expect(set.registered).toEqual(['mock-stt', 'gemini-3.1-flash-lite', 'mock-tts']);
    expect(set.blocked).toEqual([]);
    expect(select(set, 'llm').providerId).toBe('gemini-3.1-flash-lite');
    expect(select(set, 'stt').providerId).toBe('mock-stt');
    expect(select(set, 'tts').providerId).toBe('mock-tts');
    // Oido simulado con un modelo real: la app no debe ofrecer hablar.
    expect(set.voiceUnavailable).toBe(true);
  });

  it('kokoro (Together): con sus confirmaciones es la voz, y mock-voice ya no pone un TTS simulado', () => {
    const config = loadConfig({
      ...base,
      KOTARU_PROVIDERS: 'gemini,kokoro,mock-voice',
      GEMINI_API_KEY: 'k2',
      KOTARU_GEMINI_PAID_TIER_CONFIRMED: 'true',
      TOGETHER_API_KEY: 'k3',
      KOTARU_TOGETHER_ZERO_RETENTION_CONFIRMED: 'true',
      KOTARU_TOGETHER_COMMERCIAL_TERMS_REVIEWED: 'true',
    });
    const set = buildProviders(config.providers, config.providerSettings, Date.now);
    expect(set.registered).toEqual(['mock-stt', 'gemini-3.1-flash-lite', 'together-kokoro']);
    expect(select(set, 'tts').providerId).toBe('together-kokoro');
    expect(select(set, 'tts').estimate).toMatchObject({ basis: 'verified', verifiedAt: '2026-09-27' });
  });

  it('kokoro sin clave es un error; sin confirmaciones queda bloqueado', () => {
    expect(() => loadConfig({ ...base, KOTARU_PROVIDERS: 'kokoro' })).toThrow(/falta TOGETHER_API_KEY/);
    const config = loadConfig({ ...base, KOTARU_PROVIDERS: 'kokoro', TOGETHER_API_KEY: 'k3' });
    const set = buildProviders(config.providers, config.providerSettings, Date.now);
    expect(set.blocked.map((b) => b.id)).toEqual(['together-kokoro']);
  });

  it('whisper (Together) oye de verdad: con gemini y kokoro no queda nada simulado y la voz esta disponible', () => {
    const config = loadConfig({
      ...base,
      KOTARU_PROVIDERS: 'gemini,mock-voice,kokoro,whisper',
      GEMINI_API_KEY: 'k2',
      KOTARU_GEMINI_PAID_TIER_CONFIRMED: 'true',
      TOGETHER_API_KEY: 'k3',
      KOTARU_TOGETHER_ZERO_RETENTION_CONFIRMED: 'true',
      KOTARU_TOGETHER_COMMERCIAL_TERMS_REVIEWED: 'true',
    });
    const set = buildProviders(config.providers, config.providerSettings, Date.now);
    expect(set.registered).toEqual(['together-whisper', 'gemini-3.1-flash-lite', 'together-kokoro']);
    expect(set.blocked).toEqual([]);
    expect(select(set, 'stt').providerId).toBe('together-whisper');
    expect(set.voiceUnavailable).toBe(false);
  });
});
