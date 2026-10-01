/**
 * Realismo de la tela (pedido del dueño, 2026-09-30): la ropa no es una carcasa rigida, se
 * apoya en el cuerpo. Solo Nova (personaje adulta, perfil 18+): en el vestido, en la punta del
 * pecho, el pezon apenas marcado bajo la tela, y la sombra suave de la tela que cae bajo el
 * pecho. Nada se ve a traves de la ropa: es sombreado de la propia tela.
 *
 * Como: se busca la punta del pecho en el cuerpo (la piel, en reposo), el punto de la ropa
 * justo delante y su coordenada de textura, y se pinta ahi, difuminado, en la textura de color
 * del vestido (el sombreado de estilo anime no reacciona a relieves finos: se dibuja como lo
 * haria un ilustrador). Se apaga con ?fabric=0.
 */
import * as THREE from 'three';
import type { VRM, VRMHumanBoneName } from '@pixiv/three-vrm';
import { materialKind } from './looks';

export interface FabricDetail {
  /** Relieve del pezon: radio (m) y fuerza (0-1). */
  readonly nipple: { readonly radius: number; readonly strength: number };
  /** Pliegue bajo el pecho (fuerza 0-1; 0 = sin pliegue). */
  readonly fold: number;
}

/** Que personaje lleva que detalle. Los demas, nada. */
export const FABRIC: Partial<Record<string, FabricDetail>> = {
  nova: { nipple: { radius: 0.008, strength: 0.6 }, fold: 0.5 },
};

interface Apex {
  readonly mesh: THREE.SkinnedMesh;
  readonly vertex: number;
  readonly uv: THREE.Vector2;
  /** Pixeles de textura por metro alrededor del punto. */
  readonly pxPerM: number;
  /** Hacia donde queda «abajo» del cuerpo en la textura (unitario, en pixeles de u y v). */
  readonly down: THREE.Vector2;
}

/** Aplica el detalle de tela del personaje (si tiene). Llamar con el modelo en reposo. */
export function applyFabricDetail(vrm: VRM, companion: string): void {
  const detail = FABRIC[companion];
  if (!detail) return;
  const apexes = findApexes(vrm);
  if (!apexes.length) return;
  // Una sola textura de relieve por material (los dos pechos suelen compartir textura).
  const byMaterial = new Map<THREE.Material, Apex[]>();
  for (const a of apexes) {
    const mat = materialOf(a.mesh, a.vertex);
    if (!mat) continue;
    byMaterial.set(mat, [...(byMaterial.get(mat) ?? []), a]);
  }
  for (const [mat, list] of byMaterial) paintRelief(mat as THREE.MeshStandardMaterial, list, detail);
}

/** La punta del pecho en la ropa, a cada lado: el vertice de ropa mas adelantado a esa altura. */
function findApexes(vrm: VRM): Apex[] {
  const pos = (b: VRMHumanBoneName) => {
    const n = vrm.humanoid.getNormalizedBoneNode(b);
    return n ? vrm.scene.worldToLocal(n.getWorldPosition(new THREE.Vector3())) : null;
  };
  const hips = pos('hips');
  const spine = pos('spine');
  const neck = pos('neck');
  const lArm = pos('leftUpperArm');
  const rArm = pos('rightUpperArm');
  if (!hips || !spine || !neck || !lArm || !rArm) return [];
  const up = spine.clone().sub(hips).normalize();
  const left = lArm.clone().sub(rArm).normalize();
  const fwd = new THREE.Vector3().crossVectors(left, up).normalize();
  // El pecho, entre el 60 % y el 88 % de la altura de la columna al cuello (mas abajo, un
  // vestido que cae recto desde el pecho esta igual de adelantado y confundiria la busqueda).
  const h0 = spine.dot(up) + 0.6 * (neck.dot(up) - spine.dot(up));
  const h1 = spine.dot(up) + 0.88 * (neck.dot(up) - spine.dot(up));
  const shoulderHalf = lArm.clone().sub(rArm).length() / 2;
  const center = neck.clone();
  vrm.scene.updateMatrixWorld(true);
  // 1) La punta del pecho en el cuerpo (la piel): la tela de delante hace de puente entre los
  //    dos pechos y su punto mas adelantado no dice donde esta cada pezon.
  // 2) En la ropa, el vertice justo delante de esa punta.
  const skinApex: Record<'l' | 'r', { f: number; l: number; h: number } | null> = { l: null, r: null };
  const cloth: { mesh: THREE.SkinnedMesh; vertex: number; l: number; h: number; f: number }[] = [];
  const v = new THREE.Vector3();
  vrm.scene.traverse((o) => {
    const mesh = o as THREE.SkinnedMesh;
    if (!mesh.isSkinnedMesh) return;
    const geo = mesh.geometry;
    const position = geo.getAttribute('position');
    if (!position || !geo.getAttribute('uv')) return;
    for (let i = 0; i < position.count; i++) {
      const mat = materialOf(mesh, i);
      const kind = mat ? materialKind(mat.name) : 'other';
      if (kind !== 'cloth' && kind !== 'skin') continue;
      v.fromBufferAttribute(position, i);
      mesh.localToWorld(v);
      vrm.scene.worldToLocal(v);
      const h = v.dot(up);
      if (h < h0 || h > h1) continue;
      const rel = v.clone().sub(center);
      const l = rel.dot(left);
      if (Math.abs(l) > shoulderHalf * 0.8) continue;
      const f = rel.dot(fwd);
      if (kind === 'cloth') {
        cloth.push({ mesh, vertex: i, l, h, f });
        continue;
      }
      if (Math.abs(l) < 0.015) continue;
      const side = l > 0 ? 'l' : 'r';
      if (!skinApex[side] || f > skinApex[side]!.f) skinApex[side] = { f, l, h };
    }
  });
  const best: ({ mesh: THREE.SkinnedMesh; vertex: number } | null)[] = [];
  for (const apex of [skinApex.l, skinApex.r]) {
    if (!apex) continue;
    let pick: (typeof cloth)[number] | null = null;
    let dist = Infinity;
    // Ajuste comprobado con capturas: la punta visible queda algo mas afuera y arriba.
    const tl = apex.l + Math.sign(apex.l) * APEX_SHIFT[0];
    const th = apex.h + APEX_SHIFT[1];
    for (const c of cloth) {
      const d = Math.hypot(c.l - tl, c.h - th) - c.f * 0.3;
      if (d < dist) {
        dist = d;
        pick = c;
      }
    }
    if (pick) best.push(pick);
  }
  const out: Apex[] = [];
  for (const b of best) {
    if (!b) continue;
    const uv = new THREE.Vector2().fromBufferAttribute(b.mesh.geometry.getAttribute('uv') as THREE.BufferAttribute, b.vertex);
    out.push({ mesh: b.mesh, vertex: b.vertex, uv, pxPerM: pixelsPerMeter(b.mesh, b.vertex), down: downInTexture(vrm, b.mesh, b.vertex, up) });
  }
  return out;
}

/** Direccion de «abajo» en la textura junto a un vertice (del vecino que queda debajo en el cuerpo). */
function downInTexture(vrm: VRM, mesh: THREE.SkinnedMesh, vertex: number, up: THREE.Vector3): THREE.Vector2 {
  const geo = mesh.geometry;
  const position = geo.getAttribute('position');
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  const world = (i: number, out: THREE.Vector3) => vrm.scene.worldToLocal(mesh.localToWorld(out.fromBufferAttribute(position, i)));
  const p0 = world(vertex, new THREE.Vector3());
  const u0 = new THREE.Vector2().fromBufferAttribute(uv, vertex);
  const p = new THREE.Vector3();
  const acc = new THREE.Vector2();
  for (let i = 0; i < position.count; i++) {
    world(i, p).sub(p0);
    const d = p.length();
    if (d < 0.004 || d > 0.035) continue;
    const du = new THREE.Vector2().fromBufferAttribute(uv, i).sub(u0);
    if (du.length() > 0.05) continue; // otra isla de la textura
    // Cuanto baja este vecino (de 0 a 1) pesa su direccion en la textura.
    const drop = -p.dot(up) / d;
    if (drop > 0.3) acc.addScaledVector(du.normalize(), drop);
  }
  return acc.lengthSq() > 1e-8 ? acc.normalize() : new THREE.Vector2(0, 1);
}

function materialOf(mesh: THREE.Mesh, vertex: number): THREE.Material | null {
  const mats = ([] as THREE.Material[]).concat(mesh.material);
  if (mats.length === 1) return mats[0]!;
  const geo = mesh.geometry;
  const index = geo.getIndex();
  for (const g of geo.groups) {
    for (let k = g.start; k < g.start + g.count; k++) if ((index ? index.getX(k) : k) === vertex) return mats[g.materialIndex ?? 0] ?? null;
  }
  return null;
}

/** Escala de la textura alrededor de un vertice: pixeles por metro (con los vecinos cercanos). */
function pixelsPerMeter(mesh: THREE.SkinnedMesh, vertex: number): number {
  const geo = mesh.geometry;
  const position = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  const mat = ([] as THREE.Material[]).concat(mesh.material)[0] as THREE.MeshStandardMaterial;
  const size = (mat.map?.image as { width?: number } | undefined)?.width ?? 1024;
  const p0 = new THREE.Vector3().fromBufferAttribute(position, vertex);
  const u0 = new THREE.Vector2().fromBufferAttribute(uv as THREE.BufferAttribute, vertex);
  const p = new THREE.Vector3();
  const u = new THREE.Vector2();
  const ratios: number[] = [];
  for (let i = 0; i < position.count; i++) {
    if (i === vertex) continue;
    p.fromBufferAttribute(position, i);
    const d = p.distanceTo(p0);
    if (d < 0.004 || d > 0.04) continue;
    u.fromBufferAttribute(uv as THREE.BufferAttribute, i);
    const du = u.distanceTo(u0) * size;
    // Vertices de otra isla de la textura (costura): fuera.
    if (du / d > 0 && du / d < 1e5) ratios.push(du / d);
  }
  if (!ratios.length) return size * 2;
  ratios.sort((a, b) => a - b);
  return ratios[Math.floor(ratios.length / 2)]!;
}

/**
 * Pinta el detalle en la textura de color de la tela (el sombreado de estilo anime no reacciona
 * a relieves finos: se dibuja como lo haria un ilustrador). Por cada pecho: el pezon marcado
 * bajo la tela (un punto suave algo mas oscuro, con su sombra debajo y un brillo encima) y la
 * sombra de la tela que cae bajo el pecho. Todo difuminado y con poca opacidad.
 */
function paintRelief(mat: THREE.MeshStandardMaterial, apexes: Apex[], detail: FabricDetail): void {
  const map = mat.map;
  const src = map?.image as (CanvasImageSource & { width: number; height: number }) | undefined;
  if (!map || !src?.width) return;
  const canvas = document.createElement('canvas');
  canvas.width = src.width;
  canvas.height = src.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(src, 0, 0);
  const dot = (x: number, y: number, r: number, rgb: string, alpha: number, sx = 1, sy = 1) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sx, sy);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, `rgba(${rgb},${alpha})`);
    g.addColorStop(0.55, `rgba(${rgb},${alpha * 0.55})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  const s = detail.nipple.strength;
  for (const a of apexes) {
    const r = Math.max(2, detail.nipple.radius * a.pxPerM);
    // La punta real queda algo mas arriba que el punto mas adelantado de la tela en reposo.
    const cx = a.uv.x * src.width - a.down.x * r * NIPPLE_UP;
    const cy = a.uv.y * src.height - a.down.y * r * NIPPLE_UP;
    const dx = a.down.x * r;
    const dy = a.down.y * r;
    // Sombra de la tela que cae bajo el pecho: ancha y muy tenue.
    if (detail.fold > 0) dot(cx + dx * 3.4, cy + dy * 3.4, r * 4.2, '70,40,70', 0.12 * detail.fold, 1.5, 0.55);
    // Areola apenas insinuada bajo la tela.
    dot(cx, cy, r * 2.1, '170,105,125', 0.1 * s);
    // Sombra justo debajo del relieve y brillo encima: se lee como un bulto en la tela.
    dot(cx + dx * 0.75, cy + dy * 0.75, r * 1.05, '90,45,70', 0.3 * s, 1.2, 0.8);
    dot(cx, cy, r * 0.8, '185,115,135', 0.32 * s);
    dot(cx - dx * 0.55, cy - dy * 0.55, r * 0.55, '255,255,255', 0.28 * s);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = map.flipY;
  tex.colorSpace = map.colorSpace;
  tex.wrapS = map.wrapS;
  tex.wrapT = map.wrapT;
  tex.anisotropy = map.anisotropy;
  tex.needsUpdate = true;
  mat.map = tex;
  // MToon dibuja la parte en sombra con su propia textura: si es la misma, tambien la nueva.
  const mtoon = mat as unknown as { shadeMultiplyTexture?: THREE.Texture | null };
  if (mtoon.shadeMultiplyTexture && mtoon.shadeMultiplyTexture.image === src) mtoon.shadeMultiplyTexture = tex;
  mat.needsUpdate = true;
}

/** Desplazamiento (m) desde la punta de la piel: hacia fuera y hacia arriba. */
export const APEX_SHIFT: [number, number] = [0.07, 0.06];

/** Cuanto mas arriba (en radios del pezon) que el punto mas adelantado de la tela. */
export let NIPPLE_UP = 0;
export function setNippleUp(v: number): void {
  NIPPLE_UP = v;
}
