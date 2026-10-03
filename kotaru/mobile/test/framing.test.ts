import assert from 'node:assert/strict';
import { test } from 'node:test';
import { frameCamera, pixelRatio } from '../src/framing.ts';

const HEAD = 1.42;

function visible(setup: ReturnType<typeof frameCamera>) {
  const half = Math.tan(((setup.fov / 2) * Math.PI) / 180) * setup.z;
  return { top: setup.targetY + half, bottom: setup.targetY - half };
}

test('retrato y escenario siguen igual que antes (busto)', () => {
  assert.deepEqual(frameCamera('portrait', 1, HEAD), { fov: 20, y: HEAD, z: 1.5, targetY: HEAD - 0.03 });
  assert.equal(frameCamera('stage', 1.6, HEAD).fov, 26);
  assert.equal(frameCamera('stage', 3, HEAD).fov, 15);
});

test('pantalla completa en telefono: cabeza entera, por debajo de los controles de arriba, y hasta la cadera', () => {
  const v = visible(frameCamera('immersive', 390 / 760, HEAD));
  const headTop = HEAD + 0.11;
  assert.ok(v.top > headTop, 'la cabeza no se corta');
  const fromTop = (v.top - headTop) / (v.top - v.bottom);
  assert.ok(fromTop > 0.12 && fromTop < 0.25, `hueco arriba ${fromTop}`);
  assert.ok(v.bottom < 0.95, 'llega a la cadera');
});

test('en ordenador el encuadre es algo mas cercano que en telefono', () => {
  const phone = visible(frameCamera('immersive', 0.5, HEAD));
  const desk = visible(frameCamera('immersive', 1.6, HEAD));
  assert.ok(desk.top - desk.bottom < phone.top - phone.bottom);
});

test('la densidad de pixeles se limita a pantalla completa', () => {
  assert.equal(pixelRatio('portrait', 188, 188, 3), 2);
  assert.equal(pixelRatio('stage', 400, 250, 3), 1.8);
  // Telefono (390x844, densidad 3): 1,8 y por debajo del presupuesto de pixeles.
  assert.equal(pixelRatio('immersive', 390, 844, 3), 1.8);
  const r = pixelRatio('immersive', 1440, 900, 2);
  assert.ok(1440 * 900 * r * r <= 1_600_000 * 1.01);
  assert.equal(pixelRatio('immersive', 2560, 1440, 1), 1);
});

test('si el panel de abajo crece, la camara se aleja para que la cara quede por encima', () => {
  const setup = frameCamera('immersive', 390 / 760, HEAD, 0.45);
  const v = visible(setup);
  const chin = HEAD + 0.11 - 0.23;
  const chinFromTop = (v.top - chin) / (v.top - v.bottom);
  assert.ok(chinFromTop <= 0.45 - 0.049, `barbilla a ${chinFromTop}`);
  // Con el panel pequeño, el encuadre normal (no se aleja de mas).
  assert.deepEqual(frameCamera('immersive', 0.5, HEAD, 0.9), frameCamera('immersive', 0.5, HEAD));
  // Nunca mas lejos que medio cuerpo, aunque el panel ocupe casi todo.
  const far = visible(frameCamera('immersive', 0.5, HEAD, 0.1));
  assert.ok(far.top - far.bottom <= 1.6 + 1e-9);
});

test('la camara viva se mueve milimetros, nunca da saltos', async () => {
  const { cameraDrift } = await import('../src/framing.ts');
  let prev = cameraDrift(0);
  for (let t = 0.033; t < 60; t += 0.033) {
    const d = cameraDrift(t);
    assert.ok(Math.abs(d.x) < 0.01 && Math.abs(d.y) < 0.009 && d.z > -0.03 && d.z < 0.007 && Math.abs(d.roll) < 0.01);
    assert.ok(Math.abs(d.z - prev.z) < 0.002 && Math.abs(d.x - prev.x) < 0.001, `salto en t=${t}`);
    prev = d;
  }
});
