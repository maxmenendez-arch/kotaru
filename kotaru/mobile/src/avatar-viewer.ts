import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils, type VRM, type VRMHumanBoneName } from '@pixiv/three-vrm';
import type { AvatarProps } from './avatar-types';
import {
  AFFECT_HOLD_MS,
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
import { CharacterMotion, rigRest, showcaseList } from './character-motion';
import { applyFabricDetail } from './fabric-detail';
import { ArmCollider, measureBody } from './arm-collision';
import { IdleBody, armEnvelope, armForEmotion, armForGesture, emotionEnergy } from './idle-body';
import { applyLook, type LookHandle } from './avatar-look';
import { createHairWind } from './hair-wind';
import { REELS, reelCamera, reelCue, reelFade, reelVoice, type Anchors } from './reel';
import { styleFor } from './body-styles';
import { CloseUpDirector, zoomFov } from './close-ups';
import { applyBlush } from './face-detail';
import { cameraDrift, frameCamera, pixelRatio, smoothNoise, type Drift, type Framing } from './framing';

/** Primer plano del modo cinematico: punto mirado, alto visible (zoom), deslizamiento y peso. */
const VISEMES = ['aa', 'ih', 'ou', 'ee', 'oh'] as const;
type CloseShot = { target: [number, number, number]; span: number; slide: number; w: number };

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
  // Camara viva solo en el escenario (no en el retrato redondo); ?drift=0 la apaga.
  const drifts = withBackground && new URLSearchParams(globalThis.location?.search ?? '').get('drift') !== '0';
  let drift: Drift = { x: 0, y: 0, z: 0, tx: 0, ty: 0, roll: 0 };
  // Primer plano del camarografo (close-ups.ts), mezclado con el encuadre normal segun `w`.
  let close: CloseShot | null = null;
  const applyShot = () => {
    if (!shot) return;
    const px = drift.x;
    const py = shot.y + drift.y;
    const pz = shot.z + drift.z;
    const tx = drift.tx;
    const ty = shot.targetY + drift.ty;
    if (!close || close.w <= 0) {
      camera.fov = shot.fov;
      camera.position.set(px, py, pz);
      camera.lookAt(tx, ty, 0);
    } else {
      // Zoom del camarografo: la camara apenas se mueve (un paso de lado); lo que cambia es el
      // angulo del objetivo, del plano normal al encuadre pedido.
      const w = close.w;
      camera.position.set(px + close.slide * w, py, pz);
      const [cx, cy, cz] = close.target;
      const lx = tx + (cx - tx) * w;
      const ly = ty + (cy - ty) * w;
      const lz = cz * w;
      camera.lookAt(lx, ly, lz);
      const d = Math.hypot(camera.position.x - lx, camera.position.y - ly, camera.position.z - lz);
      const baseSpan = 2 * d * Math.tan((shot.fov * Math.PI) / 360);
      camera.fov = zoomFov(baseSpan + (close.span - baseSpan) * w, d);
    }
    if (drift.roll) camera.rotateZ(drift.roll);
    camera.updateProjectionMatrix();
  };
  /** Acerca la camara al encuadre pedido (suave, ~0,4 s). Devuelve si se movio. */
  const easeShot = (dt: number, d?: typeof drift, c?: CloseShot | null): boolean => {
    if (d) {
      if (drifts) drift = d;
      close = c ?? null;
      applyShot();
      return true;
    }
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
  // Esqueleto de reposo para la captura de movimiento (antes de cambiar la pose).
  const motion = flagOn('mocap') ? new CharacterMotion(vrm, rigRest(vrm), props().companion) : null;
  // Volumen del cuerpo y la ropa: los brazos no pueden entrar (arm-collision.ts). ?collide=0 lo apaga.
  const profile = flagOn('collide') ? measureBody(vrm) : null;
  const collider = profile ? new ArmCollider(vrm, profile) : null;
  // Tela que se apoya en el cuerpo (fabric-detail.ts; solo Nova). ?fabric=0 lo apaga.
  if (flagOn('fabric')) applyFabricDetail(vrm, props().companion);
  if (flagOn('blush')) applyBlush(vrm, props().companion);
  relaxPose(bone);
  vrm.update(0);
  // Acabado por personaje: luz de borde de su escenario, pelo con sombra, brillo en los ojos.
  const look: LookHandle = flagOn('look') ? applyLook(vrm, props().companion) : { update: () => {}, dispose: () => {} };

  // Encuadre segun la altura de la cabeza de este modelo (framing.ts).
  const head = bone('head');
  const headPos = new THREE.Vector3();
  (head ?? vrm.scene).getWorldPosition(headPos);
  headY = headPos.y;
  const focus = headPos.clone().add(new THREE.Vector3(0, -0.03, 0));
  const eye = bone('leftEye');
  const eyePos = new THREE.Vector3();
  if (eye) eye.getWorldPosition(eyePos);
  const anchors: Anchors = { headY, eyeY: eye ? eyePos.y : headY + 0.06, x: headPos.x, z: headPos.z, eyeZ: eye ? eyePos.z : headPos.z + 0.08 };
  shot = null;
  resize();

  // El lugar del personaje, con sus propias luces (sustituyen a las del retrato).
  let stage: Stage | null = null;
  let contact: THREE.Mesh | null = null;
  if (withBackground) {
    stage = buildStage(props().companion, scene, focus);
    if (stage) {
      // Sombra de contacto (2-oct): una mancha suave en el suelo bajo los pies, para que el
      // personaje pise el suelo en vez de flotar sobre el escenario. Sigue a la cadera.
      contact = contactShadow(vrm);
      if (contact) scene.add(contact);
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

  return animate(renderer, scene, camera, vrm, gaze, props, stage, post, easeShot, anchors, look, motion, collider, () => {
    look.dispose();
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
  return flagOn('post');
}

/** Interruptores de depuracion por URL (?post=0, ?look=0): apagan el acabado para comparar. */
function flagOn(name: string): boolean {
  try {
    return new URLSearchParams(window.location.search).get(name) !== '0';
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
  easeShot: (dt: number, d?: Drift, c?: CloseShot | null) => boolean,
  anchors: Anchors,
  look: LookHandle,
  motion: CharacterMotion | null,
  collider: ArmCollider | null,
  cleanup: () => void,
): () => void {
  const timer = new THREE.Timer();
  timer.connect(document);
  const blinker = new Blinker();
  const reduce = prefersReducedMotion();
  const expressions = vrm.expressionManager;
  const face: Record<string, number> = { happy: 0, sad: 0, relaxed: 0, surprised: 0 };
  let mouth = 0;
  const lips: Record<(typeof VISEMES)[number], number> = { aa: 0, ih: 0, ou: 0, ee: 0, oh: 0 };
  let headX = 0;
  let headY = 0;
  let headZ = 0;
  let frame = 0;
  let running = true;
  let lastShot = -1;
  let focusNow = 0;
  const focusPoint = new THREE.Vector3();
  let pendingAct = (() => {
    try {
      return new URLSearchParams(window.location.search).get('act');
    } catch {
      return null;
    }
  })();

  const body = new IdleBody((name) => vrm.humanoid.getNormalizedBoneNode(name), styleFor(props().companion));
  const hairWind = createHairWind(vrm, props().companion, reduce);
  const neck = vrm.humanoid.getNormalizedBoneNode('neck');
  const head = vrm.humanoid.getNormalizedBoneNode('head');
  const ahead = new THREE.Vector3();
  const aheadPoint = new THREE.Vector3();
  const camRight = new THREE.Vector3();
  let lastPan = 0;
  let lastFar = 0;
  // Hacia donde mira el modelo en reposo respecto a su eje +Z (hacia la camara o al reves).
  const follow = { x: 0, y: 0 };
  const saccade = { i: 0, x: 0, y: 0, next: 0 };
  let lastGlance = { x: 0, y: 0 };
  const followTmp = new THREE.Vector3();
  const director = new CloseUpDirector();
  let seenReactions = 0;
  // Modo cinematico (Ajustes): encendido salvo que la persona lo apague.
  const cinematic = () => props().cinematic !== false;
  const showcase = (() => {
    if (typeof document === 'undefined' || new URLSearchParams(globalThis.location?.search ?? '').get('muestrario') !== '1') return null;
    const label = document.createElement('div');
    label.style.cssText = 'position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:9999;padding:6px 12px;border-radius:8px;background:rgba(0,0,0,.65);color:#fff;font:14px system-ui;pointer-events:none';
    document.body.appendChild(label);
    return { list: showcaseList(props().companion), i: 0, next: 0, label };
  })();
  const armNodes = ['leftUpperArm', 'leftLowerArm', 'leftHand', 'rightUpperArm', 'rightLowerArm', 'rightHand']
    .map((n) => vrm.humanoid.getNormalizedBoneNode(n as Parameters<typeof vrm.humanoid.getNormalizedBoneNode>[0]))
    .filter((n): n is THREE.Object3D => !!n);
  const armPrev = armNodes.map((n) => n.quaternion.clone());
  const smoothArms = (dt: number) => {
    const k = 1 - Math.exp(-dt / 0.07);
    armNodes.forEach((n, i) => {
      const prev = armPrev[i]!;
      // Un salto grande es un corte de verdad (cambio de clip, short): se acepta sin filtrar.
      if (prev.angleTo(n.quaternion) > 0.6) prev.copy(n.quaternion);
      else prev.slerp(n.quaternion, k);
      n.quaternion.copy(prev);
    });
  };
  const faceSign = (() => {
    const d = vrm.scene.getWorldDirection(new THREE.Vector3());
    const h = (head ?? vrm.scene).getWorldPosition(new THREE.Vector3());
    return d.dot(camera.position.clone().sub(h)) >= 0 ? 1 : -1;
  })();

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
    const live = props();
    // Short de presentacion: el guion manda sobre cara, boca, gestos y camara (reel.ts).
    const cue = live.reel && !reduce ? reelCue(REELS[live.companion], t) : null;
    let cut = false;
    if (cue && cue.index !== lastShot) {
      lastShot = cue.index;
      cut = true;
      live.onReelShot?.(cue.index);
    }
    // Si suena la voz de presentacion, la boca sigue esa voz; si no, la voz simulada del guion.
    const voice = cue ? (live.reelLevel?.() ?? 0) : 0;
    const p: AvatarProps = cue
      ? {
          ...live,
          state: cue.shot.talk || voice > 0.02 ? 'speaking' : 'idle',
          // Emocion suave: a 0,85 la sonrisa de VRoid cierra los ojos y abre la boca de par en par.
          affect: { emotion: cue.shot.emotion, intensity: 0.45, ...(cue.shot.gesture ? { gesture: cue.shot.gesture } : {}), at: now - cue.age * 1000 },
          level: () => (voice > 0.02 ? voice * 0.75 : cue.shot.talk ? reelVoice(cue.age) * 0.55 : 0),
          visemes: () => (voice > 0.02 ? (live.reelVisemes?.() ?? null) : null),
        }
      : live;
    // Gesto de brazo: el del plano del short, o en la conversacion el que pide el servidor
    // (saludar, pose de pensar, señalar).
    // Si no, de vez en cuando uno propio de su emocion (mano al pecho, señalar, barbilla).
    const armAction = cue
      ? (cue.shot.arm ?? (cue.shot.wave ? 'wave' : null))
      : // En la conversacion los gestos son animaciones de Mixamo (character-motion: reactionFor);
        // las poses de brazo de codigo solo quedan para el short y si no hay animaciones.
        motion?.ready
        ? null
        : (armForGesture(p.affect?.gesture) ?? (p.affect ? armForEmotion(p.companion, p.affect.emotion, p.affect.intensity ?? 0, p.affect.at) : null));
    // El selfie sostiene el movil todo el short (sin bajar el brazo entre planos).
    const armOn = !armAction || reduce ? 0 : armAction === 'selfie' ? 1 : cue ? armEnvelope(cue.age, cue.shot.dur - 0.65) : armEnvelope(p.affect ? (now - p.affect.at) / 1000 : -1);
    const lookAway = cue?.shot.look === 'away' ? Math.min(1, cue.age / 0.6) * Math.min(1, Math.max(0, (cue.shot.dur - cue.age) / 0.8)) : 0;

    // Cara: emocion o reposo, con transiciones suaves.
    const target = targetFace(p.companion, p.affect, now);
    // Coqueteo: mirada algo entornada y sonrisa suave (sobre la emocion del momento).
    const flirtFace = p.mood === 'flirt' ? { relaxed: 0.22, happy: 0.1 } : null;
    for (const name of FACE_EXPRESSIONS) {
      const extra = flirtFace ? ((flirtFace as Record<string, number>)[name] ?? 0) : 0;
      face[name] = approach(face[name] ?? 0, Math.min(1, target[name] + extra), dt, 4);
      expressions?.setValue(name, face[name]!);
    }
    const blink = blinker.weight(t) * (1 - (face['happy'] ?? 0) * 0.6);
    expressions?.setValue('blink', blink);
    // Con los ojos cerrados (parpadeo o sonrisa de ojos cerrados) el brillo se apaga.
    look.update(Math.max(blink, (face['happy'] ?? 0) * 0.9, (face['relaxed'] ?? 0) * 0.4));

    // Boca: solo mientras suena su voz.
    const speaking = p.state === 'speaking';
    mouth = approach(mouth, speaking ? p.level() * 1.3 : 0, dt, 18);
    // Labios: si hay espectro de la voz, la vocal que suena (abre rapido, cierra algo mas lento,
    // como una boca de verdad); si no, el volumen con una variacion de vocales.
    const heard = speaking ? (p.visemes?.() ?? null) : null;
    const want = heard ?? { ...mouthShapes(mouth, t), ou: 0, ee: 0 };
    for (const v of VISEMES) {
      const goal = Math.min(1, (want[v] ?? 0) * (heard ? 1.35 : 1));
      lips[v] = approach(lips[v], goal, dt, goal > lips[v] ? 28 : 14);
      expressions?.setValue(v, lips[v]);
    }

    // Cabeza: postura del estado + gesto + un balanceo muy leve.
    const base = stateOffset(p.state);
    // Nova mira un poco desde abajo (barbilla baja, ojos a camara) con la cabeza ladeada.
    const pose = p.companion === 'nova' && !cue ? { x: base.x + 0.06, y: base.y, z: base.z + 0.05 } : base;
    // Con animaciones, la cabeza no añade gestos ni balanceos propios: tranquila.
    const calmHead = !!motion?.ready && !cue;
    const gesture = reduce || !p.affect || calmHead ? { x: 0, y: 0, z: 0 } : gestureOffset(p.affect.gesture, (now - p.affect.at) / 1000);
    const sway = reduce ? 0 : calmHead ? 0.35 : 1;
    const headLife = calmHead ? 0.3 : 1;
    headX = approach(headX, pose.x + gesture.x + Math.sin(t * 0.8) * 0.015 * sway + body.head.x * headLife, dt, 6);
    headY = approach(headY, pose.y + gesture.y + Math.sin(t * 0.45) * 0.05 * sway + body.head.y * headLife + lookAway * 0.45, dt, 6);
    headZ = approach(headZ, pose.z + gesture.z + Math.sin(t * 0.6) * 0.02 * sway + body.head.z * headLife, dt, 6);
    if (neck) neck.rotation.set(headX * 0.4, headY * 0.4, headZ * 0.4);
    if (head) head.rotation.set(headX * 0.6, headY * 0.6, headZ * 0.6);

    // Cuerpo: respiracion, cambio de peso, brazos y manos vivos; mas gesto al hablar.
    body.update(t, dt, { still: reduce, speaking, level: mouth, intensity: p.mood === 'flirt' ? 1.4 : p.mood === 'friend' ? 0.6 : 1, listening: p.state === 'listening',
      ...(p.affect?.gesture ? { gesture: { name: p.affect.gesture, age: (now - p.affect.at) / 1000 } } : {}),
      energy: p.affect && now - p.affect.at < AFFECT_HOLD_MS ? emotionEnergy(p.affect.emotion, p.affect.intensity) : 1,
      ...(armAction ? { arm: { action: armAction, weight: armOn } } : {}) });

    // Mirada: a la camara con pequeños saltos naturales; al pensar, arriba y a un lado.
    const thinking = p.state === 'thinking';
    const glance = reduce ? { x: 0, y: 0 } : body.glance(t);
    // Al apartar o devolver la mirada, parpadeo (como la gente).
    if (glance.x !== lastGlance.x || glance.y !== lastGlance.y) {
      blinker.nudge(t);
      lastGlance = glance;
    }
    // Microsacadas (2-oct): al mirar a alguien los ojos saltan de un ojo suyo al otro y a veces
    // a la boca, cada medio segundo o asi. Sin esto la mirada parece de muñeca.
    if (t > saccade.next) {
      saccade.i += 1;
      const r = smoothNoise(saccade.i * 1.7, 41) * 0.5 + 0.5;
      saccade.x = (saccade.i % 2 ? 1 : -1) * 0.022;
      saccade.y = r > 0.8 ? -0.05 : 0;
      saccade.next = t + 0.35 + r * 0.7;
      // Al bajar la mirada a la boca (un salto grande) a veces parpadea.
      if (saccade.y !== 0 && r > 0.9) blinker.nudge(t);
    }
    const sx = thinking || reduce ? 0 : saccade.x;
    const sy = thinking || reduce ? 0 : saccade.y;
    gaze.position.set(
      camera.position.x + (thinking ? 0.25 : glance.x) + lookAway * 1.4 + sx,
      camera.position.y + (thinking ? 0.2 : glance.y) + sy,
      camera.position.z,
    );

    hairWind.update(t);
    easeShot(reduce ? 1 : dt);
    if (cue) {
      const cam = reelCamera(REELS[live.companion], t, anchors, camera.aspect);
      post?.setFade(reelFade(REELS[live.companion], t));
      post?.setSoft(0);
      camera.fov = cam.fov;
      camera.position.set(...cam.position);
      camera.lookAt(...cam.target);
      if (cam.roll) camera.rotateZ(cam.roll);
      camera.updateProjectionMatrix();
    } else {
      post?.setFade(1);
      // Camara viva (framing.ts): solo en el escenario, nunca con «reducir movimiento».
      // Camarografo: cuando empieza una reaccion, primer plano de cara o torso desde un angulo
      // que no se repite; el foco se pierde al acercarse y vuelve (close-ups.ts).
      if (motion && motion.reactions !== seenReactions) {
        seenReactions = motion.reactions;
        if (!reduce && stage && cinematic()) director.start(t, motion.actionLength, Math.random());
      }
      if (!cinematic()) director.stop();
      const cf = director.frame(t);
      let shotNow: CloseShot | null = null;
      if (cf) {
        const f = cf.framing;
        // + a la izquierda de la pantalla = -x en el mundo (la camara mira hacia -z).
        shotNow = { target: [anchors.x - f.dx, anchors.headY + f.dy, (anchors.z + anchors.eyeZ) / 2], span: f.span, slide: cf.slide, w: cf.weight };
      }
      post?.setSoft(cf ? cf.soft * 0.8 : 0);
      // El operador sigue la cabeza con retraso (si se mece o se inclina, la camara la acompaña
      // un poco, tarde, como una persona; nunca la clava en el centro).
      if (head) {
        head.getWorldPosition(followTmp);
        follow.x += (followTmp.x - anchors.x - follow.x) * Math.min(1, dt * 0.9);
        follow.y += (followTmp.y - anchors.headY - follow.y) * Math.min(1, dt * 0.9);
      }
      const d0 = cameraDrift(t);
      if (!reduce) easeShot(0, { ...d0, tx: d0.tx + follow.x * 0.5, ty: d0.ty + follow.y * 0.4, x: d0.x + follow.x * 0.2 }, shotNow);
    }
    // Retrato: cuanto mas cerca la camara, mas desenfocado el fondo (primeros planos del short).
    // En un corte del short el enfoque salta con la camara (antes tardaba medio segundo en llegar).
    const closeness = Math.min(1, Math.max(0, (2.2 - camera.position.distanceTo(focusPoint.set(0, anchors.headY, anchors.z))) / 1.6));
    focusNow = cut ? closeness : focusNow + (closeness - focusNow) * Math.min(1, dt * 3);
    // El foco respira un poco (el foquista nunca lo deja clavado).
    post?.setFocus(Math.max(0, Math.min(1, focusNow + 0.05 * smoothNoise(t * 0.18, 21))));
    // Captura de movimiento real encima del de codigo (postura, peso, gestos al hablar).
    motion?.update(dt, { speaking, still: reduce, arm: body.arm, busy: p.state === 'listening' || p.state === 'thinking', noActions: !!cue, affect: cue ? null : p.affect });
    // Recado (ir a por agua): mira hacia donde anda, y su voz viene de donde esta.
    const errand = motion?.errand ?? null;
    if (errand && errand.lookAhead > 0) {
      vrm.scene.getWorldDirection(ahead);
      head?.getWorldPosition(aheadPoint);
      aheadPoint.addScaledVector(ahead, 3 * faceSign);
      gaze.position.lerp(aheadPoint, errand.lookAhead);
    }
    const pan = errand ? errand.pan * Math.sign(camRight.set(1, 0, 0).applyQuaternion(camera.quaternion).x || 1) : 0;
    const far = errand?.far ?? 0;
    if (Math.abs(pan - lastPan) > 0.02 || Math.abs(far - lastFar) > 0.02) {
      lastPan = pan;
      lastFar = far;
      live.onPresence?.(pan, far);
    }
    // Pruebas: ?act=drink (o hair, errand) hace esa accion en cuanto se puede.
    if (motion && pendingAct && motion.ready && motion.act(pendingAct)) pendingAct = null;
    // Muestrario (?muestrario=1): todas las animaciones de este personaje, una cada 7 s, con
    // su nombre en pantalla. Para revisarlas; nunca se activa solo.
    if (motion?.ready && showcase && t > showcase.next) {
      const name = showcase.list[showcase.i % showcase.list.length]!;
      showcase.i += 1;
      showcase.next = t + 7;
      if (motion.act(name)) showcase.label.textContent = `${showcase.i}/${showcase.list.length} · ${name.replace(/^mx-/, '').replace(/-/g, ' ')}`;
    }
    // Cabeza erguida: la postura de las animaciones (pecho y cuello) no la deja caer. Se mide
    // hacia donde apunta la cara y se corrige en el cuello hasta quedar casi horizontal (solo
    // la leve inclinacion de escuchar); en una accion (reir, beber) se corrige poco.
    if (motion?.ready && head && neck && !cue) levelHead(neck, head, faceSign, pose.x * 0.5, motion.acting ? 0.3 : 0.9);
    // Por ultimo: sacar los brazos de dentro de la ropa si hace falta.
    collider?.update(0, motion?.posed ?? 0);
    // Filtro de temblores: la correccion de la ropa puede saltar de un cuadro a otro cuando la
    // mano roza el limite (la izquierda de Rio temblaba). Brazo, antebrazo y mano siguen a su
    // pose con unos 70 ms de suavizado: el temblor desaparece y el gesto se ve igual.
    if (!reduce) smoothArms(dt);
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

const levelTmp = { f: new THREE.Vector3(), want: new THREE.Vector3(), q: new THREE.Quaternion(), pw: new THREE.Quaternion(), hw: new THREE.Quaternion() };
/**
 * Lleva la mirada de la cabeza a `pitch` radianes (positivo: hacia abajo) girando el cuello,
 * con fuerza `amount` (0-1). Corrige como mucho 20 grados: es un ajuste, no una pose.
 */
function levelHead(neck: THREE.Object3D, head: THREE.Object3D, faceSign: number, pitch: number, amount: number): void {
  const { f, want, q, pw, hw } = levelTmp;
  neck.parent?.updateWorldMatrix(true, false);
  neck.updateMatrixWorld(true);
  head.getWorldQuaternion(hw);
  f.set(0, 0, faceSign).applyQuaternion(hw);
  const flat = Math.hypot(f.x, f.z);
  if (flat < 1e-3) return;
  const now = Math.atan2(-f.y, flat);
  const fix = Math.max(-0.35, Math.min(0.35, now - pitch)) * amount;
  if (Math.abs(fix) < 1e-3) return;
  const target = now - fix;
  want.set((f.x / flat) * Math.cos(target), -Math.sin(target), (f.z / flat) * Math.cos(target));
  q.setFromUnitVectors(f.normalize(), want);
  // Giro en el mundo pasado al espacio local del cuello: q_local' = P^-1 * q * P * q_local.
  neck.parent?.getWorldQuaternion(pw) ?? pw.identity();
  neck.quaternion.premultiply(pw.clone().invert().multiply(q).multiply(pw));
}

/** Mancha de sombra bajo los pies: textura radial en un plano en el suelo. */
function contactShadow(vrm: VRM): THREE.Mesh | null {
  if (typeof document === 'undefined') return null;
  vrm.scene.updateMatrixWorld(true);
  const feet = (['leftFoot', 'rightFoot', 'leftToes', 'rightToes'] as const)
    .map((b) => vrm.humanoid.getRawBoneNode(b)?.getWorldPosition(new THREE.Vector3()))
    .filter((v): v is THREE.Vector3 => !!v);
  if (!feet.length) return null;
  const ground = Math.max(0, Math.min(...feet.map((f) => f.y)) - 0.012);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,0.5)');
  g.addColorStop(0.45, 'rgba(0,0,0,0.28)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.34),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, ground + 0.003, 0);
  mesh.renderOrder = 1;
  // Sigue el punto medio de los pies (no la cadera: al ladear el cuerpo la sombra se iba).
  const bones = (['leftFoot', 'rightFoot', 'leftToes', 'rightToes'] as const).map((b) => vrm.humanoid.getRawBoneNode(b)).filter((b): b is THREE.Object3D => !!b);
  const at = new THREE.Vector3();
  const sum = new THREE.Vector3();
  mesh.onBeforeRender = () => {
    sum.set(0, 0, 0);
    for (const b of bones) sum.add(b.getWorldPosition(at));
    sum.divideScalar(bones.length);
    mesh.position.x = sum.x;
    mesh.position.z = sum.z;
  };
  return mesh;
}
