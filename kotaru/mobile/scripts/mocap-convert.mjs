#!/usr/bin/env node
/**
 * Convierte capturas de movimiento BVH de la base de datos de CMU a clips compactos para los
 * personajes (mobile/public/motions/*.json). Los BVH no se guardan en el repositorio (son la
 * fuente); se descargan de la copia en GitHub (una-dinosauria/cmu-mocap) y se pasan por aqui.
 *
 * Licencia CMU: se puede incluir en productos comerciales, pero no revender los datos, ni
 * convertidos. Agradecimiento: "The data used in this project was obtained from mocap.cs.cmu.edu.
 * The database was created with funding from NSF EIA-0196217." (ver public/motions/CREDITS.md).
 *
 * Que guarda cada clip (en el marco del BVH; el reajuste a cada modelo se hace al cargarlo,
 * con sus proporciones reales: mocap.ts):
 * - la rotacion en el mundo de cada hueso VRM (cuaterniones cuantizados a 16 bits), a 30 fps;
 * - la posicion de la cadera, en largos de pierna (asi vale para cualquier estatura);
 * - la postura de reposo del BVH: direccion de cada hueso y el marco de la cadera.
 *
 *   node scripts/mocap-convert.mjs <archivo.bvh> <salida.json> [desde_s] [hasta_s]
 */
import fs from 'node:fs';
import { Euler, Quaternion, Vector3, MathUtils } from 'three';

const [src, out, fromArg, toArg, mirrorArg] = process.argv.slice(2);
// 'mirror': en espejo (izquierda por derecha): el doble de variedad y el peso cambia de pie.
const MIRROR = mirrorArg === 'mirror';
const swap = (n) => (!MIRROR ? n : n.replace(/^(Left|Right|L|R)(?=[A-Z])/, (m) => ({ Left: 'Right', Right: 'Left', L: 'R', R: 'L' })[m]));
const mv = (v) => (MIRROR ? new Vector3(-v.x, v.y, v.z) : v);
if (!src || !out) {
  console.error('uso: mocap-convert.mjs <bvh> <json> [desde_s] [hasta_s] [mirror]');
  process.exit(1);
}

// ---- Lectura del BVH ---------------------------------------------------------------------
const text = fs.readFileSync(src, 'utf8');
const tokens = text.split(/\s+/).filter(Boolean);
let i = 0;
const joints = [];
function readJoint(parent) {
  const kind = tokens[i++]; // ROOT, JOINT o End
  let name;
  if (kind === 'End') {
    i++; // Site
    name = `${parent.name}_end`;
  } else name = tokens[i++];
  const joint = { name, parent, offset: new Vector3(), channels: [], children: [], end: kind === 'End' };
  if (tokens[i++] !== '{') throw new Error('se esperaba {');
  while (tokens[i] !== '}') {
    const t = tokens[i++];
    if (t === 'OFFSET') joint.offset.set(+tokens[i++], +tokens[i++], +tokens[i++]);
    else if (t === 'CHANNELS') {
      const n = +tokens[i++];
      for (let c = 0; c < n; c++) joint.channels.push(tokens[i++]);
    } else if (t === 'JOINT' || t === 'End') {
      i--;
      joint.children.push(readJoint(joint));
    } else throw new Error(`token inesperado ${t}`);
  }
  i++;
  joints.push(joint);
  return joint;
}
if (tokens[i++] !== 'HIERARCHY') throw new Error('no es BVH');
const root = readJoint(null);
if (tokens[i++] !== 'MOTION') throw new Error('falta MOTION');
i++; // Frames:
const frameCount = +tokens[i++];
i += 2; // Frame Time:
const frameTime = +tokens[i++];
// Orden de lectura de canales = orden de aparicion en la jerarquia (preorden).
const order = [];
(function walk(j) {
  if (!j.end) order.push(j);
  j.children.forEach(walk);
})(root);
const perFrame = order.reduce((s, j) => s + j.channels.length, 0);
const values = tokens.slice(i).map(Number);
if (values.length < frameCount * perFrame) throw new Error('datos incompletos');

// ---- Huesos VRM y su equivalente en CMU ----------------------------------------------------
// [hueso VRM, articulacion CMU, articulacion hacia la que apunta en reposo]
const MAP = [
  ['hips', 'Hips', 'LowerBack'],
  ['spine', 'LowerBack', 'Spine'],
  ['chest', 'Spine', 'Spine1'],
  ['upperChest', 'Spine1', 'Neck'],
  ['neck', 'Neck', 'Head'],
  ['head', 'Head', 'Head_end'],
  ['leftShoulder', 'LeftShoulder', 'LeftArm'],
  ['leftUpperArm', 'LeftArm', 'LeftForeArm'],
  ['leftLowerArm', 'LeftForeArm', 'LeftHand'],
  ['leftHand', 'LeftHand', 'LeftHandIndex1'],
  ['rightShoulder', 'RightShoulder', 'RightArm'],
  ['rightUpperArm', 'RightArm', 'RightForeArm'],
  ['rightLowerArm', 'RightForeArm', 'RightHand'],
  ['rightHand', 'RightHand', 'RightHandIndex1'],
  ['leftUpperLeg', 'LeftUpLeg', 'LeftLeg'],
  ['leftLowerLeg', 'LeftLeg', 'LeftFoot'],
  ['leftFoot', 'LeftFoot', 'LeftToeBase'],
  ['leftToes', 'LeftToeBase', 'LeftToeBase_end'],
  ['rightUpperLeg', 'RightUpLeg', 'RightLeg'],
  ['rightLowerLeg', 'RightLeg', 'RightFoot'],
  ['rightFoot', 'RightFoot', 'RightToeBase'],
  ['rightToes', 'RightToeBase', 'RightToeBase_end'],
];
const byName = new Map(joints.map((j) => [j.name, j]));
for (const [, a, b] of MAP) if (!byName.get(a) || !byName.get(b)) throw new Error(`falta ${a} o ${b}`);

// Posiciones de reposo (rotaciones de reposo = identidad en BVH).
const restPos = new Map();
(function walk(j, at) {
  const p = at.clone().add(j.offset);
  restPos.set(j.name, p);
  j.children.forEach((c) => walk(c, p));
})(root, new Vector3());
// En espejo, la articulacion izquierda es la derecha reflejada.
const rp = (n) => mv(restPos.get(swap(n)).clone());
const restDir = (a, b) => rp(b).sub(rp(a)).normalize();
const legLength = restPos.get('Hips').y - restPos.get('LeftToeBase').y;

// ---- Cinematica directa por cuadro ---------------------------------------------------------
const fps = 30;
const step = Math.max(1, Math.round(1 / fps / frameTime));
const first = Math.max(0, Math.round((+fromArg || 0) / frameTime));
const last = Math.min(frameCount, toArg ? Math.round(+toArg / frameTime) : frameCount);
const frames = [];
for (let f = first; f < last; f += step) frames.push(f);

const q16 = new Int16Array(frames.length * MAP.length * 4);
const p16 = new Int16Array(frames.length * 3);
const local = new Quaternion();
let standY = 0;
const euler = new Euler();
frames.forEach((f, fi) => {
  let k = f * perFrame;
  const world = new Map();
  let hipsPos = null;
  for (const j of order) {
    const rot = { X: 0, Y: 0, Z: 0 };
    let axes = '';
    const pos = new Vector3();
    for (const ch of j.channels) {
      const v = values[k++];
      if (ch.endsWith('position')) pos[ch[0].toLowerCase()] = v;
      else {
        rot[ch[0]] = MathUtils.degToRad(v);
        axes += ch[0];
      }
    }
    // BVH: la rotacion es el producto en el orden de los canales (p. ej. Z·Y·X).
    euler.set(rot.X, rot.Y, rot.Z, axes || 'XYZ');
    local.setFromEuler(euler);
    const parentWorld = j.parent ? world.get(j.parent.name) : new Quaternion();
    world.set(j.name, parentWorld.clone().multiply(local));
    if (!j.parent) hipsPos = pos;
  }
  MAP.forEach(([, cmu], bi) => {
    const q = world.get(swap(cmu)).clone();
    // Reflejo en el plano YZ: (x, y, z, w) -> (x, -y, -z, w).
    if (MIRROR) q.set(q.x, -q.y, -q.z, q.w);
    const o = (fi * MAP.length + bi) * 4;
    q16[o] = Math.round(q.x * 32767);
    q16[o + 1] = Math.round(q.y * 32767);
    q16[o + 2] = Math.round(q.z * 32767);
    q16[o + 3] = Math.round(q.w * 32767);
  });
  // Cadera en largos de pierna. La altura, respecto a la del primer cuadro (de pie): la
  // captura mide desde el suelo y el esqueleto de reposo desde la cadera.
  if (fi === 0) standY = hipsPos.y;
  const rel = mv(new Vector3(hipsPos.x, hipsPos.y - standY, hipsPos.z)).divideScalar(legLength);
  p16[fi * 3] = Math.round(rel.x * 10000);
  p16[fi * 3 + 1] = Math.round(rel.y * 10000);
  p16[fi * 3 + 2] = Math.round(rel.z * 10000);
});

const b64 = (arr) => Buffer.from(arr.buffer).toString('base64');
const clip = {
  v: 1,
  source: `CMU mocap ${src.split('/').pop()}${MIRROR ? ' (espejo)' : ''} ${fromArg ?? 0}-${toArg ?? 'fin'} s`,
  fps,
  frames: frames.length,
  bones: MAP.map(([vrm]) => vrm),
  rest: {
    dirs: Object.fromEntries(MAP.map(([vrm, a, b]) => [vrm, restDir(a, b).toArray().map((x) => +x.toFixed(5))])),
    // Segunda referencia de la mano (hacia el pulgar): fija el giro de la muñeca, no solo la direccion.
    thumbs: { leftHand: restDir('LeftHand', 'LThumb_end').toArray().map((x) => +x.toFixed(5)), rightHand: restDir('RightHand', 'RThumb_end').toArray().map((x) => +x.toFixed(5)) },
    // Marco de la cadera en reposo: arriba (hacia la espalda) e izquierda (de cadera derecha a izquierda).
    up: restDir('Hips', 'Spine1').toArray().map((x) => +x.toFixed(5)),
    left: rp('LeftUpLeg').sub(rp('RightUpLeg')).normalize().toArray().map((x) => +x.toFixed(5)),
  },
  q: b64(q16),
  p: b64(p16),
};
fs.writeFileSync(out, JSON.stringify(clip));
console.log(`${out}: ${frames.length} cuadros (${(frames.length / fps).toFixed(1)} s), ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
