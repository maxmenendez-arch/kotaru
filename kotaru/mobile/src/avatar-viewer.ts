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
import { PALETTES } from './scenes';
import { assignLayers, createStagePost, type StagePost } from './stage-post';
import { IdleBody } from './idle-body';
import { styleFor } from './body-styles';
import { frameCamera, pixelRatio, type Framing } from './framing';

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
  const withBackground = props().background === true;
  const framing: Framing = !withBackground ? 'portrait' : props().immersive ? 'immersive' : 'stage';
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(20, 1, 0.05, 80);
  let post: StagePost | null = null;
  let headY = 1.4;
  const drawingSize = new THREE.Vector2();
  let shot: { fov: number; y: number; z: number; targetY: number } | null = null;
  let goal: { fov: number; y: number; z: number; targetY: number } | null = null;
  const applyShot = () => {
    if (!shot) return;
    camera.fov = shot.fov;
    camera.position.set(0, shot.y, shot.z);
    camera.lookAt(0, shot.targetY, 0);
    camera.updateProjectionMatrix();
  };
  /** Acerca la camara al encuadre pedido (suave, ~0,4 s). Devuelve si se movio. */
  const easeShot = (dt: number): boolean => {
    if (!shot || !goal) return false;
    const k = Math.min(1, dt * 6);
    let moved = false;
    for (const key of ['fov', 'y', 'z', 'targetY'] as const) {
      const d = goal[key] - shot[key];
      if (Math.abs(d) > 1e-4) {
        shot[key] += d * k;
        moved = true;
      } else shot[key] = goal[key];
    }
    if (moved) applyShot();
    return moved;
  };
  const resize = () => {
    const p = props();
    const w = p.width ?? p.size;
    // Con fondo se dibuja mucho mas: la densidad se limita segun el tamaño (framing.ts).
    renderer.setPixelRatio(pixelRatio(framing, w, p.size, window.devicePixelRatio || 1));
    renderer.setSize(w, p.size, false);
    camera.aspect = w / p.size;
    camera.updateProjectionMatrix();
    const setup = frameCamera(framing, camera.aspect, headY, p.freeBottom);
    // La primera vez, directo; despues la camara se desliza hasta el nuevo encuadre.
    if (!shot) {
      shot = { ...setup };
      applyShot();
    }
    goal = setup;
    renderer.getDrawingBufferSize(drawingSize);
    post?.setSize(drawingSize.x, drawingSize.y);
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

  // Encuadre segun la altura de la cabeza de este modelo (framing.ts).
  const head = bone('head');
  const headPos = new THREE.Vector3();
  (head ?? vrm.scene).getWorldPosition(headPos);
  headY = headPos.y;
  const focus = headPos.clone().add(new THREE.Vector3(0, -0.03, 0));
  shot = null;
  resize();

  // El lugar del personaje, con sus propias luces (sustituyen a las del retrato).
  let stage: Stage | null = null;
  if (withBackground) {
    stage = buildStage(props().companion, scene, focus);
    if (stage) {
      scene.remove(key, ambient);
      renderer.setClearColor(0x000000, 1);
      // Acabado de camara: fondo desenfocado, halo y color. Se puede apagar con ?post=0.
      if (postAllowed()) {
        post = createStagePost(renderer, PALETTES[stage.id].grade);
        if (post) {
          assignLayers(scene, vrm.scene);
          resize();
        }
      }
    }
  }

  // Mira a la persona (la camara); al pensar, desvia la mirada hacia arriba.
  const gaze = new THREE.Object3D();
  scene.add(gaze);
  if (vrm.lookAt) vrm.lookAt.target = gaze;

  return animate(renderer, scene, camera, vrm, gaze, props, stage, post, easeShot, () => {
    canvas.removeEventListener('kotaru-resize', resize);
    post?.dispose();
    stage?.dispose();
    scene.remove(vrm.scene);
    VRMUtils.deepDispose(vrm.scene);
    renderer.dispose();
    renderer.forceContextLoss();
  });
}

/** El acabado se puede apagar para comparar (o si un navegador lo dibuja mal): ?post=0. */
function postAllowed(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('post') !== '0';
  } catch {
    return true;
  }
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
  post: StagePost | null,
  easeShot: (dt: number) => boolean,
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

  const body = new IdleBody((name) => vrm.humanoid.getNormalizedBoneNode(name), styleFor(props().companion));
  const neck = vrm.humanoid.getNormalizedBoneNode('neck');
  const head = vrm.humanoid.getNormalizedBoneNode('head');

  // Con fondo se dibuja mucho mas por cuadro: a 30 por segundo basta (lluvia, velas y boca
  // se ven igual de fluidas) y el telefono gasta la mitad. Y si el escenario no esta en
  // pantalla (pagina desplazada), no se dibuja.
  const minFrameMs = stage ? 1000 / 30 - 2 : 0;
  let lastDraw = 0;
  let visible = true;
  const observer =
    stage && typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((entries) => {
          visible = entries.some((e) => e.isIntersecting);
        })
      : null;
  observer?.observe(renderer.domElement);

  // El lienzo puede mudarse a la ventana flotante (pip.web.ts): entonces se anima con la
  // ventana donde esta (la de la app queda en segundo plano y el navegador la frena) y se
  // dibuja aunque el observador de la app diga que no se ve.
  const hostWindow = (): Window => renderer.domElement.ownerDocument.defaultView ?? window;
  let frameWindow: Window = window;
  const tick = () => {
    if (!running) return;
    frameWindow = hostWindow();
    frame = frameWindow.requestAnimationFrame(tick);
    const nowMs = performance.now();
    const away = renderer.domElement.ownerDocument !== document;
    if ((!visible && !away) || nowMs - lastDraw < minFrameMs) return;
    lastDraw = nowMs;
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
    headX = approach(headX, pose.x + gesture.x + Math.sin(t * 0.8) * 0.015 * sway + body.head.x, dt, 6);
    headY = approach(headY, pose.y + gesture.y + Math.sin(t * 0.45) * 0.05 * sway + body.head.y, dt, 6);
    headZ = approach(headZ, pose.z + gesture.z + Math.sin(t * 0.6) * 0.02 * sway + body.head.z, dt, 6);
    if (neck) neck.rotation.set(headX * 0.4, headY * 0.4, headZ * 0.4);
    if (head) head.rotation.set(headX * 0.6, headY * 0.6, headZ * 0.6);

    // Cuerpo: respiracion, cambio de peso, brazos y manos vivos; mas gesto al hablar.
    body.update(t, dt, { still: reduce, speaking, level: mouth });

    // Mirada: a la camara con pequeños saltos naturales; al pensar, arriba y a un lado.
    const thinking = p.state === 'thinking';
    const glance = reduce ? { x: 0, y: 0 } : body.glance(t);
    gaze.position.set(
      camera.position.x + (thinking ? 0.25 : glance.x),
      camera.position.y + (thinking ? 0.2 : glance.y),
      camera.position.z,
    );

    easeShot(reduce ? 1 : dt);
    stage?.update(t, reduce);
    vrm.update(dt);
    if (post) post.render(scene, camera, t);
    else renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    running = false;
    frameWindow.cancelAnimationFrame(frame);
    observer?.disconnect();
    timer.dispose();
    cleanup();
  };
}
