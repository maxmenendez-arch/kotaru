import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HandsFreeVad, PreRoll, pcmLevel, pcmMs } from '../src/hands-free.ts';

const F = 20;

/** Pasa `ms` de audio a nivel `level`; devuelve los eventos con su instante. */
function feed(vad: HandsFreeVad, clock: { t: number }, level: number, ms: number, busy = false) {
  const events: { e: string; t: number }[] = [];
  for (let i = 0; i < ms; i += F) {
    clock.t += F;
    const e = vad.push(level, F, clock.t, busy);
    if (e) events.push({ e, t: clock.t });
  }
  return events;
}

test('una frase: empieza al hablar, termina tras el silencio', () => {
  const clock = { t: 0 };
  const vad = new HandsFreeVad(0);
  assert.deepEqual(feed(vad, clock, 0.003, 1000), []);
  const start = feed(vad, clock, 0.08, 1500);
  assert.equal(start.length, 1);
  assert.equal(start[0]!.e, 'start');
  assert.ok(start[0]!.t - 1000 <= 200, 'empieza en menos de 200 ms');
  const end = feed(vad, clock, 0.003, 1200);
  assert.equal(end.length, 1);
  assert.equal(end[0]!.e, 'end');
  assert.ok(end[0]!.t - 2500 >= 880 && end[0]!.t - 2500 <= 940);
});

test('las pausas cortas entre palabras no cortan el turno', () => {
  const clock = { t: 0 };
  const vad = new HandsFreeVad(0);
  feed(vad, clock, 0.003, 500);
  const events = [...feed(vad, clock, 0.08, 600), ...feed(vad, clock, 0.003, 400), ...feed(vad, clock, 0.08, 600)];
  assert.deepEqual(events.map((x) => x.e), ['start']);
});

test('un golpe corto (tos, portazo) no abre turno', () => {
  const clock = { t: 0 };
  const vad = new HandsFreeVad(0);
  feed(vad, clock, 0.003, 500);
  assert.deepEqual(feed(vad, clock, 0.3, 100), []);
  assert.deepEqual(feed(vad, clock, 0.003, 500), []);
});

test('ruido de fondo constante (lluvia, ventilador): se aprende y no abre turno', () => {
  const clock = { t: 0 };
  const vad = new HandsFreeVad(0);
  // Sube poco a poco (como al abrir una ventana): el suelo lo sigue.
  for (let level = 0.004; level <= 0.03; level += 0.002) feed(vad, clock, level, 400);
  assert.deepEqual(feed(vad, clock, 0.03, 3000), []);
  // Hablar por encima del ruido si se detecta.
  assert.deepEqual(feed(vad, clock, 0.15, 400).map((x) => x.e), ['start']);
});

test('mientras el personaje habla, su eco suave no abre turno; hablarle fuerte si le interrumpe', () => {
  const clock = { t: 0 };
  const vad = new HandsFreeVad(0);
  feed(vad, clock, 0.003, 800);
  // Eco residual del personaje: por encima del umbral normal, pero no del de interrupcion.
  const echo = vad.threshold(false) * 1.5;
  assert.deepEqual(feed(vad, clock, echo, 3000, true), []);
  // Sin el personaje hablando, ese mismo nivel si seria voz.
  const quiet = new HandsFreeVad(0);
  const c2 = { t: 0 };
  feed(quiet, c2, 0.003, 800);
  assert.deepEqual(feed(quiet, c2, echo, 400).map((x) => x.e), ['start']);
  // La persona le interrumpe hablando claro.
  const barge = feed(vad, clock, 0.2, 600, true);
  assert.deepEqual(barge.map((x) => x.e), ['start']);
});

test('un turno no dura para siempre', () => {
  const clock = { t: 0 };
  const vad = new HandsFreeVad(0, { maxTurnMs: 5000 });
  feed(vad, clock, 0.003, 300);
  assert.deepEqual(feed(vad, clock, 0.1, 6000).map((x) => x.e), ['start', 'end', 'start']);
});

test('se apaga solo tras un rato sin que nadie hable', () => {
  const clock = { t: 0 };
  const vad = new HandsFreeVad(0, { idleOffMs: 10_000 });
  const events = feed(vad, clock, 0.003, 12_000);
  assert.deepEqual(events.map((x) => x.e), ['idle-off']);
});

test('nivel y duracion de un trozo PCM de 16 bits', () => {
  const pcm = new Uint8Array(640); // 320 muestras = 20 ms a 16 kHz
  const view = new DataView(pcm.buffer);
  for (let i = 0; i < 320; i++) view.setInt16(i * 2, i % 2 ? 16384 : -16384, true);
  assert.ok(Math.abs(pcmLevel(pcm) - 0.5) < 1e-6);
  assert.equal(pcmLevel(new Uint8Array(640)), 0);
  assert.equal(pcmMs(pcm, 16000), 20);
});

test('pre-roll: guarda solo lo ultimo y se vacia al usarlo', () => {
  const roll = new PreRoll(300);
  for (let i = 0; i < 30; i++) roll.push(new Uint8Array([i]), 20);
  const out = roll.drain();
  assert.ok(out.length >= 15 && out.length <= 16);
  assert.equal(out[out.length - 1]![0], 29);
  assert.equal(roll.drain().length, 0);
});
