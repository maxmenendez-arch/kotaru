/**
 * Rubor (2-oct, realismo): un toque de color en las mejillas, como el de una piel viva o un
 * maquillaje suave. Se pinta en la textura de la piel de la cara (igual que fabric-detail.ts):
 * se busca en la malla la mejilla de cada lado (bajo el ojo, algo hacia fuera, lo mas
 * adelantado) y su coordenada de textura. Mas marcado en Luna y Nova, apenas en Rio.
 * Se apaga con ?blush=0.
 */
import * as THREE from 'three';
import type { VRM } from '@pixiv/three-vrm';
import { BLUSH, materialKind } from './looks';
import { materialOf, pixelsPerMeter } from './fabric-detail';


export function applyBlush(vrm: VRM, companion: string): void {
  const blush = BLUSH[companion];
  if (!blush || typeof document === 'undefined') return;
  vrm.scene.updateMatrixWorld(true);
  const eyes = (['leftEye', 'rightEye'] as const).map((b) => vrm.humanoid.getRawBoneNode(b)?.getWorldPosition(new THREE.Vector3()) ?? null);
  const head = vrm.humanoid.getRawBoneNode('head')?.getWorldPosition(new THREE.Vector3());
  if (!eyes[0] || !eyes[1] || !head) return;
  const mid = eyes[0].clone().add(eyes[1]).multiplyScalar(0.5);
  // Hacia donde mira la cara (en horizontal): de la cabeza al punto entre los ojos.
  const fwd = mid.clone().sub(head).setY(0).normalize();
  const spots: { mesh: THREE.SkinnedMesh; vertex: number }[] = [];
  vrm.scene.traverse((o) => {
    const mesh = o as THREE.SkinnedMesh;
    if (!mesh.isSkinnedMesh || !/face/i.test(mesh.name)) return;
    const pos = mesh.geometry.getAttribute('position');
    const p = new THREE.Vector3();
    for (const eye of eyes as THREE.Vector3[]) {
      const out = eye.clone().sub(mid).setY(0).normalize();
      const target = eye.clone().addScaledVector(out, 0.006).add(new THREE.Vector3(0, -0.03, 0));
      let best = -1;
      let bestScore = Infinity;
      for (let i = 0; i < pos.count; i++) {
        p.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
        const lateral = p.clone().sub(target);
        const along = lateral.dot(fwd);
        lateral.addScaledVector(fwd, -along);
        const d = lateral.length();
        if (d > 0.012) continue;
        // Lo mas adelantado (la superficie de la mejilla, no el interior de la boca).
        const score = d * 4 - along;
        if (score >= bestScore) continue;
        const mat = materialOf(mesh, i) as { name?: string } | null;
        if (!mat || materialKind(mat.name ?? '') !== 'skin') continue;
        bestScore = score;
        best = i;
      }
      if (best >= 0) spots.push({ mesh, vertex: best });
    }
  });
  if (spots.length !== 2) return;
  const mat = materialOf(spots[0]!.mesh, spots[0]!.vertex) as THREE.MeshStandardMaterial | null;
  const map = mat?.map;
  const src = map?.image as (CanvasImageSource & { width: number; height: number }) | undefined;
  if (!mat || !map || !src?.width) return;
  const canvas = document.createElement('canvas');
  canvas.width = src.width;
  canvas.height = src.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(src, 0, 0);
  for (const s of spots) {
    const uv = new THREE.Vector2().fromBufferAttribute(s.mesh.geometry.getAttribute('uv') as THREE.BufferAttribute, s.vertex);
    const ppm = pixelsPerMeter(s.mesh, s.vertex);
    const x = uv.x * src.width;
    const y = uv.y * src.height;
    const r = 0.013 * ppm;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1.5, 0.85);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, `rgba(${blush.rgb},${blush.alpha})`);
    g.addColorStop(0.6, `rgba(${blush.rgb},${blush.alpha * 0.45})`);
    g.addColorStop(1, `rgba(${blush.rgb},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
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
