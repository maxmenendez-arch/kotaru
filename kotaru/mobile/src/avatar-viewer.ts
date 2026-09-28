import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils, type VRM, type VRMHumanBoneName } from '@pixiv/three-vrm';
import type { AvatarProps } from './avatar-types';
import {
  approach,
  Blinker,
  FACE_EXPRESSIONS,
  gestureOffset,
  mouthShapes,
  stateOffset,
  targetFace,
} from './avatar-motion';

/**
 * Motor del avatar 3D de la web (three.js + three-vrm). Solo lo importa avatar.web.tsx, con
 * import dinamico: Metro lo deja en un archivo aparte que se descarga al mostrar el avatar.
 */

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Carga el modelo y arranca la animacion. Devuelve la funcion que lo apaga todo. */
export async function startViewer(canvas: HTMLCanvasElement, url: string, props: () => AvatarProps): Promise<() => void> {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const resize = () => renderer.setSize(props().size, props().size, false);
  resize();
  canvas.addEventListener('kotaru-resize', resize);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(20, 1, 0.05, 20);
  const key = new THREE.DirectionalLight(0xffffff, Math.PI * 0.7);
  key.position.set(0.6, 1.2, 1.6);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.35));

  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));
  let gltf: Awaited<ReturnType<typeof loader.loadAsync>>;
  try {
    gltf = await loader.loadAsync(url);
  } catch (error) {
    renderer.dispose();
    throw error;
  }
  const vrm = gltf.userData['vrm'] as VRM | undefined;
  if (!vrm) {
    renderer.dispose();
    throw new Error('el archivo no es un VRM');
  }
  VRMUtils.removeUnnecessaryVertices(gltf.scene);
  VRMUtils.combineSkeletons(gltf.scene);
  VRMUtils.rotateVRM0(vrm);
  vrm.scene.traverse((object) => {
    object.frustumCulled = false;
  });
  scene.add(vrm.scene);

  const bone = (name: VRMHumanBoneName) => vrm.humanoid.getNormalizedBoneNode(name);
  relaxPose(bone);
  vrm.update(0);

  // Encuadre de busto: la camara apunta un poco por debajo de la cabeza.
  const head = bone('head');
  const headPos = new THREE.Vector3();
  (head ?? vrm.scene).getWorldPosition(headPos);
  const focus = headPos.clone().add(new THREE.Vector3(0, -0.03, 0));
  camera.position.set(focus.x, focus.y + 0.03, focus.z + 1.5);
  camera.lookAt(focus);

  // Mira a la persona (la camara); al pensar, desvia la mirada hacia arriba.
  const gaze = new THREE.Object3D();
  scene.add(gaze);
  if (vrm.lookAt) vrm.lookAt.target = gaze;

  return animate(renderer, scene, camera, vrm, gaze, props, () => {
    canvas.removeEventListener('kotaru-resize', resize);
    scene.remove(vrm.scene);
    VRMUtils.deepDispose(vrm.scene);
    renderer.dispose();
    renderer.forceContextLoss();
  });
}

/** De la T de VRoid a una postura natural: brazos abajo, codos algo doblados. */
function relaxPose(bone: (name: VRMHumanBoneName) => THREE.Object3D | null): void {
  const set = (name: VRMHumanBoneName, x: number, y: number, z: number) => bone(name)?.rotation.set(x, y, z);
  set('leftUpperArm', 0, 0, -1.2);
  set('rightUpperArm', 0, 0, 1.2);
  set('leftLowerArm', 0, -0.25, 0);
  set('rightLowerArm', 0, 0.25, 0);
  set('leftHand', 0, 0, -0.1);
  set('rightHand', 0, 0, 0.1);
}

function animate(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  vrm: VRM,
  gaze: THREE.Object3D,
  props: () => AvatarProps,
  cleanup: () => void,
): () => void {
  const timer = new THREE.Timer();
  timer.connect(document);
  const blinker = new Blinker();
  const reduce = prefersReducedMotion();
  const expressions = vrm.expressionManager;
  const face: Record<string, number> = { happy: 0, sad: 0, relaxed: 0, surprised: 0 };
  let mouth = 0;
  let headX = 0;
  let headY = 0;
  let headZ = 0;
  let frame = 0;
  let running = true;

  const spine = vrm.humanoid.getNormalizedBoneNode('spine');
  const chest = vrm.humanoid.getNormalizedBoneNode('chest') ?? vrm.humanoid.getNormalizedBoneNode('upperChest');
  const neck = vrm.humanoid.getNormalizedBoneNode('neck');
  const head = vrm.humanoid.getNormalizedBoneNode('head');

  const tick = () => {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.1);
    const t = timer.getElapsed();
    const now = performance.now();
    const p = props();

    // Cara: emocion o reposo, con transiciones suaves.
    const target = targetFace(p.companion, p.affect, now);
    for (const name of FACE_EXPRESSIONS) {
      face[name] = approach(face[name] ?? 0, target[name], dt, 4);
      expressions?.setValue(name, face[name]!);
    }
    expressions?.setValue('blink', blinker.weight(t) * (1 - (face['happy'] ?? 0) * 0.6));

    // Boca: solo mientras suena su voz.
    const speaking = p.state === 'speaking';
    mouth = approach(mouth, speaking ? p.level() * 1.3 : 0, dt, 18);
    const shapes = mouthShapes(mouth, t);
    expressions?.setValue('aa', shapes.aa);
    expressions?.setValue('oh', shapes.oh);
    expressions?.setValue('ih', shapes.ih);

    // Cabeza: postura del estado + gesto + un balanceo muy leve.
    const pose = stateOffset(p.state);
    const gesture = reduce || !p.affect ? { x: 0, y: 0, z: 0 } : gestureOffset(p.affect.gesture, (now - p.affect.at) / 1000);
    const sway = reduce ? 0 : 1;
    headX = approach(headX, pose.x + gesture.x + Math.sin(t * 0.8) * 0.015 * sway, dt, 6);
    headY = approach(headY, pose.y + gesture.y + Math.sin(t * 0.45) * 0.05 * sway, dt, 6);
    headZ = approach(headZ, pose.z + gesture.z + Math.sin(t * 0.6) * 0.02 * sway, dt, 6);
    if (neck) neck.rotation.set(headX * 0.4, headY * 0.4, headZ * 0.4);
    if (head) head.rotation.set(headX * 0.6, headY * 0.6, headZ * 0.6);

    // Respiracion: el pecho sube y baja unas 15 veces por minuto.
    const breath = reduce ? 0 : Math.sin(t * 1.6);
    if (spine) spine.rotation.x = breath * 0.012;
    if (chest) chest.rotation.x = breath * 0.018;

    // Mirada: a la camara; al pensar, arriba y a un lado.
    const thinking = p.state === 'thinking';
    gaze.position.set(camera.position.x + (thinking ? 0.25 : 0), camera.position.y + (thinking ? 0.2 : 0), camera.position.z);

    vrm.update(dt);
    renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    running = false;
    cancelAnimationFrame(frame);
    timer.dispose();
    cleanup();
  };
}
