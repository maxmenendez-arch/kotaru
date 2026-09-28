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
import { buildStage, type Stage } from './scene3d';

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
  // Con fondo se dibuja mucho mas: en pantallas muy densas basta con 1,5x.
  const withBackground = props().background === true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, withBackground ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  // Con fondo el encuadre es algo mas abierto, para que se vea el lugar.
  const camera = new THREE.PerspectiveCamera(withBackground ? 26 : 20, 1, 0.05, 80);
  const resize = () => {
    const p = props();
    const w = p.width ?? p.size;
    renderer.setSize(w, p.size, false);
    camera.aspect = w / p.size;
    // Escenario bajo (con conversacion en pantalla): se acerca a la cara para que no quede diminuta.
    if (withBackground) camera.fov = camera.aspect > 2.1 ? 15 : 26;
    camera.updateProjectionMatrix();
  };
  resize();
  canvas.addEventListener('kotaru-resize', resize);
  const key = new THREE.DirectionalLight(0xffffff, Math.PI * 0.7);
  key.position.set(0.6, 1.2, 1.6);
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(key, ambient);

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
  // Mismo tamaño de busto con o sin fondo: mas angulo, un poco mas cerca.
  camera.position.set(focus.x, focus.y + 0.03, focus.z + (withBackground ? 1.35 : 1.5));
  camera.lookAt(focus);

  // El lugar del personaje, con sus propias luces (sustituyen a las del retrato).
  let stage: Stage | null = null;
  if (withBackground) {
    stage = buildStage(props().companion, scene, focus);
    if (stage) {
      scene.remove(key, ambient);
      renderer.setClearColor(0x000000, 1);
    }
  }

  // Mira a la persona (la camara); al pensar, desvia la mirada hacia arriba.
  const gaze = new THREE.Object3D();
  scene.add(gaze);
  if (vrm.lookAt) vrm.lookAt.target = gaze;

  return animate(renderer, scene, camera, vrm, gaze, props, stage, () => {
    canvas.removeEventListener('kotaru-resize', resize);
    stage?.dispose();
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
  stage: Stage | null,
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

    stage?.update(t, reduce);
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
