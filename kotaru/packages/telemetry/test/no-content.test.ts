import { describe, expect, it } from 'vitest';
import { ContentLeakError, InMemorySink, assertNoContent, type TurnMetric } from '../src/index.js';

const validTurn: TurnMetric = {
  conversationId: 'conv_01HZX',
  turnId: 'turn_0007',
  routeId: 'stt:mock-stt|llm:mock-llm|tts:mock-tts',
  sttProvider: 'mock-stt',
  llmProvider: 'mock-llm',
  ttsProvider: 'mock-tts',
  endpointToFinalMs: 420,
  llmTtftMs: 310,
  ttsTtfbMs: 780,
  turnTotalMs: 2140,
  userSpeechMs: 11_500,
  sessionMs: 96_000,
  sttCostUsd: 0.000_958,
  llmCostUsd: 0.000_611,
  ttsCostUsd: 0.004_800,
  infraCostUsd: 0.000_375,
  totalCostUsd: 0.006_744,
  costBasis: 'verified',
  fallbackUsed: false,
  interrupted: false,
  createdAt: '2026-09-17T06:00:00.000Z',
};

describe('telemetria sin contenido', () => {
  it('acepta una metrica valida', () => {
    expect(() => assertNoContent(validTurn as unknown as Record<string, unknown>)).not.toThrow();
  });

  it('rechaza una clave no declarada, aunque parezca inocente', () => {
    const leaky = { ...validTurn, transcript: 'hola, como estas' };
    expect(() => assertNoContent(leaky as unknown as Record<string, unknown>)).toThrow(ContentLeakError);
  });

  it('rechaza texto con espacios en un campo permitido', () => {
    const leaky = { ...validTurn, routeId: 'me siento muy solo hoy' };
    expect(() => assertNoContent(leaky as unknown as Record<string, unknown>)).toThrow(/espacios/);
  });

  it('rechaza una cadena demasiado larga', () => {
    const leaky = { ...validTurn, conversationId: 'x'.repeat(65) };
    expect(() => assertNoContent(leaky as unknown as Record<string, unknown>)).toThrow(/65 caracteres/);
  });

  it('el sink falla en vez de guardar una metrica con fuga', () => {
    const sink = new InMemorySink();
    const leaky = { ...validTurn, userMessage: 'texto privado' } as unknown as TurnMetric;
    expect(() => sink.emitTurn(leaky)).toThrow(ContentLeakError);
    expect(sink.turns).toHaveLength(0);
  });

  it('suma el costo de los turnos emitidos', () => {
    const sink = new InMemorySink();
    sink.emitTurn(validTurn);
    sink.emitTurn({ ...validTurn, turnId: 'turn_0008' });
    expect(sink.totalCostUsd()).toBeCloseTo(0.013_488, 6);
  });
});
