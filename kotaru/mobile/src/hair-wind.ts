import * as THREE from 'three';
import type { VRM } from '@pixiv/three-vrm';
import type { CompanionId } from './companions';

/**
 * Viento en el pelo y la ropa suelta (los "spring bones" de VRoid): una brisa con rachas
 * que empuja un poco la gravedad de esas cadenas hacia un lado. Rio esta al aire libre
 * (brisa de montaña); Luna tiene la ventana abierta (muy suave); Nova, un cuarto cerrado
 * (casi nada: solo el aire de moverse).
 */
export const WIND: Readonly<Record<CompanionId, { strength: number; gustiness: number }>> = {
  rio: { strength: 0.35, gustiness: 0.6 },
  luna: { strength: 0.12, gustiness: 0.4 },
  nova: { strength: 0.04, gustiness: 0.3 },
};

/** Fuerza de la racha en el segundo `t` (0 a 1): suma de ondas lentas, nunca periodica a simple vista. */
export function gust(t: number, gustiness: number): number {
  const slow = 0.5 + 0.5 * Math.sin(t * 0.31) * Math.sin(t * 0.17 + 1.3);
  const fast = 0.5 + 0.5 * Math.sin(t * 1.3 + Math.sin(t * 0.7));
  return Math.min(1, Math.max(0, slow * (1 - gustiness) + fast * gustiness * slow + 0.15));
}

export interface HairWind {
  update(t: number): void;
}

export function createHairWind(vrm: VRM, companion: CompanionId, still: boolean): HairWind {
  const joints = [...(vrm.springBoneManager?.joints ?? [])];
  const wind = WIND[companion];
  if (joints.length === 0 || still || wind.strength <= 0) return { update() {} };
  const base = joints.map((j) => ({ dir: j.settings.gravityDir.clone(), power: j.settings.gravityPower }));
  // Sopla desde delante y un lado del personaje hacia atras (el pelo se aparta de la cara).
  const from = new THREE.Vector3(0.55, 0, -0.8).normalize();
  const dir = new THREE.Vector3();
  return {
    update(t) {
      const g = gust(t, wind.gustiness) * wind.strength;
      joints.forEach((joint, i) => {
        const b = base[i]!;
        // Gravedad del modelo (hacia abajo) mas el empuje del viento.
        dir.copy(b.dir).multiplyScalar(Math.max(0.0001, b.power)).addScaledVector(from, g);
        const power = dir.length();
        joint.settings.gravityPower = power;
        joint.settings.gravityDir.copy(dir.normalize());
      });
    },
  };
}
