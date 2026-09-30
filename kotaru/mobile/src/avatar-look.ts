import * as THREE from 'three';
import type { VRM } from '@pixiv/three-vrm';
import type { CompanionId } from './companions';
import { LOOKS, catchlightOpacity, materialKind } from './looks';

/** Lo que cambia cuadro a cuadro del acabado: el brillo de los ojos se apaga al parpadear o sonreir. */
export interface LookHandle {
  /** `closed`: 0 ojos abiertos, 1 cerrados (parpadeo, sonrisa con ojos cerrados). */
  update(closed: number): void;
  dispose(): void;
}

interface MToonLike {
  name: string;
  parametricRimColorFactor?: THREE.Color;
  parametricRimFresnelPowerFactor?: number;
  rimLightingMixFactor?: number;
  emissive?: THREE.Color;
  shadeColorFactor?: THREE.Color;
}

/**
 * Aplica el acabado de looks.ts a los materiales del modelo y, si el modelo no trae capa de
 * brillo en los ojos, añade un punto de luz en cada uno (pegado al hueso del ojo, asi sigue
 * a la mirada). El punto se coloca buscando la superficie del ojo con un rayo desde delante.
 */
export function applyLook(vrm: VRM, companion: CompanionId): LookHandle {
  const look = LOOKS[companion];
  let hasHighlight = false;
  const eyeMeshes: THREE.Object3D[] = [];
  vrm.scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    for (const material of ([] as THREE.Material[]).concat(mesh.material)) {
      const m = material as unknown as MToonLike;
      const kind = materialKind(m.name ?? '');
      if (kind === 'eye-highlight') hasHighlight = true;
      if (kind === 'eye') eyeMeshes.push(mesh);
      if (kind === 'hair' && m.emissive) m.emissive.multiplyScalar(look.hairEmissive);
      if (kind === 'skin' && m.shadeColorFactor) m.shadeColorFactor.setHex(look.skinShade);
      if ((kind === 'hair' || kind === 'skin' || kind === 'cloth') && m.parametricRimColorFactor) {
        m.parametricRimColorFactor.setHex(look.rim);
        if (m.parametricRimFresnelPowerFactor !== undefined) m.parametricRimFresnelPowerFactor = look.rimPower;
      }
    }
  });

  const dots: THREE.Mesh[] = [];
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: look.catchlight.strength, depthWrite: false, map: softDot() });
  const geometry = new THREE.CircleGeometry(1, 20);
  if (!hasHighlight && look.catchlight.size > 0) {
    vrm.scene.updateMatrixWorld(true);
    for (const iris of irisPerEye(eyeMeshes)) {
      // Cada punto va pegado al hueso del ojo de su lado (asi sigue a la mirada), arriba y
      // hacia la luz principal, justo delante de la superficie del iris.
      const bone = vrm.humanoid.getRawBoneNode(iris.center.x > 0 ? 'leftEye' : 'rightEye') ?? vrm.humanoid.getRawBoneNode('head');
      if (!bone) continue;
      const r = iris.radius;
      // Un brillo grande arriba, hacia la luz, y uno pequeño abajo, del otro lado (como en la ilustracion anime).
      // Algo por debajo del centro: el parpado tapa la parte de arriba del iris y, en el
      // centro de su caja, el brillo quedaba pegado a las pestañas (como una pegatina).
      for (const [dx, dy, size] of [
        [-0.15, -0.16, 0.16],
        [0.12, -0.38, 0.07],
      ] as const) {
        const world = new THREE.Vector3(iris.center.x + r * dx, iris.center.y + r * dy, iris.front + 0.004);
        const dot = new THREE.Mesh(geometry, material);
        // Despues de las capas del ojo (VRoid las dibuja como transparentes, al final).
        dot.renderOrder = 10000;
        // Es diminuto: con el recorte por camara de three.js a veces desaparecia.
        dot.frustumCulled = false;
        bone.add(dot);
        dot.position.copy(bone.worldToLocal(world));
        dot.quaternion.copy(bone.getWorldQuaternion(new THREE.Quaternion()).invert());
        dot.scale.setScalar((r * size * look.catchlight.size) / Math.max(1e-6, bone.getWorldScale(new THREE.Vector3()).x));
        dots.push(dot);
      }
    }
  }

  return {
    update(closed: number) {
      material.opacity = look.catchlight.strength * catchlightOpacity(closed);
    },
    dispose() {
      for (const dot of dots) dot.removeFromParent();
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
    },
  };
}

/**
 * Centro, radio y frente de cada iris, medidos en los vertices del material del iris (ya
 * con su esqueleto en reposo). En VRoid el hueso del ojo no esta donde se dibuja el iris.
 */
function irisPerEye(meshes: THREE.Object3D[]): { center: THREE.Vector3; radius: number; front: number }[] {
  const sides = [new THREE.Box3(), new THREE.Box3()];
  const v = new THREE.Vector3();
  for (const object of meshes) {
    const mesh = object as THREE.SkinnedMesh;
    const materials = ([] as THREE.Material[]).concat(mesh.material);
    if (!materials.some((m) => m.name.toUpperCase().includes('IRIS'))) continue;
    const position = mesh.geometry.getAttribute('position');
    if (!position) continue;
    for (let i = 0; i < position.count; i++) {
      if (mesh.isSkinnedMesh) mesh.getVertexPosition(i, v);
      else v.fromBufferAttribute(position, i);
      mesh.localToWorld(v);
      sides[v.x > 0 ? 0 : 1]!.expandByPoint(v);
    }
  }
  return sides
    .filter((box) => !box.isEmpty())
    .map((box) => {
      const size = box.getSize(new THREE.Vector3());
      return { center: box.getCenter(new THREE.Vector3()), radius: Math.min(size.x, size.y) / 2, front: box.max.z };
    });
}

/** Punto blanco de borde suave (degradado radial), para que el brillo no parezca una pegatina. */
function softDot(): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const g = canvas.getContext('2d');
  if (!g) return null;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.55, 'rgba(255,255,255,0.95)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
