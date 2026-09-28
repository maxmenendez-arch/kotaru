import * as THREE from 'three';
import { candleFlicker, neonPulse, PALETTES, SCENE_FOR, seeded, sway, type SceneId } from './scenes';

/**
 * Los fondos de ambientacion en 3D (three.js), detras del avatar. Solo los usa
 * avatar-viewer.ts, que ya se descarga aparte: no pesan en el arranque de la app.
 *
 * Sistema de coordenadas del visor: el personaje de pie en el origen mirando hacia +z (a la
 * camara), el suelo en y = 0, `focus` a la altura de la cara. Todo lo de la escena queda
 * detras (z negativa) y a los lados, dentro de lo que ve la camara de busto.
 *
 * Geometria sencilla (cajas, cilindros, esferas, formas extruidas), materiales mate y luz
 * propia de cada lugar. La niebla funde el fondo y deja al personaje en primer plano.
 */

export interface Stage {
  readonly id: SceneId;
  /** Avanza las animaciones (velas, hojas, agua). `still`: reducir movimiento. */
  update(t: number, still: boolean): void;
  dispose(): void;
}

type Updater = (t: number) => void;

class Kit {
  readonly group = new THREE.Group();
  readonly updaters: Updater[] = [];
  readonly #disposables: { dispose(): void }[] = [];
  readonly #materials = new Map<string, THREE.Material>();

  constructor(readonly random: () => number) {}

  /** Material mate reutilizable por color (menos llamadas a la GPU). */
  matte(color: number, roughness = 0.9, metalness = 0): THREE.MeshStandardMaterial {
    const key = `m${color}-${roughness}-${metalness}`;
    let m = this.#materials.get(key) as THREE.MeshStandardMaterial | undefined;
    if (!m) {
      m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
      this.#materials.set(key, m);
      this.#disposables.push(m);
    }
    return m;
  }

  /** Material que brilla por si mismo (ventanas, neon, llamas). La niebla no lo apaga del todo. */
  glow(color: number, opacity = 1, fog = true): THREE.MeshBasicMaterial {
    const m = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, fog });
    this.#disposables.push(m);
    return m;
  }

  track<T extends { dispose(): void }>(thing: T): T {
    this.#disposables.push(thing);
    return thing;
  }

  mesh(geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0, parent: THREE.Object3D = this.group): THREE.Mesh {
    this.track(geometry);
    const m = new THREE.Mesh(geometry, material);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }

  box(w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, parent?: THREE.Object3D): THREE.Mesh {
    return this.mesh(new THREE.BoxGeometry(w, h, d), material, x, y, z, parent);
  }

  dispose(): void {
    for (const d of this.#disposables) d.dispose();
    this.#disposables.length = 0;
  }
}

/** Arma el fondo del personaje y ajusta niebla y luces de la escena. null si no tiene. */
export function buildStage(companion: string, scene: THREE.Scene, focus: THREE.Vector3): Stage | null {
  const id = SCENE_FOR[companion];
  if (!id) return null;
  const palette = PALETTES[id];
  const kit = new Kit(seeded(id.length * 7919 + 17));

  scene.fog = new THREE.Fog(palette.fog, palette.fogNear, palette.fogFar);
  scene.background = new THREE.Color(palette.fog);

  const hemi = new THREE.HemisphereLight(palette.sky, palette.ground, palette.hemiIntensity);
  const key = new THREE.DirectionalLight(palette.key, palette.keyIntensity);
  key.position.set(focus.x + 0.7, focus.y + 0.9, focus.z + 1.8);
  key.target.position.copy(focus);
  const rim = new THREE.DirectionalLight(palette.rim, palette.rimIntensity);
  rim.position.set(focus.x - 1.2, focus.y + 0.8, focus.z - 1.6);
  rim.target.position.copy(focus);
  kit.group.add(hemi, key, key.target, rim, rim.target);

  BUILDERS[id](kit, focus);
  scene.add(kit.group);

  return {
    id,
    update(t, still) {
      const at = still ? 0 : t;
      for (const u of kit.updaters) u(at);
    },
    dispose() {
      scene.remove(kit.group);
      scene.fog = null;
      scene.background = null;
      kit.dispose();
    },
  };
}

// ---- Luna: oficina tranquila de dia --------------------------------------------------

function lunaOffice(kit: Kit, focus: THREE.Vector3): void {
  const wallZ = -2.6;
  const wall = kit.matte(0xe8dfd0);
  const wood = kit.matte(0x9a6b45, 0.7);
  const woodDark = kit.matte(0x6e4a30, 0.75);

  // Suelo de madera clara y pared del fondo.
  kit.box(8, 0.05, 8, kit.matte(0xb9916a, 0.8), 0, -0.025, -1.5);
  kit.box(8, 4, 0.1, wall, 0, 2, wallZ);
  // Zocalo.
  kit.box(8, 0.12, 0.04, kit.matte(0xf6f1e8), 0, 0.06, wallZ + 0.07);

  // Ventana grande a la izquierda: cielo claro con luz de mañana y marco blanco.
  const win = { x: -1.05, y: focus.y + 0.15, w: 1.5, h: 1.55 };
  const skyGeo = new THREE.PlaneGeometry(win.w, win.h, 1, 8);
  const colors: number[] = [];
  const top = new THREE.Color(0xbfdcf2);
  const bottom = new THREE.Color(0xfdf6e8);
  const pos = skyGeo.attributes['position']!;
  for (let i = 0; i < pos.count; i++) {
    const k = (pos.getY(i) + win.h / 2) / win.h;
    const c = bottom.clone().lerp(top, k);
    colors.push(c.r, c.g, c.b);
  }
  skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const skyMat = kit.track(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }));
  kit.mesh(skyGeo, skyMat, win.x, win.y, wallZ + 0.06);
  // Copas de arboles lejanos por la ventana (manchas suaves).
  const treeMat = kit.glow(0xa9c9a0, 0.9, false);
  for (let i = 0; i < 5; i++) {
    const r = 0.18 + kit.random() * 0.14;
    const m = kit.mesh(new THREE.CircleGeometry(r, 20), treeMat, win.x - win.w / 2 + 0.2 + i * 0.3, win.y - win.h / 2 + 0.12 + kit.random() * 0.1, wallZ + 0.065);
    m.scale.y = 0.8;
  }
  const frame = kit.matte(0xfbf8f2, 0.6);
  kit.box(win.w + 0.1, 0.06, 0.08, frame, win.x, win.y + win.h / 2, wallZ + 0.08);
  kit.box(win.w + 0.1, 0.08, 0.14, frame, win.x, win.y - win.h / 2, wallZ + 0.1);
  kit.box(0.06, win.h, 0.08, frame, win.x - win.w / 2, win.y, wallZ + 0.08);
  kit.box(0.06, win.h, 0.08, frame, win.x + win.w / 2, win.y, wallZ + 0.08);
  kit.box(0.035, win.h, 0.06, frame, win.x, win.y, wallZ + 0.08);
  kit.box(win.w, 0.035, 0.06, frame, win.x, win.y + win.h * 0.12, wallZ + 0.08);
  // Cortina de lino recogida a un lado, que se mece apenas.
  const curtain = kit.mesh(new THREE.PlaneGeometry(0.34, win.h + 0.25, 1, 6), kit.matte(0xf3ece0, 1), win.x - win.w / 2 - 0.1, win.y - 0.05, wallZ + 0.16);
  (curtain.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
  kit.updaters.push((t) => {
    curtain.rotation.y = sway(t, 0.3, 0.05);
  });
  // Luz de la ventana sobre la sala.
  // Solo alcanza la pared y la ventana: no debe quemar la cara del personaje.
  const sun = new THREE.PointLight(0xfff1d8, 4, 2.2, 1.6);
  sun.position.set(win.x + 0.2, win.y + 0.3, wallZ + 0.8);
  kit.group.add(sun);

  // Estanteria con libros a la derecha.
  const shelf = { x: 1.05, w: 1.1, z: wallZ + 0.22 };
  kit.box(shelf.w, 2.3, 0.34, woodDark, shelf.x, 1.15, shelf.z - 0.02);
  const bookColors = [0x7c9a8a, 0xc9a36a, 0x8c6f8f, 0xd6c7a8, 0x6f8fae, 0xb5705a, 0xe0d5c0, 0x5d7560];
  for (let row = 0; row < 5; row++) {
    const y = 0.28 + row * 0.44;
    kit.box(shelf.w - 0.06, 0.03, 0.3, wood, shelf.x, y - 0.02, shelf.z + 0.02);
    let x = shelf.x - shelf.w / 2 + 0.07;
    while (x < shelf.x + shelf.w / 2 - 0.12) {
      if (kit.random() < 0.12) {
        x += 0.1; // hueco
        continue;
      }
      const bw = 0.035 + kit.random() * 0.035;
      const bh = 0.24 + kit.random() * 0.12;
      const b = kit.box(bw, bh, 0.22, kit.matte(bookColors[Math.floor(kit.random() * bookColors.length)]!), x + bw / 2, y + bh / 2, shelf.z + 0.04);
      if (kit.random() < 0.08) b.rotation.z = 0.25;
      x += bw + 0.006;
    }
  }
  // Una maceta pequeña en la estanteria.
  kit.mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.12, 16), kit.matte(0xd9cbb3), shelf.x + 0.3, 1.2 + 0.06, shelf.z + 0.04);
  for (let i = 0; i < 6; i++) {
    const leaf = kit.mesh(new THREE.SphereGeometry(0.05, 10, 8), kit.matte(0x6f9a6a), shelf.x + 0.3 + (kit.random() - 0.5) * 0.12, 1.36 + kit.random() * 0.08, shelf.z + 0.04);
    leaf.scale.set(1, 0.6, 1);
  }

  // Planta grande en maceta junto a la ventana (hojas alargadas, tipo ficus lyrata).
  const plant = new THREE.Group();
  plant.position.set(-1.05, 0, -1.9);
  kit.group.add(plant);
  kit.mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.42, 20), kit.matte(0xcdb89a, 0.85), 0, 0.21, 0, plant);
  kit.mesh(new THREE.CylinderGeometry(0.015, 0.02, 1.2, 6), kit.matte(0x6b5a44), 0, 1.0, 0, plant);
  const leafMat = kit.matte(0x5e8f5a, 0.8);
  const leafDark = kit.matte(0x4a7549, 0.8);
  const leaves: THREE.Object3D[] = [];
  for (let i = 0; i < 16; i++) {
    const stem = new THREE.Group();
    const h = 0.7 + (i / 16) * 0.95;
    stem.position.set(0, h, 0);
    stem.rotation.set(0, (i * 2.4) % (Math.PI * 2), 0.9 + kit.random() * 0.5);
    plant.add(stem);
    const leaf = kit.mesh(new THREE.SphereGeometry(0.1, 12, 8), i % 2 ? leafMat : leafDark, 0, 0.16, 0, stem);
    leaf.scale.set(0.75, 1.5, 0.18);
    leaves.push(stem);
  }
  // Escritorio al fondo a la derecha, con lampara calida encendida.
  kit.box(1.3, 0.05, 0.6, wood, 0.25, 0.76, -2.0);
  kit.box(0.05, 0.74, 0.55, woodDark, -0.35, 0.37, -2.0);
  kit.box(0.05, 0.74, 0.55, woodDark, 0.85, 0.37, -2.0);
  kit.mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.03, 16), kit.matte(0x3d3a36, 0.5, 0.3), 0.7, 0.8, -2.1);
  kit.mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 8), kit.matte(0x3d3a36, 0.5, 0.3), 0.7, 1.0, -2.1);
  // Pantalla de tela: mas ancha abajo, encendida por dentro.
  kit.mesh(new THREE.CylinderGeometry(0.07, 0.13, 0.16, 24, 1, true), kit.glow(0xffe0b0, 1), 0.7, 1.24, -2.1);
  const lamp = new THREE.PointLight(0xffc98a, 1.6, 2.2, 2);
  lamp.position.set(0.7, 1.16, -2.05);
  kit.group.add(lamp);
  // Taza y libro abierto sobre el escritorio.
  kit.mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.08, 16), kit.matte(0xf2ede4, 0.5), 0.0, 0.82, -1.95);
  kit.box(0.28, 0.02, 0.2, kit.matte(0xf7f2e7), 0.3, 0.79, -1.9).rotation.y = 0.2;

  // Cuadro sobrio en la pared: horizonte de colinas en tonos suaves.
  const art = new THREE.Group();
  art.position.set(0.15, focus.y + 0.55, wallZ + 0.07);
  kit.group.add(art);
  kit.box(0.62, 0.42, 0.03, kit.matte(0xfaf6ee), 0, 0, 0, art);
  kit.box(0.54, 0.34, 0.01, kit.matte(0xe9d9c0), 0, 0, 0.02, art);
  kit.box(0.54, 0.1, 0.012, kit.matte(0xa9bda0), 0, -0.1, 0.022, art);
  kit.mesh(new THREE.CircleGeometry(0.05, 20), kit.matte(0xf0b98a), 0.12, 0.07, 0.024, art);

  // Motas de polvo flotando en la luz de la ventana (muy pocas, muy lentas).
  const count = 40;
  const dust = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    dust[i * 3] = win.x + (kit.random() - 0.3) * 1.2;
    dust[i * 3 + 1] = 0.8 + kit.random() * 1.6;
    dust[i * 3 + 2] = wallZ + 0.4 + kit.random() * 1.2;
  }
  const dustGeo = kit.track(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  const dustMat = kit.track(new THREE.PointsMaterial({ color: 0xfff6e0, size: 0.012, transparent: true, opacity: 0.7 }));
  const points = new THREE.Points(dustGeo, dustMat);
  kit.group.add(points);
  kit.updaters.push((t) => {
    points.position.y = Math.sin(t * 0.15) * 0.05;
    points.position.x = Math.sin(t * 0.1) * 0.04;
  });
}

// ---- Nova: su cuarto al anochecer ----------------------------------------------------

function heartShape(size: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = 0;
  const y = -size * 0.5;
  s.moveTo(x, y);
  s.bezierCurveTo(x - size * 0.9, y + size * 0.55, x - size * 0.55, y + size * 1.25, x, y + size * 0.9);
  s.bezierCurveTo(x + size * 0.55, y + size * 1.25, x + size * 0.9, y + size * 0.55, x, y);
  return s;
}

function novaRoom(kit: Kit, focus: THREE.Vector3): void {
  const wallZ = -2.6;
  // Paredes ciruela oscuro y suelo de madera casi negra con alfombra rosa empolvado.
  kit.box(8, 4, 0.1, kit.matte(0x3b1b3f), 0, 2, wallZ);
  kit.box(8, 0.05, 8, kit.matte(0x241318, 0.6), 0, -0.025, -1.5);
  kit.mesh(new THREE.CircleGeometry(1.1, 40), kit.matte(0x8a4a67, 1), 0.2, 0.002, -1.6).rotation.x = -Math.PI / 2;

  // Ventana a la derecha con la ciudad de noche.
  const win = { x: 1.0, y: focus.y + 0.2, w: 1.2, h: 1.5 };
  kit.box(win.w, win.h, 0.02, kit.glow(0x1a2350, 1, false), win.x, win.y, wallZ + 0.06);
  // Edificios recortados y ventanas encendidas.
  const skyline = kit.glow(0x0e1230, 1, false);
  const lit = [kit.glow(0xffd28a, 1, false), kit.glow(0xffb3d1, 1, false), kit.glow(0x9fd0ff, 1, false)];
  let bx = win.x - win.w / 2 + 0.04;
  while (bx < win.x + win.w / 2 - 0.08) {
    const bw = 0.1 + kit.random() * 0.14;
    const bh = 0.3 + kit.random() * 0.7;
    const baseY = win.y - win.h / 2;
    kit.box(bw, bh, 0.01, skyline, bx + bw / 2, baseY + bh / 2, wallZ + 0.075);
    for (let wy = baseY + 0.06; wy < baseY + bh - 0.05; wy += 0.07) {
      for (let wx = bx + 0.025; wx < bx + bw - 0.02; wx += 0.045) {
        if (kit.random() < 0.35) kit.box(0.018, 0.024, 0.005, lit[Math.floor(kit.random() * 3)]!, wx, wy, wallZ + 0.082);
      }
    }
    bx += bw + 0.015;
  }
  // Luna llena pequeña en el cielo de la ventana.
  kit.mesh(new THREE.CircleGeometry(0.07, 24), kit.glow(0xfff0e0, 1, false), win.x + 0.3, win.y + win.h / 2 - 0.2, wallZ + 0.075);
  const frame = kit.matte(0x1a0d1c, 0.5);
  kit.box(win.w + 0.08, 0.05, 0.08, frame, win.x, win.y + win.h / 2, wallZ + 0.09);
  kit.box(win.w + 0.08, 0.05, 0.08, frame, win.x, win.y - win.h / 2, wallZ + 0.09);
  kit.box(0.05, win.h, 0.08, frame, win.x - win.w / 2, win.y, wallZ + 0.09);
  kit.box(0.05, win.h, 0.08, frame, win.x + win.w / 2, win.y, wallZ + 0.09);

  // Cortinas de gasa rosa que se mecen (a los dos lados de la ventana).
  const sheer = kit.track(new THREE.MeshStandardMaterial({ color: 0xf2a6c8, transparent: true, opacity: 0.35, side: THREE.DoubleSide, roughness: 1 }));
  const curtains: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const c = kit.mesh(new THREE.PlaneGeometry(0.13, win.h + 0.5, 1, 6), sheer, win.x + side * (win.w / 2 - 0.02 + k * 0.09), win.y - 0.1, wallZ + 0.18 + (k % 2) * 0.04);
      c.rotation.y = (k % 2 ? 0.5 : -0.5) * side;
      curtains.push(c);
    }
  }
  const curtainRest = curtains.map((c) => c.rotation.y);
  kit.updaters.push((t) => {
    curtains.forEach((c, i) => {
      c.rotation.y = curtainRest[i]! + sway(t, i * 1.3, 0.06);
    });
  });

  // Sofa de terciopelo burdeos detras, a la izquierda, con cojines.
  const velvet = kit.matte(0x7a1f3d, 0.95);
  const velvetDark = kit.matte(0x5c1530, 0.95);
  const sofa = new THREE.Group();
  sofa.position.set(-0.75, 0, -2.25);
  sofa.rotation.y = 0.15;
  kit.group.add(sofa);
  kit.box(1.7, 0.36, 0.8, velvet, 0, 0.3, 0, sofa);
  kit.box(1.7, 0.6, 0.22, velvetDark, 0, 0.72, -0.3, sofa);
  kit.box(0.2, 0.5, 0.8, velvetDark, -0.85, 0.5, 0, sofa);
  kit.box(0.2, 0.5, 0.8, velvetDark, 0.85, 0.5, 0, sofa);
  // Cojines apoyados en el respaldo (rosa empolvado y dorado satinado).
  const cushion = kit.box(0.34, 0.3, 0.1, kit.matte(0xf0a8c4, 1), -0.45, 0.66, -0.14, sofa);
  cushion.rotation.set(-0.25, 0, 0.18);
  const cushion2 = kit.box(0.3, 0.26, 0.1, kit.matte(0xc9a24a, 0.55, 0.25), 0.15, 0.63, -0.14, sofa);
  cushion2.rotation.set(-0.25, 0, -0.12);
  // Una manta de punto caida sobre el brazo del sofa.
  kit.box(0.26, 0.4, 0.84, kit.matte(0xe9d6e4, 1), 0.78, 0.55, 0, sofa).rotation.z = -0.2;

  // Letrero de neon en forma de corazon sobre el sofa.
  const heart = kit.mesh(
    new THREE.ExtrudeGeometry(heartShape(0.26), { depth: 0.02, bevelEnabled: false }),
    kit.glow(0xff5fae, 1, false),
    -0.55,
    focus.y + 0.45,
    wallZ + 0.1,
  );
  // Solo el contorno brilla: un corazon oscuro un poco mas pequeño delante.
  const inner = kit.mesh(new THREE.ShapeGeometry(heartShape(0.21)), kit.matte(0x3b1b3f), -0.55, focus.y + 0.45 + 0.02, wallZ + 0.125);
  inner.scale.set(1, 1, 1);
  const neon = new THREE.PointLight(0xff4fa3, 1.5, 3, 2);
  neon.position.set(-0.55, focus.y + 0.5, wallZ + 0.4);
  kit.group.add(neon);
  const heartMat = heart.material as THREE.MeshBasicMaterial;
  const heartBase = new THREE.Color(0xff5fae);
  kit.updaters.push((t) => {
    const k = neonPulse(t);
    neon.intensity = 1.5 * k;
    heartMat.color.copy(heartBase).multiplyScalar(0.8 + 0.2 * k);
  });

  // Guirnalda de lucecitas calidas cruzando la pared.
  const bulbMat = kit.glow(0xffc78a, 1, false);
  for (let i = 0; i < 22; i++) {
    const u = i / 21;
    const x = -1.9 + u * 3.2;
    const y = focus.y + 0.95 - Math.sin(u * Math.PI) * 0.22;
    kit.mesh(new THREE.SphereGeometry(0.018, 8, 6), bulbMat, x, y, wallZ + 0.12);
  }

  // Velas en una mesita baja delante del sofa: llamas que titilan y dan luz ambar.
  kit.mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 28), kit.matte(0x1f1216, 0.4, 0.2), 0.45, 0.46, -1.45);
  kit.mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.44, 12), kit.matte(0x1f1216, 0.4, 0.2), 0.45, 0.22, -1.45);
  const candleWax = kit.matte(0xf6e9dc, 0.7);
  const flameMat = kit.glow(0xffb45a, 1, false);
  const flames: { mesh: THREE.Mesh; light: THREE.PointLight | null; phase: number }[] = [];
  const candles: [number, number, number][] = [
    [0.33, 0.14, -1.5],
    [0.47, 0.2, -1.38],
    [0.6, 0.11, -1.52],
  ];
  candles.forEach(([x, h, z], i) => {
    kit.mesh(new THREE.CylinderGeometry(0.035, 0.035, h, 14), candleWax, x, 0.48 + h / 2, z);
    const f = kit.mesh(new THREE.SphereGeometry(0.014, 10, 8), flameMat, x, 0.48 + h + 0.022, z);
    f.scale.set(0.8, 1.8, 0.8);
    let light: THREE.PointLight | null = null;
    if (i === 1) {
      light = new THREE.PointLight(0xffa04a, 1.4, 2.4, 2);
      light.position.set(x, 0.48 + h + 0.08, z);
      kit.group.add(light);
    }
    flames.push({ mesh: f, light, phase: i * 1.9 });
  });
  kit.updaters.push((t) => {
    for (const f of flames) {
      const k = candleFlicker(t, f.phase);
      f.mesh.scale.set(0.8, 1.5 + k * 0.5, 0.8);
      if (f.light) f.light.intensity = 1.4 * k;
    }
  });

  // Espejo redondo con marco dorado a la derecha del corazon.
  kit.mesh(new THREE.TorusGeometry(0.2, 0.025, 10, 40), kit.matte(0xd4af37, 0.35, 0.8), -1.2, focus.y + 0.2, wallZ + 0.08);
  kit.mesh(new THREE.CircleGeometry(0.2, 32), kit.matte(0x6a4f7a, 0.15, 0.6), -1.2, focus.y + 0.2, wallZ + 0.07);

  // Luz de relleno violeta desde abajo a la derecha (ambiente de noche).
  const fill = new THREE.PointLight(0x9a5cff, 1.2, 4, 2);
  fill.position.set(1.2, 0.6, -0.8);
  kit.group.add(fill);
}

// ---- Rio: claro de montaña al atardecer ---------------------------------------------

function rioOutdoors(kit: Kit, focus: THREE.Vector3): void {
  // Cielo: una cupula grande con degradado del azul arriba al naranja en el horizonte.
  const skyGeo = new THREE.SphereGeometry(40, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const pos = skyGeo.attributes['position']!;
  const colors: number[] = [];
  const zenith = new THREE.Color(0x5b86c4);
  const mid = new THREE.Color(0xf2b27a);
  const horizon = new THREE.Color(0xffd29a);
  for (let i = 0; i < pos.count; i++) {
    const h = Math.max(0, pos.getY(i) / 40);
    const c = h < 0.25 ? horizon.clone().lerp(mid, h / 0.25) : mid.clone().lerp(zenith, Math.min(1, (h - 0.25) / 0.5));
    colors.push(c.r, c.g, c.b);
  }
  skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const sky = kit.mesh(skyGeo, kit.track(new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false })), 0, -2, 0);
  sky.renderOrder = -1;

  // Sol bajo, entre las montañas, con halo.
  kit.mesh(new THREE.CircleGeometry(0.9, 32), kit.glow(0xfff1c8, 1, false), -3.2, 3.2, -30);
  kit.mesh(new THREE.CircleGeometry(2.4, 32), kit.glow(0xffd9a0, 0.35, false), -3.2, 3.2, -30.1);

  // Montañas en capas: cuanto mas lejos, mas del color del cielo (perspectiva atmosferica).
  const ranges: { z: number; color: number; height: number; seed: number }[] = [
    { z: -26, color: 0xc99aa0, height: 7, seed: 1 },
    { z: -20, color: 0x9a7f95, height: 5.5, seed: 2 },
    { z: -14, color: 0x5f6b78, height: 4, seed: 3 },
  ];
  for (const r of ranges) {
    const shape = new THREE.Shape();
    shape.moveTo(-30, -2);
    const steps = 26;
    for (let i = 0; i <= steps; i++) {
      const x = -30 + (60 * i) / steps;
      const y = r.height * (0.45 + 0.55 * Math.abs(Math.sin(i * 0.9 + r.seed * 1.7)) * (0.6 + kit.random() * 0.4));
      shape.lineTo(x, y);
    }
    shape.lineTo(30, -2);
    kit.mesh(new THREE.ShapeGeometry(shape), kit.glow(r.color, 1, false), 0, 0, r.z);
  }

  // Lago que refleja el cielo, con un brillo que se mueve.
  const lake = kit.mesh(new THREE.CircleGeometry(12, 48), kit.matte(0x7f8fb5, 0.15, 0.3), 0.5, 0.01, -12);
  lake.rotation.x = -Math.PI / 2;
  lake.scale.set(1.4, 0.7, 1);
  const glint = kit.mesh(new THREE.PlaneGeometry(1.6, 0.05), kit.glow(0xffe0b0, 0.7, false), -2.4, 0.03, -10);
  glint.rotation.x = -Math.PI / 2;
  const glint2 = kit.mesh(new THREE.PlaneGeometry(0.9, 0.04), kit.glow(0xffe0b0, 0.5, false), -2.0, 0.03, -8.5);
  glint2.rotation.x = -Math.PI / 2;
  kit.updaters.push((t) => {
    (glint.material as THREE.MeshBasicMaterial).opacity = 0.45 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.3));
    (glint2.material as THREE.MeshBasicMaterial).opacity = 0.3 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.7 + 1));
  });

  // Pradera: suelo verde que se funde con la niebla calida.
  const meadow = kit.mesh(new THREE.CircleGeometry(30, 48), kit.matte(0x5c6e3a, 1), 0, 0, -6);
  meadow.rotation.x = -Math.PI / 2;
  // La pradera no debe tapar el lago: el lago esta un poco mas alto.
  lake.position.y = 0.02;

  // Pinos: conos oscuros en grupos a los dos lados, que se mecen con el viento.
  const needle = kit.matte(0x2f4a33, 0.95);
  const needleLight = kit.matte(0x3d5c3c, 0.95);
  const trunk = kit.matte(0x4a3526, 1);
  const trees: { g: THREE.Group; phase: number }[] = [];
  const pine = (x: number, z: number, h: number) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    kit.group.add(g);
    kit.mesh(new THREE.CylinderGeometry(h * 0.03, h * 0.04, h * 0.25, 6), trunk, 0, h * 0.12, 0, g);
    for (let k = 0; k < 3; k++) {
      const r = h * (0.26 - k * 0.06);
      kit.mesh(new THREE.ConeGeometry(r, h * 0.42, 9), k % 2 ? needleLight : needle, 0, h * (0.35 + k * 0.2), 0, g);
    }
    trees.push({ g, phase: kit.random() * 6 });
  };
  const spots: [number, number, number][] = [
    [-2.6, -6.0, 2.9], [-3.2, -7.5, 4.0], [-2.1, -9.5, 3.3], [-4.3, -6.2, 3.6], [-1.9, -12, 2.8],
    [2.4, -5.8, 3.3], [3.4, -7.6, 4.1], [2.2, -10.2, 3.0], [4.4, -5.4, 3.4], [3.9, -11.5, 3.8],
  ];
  for (const [x, z, h] of spots) pine(x, z, h);
  kit.updaters.push((t) => {
    for (const tr of trees) {
      tr.g.rotation.z = sway(t, tr.phase, 0.012);
    }
  });

  // Roca grande a la derecha con la mochila y el farol (el campamento de Rio), y otra lejos.
  const rock = kit.matte(0x8a8378, 0.95);
  const rockDark = kit.matte(0x6d675e, 0.95);
  const boulder = kit.mesh(new THREE.DodecahedronGeometry(0.6, 1), rock, 1.35, 0.35, -2.4);
  boulder.scale.set(1.3, 0.95, 1);
  const r2 = kit.mesh(new THREE.DodecahedronGeometry(0.5, 1), rockDark, -1.6, 0.3, -3.2);
  r2.scale.set(1.5, 0.8, 1);
  const top = 0.35 + 0.6 * 0.95 - 0.04;
  const pack = new THREE.Group();
  pack.position.set(1.15, top, -2.2);
  pack.rotation.set(0, -0.5, 0.08);
  kit.group.add(pack);
  kit.box(0.3, 0.42, 0.18, kit.matte(0xb4532f, 0.9), 0, 0.21, 0, pack);
  kit.box(0.22, 0.15, 0.05, kit.matte(0x8f3f22, 0.9), 0, 0.14, 0.11, pack);
  kit.mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.32, 12), kit.matte(0x3f5a4a, 0.9), 0, 0.46, -0.02, pack).rotation.z = Math.PI / 2;
  const lx = 1.55;
  const lz = -2.25;
  kit.mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.03, 12), kit.matte(0x2c2a26, 0.5, 0.5), lx, top + 0.015, lz);
  const lanternGlass = kit.mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 12), kit.glow(0xffc070, 0.9, false), lx, top + 0.08, lz);
  kit.mesh(new THREE.ConeGeometry(0.06, 0.05, 12), kit.matte(0x2c2a26, 0.5, 0.5), lx, top + 0.155, lz);
  const lanternLight = new THREE.PointLight(0xffa850, 1.2, 2.2, 2);
  lanternLight.position.set(lx, top + 0.1, lz + 0.1);
  kit.group.add(lanternLight);
  kit.updaters.push((t) => {
    const k = candleFlicker(t, 0.4, 0.85);
    lanternLight.intensity = 1.2 * k;
    (lanternGlass.material as THREE.MeshBasicMaterial).opacity = 0.75 + 0.2 * k;
  });

  // Hierba: matas finas cerca del personaje.
  const grass = kit.matte(0x6f8544, 1);
  for (let i = 0; i < 70; i++) {
    const x = (kit.random() - 0.5) * 4;
    const z = -1 - kit.random() * 3;
    const blade = kit.mesh(new THREE.ConeGeometry(0.012, 0.12 + kit.random() * 0.12, 3), grass, x, 0.08, z);
    blade.rotation.z = (kit.random() - 0.5) * 0.4;
  }

  // Unos pajaros lejanos cruzando el cielo muy despacio.
  const birdMat = kit.glow(0x3a2c30, 0.8, false);
  const birds: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Shape();
    b.moveTo(-0.12, 0.02);
    b.quadraticCurveTo(-0.06, 0.06, 0, 0);
    b.quadraticCurveTo(0.06, 0.06, 0.12, 0.02);
    b.quadraticCurveTo(0.06, 0.03, 0, 0.01);
    b.quadraticCurveTo(-0.06, 0.03, -0.12, 0.02);
    birds.push(kit.mesh(new THREE.ShapeGeometry(b), birdMat, 0, 0, -18));
  }
  kit.updaters.push((t) => {
    birds.forEach((b, i) => {
      const u = ((t * 0.02 + i * 0.07) % 1) * 2 - 1;
      b.position.set(u * 9 + i * 0.4, focus.y + 3.2 + i * 0.25 + Math.sin(t * 0.8 + i) * 0.1, -18);
      b.scale.y = 1 + Math.sin(t * 6 + i * 2) * 0.5;
    });
  });
}

const BUILDERS: Readonly<Record<SceneId, (kit: Kit, focus: THREE.Vector3) => void>> = {
  'luna-office': lunaOffice,
  'nova-room': novaRoom,
  'rio-outdoors': rioOutdoors,
};
