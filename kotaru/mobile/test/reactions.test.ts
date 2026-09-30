import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyReaction, reactionFor } from '../src/reactions.ts';

test('reconoce el tono de lo que se dice, en español e ingles', () => {
  assert.equal(classifyReaction('Te quiero mucho, eres preciosa'), 'love');
  assert.equal(classifyReaction('I love you'), 'love');
  assert.equal(classifyReaction('¿Sabes qué me pasó hoy?'), 'intrigue');
  assert.equal(classifyReaction('Mañana tengo una cita'), 'expectation');
  assert.equal(classifyReaction('jajaja qué bueno'), 'joy');
  assert.equal(classifyReaction('Hoy me siento muy solo y triste'), 'tender');
  assert.equal(classifyReaction('Hola'), 'attentive');
});

test('lo dificil gana: triste con un "te quiero" es ternura, sin particulas', () => {
  const kind = classifyReaction('Estoy triste, te quiero');
  assert.equal(kind, 'tender');
  assert.equal(reactionFor(kind, 'nova', 'flirt').particles, 'none');
});

test('siempre positivas: ninguna reaccion usa emociones de rechazo o enfado', () => {
  const allowed = new Set(['warm', 'happy', 'curious', 'playful']);
  for (const kind of ['love', 'intrigue', 'expectation', 'joy', 'tender', 'attentive'] as const)
    for (const c of ['luna', 'nova', 'rio'] as const)
      for (const m of ['friend', 'flirt', 'ask'] as const) assert.ok(allowed.has(reactionFor(kind, c, m).emotion), `${kind} ${c} ${m}`);
});

test('corazones solo en coqueteo: Luna y el modo Amigo reaccionan con destellos calidos', () => {
  assert.equal(reactionFor('love', 'nova', 'flirt').particles, 'hearts');
  assert.equal(reactionFor('love', 'rio', 'ask').particles, 'hearts');
  assert.equal(reactionFor('love', 'nova', 'friend').particles, 'sparkles');
  assert.equal(reactionFor('love', 'luna', 'flirt').particles, 'sparkles');
});
