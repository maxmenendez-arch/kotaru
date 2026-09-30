/**
 * Cinematica inversa de dos huesos (brazo y antebrazo): lleva la mano a un punto y el codo
 * hacia un lado. Para poses que no salen de una captura (las manos a la espalda de Nova).
 * Trabaja sobre los huesos normalizados del VRM, en el espacio del mundo.
 */
import * as THREE from 'three';

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _e = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _n = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _pw = new THREE.Quaternion();
const _w = new THREE.Quaternion();

/** Punto del codo: a `l1` del hombro, con la mano a `l2` del codo, doblado hacia `pole`. */
export function elbowPoint(a: THREE.Vector3, target: THREE.Vector3, pole: THREE.Vector3, l1: number, l2: number, out: THREE.Vector3): THREE.Vector3 {
  _dir.copy(target).sub(a);
  const d = Math.min(Math.max(_dir.length(), Math.abs(l1 - l2) + 1e-4), l1 + l2 - 1e-4);
  _dir.normalize();
  // Direccion del codo: la del polo, sin su parte a lo largo del brazo.
  _n.copy(pole).sub(a);
  _n.addScaledVector(_dir, -_n.dot(_dir));
  if (_n.lengthSq() < 1e-8) _n.set(0, -1, 0).addScaledVector(_dir, -_dir.y);
  _n.normalize();
  const cos = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const sin = Math.sqrt(Math.max(0, 1 - cos * cos));
  return out.copy(a).addScaledVector(_dir, l1 * cos).addScaledVector(_n, l1 * sin);
}

/** Gira `node` (en su espacio local) para que su hijo pase de apuntar `from` a apuntar `to` (mundo). */
function aim(node: THREE.Object3D, from: THREE.Vector3, to: THREE.Vector3): void {
  _q.setFromUnitVectors(from.normalize(), to.normalize());
  node.getWorldQuaternion(_w);
  node.parent!.getWorldQuaternion(_pw);
  // local' = inv(padre) * giro * mundo
  node.quaternion.copy(_pw.invert().multiply(_q).multiply(_w));
}

/** Coloca brazo y antebrazo: la mano (`hand`) en `target`, el codo hacia `pole`. */
export function twoBoneIK(upper: THREE.Object3D, lower: THREE.Object3D, hand: THREE.Object3D, target: THREE.Vector3, pole: THREE.Vector3): void {
  upper.updateWorldMatrix(true, true);
  upper.getWorldPosition(_a);
  lower.getWorldPosition(_b);
  hand.getWorldPosition(_c);
  const l1 = _a.distanceTo(_b);
  const l2 = _b.distanceTo(_c);
  elbowPoint(_a, target, pole, l1, l2, _e);
  aim(upper, _b.clone().sub(_a), _e.clone().sub(_a));
  upper.updateWorldMatrix(false, true);
  lower.getWorldPosition(_b);
  hand.getWorldPosition(_c);
  aim(lower, _c.clone().sub(_b), target.clone().sub(_b));
  lower.updateWorldMatrix(false, true);
}
