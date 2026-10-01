#!/usr/bin/env node
/**
 * Convierte animaciones de Mixamo (FBX sin malla, «Without Skin», 30 fps) al mismo formato de
 * clip que mocap-convert.mjs (mobile/public/motions/*.json): rotaciones por hueso respecto a la
 * pose de reposo del esqueleto de Mixamo, posicion de la cadera en largos de pierna y las
 * direcciones de reposo de cada hueso. El reajuste a cada personaje se hace al cargar (mocap.ts).
 *
 * Licencia de Mixamo (Adobe): uso libre de regalias en proyectos personales, comerciales y sin
 * animo de lucro; se descargan con la cuenta del dueño. Ver public/motions/CREDITS.md.
 *
 *   node scripts/fbx-convert.mjs <archivo.fbx> <salida.json> [desde_s] [hasta_s] [mirror]
 */
import fs from 'node:fs';
import { AnimationMixer, Quaternion, Vector3 } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const [src, out, fromArg, toArg, mirrorArg] = process.argv.slice(2);
if (!src || !out) {
  console.error('uso: fbx-convert.mjs <fbx> <json> [desde_s] [hasta_s] [mirror]');
  process.exit(1);
}
const MIRROR = mirrorArg === 'mirror';
const swap = (n) => (!MIRROR ? n : n.replace(/^(Left|Right)/, (m) => (m === 'Left' ? 'Right' : 'Left')));
const mv = (v) => (MIRROR ? new Vector3(-v.x, v.y, v.z) : v);

// [hueso VRM, articulacion Mixamo, hacia la que apunta en reposo]
const MAP = [
  ['hips', 'Hips', 'Spine'],
  ['spine', 'Spine', 'Spine1'],
  ['chest', 'Spine1', 'Spine2'],
  ['upperChest', 'Spine2', 'Neck'],
  ['neck', 'Neck', 'Head'],
  ['head', 'Head', 'HeadTop_End'],
  ['leftUpperLeg', 'LeftUpLeg', 'LeftLeg'],
  ['leftLowerLeg', 'LeftLeg', 'LeftFoot'],
  ['leftFoot', 'LeftFoot', 'LeftToeBase'],
  ['leftToes', 'LeftToeBase', 'LeftToe_End'],
  ['rightUpperLeg', 'RightUpLeg', 'RightLeg'],
  ['rightLowerLeg', 'RightLeg', 'RightFoot'],
  ['rightFoot', 'RightFoot', 'RightToeBase'],
  ['rightToes', 'RightToeBase', 'RightToe_End'],
];
for (const s of ['left', 'right']) {
  const S = s === 'left' ? 'Left' : 'Right';
  MAP.push([`${s}Shoulder`, `${S}Shoulder`, `${S}Arm`], [`${s}UpperArm`, `${S}Arm`, `${S}ForeArm`], [`${s}LowerArm`, `${S}ForeArm`, `${S}Hand`], [`${s}Hand`, `${S}Hand`, `${S}HandMiddle1`]);
  // Dedos: los de Mixamo se mueven (la mano no queda de palo).
  for (const [vrm, mx] of [['Index', 'Index'], ['Middle', 'Middle'], ['Ring', 'Ring'], ['Little', 'Pinky']]) {
    // Sin la ultima falange: casi no se ve y el clip pesa un tercio menos.
    MAP.push([`${s}${vrm}Proximal`, `${S}Hand${mx}1`, `${S}Hand${mx}2`], [`${s}${vrm}Intermediate`, `${S}Hand${mx}2`, `${S}Hand${mx}3`]);
  }
  MAP.push([`${s}ThumbMetacarpal`, `${S}HandThumb1`, `${S}HandThumb2`], [`${s}ThumbProximal`, `${S}HandThumb2`, `${S}HandThumb3`]);
}

const buf = fs.readFileSync(src);
const root = new FBXLoader().parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '');
const bones = new Map();
root.traverse((o) => {
  if (o.isBone) bones.set(o.name.replace(/^mixamorig\d*:?/, ''), o);
});
const clipSrc = root.animations[0];
if (!clipSrc) throw new Error('el FBX no trae animacion');
for (const [, a, b] of MAP) if (!bones.get(a) || !bones.get(b)) throw new Error(`falta ${a} o ${b}`);

// Reposo: el esqueleto tal como viene, antes de animar (pose en T de Mixamo).
root.updateMatrixWorld(true);
const rootInv = new Quaternion();
const restQ = new Map();
const restP = new Map();
for (const [name, bone] of bones) {
  restQ.set(name, bone.getWorldQuaternion(new Quaternion()));
  restP.set(name, bone.getWorldPosition(new Vector3()));
}
const rp = (n) => mv(restP.get(swap(n)).clone());
const restDir = (a, b) => rp(b).sub(rp(a)).normalize();
const legLength = restP.get('Hips').y - restP.get('LeftToeBase').y;

const mixer = new AnimationMixer(root);
mixer.clipAction(clipSrc).play();
// Mixamo es muy suave: 15 cuadros por segundo bastan (se interpola entre ellos) y pesa la mitad.
const fps = +(process.env.FPS || 15);
const from = Math.max(0, +fromArg || 0);
const to = Math.min(clipSrc.duration, toArg ? +toArg : clipSrc.duration);
const frames = [];
for (let t = from; t < to - 1e-6; t += 1 / fps) frames.push(t);

const q16 = new Int16Array(frames.length * MAP.length * 4);
const hipsRel = [];
let standY = 0;
const q = new Quaternion();
const p = new Vector3();
frames.forEach((t, fi) => {
  mixer.setTime(t);
  root.updateMatrixWorld(true);
  root.getWorldQuaternion(rootInv).invert();
  MAP.forEach(([, mx], bi) => {
    const name = swap(mx);
    // Giro en el mundo respecto al reposo (como en un BVH, cuyo reposo es la identidad).
    bones.get(name).getWorldQuaternion(q).multiply(restQ.get(name).clone().invert());
    if (MIRROR) q.set(q.x, -q.y, -q.z, q.w);
    if (q.w < 0) q.set(-q.x, -q.y, -q.z, -q.w);
    const o = (fi * MAP.length + bi) * 4;
    q16[o] = Math.round(q.x * 32767);
    q16[o + 1] = Math.round(q.y * 32767);
    q16[o + 2] = Math.round(q.z * 32767);
    q16[o + 3] = Math.round(q.w * 32767);
  });
  bones.get('Hips').getWorldPosition(p);
  if (fi === 0) standY = p.y;
  hipsRel.push(mv(new Vector3(p.x - restP.get('Hips').x, p.y - standY, p.z - restP.get('Hips').z)).divideScalar(legLength));
});
const p16 = new Int16Array(frames.length * 3);
hipsRel.forEach((rel, fi) => {
  p16[fi * 3] = Math.round(rel.x * 10000);
  p16[fi * 3 + 1] = Math.round(rel.y * 10000);
  p16[fi * 3 + 2] = Math.round(rel.z * 10000);
});
const r5 = (v) => v.toArray().map((x) => +x.toFixed(5));
const b64 = (arr) => Buffer.from(arr.buffer).toString('base64');
const clip = {
  v: 1,
  source: `Mixamo ${src.split('/').pop()}${MIRROR ? ' (espejo)' : ''} ${from.toFixed(2)}-${to.toFixed(2)} s`,
  fps,
  frames: frames.length,
  bones: MAP.map(([vrm]) => vrm),
  rest: {
    dirs: Object.fromEntries(MAP.map(([vrm, a, b]) => [vrm, r5(restDir(a, b))])),
    thumbs: { leftHand: r5(restDir('LeftHand', 'LeftHandThumb2')), rightHand: r5(restDir('RightHand', 'RightHandThumb2')) },
    up: r5(restDir('Hips', 'Spine1')),
    left: r5(rp('LeftUpLeg').sub(rp('RightUpLeg')).normalize()),
  },
  q: b64(q16),
  p: b64(p16),
};
fs.writeFileSync(out, JSON.stringify(clip));
console.log(`${out}: ${frames.length} cuadros (${(frames.length / fps).toFixed(1)} s), ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
