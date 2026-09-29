import * as THREE from 'three';
import { candleFlicker, neonPulse, PALETTES, PLATES, SCENE_FOR, seeded, sway, type SceneId } from './scenes';

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

  /** Textura dibujada con canvas 2D (cielos, ciudad, nubes). Solo en navegador. */
  canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    draw(ctx, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return this.track(texture);
  }

  #glowTexture: THREE.CanvasTexture | null = null;
  /** Punto de luz suave (centro blanco que se desvanece): luces, chispas, luciernagas. */
  glowSprite(): THREE.CanvasTexture {
    this.#glowTexture ??= this.canvasTexture(64, 64, (ctx, w) => {
      const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(255,255,255,0.8)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, w);
    });
    return this.#glowTexture;
  }

  /**
   * Nube de puntos luminosos que se mueven. `size` es el de three.js con atenuacion: a unos
   * 4 m de la camara, 0,1 son unos 6 puntos de pantalla en el escenario normal.: `step(i, t, p)` escribe la posicion del punto i
   * en `p` (x, y, z) y devuelve su brillo (0-1). Brillo por punto via color.
   */
  movingLights(count: number, size: number, color: (i: number) => number, step: (i: number, t: number, p: THREE.Vector3) => number): THREE.Points {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = Array.from({ length: count }, (_, i) => new THREE.Color(color(i)));
    const geo = this.track(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = this.track(
      new THREE.PointsMaterial({ size, map: this.glowSprite(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }),
    );
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    this.group.add(points);
    const p = new THREE.Vector3();
    const update = (t: number) => {
      for (let i = 0; i < count; i++) {
        const k = step(i, t, p);
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
        colors[i * 3] = base[i]!.r * k;
        colors[i * 3 + 1] = base[i]!.g * k;
        colors[i * 3 + 2] = base[i]!.b * k;
      }
      geo.attributes['position']!.needsUpdate = true;
      geo.attributes['color']!.needsUpdate = true;
    };
    update(0);
    this.updaters.push(update);
    return points;
  }

  /**
   * Vista pintada (B del plan de realismo): si la escena tiene imagen en PLATES, se carga
   * aparte y, cuando llega, `apply` la pone en su sitio (y oculta lo procedural que
   * sustituye). Si no hay imagen o falla, se queda la vista dibujada con codigo.
   */
  plate(url: string | null, apply: (texture: THREE.Texture) => void): void {
    if (!url) return;
    new THREE.TextureLoader().load(
      url,
      (texture) => {
        if (this.#disposed) {
          texture.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        this.track(texture);
        apply(texture);
      },
      undefined,
      () => console.info('[escena] sin vista pintada, sigue la dibujada:', url),
    );
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

  #disposed = false;

  dispose(): void {
    this.#disposed = true;
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

  BUILDERS[id](kit, focus, PLATES[id]);
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

function lunaOffice(kit: Kit, focus: THREE.Vector3, plate: string | null): void {
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
  const viewZ = wallZ + 0.06;
  const viewRandom = seeded(4242);
  // Cielo de mañana (degradado) detras de todo.
  const skyTex = kit.canvasTexture(64, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#8fbfe6');
    g.addColorStop(0.6, '#cfe4f2');
    g.addColorStop(1, '#fbf3e3');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  kit.mesh(new THREE.PlaneGeometry(win.w, win.h), kit.track(new THREE.MeshBasicMaterial({ map: skyTex, fog: false })), win.x, win.y, viewZ);
  // Nubes que pasan despacio (textura que se repite y se desplaza).
  const cloudTex = kit.canvasTexture(512, 256, (ctx, w, h) => {
    for (let i = 0; i < 9; i++) {
      const cx = viewRandom() * w;
      const cy = h * (0.15 + viewRandom() * 0.45);
      for (let k = 0; k < 7; k++) {
        const r = 18 + viewRandom() * 34;
        const x = cx + (viewRandom() - 0.5) * 90;
        const y = cy + (viewRandom() - 0.5) * 20;
        for (const dx of [-w, 0, w]) {
          const g = ctx.createRadialGradient(x + dx, y, 0, x + dx, y, r);
          g.addColorStop(0, 'rgba(255,255,255,0.85)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(x + dx - r, y - r, r * 2, r * 2);
        }
      }
    }
  });
  cloudTex.wrapS = THREE.RepeatWrapping;
  const clouds = kit.mesh(new THREE.PlaneGeometry(win.w, win.h), kit.track(new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, fog: false, depthWrite: false })), win.x, win.y, viewZ + 0.002);
  kit.updaters.push((t) => {
    cloudTex.offset.x = t * 0.004;
  });
  void clouds;
  // Parque al fondo: colinas y copas de arboles con luz de mañana, pintadas una vez.
  const parkTex = kit.canvasTexture(512, 512, (ctx, w, h) => {
    const hill = (y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 16) ctx.lineTo(x, y + Math.sin(x * 0.012 + y) * 14);
      ctx.lineTo(w, h);
      ctx.fill();
    };
    hill(h * 0.7, '#b9cfb0');
    hill(h * 0.78, '#9dbc92');
    for (let i = 0; i < 26; i++) {
      const x = viewRandom() * w;
      const y = h * (0.72 + viewRandom() * 0.2);
      const r = 22 + viewRandom() * 34;
      const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r);
      g.addColorStop(0, '#a9cf8f');
      g.addColorStop(0.7, '#6f9c63');
      g.addColorStop(1, 'rgba(79,122,74,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  const parkMat = kit.track(new THREE.MeshBasicMaterial({ map: parkTex, transparent: true, fog: false, depthWrite: false }));
  kit.mesh(new THREE.PlaneGeometry(win.w, win.h), parkMat, win.x, win.y, viewZ + 0.004);
  // Vista pintada: sustituye cielo, nubes y parque dibujados (la rama y la luz siguen).
  kit.plate(plate, (texture) => {
    fitCover(texture, win.w / win.h);
    parkMat.map = texture;
    parkMat.transparent = false;
    parkMat.needsUpdate = true;
    clouds.visible = false;
  });
  // Una rama cerca de la ventana, por fuera, que se mece con la brisa.
  const branch = new THREE.Group();
  branch.position.set(win.x + win.w / 2 - 0.1, win.y + win.h / 2 - 0.1, viewZ + 0.01);
  kit.group.add(branch);
  const branchLeaf = kit.glow(0x7fae6e, 0.95, false);
  const branchLeafDark = kit.glow(0x5f8f55, 0.95, false);
  for (let i = 0; i < 18; i++) {
    const leaf = kit.mesh(new THREE.CircleGeometry(0.035 + viewRandom() * 0.03, 10), i % 3 ? branchLeaf : branchLeafDark, -viewRandom() * 0.45, -viewRandom() * 0.3, 0, branch);
    leaf.scale.set(1.6, 0.8, 1);
    leaf.rotation.z = viewRandom() * Math.PI;
  }
  kit.updaters.push((t) => {
    branch.rotation.z = sway(t, 0.8, 0.05);
  });
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
  // Rayos de sol que entran en diagonal por la ventana, con un brillo que respira.
  const shaftTex = kit.canvasTexture(64, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,244,220,0.55)');
    g.addColorStop(1, 'rgba(255,244,220,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  const shafts: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const shaft = kit.mesh(
      new THREE.PlaneGeometry(0.28 + i * 0.08, 2.2),
      kit.track(new THREE.MeshBasicMaterial({ map: shaftTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide })),
      win.x + 0.25 + i * 0.28,
      win.y - 0.25,
      wallZ + 0.6 + i * 0.1,
    );
    shaft.rotation.z = 0.55;
    shafts.push(shaft);
  }
  kit.updaters.push((t) => {
    shafts.forEach((sh, i) => {
      (sh.material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.2 * (0.5 + 0.5 * Math.sin(t * 0.25 + i * 1.7));
    });
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
  const mug = { x: 0.84, y: 0.82, z: -2.02 };
  kit.mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.08, 16), kit.matte(0xf2ede4, 0.5), mug.x, mug.y, mug.z);
  kit.mesh(new THREE.CircleGeometry(0.036, 16), kit.matte(0x8a5a3a, 0.3), mug.x, mug.y + 0.041, mug.z).rotation.x = -Math.PI / 2;
  // Vapor del te: volutas que suben, se abren y se desvanecen.
  const steamTex = kit.glowSprite();
  const steamMat = kit.track(new THREE.SpriteMaterial({ map: steamTex, color: 0xffffff, transparent: true, depthWrite: false, opacity: 0 }));
  const puffs = Array.from({ length: 6 }, (_, i) => {
    const sp = new THREE.Sprite(steamMat.clone());
    kit.track(sp.material);
    kit.group.add(sp);
    return { sp, phase: i / 6 };
  });
  kit.updaters.push((t) => {
    for (const p of puffs) {
      const u = (t * 0.18 + p.phase) % 1;
      p.sp.position.set(mug.x + Math.sin(t * 0.9 + p.phase * 9) * 0.02 * u, mug.y + 0.06 + u * 0.28, mug.z);
      const size = 0.04 + u * 0.1;
      p.sp.scale.set(size, size * 1.3, 1);
      p.sp.material.opacity = Math.sin(u * Math.PI) * 0.3;
    }
  });
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

function novaRoom(kit: Kit, focus: THREE.Vector3, plate: string | null): void {
  const wallZ = -2.6;
  // Paredes ciruela oscuro y suelo de madera casi negra con alfombra rosa empolvado.
  kit.box(8, 4, 0.1, kit.matte(0x3b1b3f), 0, 2, wallZ);
  kit.box(8, 0.05, 8, kit.matte(0x241318, 0.6), 0, -0.025, -1.5);
  kit.mesh(new THREE.CircleGeometry(1.1, 40), kit.matte(0x8a4a67, 1), 0.2, 0.002, -1.6).rotation.x = -Math.PI / 2;

  // Ventana a la derecha: la ciudad de noche bajo la lluvia.
  const win = { x: 1.0, y: focus.y + 0.2, w: 1.2, h: 1.5 };
  const glassZ = wallZ + 0.12;
  const cityZ = wallZ + 0.06;
  // Altura de los carros en la vista (el bulevar ocupa la parte baja de la ventana).
  const street = { y: win.y - win.h / 2 + 0.26 };
  // La vista: cielo nublado que brilla con las luces de la ciudad, edificios a dos
  // distancias con ventanas encendidas y un bulevar abajo. Pintada una vez en canvas.
  const cityRandom = seeded(90210);
  const cityTex = kit.canvasTexture(512, 640, (ctx, w, h) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0b0f26');
    sky.addColorStop(0.55, '#231a45');
    sky.addColorStop(0.8, '#4a2f5e');
    sky.addColorStop(1, '#2a1d3a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    // Nubes bajas iluminadas desde abajo.
    for (let i = 0; i < 14; i++) {
      const g = ctx.createRadialGradient(cityRandom() * w, h * (0.15 + cityRandom() * 0.4), 0, cityRandom() * w, h * 0.3, 90 + cityRandom() * 120);
      g.addColorStop(0, 'rgba(120,90,150,0.18)');
      g.addColorStop(1, 'rgba(120,90,150,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
    const building = (x: number, bw: number, top: number, fill: string, lit: number, blur: number) => {
      ctx.filter = blur > 0 ? `blur(${blur}px)` : 'none';
      ctx.fillStyle = fill;
      ctx.fillRect(x, top, bw, h - top);
      const colors = ['#ffd28a', '#ffe7b8', '#9fd0ff', '#ffb3d1'];
      for (let wy = top + 8; wy < h - 60; wy += 12) {
        for (let wx = x + 5; wx < x + bw - 6; wx += 9) {
          if (cityRandom() < lit) {
            ctx.fillStyle = colors[Math.floor(cityRandom() * colors.length)]!;
            ctx.globalAlpha = 0.55 + cityRandom() * 0.45;
            ctx.fillRect(wx, wy, 4, 6);
            ctx.globalAlpha = 1;
          }
        }
      }
      ctx.filter = 'none';
    };
    // Lejos: bajos, borrosos y morados.
    for (let x = -10; x < w; ) {
      const bw = 30 + cityRandom() * 50;
      building(x, bw, h * (0.35 + cityRandom() * 0.25), '#1c1638', 0.25, 2);
      x += bw + 2;
    }
    // Cerca: altos, nitidos, casi negros.
    for (let x = -20; x < w; ) {
      const bw = 50 + cityRandom() * 70;
      building(x, bw, h * (0.18 + cityRandom() * 0.4), '#0a0a1a', 0.33, 0);
      // Antena con luz roja en algunos.
      x += bw + 6 + cityRandom() * 20;
    }
    // Bulevar mojado: asfalto con reflejos de luces.
    const road = ctx.createLinearGradient(0, h - 150, 0, h);
    road.addColorStop(0, '#15101f');
    road.addColorStop(1, '#241a2e');
    ctx.fillStyle = road;
    ctx.fillRect(0, h - 150, w, 150);
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = i % 2 ? 'rgba(255,200,140,0.16)' : 'rgba(255,90,120,0.13)';
      ctx.fillRect(cityRandom() * w, h - 140 + cityRandom() * 130, 2, 10 + cityRandom() * 24);
    }
    // Farolas.
    for (let x = 30; x < w; x += 110) {
      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(x, h - 215, 3, 70);
      const g = ctx.createRadialGradient(x + 1, h - 215, 0, x + 1, h - 215, 26);
      g.addColorStop(0, 'rgba(255,215,160,0.95)');
      g.addColorStop(1, 'rgba(255,215,160,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 26, h - 241, 54, 54);
    }
  });
  const cityMat = kit.track(new THREE.MeshBasicMaterial({ map: cityTex, fog: false }));
  kit.mesh(new THREE.PlaneGeometry(win.w, win.h), cityMat, win.x, win.y, cityZ);
  // Luces pegadas a la ciudad dibujada: con la vista pintada no coinciden y se apagan.
  const cityLights: THREE.Object3D[] = [];

  // Luces de los carros por el bulevar: faros blancos hacia un lado, pilotos rojos hacia
  // el otro, a velocidades distintas.
  const carCount = 14;
  const carSpeed = Array.from({ length: carCount }, () => 0.12 + kit.random() * 0.1);
  const carOffset = Array.from({ length: carCount }, () => kit.random());
  const cars = kit.movingLights(
    carCount * 2,
    0.17,
    (i) => (Math.floor(i / 2) % 2 ? 0xff3b3b : 0xfff2d6),
    (i, t, p) => {
      const car = Math.floor(i / 2);
      const dir = car % 2 ? -1 : 1;
      const u = (carOffset[car]! + t * carSpeed[car]! * dir + 10) % 1;
      const lane = car % 2 ? 0.0 : 0.045;
      p.set(win.x - win.w / 2 + u * win.w + (i % 2) * 0.028 * dir, street.y - 0.12 + lane, cityZ + 0.01);
      // Se apagan al llegar a los bordes (entran y salen de la vista).
      return Math.min(1, u * 8, (1 - u) * 8);
    },
  );
  // Alguna ventana que se enciende y se apaga, y la luz roja de una antena.
  const blink = [
    [win.x - 0.3, win.y + 0.1],
    [win.x + 0.15, win.y - 0.05],
    [win.x + 0.4, win.y + 0.25],
    [win.x - 0.1, win.y + 0.3],
  ];
  cityLights.push(cars);
  const windows = kit.movingLights(blink.length, 0.09, () => 0xffd28a, (i, t, p) => {
    p.set(blink[i]![0]!, blink[i]![1]!, cityZ + 0.01);
    return Math.sin(t * 0.21 + i * 2.3) > 0.3 ? 0.9 : 0;
  });
  const antenna = kit.movingLights(1, 0.14, () => 0xff2020, (_i, t, p) => {
    p.set(win.x - 0.05, win.y + win.h / 2 - 0.35, cityZ + 0.01);
    return Math.sin(t * 3) > 0.6 ? 1 : 0.15;
  });
  cityLights.push(windows, antenna);
  // Vista pintada de la ciudad: la lluvia, las gotas del cristal y el cuarto siguen igual.
  kit.plate(plate, (texture) => {
    fitCover(texture, win.w / win.h);
    cityMat.map = texture;
    cityMat.needsUpdate = true;
    for (const o of cityLights) o.visible = false;
  });

  // Lluvia afuera: trazos finos que caen en diagonal entre la ciudad y el cristal.
  const drops = 160;
  const rainPos = new Float32Array(drops * 6);
  const rainSeed = Array.from({ length: drops }, () => [kit.random(), kit.random(), 0.8 + kit.random() * 0.6] as const);
  const rainGeo = kit.track(new THREE.BufferGeometry());
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  const rain = new THREE.LineSegments(rainGeo, kit.track(new THREE.LineBasicMaterial({ color: 0xb8c4ff, transparent: true, opacity: 0.35, fog: false })));
  rain.frustumCulled = false;
  kit.group.add(rain);
  kit.updaters.push((t) => {
    for (let i = 0; i < drops; i++) {
      const [sx, sy, speed] = rainSeed[i]!;
      const fall = (sy + t * speed) % 1;
      const x = win.x - win.w / 2 + ((sx + fall * 0.08) % 1) * win.w;
      const y = win.y + win.h / 2 - fall * win.h;
      const len = 0.05 + speed * 0.03;
      rainPos.set([x, y, cityZ + 0.02, x - len * 0.18, y - len, cityZ + 0.02], i * 6);
    }
    rainGeo.attributes['position']!.needsUpdate = true;
  });

  // Gotas en el cristal: bajan despacio y a saltos, cada una a su ritmo.
  const beads = 45;
  const bead = Array.from({ length: beads }, () => ({ x: kit.random(), y: kit.random(), speed: 0.01 + kit.random() * 0.05, phase: kit.random() * 10 }));
  kit.movingLights(beads, 0.07, () => 0xcfd8ff, (i, t, p) => {
    const b = bead[i]!;
    // A saltos: casi quietas y de pronto resbalan un tramo.
    const stepT = t * b.speed * 6 + b.phase;
    const slide = Math.floor(stepT) + Math.min(1, (stepT % 1) * 3);
    const y = (b.y + slide * 0.06) % 1;
    p.set(win.x - win.w / 2 + 0.03 + b.x * (win.w - 0.06), win.y + win.h / 2 - 0.03 - y * (win.h - 0.06), glassZ);
    return 0.55;
  });
  // El cristal: un velo frio muy tenue (se nota que hay vidrio y humedad).
  kit.mesh(new THREE.PlaneGeometry(win.w, win.h), kit.glow(0x8090c0, 0.08, false), win.x, win.y, glassZ - 0.005);
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

  // Velas en el alfeizar de la ventana: llamas que titilan y dan luz ambar.
  const sillY = win.y - win.h / 2;
  kit.box(win.w + 0.2, 0.04, 0.26, kit.matte(0x2a1620, 0.5), win.x, sillY - 0.02, wallZ + 0.2);
  const candleWax = kit.matte(0xf6e9dc, 0.7);
  const flameMat = kit.glow(0xffb45a, 1, false);
  const flames: { mesh: THREE.Mesh; light: THREE.PointLight | null; phase: number }[] = [];
  const candles: [number, number][] = [
    [win.x - 0.42, 0.16],
    [win.x - 0.3, 0.24],
    [win.x - 0.18, 0.12],
  ];
  candles.forEach(([x, h], i) => {
    const z = wallZ + 0.22 + (i % 2) * 0.05;
    kit.mesh(new THREE.CylinderGeometry(0.03, 0.03, h, 14), candleWax, x, sillY + h / 2, z);
    const f = kit.mesh(new THREE.SphereGeometry(0.013, 10, 8), flameMat, x, sillY + h + 0.02, z);
    f.scale.set(0.8, 1.8, 0.8);
    let light: THREE.PointLight | null = null;
    if (i === 1) {
      light = new THREE.PointLight(0xffa04a, 1.2, 1.6, 2);
      light.position.set(x, sillY + h + 0.08, z + 0.05);
      kit.group.add(light);
    }
    flames.push({ mesh: f, light, phase: i * 1.9 });
  });
  kit.updaters.push((t) => {
    for (const f of flames) {
      const k = candleFlicker(t, f.phase);
      f.mesh.scale.set(0.8, 1.5 + k * 0.5, 0.8);
      if (f.light) f.light.intensity = 1.2 * k;
    }
  });

  // En el alfeizar, junto a las velas: una rosa roja en un jarron fino y un frasco de perfume.
  const vaseX = win.x + 0.2;
  const vaseZ = wallZ + 0.22;
  kit.mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.2, 16), kit.track(new THREE.MeshStandardMaterial({ color: 0xd9c3e8, transparent: true, opacity: 0.55, roughness: 0.1, metalness: 0.1 })), vaseX, sillY + 0.1, vaseZ);
  kit.mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22, 5), kit.matte(0x3d6b3a), vaseX, sillY + 0.3, vaseZ);
  const rose = kit.mesh(new THREE.SphereGeometry(0.035, 14, 10), kit.matte(0xb3123a, 0.7), vaseX, sillY + 0.42, vaseZ);
  rose.scale.set(1, 0.85, 1);
  kit.mesh(new THREE.SphereGeometry(0.018, 8, 6), kit.matte(0x3d6b3a), vaseX + 0.03, sillY + 0.34, vaseZ).scale.set(1.6, 0.5, 0.7);
  const perfume = new THREE.Group();
  perfume.position.set(win.x + 0.02, sillY, wallZ + 0.26);
  kit.group.add(perfume);
  kit.box(0.07, 0.09, 0.04, kit.track(new THREE.MeshStandardMaterial({ color: 0xf7b6d2, transparent: true, opacity: 0.75, roughness: 0.05, metalness: 0.2 })), 0, 0.045, 0, perfume);
  kit.mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 10), kit.matte(0xd4af37, 0.3, 0.9), 0, 0.105, 0, perfume);

  // Espejo redondo con marco dorado a la derecha del corazon.
  kit.mesh(new THREE.TorusGeometry(0.2, 0.025, 10, 40), kit.matte(0xd4af37, 0.35, 0.8), -1.2, focus.y + 0.2, wallZ + 0.08);
  // Cristal del espejo: reflejo difuso del cuarto (rosa arriba, oscuro abajo) con un brillo
  // diagonal suave, para que se lea como espejo y no como un aro.
  const mirrorTex = kit.canvasTexture(128, 128, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#b77aa6');
    g.addColorStop(0.5, '#6d3f6a');
    g.addColorStop(1, '#2a1528');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.7);
    const shine = ctx.createLinearGradient(-w, 0, w, 0);
    shine.addColorStop(0.35, 'rgba(255,255,255,0)');
    shine.addColorStop(0.47, 'rgba(255,235,245,0.45)');
    shine.addColorStop(0.53, 'rgba(255,235,245,0.45)');
    shine.addColorStop(0.65, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine;
    ctx.fillRect(-w, -h, 2 * w, 2 * h);
    ctx.restore();
    // Reflejo borroso del neon del corazon.
    const glow = ctx.createRadialGradient(w * 0.72, h * 0.3, 0, w * 0.72, h * 0.3, w * 0.25);
    glow.addColorStop(0, 'rgba(255,110,180,0.7)');
    glow.addColorStop(1, 'rgba(255,110,180,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  });
  kit.mesh(new THREE.CircleGeometry(0.2, 32), kit.track(new THREE.MeshBasicMaterial({ map: mirrorTex })), -1.2, focus.y + 0.2, wallZ + 0.07);

  // Luz de relleno violeta desde abajo a la derecha (ambiente de noche).
  const fill = new THREE.PointLight(0x9a5cff, 1.2, 4, 2);
  fill.position.set(1.2, 0.6, -0.8);
  kit.group.add(fill);
}

// ---- Rio: claro de montaña al atardecer ---------------------------------------------

function rioOutdoors(kit: Kit, focus: THREE.Vector3, plate: string | null): void {
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

  // Lo lejano (sol y montañas): se oculta si llega la vista pintada, que ya lo trae.
  const farView: THREE.Object3D[] = [];
  // Sol bajo, entre las montañas, con halo.
  farView.push(kit.mesh(new THREE.CircleGeometry(0.9, 32), kit.glow(0xfff1c8, 1, false), -3.2, 3.2, -30));
  farView.push(kit.mesh(new THREE.CircleGeometry(2.4, 32), kit.glow(0xffd9a0, 0.35, false), -3.2, 3.2, -30.1));

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
    // Cumbres mas claras (les da el sol) y faldas que se pierden en la bruma del valle.
    const geo = new THREE.ShapeGeometry(shape);
    const pos = geo.attributes['position']!;
    const base = new THREE.Color(r.color);
    const haze = new THREE.Color(0xf0b98a);
    const lit = base.clone().lerp(new THREE.Color(0xffe0c8), 0.35);
    const cols: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const k = Math.max(0, Math.min(1, pos.getY(i) / r.height));
      const c = k > 0.55 ? base.clone().lerp(lit, (k - 0.55) / 0.45) : haze.clone().lerp(base, 0.35 + (k / 0.55) * 0.65);
      cols.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    farView.push(kit.mesh(geo, kit.track(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false })), 0, 0, r.z));
  }
  // Vista pintada: un telon lejano (detras de las nubes, que siguen pasando) con el horizonte
  // a la altura de los ojos. El lago cercano, los pinos y el campamento siguen en 3D.
  kit.plate(plate, (texture) => {
    const h = 36;
    const image = texture.image as { width: number; height: number } | undefined;
    const w = h * (image?.width && image.height ? image.width / image.height : 2);
    const backdrop = kit.mesh(new THREE.PlaneGeometry(w, h), kit.track(new THREE.MeshBasicMaterial({ map: texture, fog: false, depthWrite: false })), 0, focus.y + h * 0.02, -34);
    backdrop.renderOrder = -0.5;
    for (const o of farView) o.visible = false;
  });

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

  // Pinos pintados (ramas irregulares, borde iluminado por el sol de la izquierda), en planos
  // que miran a la camara: se ven mucho mas naturales que conos. Dos variantes.
  const pineTexture = (seed: number, dark: string, mid: string, light: string) => {
    const r = seeded(seed);
    return kit.canvasTexture(256, 512, (ctx, w, h) => {
      ctx.fillStyle = '#3b2a1e';
      ctx.fillRect(w / 2 - 7, h * 0.8, 14, h * 0.2);
      const tiers = 11;
      for (let k = 0; k < tiers; k++) {
        const top = h * 0.04 + (k / tiers) * h * 0.8;
        const half = w * (0.06 + 0.42 * ((k + 1) / tiers));
        const bottom = top + h * 0.13;
        const drawTier = (color: string, shrink: number, shift: number) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(w / 2 + shift, top);
          const n = 9;
          for (let i = 0; i <= n; i++) {
            const x = w / 2 + shift - half * shrink + (2 * half * shrink * i) / n;
            const y = bottom - (i % 2 ? r() * h * 0.03 : 0);
            ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        };
        drawTier(dark, 1, 0);
        drawTier(mid, 0.8, -half * 0.12);
        drawTier(light, 0.35, -half * 0.45);
      }
    });
  };
  const pineMats = [
    kit.track(new THREE.MeshLambertMaterial({ map: pineTexture(11, '#1f3526', '#2c4a33', '#5b7a45'), alphaTest: 0.5, side: THREE.DoubleSide })),
    kit.track(new THREE.MeshLambertMaterial({ map: pineTexture(29, '#243b2a', '#35553a', '#6d8a4c'), alphaTest: 0.5, side: THREE.DoubleSide })),
  ];
  const trees: { g: THREE.Group; phase: number }[] = [];
  const pine = (x: number, z: number, h: number) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    kit.group.add(g);
    kit.mesh(new THREE.PlaneGeometry(h * 0.5, h), pineMats[trees.length % 2]!, 0, h / 2, 0, g);
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
  const r2 = kit.mesh(new THREE.DodecahedronGeometry(0.5, 1), rockDark, -2.4, 0.3, -3.2);
  r2.scale.set(1.5, 0.8, 1);
  const top = 0.35 + 0.6 * 0.95 - 0.04;
  const pack = new THREE.Group();
  pack.position.set(1.15, top, -2.2);
  pack.rotation.set(0, -0.5, 0.08);
  kit.group.add(pack);
  // Mochila de tela: cuerpo redondeado, bolsillo, tapa y el saco de dormir enrollado encima.
  const body = kit.mesh(new THREE.CapsuleGeometry(0.13, 0.2, 6, 14), kit.matte(0xb4532f, 0.95), 0, 0.24, 0, pack);
  body.scale.set(1.1, 1, 0.7);
  const pocket = kit.mesh(new THREE.CapsuleGeometry(0.08, 0.06, 4, 12), kit.matte(0x8f3f22, 0.95), 0, 0.16, 0.08, pack);
  pocket.scale.set(1.2, 1, 0.5);
  kit.mesh(new THREE.SphereGeometry(0.14, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), kit.matte(0x9c4526, 0.95), 0, 0.4, 0, pack).scale.set(1.05, 0.5, 0.75);
  const roll = kit.mesh(new THREE.CapsuleGeometry(0.06, 0.24, 4, 12), kit.matte(0x3f5a4a, 0.95), 0, 0.5, -0.02, pack);
  roll.rotation.z = Math.PI / 2;
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

  // Nubes altas teñidas de atardecer que avanzan muy despacio.
  const skyRandom = seeded(777);
  const cloudTex = kit.canvasTexture(1024, 256, (ctx, w, h) => {
    for (let i = 0; i < 12; i++) {
      const cx = skyRandom() * w;
      const cy = h * (0.3 + skyRandom() * 0.4);
      for (let k = 0; k < 9; k++) {
        const rx = 40 + skyRandom() * 70;
        const x = cx + (skyRandom() - 0.5) * 160;
        const y = cy + (skyRandom() - 0.5) * 24;
        for (const dx of [-w, 0, w]) {
          const g = ctx.createRadialGradient(x + dx, y, 0, x + dx, y, rx);
          g.addColorStop(0, 'rgba(255,214,186,0.55)');
          g.addColorStop(0.6, 'rgba(236,160,150,0.25)');
          g.addColorStop(1, 'rgba(236,160,150,0)');
          ctx.fillStyle = g;
          ctx.fillRect(x + dx - rx, y - rx, rx * 2, rx * 2);
        }
      }
    }
  });
  cloudTex.wrapS = THREE.RepeatWrapping;
  kit.mesh(
    new THREE.PlaneGeometry(70, 10),
    kit.track(new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false })),
    0,
    focus.y + 7,
    -32,
  );
  kit.updaters.push((t) => {
    cloudTex.offset.x = t * 0.0015;
  });

  // Fogata del campamento, a la izquierda: llamas que bailan, brasas y chispas que suben.
  const fire = { x: -1.35, y: 0, z: -4.6 };
  const logMat = kit.matte(0x3b2a1e, 1);
  for (let i = 0; i < 4; i++) {
    const log = kit.mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 8), logMat, fire.x, 0.05, fire.z);
    log.rotation.set(Math.PI / 2, (i * Math.PI) / 4, 0.35);
  }
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    kit.mesh(new THREE.DodecahedronGeometry(0.07, 0), kit.matte(0x5d5750, 1), fire.x + Math.cos(a) * 0.36, 0.04, fire.z + Math.sin(a) * 0.36);
  }
  const flameTex = kit.canvasTexture(64, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h * 0.72, 2, w / 2, h * 0.6, h * 0.55);
    g.addColorStop(0, 'rgba(255,250,210,1)');
    g.addColorStop(0.25, 'rgba(255,196,90,0.95)');
    g.addColorStop(0.6, 'rgba(255,110,40,0.55)');
    g.addColorStop(1, 'rgba(255,60,20,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.quadraticCurveTo(w, h * 0.65, w / 2, h);
    ctx.quadraticCurveTo(0, h * 0.65, w / 2, 0);
    ctx.fill();
  });
  const flames = Array.from({ length: 5 }, (_, i) => {
    const sp = new THREE.Sprite(kit.track(new THREE.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })));
    kit.group.add(sp);
    return { sp, phase: i * 1.37, dx: (i - 2) * 0.07 };
  });
  const fireLight = new THREE.PointLight(0xff8a3a, 3, 7, 1.6);
  fireLight.position.set(fire.x, 0.5, fire.z + 0.3);
  kit.group.add(fireLight);
  kit.updaters.push((t) => {
    for (const f of flames) {
      const k = candleFlicker(t, f.phase, 0.6);
      f.sp.scale.set(0.22 + 0.06 * k, 0.45 + 0.25 * k, 1);
      f.sp.position.set(fire.x + f.dx + Math.sin(t * 5 + f.phase) * 0.015, 0.2 + 0.1 * k, fire.z);
    }
    fireLight.intensity = 3 * candleFlicker(t, 0.9, 0.7);
  });
  const sparkSeed = Array.from({ length: 24 }, () => ({ phase: kit.random(), dx: (kit.random() - 0.5) * 0.2, speed: 0.25 + kit.random() * 0.35 }));
  kit.movingLights(sparkSeed.length, 0.09, () => 0xffa040, (i, t, p) => {
    const sp = sparkSeed[i]!;
    const u = (sp.phase + t * sp.speed) % 1;
    p.set(fire.x + sp.dx + Math.sin(t * 2 + i) * 0.08 * u, 0.3 + u * 1.6, fire.z + Math.cos(t * 1.5 + i) * 0.05);
    return (1 - u) * (0.6 + 0.4 * Math.sin(t * 20 + i));
  });

  // Carpa de lona junto a la fogata (el campamento de Rio).
  const tentShape = new THREE.Shape();
  tentShape.moveTo(-0.55, 0);
  tentShape.lineTo(0, 0.7);
  tentShape.lineTo(0.55, 0);
  tentShape.lineTo(-0.55, 0);
  const tent = kit.mesh(new THREE.ExtrudeGeometry(tentShape, { depth: 1.1, bevelEnabled: false }), kit.matte(0xd9824a, 0.95), -2.3, 0, -6.6);
  tent.rotation.y = 0.5;
  // Entrada oscura y la luz del fuego sobre la lona.
  const door = new THREE.Shape();
  door.moveTo(-0.22, 0);
  door.lineTo(0, 0.42);
  door.lineTo(0.22, 0);
  door.lineTo(-0.22, 0);
  const doorMesh = kit.mesh(new THREE.ShapeGeometry(door), kit.matte(0x2a1a12, 1), 0, 0, 1.101, tent);
  void doorMesh;

  // Luciernagas sobre la pradera: vagan despacio y se encienden a ratos.
  const flySeed = Array.from({ length: 22 }, () => ({ x: (kit.random() - 0.5) * 5, y: 0.5 + kit.random() * 1.4, z: -3 - kit.random() * 4, phase: kit.random() * 20 }));
  kit.movingLights(flySeed.length, 0.08, () => 0xe8ff9a, (i, t, p) => {
    const f = flySeed[i]!;
    p.set(f.x + Math.sin(t * 0.3 + f.phase) * 0.35, f.y + Math.sin(t * 0.5 + f.phase * 1.3) * 0.18, f.z + Math.cos(t * 0.25 + f.phase) * 0.3);
    const blink = Math.sin(t * 1.3 + f.phase * 2.1);
    return blink > 0.2 ? (blink - 0.2) * 1.25 : 0;
  });

  // Destellos del sol sobre el agua del lago: centellean al azar.
  const glintSeed = Array.from({ length: 40 }, () => ({ x: -3.2 + kit.random() * 2.4, z: -8 - kit.random() * 5, phase: kit.random() * 30 }));
  kit.movingLights(glintSeed.length, 0.12, () => 0xfff0c8, (i, t, p) => {
    const g = glintSeed[i]!;
    p.set(g.x + Math.sin(t * 0.2 + g.phase) * 0.08, 0.04, g.z);
    const k = Math.sin(t * 2.2 + g.phase);
    return k > 0.7 ? (k - 0.7) * 3.3 : 0;
  });

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

/** Recorta una imagen para cubrir un hueco de otra proporcion sin deformarla (como CSS cover). */
function fitCover(texture: THREE.Texture, aspect: number): void {
  const image = texture.image as { width: number; height: number } | undefined;
  if (!image?.width || !image.height) return;
  const imageAspect = image.width / image.height;
  if (imageAspect > aspect) {
    texture.repeat.set(aspect / imageAspect, 1);
    texture.offset.set((1 - texture.repeat.x) / 2, 0);
  } else {
    texture.repeat.set(1, imageAspect / aspect);
    texture.offset.set(0, (1 - texture.repeat.y) / 2);
  }
}

const BUILDERS: Readonly<Record<SceneId, (kit: Kit, focus: THREE.Vector3, plate: string | null) => void>> = {
  'luna-office': lunaOffice,
  'nova-room': novaRoom,
  'rio-outdoors': rioOutdoors,
};
