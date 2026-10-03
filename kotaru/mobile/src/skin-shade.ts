/**
 * Sombras de la piel (3-oct, realismo): la luz viene de arriba, asi que la barbilla deja una
 * sombra suave en el cuello y el flequillo oscurece un poco la frente. Sin esto la cara y el
 * cuello salen planos, como recortados. Se pinta en la textura (igual que el rubor): cada
 * vertice de piel de la zona deja una mancha difusa con su peso; las manchas se combinan con el
 * maximo (no se suman, asi da igual lo densa que sea la malla) y la mascara multiplica la piel.
 * Se apaga con ?shade=0.
 */
import * as THREE from 'three';
import type { VRM } from '@pixiv/three-vrm';
import { SKIN_SHADE, browShade, chinShade, materialKind } from './looks';
import { pixelsPerMeter } from './fabric-detail';

type Spot = { uv: THREE.Vector2; weight: number };
type Job = { mat: THREE.MeshStandardMaterial; mesh: THREE.SkinnedMesh; sample: number; spots: Spot[]; rgb: readonly [number, number, number] };

export function applySkinShade(vrm: VRM, companion: string): void {
  const shade = SKIN_SHADE[companion];
  if (!shade || typeof document === 'undefined') return;
  vrm.scene.updateMatrixWorld(true);
  const at = (b: 'leftEye' | 'rightEye' | 'head' | 'neck') => vrm.humanoid.getRawBoneNode(b)?.getWorldPosition(new THREE.Vector3()) ?? null;
  const [le, re, head, neck] = [at('leftEye'), at('rightEye'), at('head'), at('neck')];
  if (!le || !re || !head || !neck) return;
  const mid = le.clone().add(re).multiplyScalar(0.5);
  const fwd = mid.clone().sub(head).setY(0).normalize();
  const eyeY = mid.y;

  // Barbilla: el punto mas bajo de la piel de la cara por delante.
  let chinY = Infinity;
  const p = new THREE.Vector3();
  const meshes: THREE.SkinnedMesh[] = [];
  vrm.scene.traverse((o) => {
    const m = o as THREE.SkinnedMesh;
    if (m.isSkinnedMesh) meshes.push(m);
  });
  // Material de cada vertice, de una vez (materialOf recorre los indices en cada llamada).
  const owner = new Map<THREE.SkinnedMesh, (THREE.Material | null)[]>();
  const matAt = (mesh: THREE.SkinnedMesh, i: number): THREE.Material | null => {
    let list = owner.get(mesh);
    if (!list) {
      const mats = ([] as THREE.Material[]).concat(mesh.material);
      const n = mesh.geometry.getAttribute('position').count;
      list = new Array<THREE.Material | null>(n).fill(mats.length === 1 ? mats[0]! : null);
      const index = mesh.geometry.getIndex();
      if (mats.length > 1) {
        for (const g of mesh.geometry.groups) {
          const end = Math.min(g.start + g.count, index ? index.count : n);
          const mat = mats[g.materialIndex ?? 0] ?? null;
          // El contorno de MToon es una copia del material (dibujada por detras): no se pinta.
          if (!mat || /outline/i.test(mat.name)) continue;
          for (let k = g.start; k < end; k++) list[index ? index.getX(k) : k] = mat;
        }
      }
      owner.set(mesh, list);
    }
    return list[i] ?? null;
  };
  const isSkin = (mesh: THREE.SkinnedMesh, i: number) => {
    const mat = matAt(mesh, i) as { name?: string } | null;
    return !!mat && materialKind(mat.name ?? '') === 'skin';
  };
  for (const mesh of meshes) {
    if (!/face/i.test(mesh.name)) continue;
    const pos = mesh.geometry.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      if (p.y > eyeY - 0.04 || p.clone().sub(head).dot(fwd) < 0.02) continue;
      if (p.y < chinY && isSkin(mesh, i)) chinY = p.y;
    }
  }
  if (!Number.isFinite(chinY)) return;

  const jobs = new Map<THREE.Material, Job>();
  const add = (mesh: THREE.SkinnedMesh, i: number, weight: number, rgb: readonly [number, number, number]) => {
    const mat = matAt(mesh, i) as THREE.MeshStandardMaterial | null;
    if (!mat?.map) return;
    let job = jobs.get(mat);
    if (!job) jobs.set(mat, (job = { mat, mesh, sample: i, spots: [], rgb }));
    job.spots.push({ uv: new THREE.Vector2().fromBufferAttribute(mesh.geometry.getAttribute('uv') as THREE.BufferAttribute, i), weight });
  };
  for (const mesh of meshes) {
    const face = /face/i.test(mesh.name);
    const pos = mesh.geometry.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      const rel = p.clone().sub(neck);
      const ahead = rel.dot(fwd);
      const side = Math.abs(rel.clone().addScaledVector(fwd, -ahead).setY(0).length());
      let w = 0;
      if (!face && side < 0.07 && ahead > -0.01 && p.y < chinY + 0.004 && p.y > chinY - 0.05) {
        // Cuello: mas sombra delante y en el centro, menos hacia los lados.
        w = chinShade(chinY - p.y) * Math.max(0, 1 - side / 0.07) ** 0.5;
      } else if (face && p.y > eyeY + 0.012) {
        w = browShade(p.y - eyeY) * 0.8;
      }
      if (w < 0.02 || !isSkin(mesh, i)) continue;
      add(mesh, i, w, face ? shade.brow : shade.chin);
    }
  }
  for (const job of jobs.values()) paint(job);
}

function paint(job: Job): void {
  const { mat } = job;
  const map = mat.map!;
  const src = map.image as (CanvasImageSource & { width: number; height: number }) | undefined;
  if (!src?.width) return;
  const W = src.width;
  const H = src.height;
  const ppm = pixelsPerMeter(job.mesh, job.sample);
  const r = Math.max(2, 0.009 * ppm);

  // Mascara: manchas grises sobre negro, combinadas con el maximo.
  const mask = document.createElement('canvas');
  mask.width = W;
  mask.height = H;
  const m = mask.getContext('2d');
  if (!m) return;
  m.fillStyle = '#000';
  m.fillRect(0, 0, W, H);
  m.globalCompositeOperation = 'lighten';
  for (const s of job.spots) {
    const v = Math.round(255 * s.weight);
    const x = s.uv.x * W;
    const y = s.uv.y * H;
    const g = m.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgb(${v},${v},${v})`);
    g.addColorStop(1, 'rgb(0,0,0)');
    m.fillStyle = g;
    m.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // Suavizar la mascara para que no se noten las manchas.
  const soft = document.createElement('canvas');
  soft.width = W;
  soft.height = H;
  const sctx = soft.getContext('2d');
  if (!sctx) return;
  sctx.filter = `blur(${Math.round(r * 0.6)}px)`;
  sctx.drawImage(mask, 0, 0);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, W, H);
  const k = sctx.getImageData(0, 0, W, H).data;
  const d = img.data;
  const [cr, cg, cb] = job.rgb;
  for (let i = 0; i < d.length; i += 4) {
    const a = k[i]! / 255;
    if (a <= 0) continue;
    d[i] = d[i]! * (1 - a * (1 - cr));
    d[i + 1] = d[i + 1]! * (1 - a * (1 - cg));
    d[i + 2] = d[i + 2]! * (1 - a * (1 - cb));
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = map.flipY;
  tex.colorSpace = map.colorSpace;
  tex.wrapS = map.wrapS;
  tex.wrapT = map.wrapT;
  tex.anisotropy = map.anisotropy;
  tex.needsUpdate = true;
  const mtoon = mat as unknown as { shadeMultiplyTexture?: THREE.Texture | null };
  if (mtoon.shadeMultiplyTexture && mtoon.shadeMultiplyTexture.image === src) mtoon.shadeMultiplyTexture = tex;
  mat.map = tex;
  mat.needsUpdate = true;
}
