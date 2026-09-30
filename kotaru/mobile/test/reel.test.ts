import assert from 'node:assert/strict';
import { test } from 'node:test';
import { REELS, reelCamera, reelCue, reelDuration, reelVoice, type Anchors } from '../src/reel.ts';
import { PROFILES } from '../src/character-profiles.ts';
import { bodyGestureOffset } from '../src/idle-body.ts';

const A: Anchors = { headY: 1.42, eyeY: 1.48, x: 0, z: 0, eyeZ: 0.08 };
const dist = (c: ReturnType<typeof reelCamera>) => Math.hypot(c.position[0] - c.target[0], c.position[1] - c.target[1], c.position[2] - c.target[2]);

test('cada short dura entre 12 y 16 s y se repite', () => {
  for (const [id, shots] of Object.entries(REELS)) {
    const total = reelDuration(shots);
    assert.ok(total >= 12 && total <= 16, `${id}: ${total}`);
    assert.equal(reelCue(shots, 0.1).index, 0);
    assert.equal(reelCue(shots, total + 0.1).index, 0);
    assert.equal(reelCue(shots, total - 0.01).index, shots.length - 1);
  }
});

test('cada short mezcla planos cercanos y de cuerpo entero, habla y usa emociones validas', () => {
  const EMOTIONS = ['neutral', 'warm', 'happy', 'curious', 'thoughtful', 'concerned', 'playful', 'surprised'];
  for (const [id, shots] of Object.entries(REELS)) {
    const foci = new Set(shots.flatMap((s) => [s.from.focus, s.to.focus]));
    assert.ok(foci.has('eyes') || foci.has('face'), `${id} sin primer plano`);
    assert.ok(foci.has('full'), `${id} sin cuerpo entero`);
    assert.ok(shots.some((s) => s.talk), `${id} no habla`);
    for (const s of shots) assert.ok(EMOTIONS.includes(s.emotion), `${id}: ${s.emotion}`);
  }
});

test('el saludo con la mano va en planos de cuerpo entero (en vertical la mano no cabe mas cerca)', () => {
  for (const shots of Object.values(REELS)) for (const s of shots) if (s.wave) assert.equal(s.from.focus, 'full');
  // Nova tiene la mano derecha en la cadera: no saluda.
  assert.ok(!REELS.nova.some((s) => s.wave));
});

test('la camara se acerca en los primeros planos y se aleja en el cuerpo entero, sin atravesar la cara', () => {
  const shots = REELS.luna;
  const eyes = reelCamera(shots, 0.05, A, 0.46);
  const full = reelCamera(shots, 2.4 + 3.0 + 0.05, A, 0.46);
  assert.ok(dist(eyes) < 0.8, `ojos a ${dist(eyes)}`);
  assert.ok(dist(eyes) > 0.25, 'demasiado cerca: el flequillo taparia la camara');
  assert.ok(dist(full) > 2.5, `cuerpo entero a ${dist(full)}`);
  // Mira a la altura de los ojos en el primer plano y a media altura en el cuerpo entero.
  assert.ok(Math.abs(eyes.target[1] - A.eyeY) < 0.05);
  assert.ok(full.target[1] < 1);
  // En horizontal (ordenador) no hace falta alejarse tanto como en vertical.
  assert.ok(dist(reelCamera(shots, 0.05, A, 1.6)) <= dist(eyes));
});

test('dentro de un plano la camara se mueve suave (sin saltos entre cuadros)', () => {
  const shots = REELS.nova;
  for (let t = 0.2; t < reelDuration(shots) - 0.1; t += 0.033) {
    if (reelCue(shots, t).index !== reelCue(shots, t + 0.033).index) continue;
    const a = reelCamera(shots, t, A, 0.46);
    const b = reelCamera(shots, t + 0.033, A, 0.46);
    const step = Math.hypot(a.position[0] - b.position[0], a.position[1] - b.position[1], a.position[2] - b.position[2]);
    assert.ok(step < 0.05, `salto de ${step} m en ${t.toFixed(2)} s`);
  }
});

test('la voz simulada tiene silabas y pausas', () => {
  const v = Array.from({ length: 300 }, (_, i) => reelVoice(i / 60));
  assert.ok(Math.max(...v) > 0.5);
  assert.ok(v.filter((x) => x < 0.1).length > 10, 'sin pausas');
});

test('los gestos del short existen para el cuerpo', () => {
  for (const shots of Object.values(REELS)) for (const s of shots) if (s.gesture && s.gesture !== 'tilt_head') assert.notDeepEqual(bodyGestureOffset(s.gesture, 0.4), { shoulders: 0, chest: 0, bounce: 0 }, s.gesture);
});

test('perfiles completos y con las mismas partes en español e ingles', () => {
  for (const [id, p] of Object.entries(PROFILES)) {
    for (const lang of ['es', 'en'] as const) {
      assert.ok(p.tags[lang].length >= 4 && p.tags[lang].length <= 8, `${id} ${lang} etiquetas`);
      assert.ok(p.tags[lang].every((t) => t.length <= 20), `${id} ${lang} etiqueta larga`);
      assert.equal(p.hook[lang].length, 2);
      assert.equal(p.questions[lang].length, 4);
      assert.equal(p.likes[lang].length, 3);
      assert.equal(p.dislikes[lang].length, 3);
      assert.ok(p.quote[lang].length > 0);
      // Lo esencial siempre dice lo importante (IA, limites).
      assert.ok(p.attributes[lang].length >= 4);
    }
    assert.equal(p.tags.es.length, p.tags.en.length, id);
  }
});

import { ARM_POSES } from '../src/idle-body.ts';
import { styleFor } from '../src/body-styles.ts';

test('gestos de brazo del short: cada personaje el suyo, con un brazo libre', () => {
  const arms = (id: 'luna' | 'nova' | 'rio') => REELS[id].map((s) => s.arm).filter(Boolean);
  assert.ok(arms('luna').includes('chest'));
  assert.ok(arms('nova').includes('chin'));
  assert.ok(arms('rio').includes('point'));
  // Nova tiene la mano derecha en la cadera: sus gestos van con la izquierda.
  assert.equal(styleFor('nova').handOnHip, true);
  for (const a of arms('nova')) assert.equal(ARM_POSES[a!].side, 'left');
  for (const pose of Object.values(ARM_POSES)) for (const v of [...pose.upper, ...pose.lower, ...pose.hand]) assert.ok(Math.abs(v) < Math.PI, 'rotacion imposible');
});
