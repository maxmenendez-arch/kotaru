import * as THREE from 'three';
import type { SceneGrade } from './scenes';

/**
 * Acabado "de camara" del escenario (A del plan de realismo, claude/18_REALISMO_PLAN.md).
 *
 * En vez de dibujar todo de una vez:
 * 1. El fondo (capa 0) se dibuja a media resolucion y se desenfoca: profundidad de campo
 *    barata, el personaje queda nitido delante de un fondo suave, como en una foto.
 * 2. Lo que brilla en el fondo (velas, neon, fogata, ventanas) desprende halo (bloom).
 * 3. El personaje (capa 1) se dibuja nitido, a resolucion completa y con antialiasing.
 * 4. Una pasada final junta todo, redondea las luces altas sin quemarlas, ajusta color
 *    (saturacion, contraste, calidez), oscurece las esquinas y añade un grano minimo
 *    que quita las bandas de los degradados.
 *
 * Solo WebGL2. Sin WebGL2, `createStagePost` devuelve null y el visor dibuja como antes.
 */

export const CHARACTER_LAYER = 1;

export interface StagePost {
  setSize(width: number, height: number): void;
  /**
   * Enfoque de retrato: 0 normal; 1 primer plano (el fondo mas desenfocado y mas lejos, como
   * con un objetivo abierto). Se puede cambiar cada cuadro.
   */
  setFocus(closeness: number): void;
  /** Brillo general (1 = normal), para fundidos del short. */
  setFade(level: number): void;
  /** Cambio de foco del personaje (0 nitido, 1 blando): el foco se pierde y vuelve. */
  setSoft(level: number): void;
  render(scene: THREE.Scene, camera: THREE.PerspectiveCamera, t: number): void;
  dispose(): void;
}

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

// Desenfoque gaussiano separable de 9 muestras con 5 lecturas (filtrado lineal).
const BLUR = /* glsl */ `
uniform sampler2D src;
uniform vec2 dir;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(src, vUv).rgb * 0.2270270270;
  vec2 o1 = dir * 1.3846153846;
  vec2 o2 = dir * 3.2307692308;
  c += texture2D(src, vUv + o1).rgb * 0.3162162162;
  c += texture2D(src, vUv - o1).rgb * 0.3162162162;
  c += texture2D(src, vUv + o2).rgb * 0.0702702703;
  c += texture2D(src, vUv - o2).rgb * 0.0702702703;
  gl_FragColor = vec4(c, 1.0);
}`;

// Se queda con lo que pasa del umbral (con rodilla suave), para el halo.
const BRIGHT = /* glsl */ `
uniform sampler2D src;
uniform float threshold;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(src, vUv).rgb;
  float l = max(c.r, max(c.g, c.b));
  float k = smoothstep(threshold, threshold + 0.25, l);
  gl_FragColor = vec4(c * k, 1.0);
}`;

const COMPOSITE = /* glsl */ `
uniform sampler2D sharpBg;
uniform sampler2D blurBg;
uniform sampler2D bloom;
uniform sampler2D character;
uniform float blurAmount;
uniform float soft;
uniform float bloomAmount;
uniform float saturation;
uniform float contrast;
uniform float warmth;
uniform float vignette;
uniform float exposure;
uniform float fade;
uniform float time;
uniform vec2 aspect;
uniform vec2 texel;
uniform float wrap;
uniform vec3 shadowTint;
uniform vec3 highlightTint;
uniform float matte;
uniform float grain;
varying vec2 vUv;

vec3 shoulder(vec3 c) {
  // Igual que antes hasta 0,8; por encima se redondea en lugar de quemarse.
  vec3 over = max(c - 0.8, 0.0);
  return min(c, 0.8) + 0.2 * (1.0 - exp(-over / 0.2));
}

vec3 toSRGB(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 bg = mix(texture2D(sharpBg, vUv).rgb, texture2D(blurBg, vUv).rgb, blurAmount);
  vec4 ch = texture2D(character, vUv);
  if (soft > 0.001) {
    // Desenfoque del personaje (9 muestras en dos anillos): solo durante el cambio de foco.
    vec2 r = texel * soft * 5.0;
    vec4 acc = ch;
    acc += texture2D(character, vUv + vec2(r.x, 0.0)) + texture2D(character, vUv - vec2(r.x, 0.0));
    acc += texture2D(character, vUv + vec2(0.0, r.y)) + texture2D(character, vUv - vec2(0.0, r.y));
    acc += texture2D(character, vUv + r * 0.7) + texture2D(character, vUv - r * 0.7);
    acc += texture2D(character, vUv + vec2(r.x, -r.y) * 0.7) + texture2D(character, vUv + vec2(-r.x, r.y) * 0.7);
    ch = acc / 9.0;
  }
  // El personaje llega premultiplicado (se dibujo sobre transparente).
  vec3 c = ch.rgb * exposure + bg * (1.0 - ch.a);
  // Luz envolvente: en el borde del personaje se cuela un poco la luz del fondo (como en
  // una foto real), y deja de parecer recortado y pegado encima.
  vec2 o = texel * 3.0;
  float around = 0.25 * (
    texture2D(character, vUv + vec2(o.x, 0.0)).a + texture2D(character, vUv - vec2(o.x, 0.0)).a +
    texture2D(character, vUv + vec2(0.0, o.y)).a + texture2D(character, vUv - vec2(0.0, o.y)).a);
  float edge = ch.a * (1.0 - around);
  c += min(texture2D(blurBg, vUv).rgb, vec3(0.9)) * edge * wrap;
  // El halo del fondo apenas pasa por encima del personaje (lo dejaria lechoso).
  c += texture2D(bloom, vUv).rgb * bloomAmount * (1.0 - ch.a * 0.75);
  c = shoulder(c);
  vec3 s = toSRGB(c);
  float luma = dot(s, vec3(0.2126, 0.7152, 0.0722));
  s = mix(vec3(luma), s, saturation);
  s = (s - 0.5) * contrast + 0.5;
  s += vec3(warmth, warmth * 0.3, -warmth);
  // Etalonaje de cine: sombras hacia un tono (frio) y luces hacia otro (calido), mas fuerte en
  // los extremos que en los medios (la piel queda casi intacta).
  float tl = clamp(dot(s, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0);
  s += shadowTint * (1.0 - smoothstep(0.0, 0.55, tl)) + highlightTint * smoothstep(0.45, 1.0, tl);
  // Curva en S suave de pelicula y negros levantados (mate): menos «render», mas foto.
  s = mix(s, s * s * (3.0 - 2.0 * s), 0.22);
  s = matte + s * (1.0 - matte * 1.4);
  vec2 d = (vUv - 0.5) * aspect;
  s *= 1.0 - vignette * smoothstep(0.35, 0.95, length(d));
  s *= fade;
  s += (hash(vUv * 997.0 + time) - 0.5) / 255.0 * 1.5;
  // Grano de pelicula: mas en los medios tonos, cambia en cada cuadro (24 por segundo).
  float g = hash(floor(vUv / texel / 1.5) + floor(time * 24.0) * 17.0) - 0.5;
  s += g * grain * (0.5 + 0.5 * (1.0 - abs(tl * 2.0 - 1.0)));
  gl_FragColor = vec4(clamp(s, 0.0, 1.0), 1.0);
}`;

function target(renderer: THREE.WebGLRenderer, samples = 0): THREE.WebGLRenderTarget {
  // Media precision si se puede (las luces pasan de 1 y el halo sale mejor); si no, 8 bits.
  const float = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
  const t = new THREE.WebGLRenderTarget(1, 1, {
    type: float ? THREE.HalfFloatType : THREE.UnsignedByteType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: true,
    samples: Math.min(samples, renderer.capabilities.maxSamples),
  });
  t.texture.generateMipmaps = false;
  return t;
}

export function createStagePost(renderer: THREE.WebGLRenderer, grade: SceneGrade): StagePost | null {
  if (!renderer.capabilities.isWebGL2) return null;

  const bg = target(renderer);
  const blurA = target(renderer);
  const blurB = target(renderer);
  const bloomA = target(renderer);
  const bloomB = target(renderer);
  const character = target(renderer, 4);
  const targets = [bg, blurA, blurB, bloomA, bloomB, character];

  const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadScene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  quad.frustumCulled = false;
  quadScene.add(quad);

  const shader = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) =>
    new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader, uniforms, depthTest: false, depthWrite: false });
  const blur = shader(BLUR, { src: { value: null }, dir: { value: new THREE.Vector2() } });
  const bright = shader(BRIGHT, { src: { value: null }, threshold: { value: grade.bloomThreshold } });
  const composite = shader(COMPOSITE, {
    sharpBg: { value: bg.texture },
    blurBg: { value: blurB.texture },
    bloom: { value: bloomA.texture },
    character: { value: character.texture },
    blurAmount: { value: grade.blur },
    soft: { value: 0 },
    bloomAmount: { value: grade.bloom },
    saturation: { value: grade.saturation },
    contrast: { value: grade.contrast },
    warmth: { value: grade.warmth },
    vignette: { value: grade.vignette },
    exposure: { value: grade.exposure ?? 1 },
    fade: { value: 1 },
    time: { value: 0 },
    aspect: { value: new THREE.Vector2(1, 1) },
    texel: { value: new THREE.Vector2(1, 1) },
    wrap: { value: 0.3 },
    shadowTint: { value: new THREE.Vector3(...(grade.shadows ?? [0, 0, 0])) },
    highlightTint: { value: new THREE.Vector3(...(grade.highlights ?? [0, 0, 0])) },
    matte: { value: grade.matte ?? 0 },
    grain: { value: grade.grain ?? 0 },
  });
  const materials = [blur, bright, composite];

  const pass = (material: THREE.ShaderMaterial, into: THREE.WebGLRenderTarget | null) => {
    quad.material = material;
    renderer.setRenderTarget(into);
    renderer.render(quadScene, quadCamera);
  };
  // En lienzos pequeños (tarjetas) el halo y el desenfoque se acortan: medidos en pixeles de
  // una imagen chica, cubririan media pantalla y la dejarian lechosa.
  let spread = 1;
  let dof = 0;
  let bloomAmountBase = grade.bloom;
  const blurPass = (from: THREE.WebGLRenderTarget, into: THREE.WebGLRenderTarget, dx: number, dy: number) => {
    blur.uniforms['src']!.value = from.texture;
    const reach = spread * (1 + dof * 1.6);
    (blur.uniforms['dir']!.value as THREE.Vector2).set((dx * reach) / from.width, (dy * reach) / from.height);
    pass(blur, into);
  };

  const clearColor = new THREE.Color();

  return {
    setFade(level) {
      composite.uniforms['fade']!.value = Math.min(1, Math.max(0, level));
    },
    setSoft(level) {
      composite.uniforms['soft']!.value = Math.min(1, Math.max(0, level));
    },
    setFocus(closeness) {
      dof = Math.min(1, Math.max(0, closeness));
      composite.uniforms['blurAmount']!.value = Math.min(1, grade.blur + (1 - grade.blur) * dof * 0.8);
    },
    setSize(width, height) {
      // Tamaños en pixeles reales del lienzo.
      const w = Math.max(1, Math.round(width));
      const h = Math.max(1, Math.round(height));
      bg.setSize(Math.max(1, w >> 1), Math.max(1, h >> 1));
      blurA.setSize(Math.max(1, w >> 2), Math.max(1, h >> 2));
      blurB.setSize(Math.max(1, w >> 2), Math.max(1, h >> 2));
      bloomA.setSize(Math.max(1, w >> 3), Math.max(1, h >> 3));
      bloomB.setSize(Math.max(1, w >> 3), Math.max(1, h >> 3));
      character.setSize(w, h);
      spread = Math.min(1, Math.max(0.35, Math.max(w, h) / 1280));
      bloomAmountBase = grade.bloom * Math.min(1, Math.max(0.4, Math.max(w, h) / 1100));
      composite.uniforms['bloomAmount']!.value = bloomAmountBase;
      const a = w / h;
      (composite.uniforms['aspect']!.value as THREE.Vector2).set(a >= 1 ? a : 1, a >= 1 ? 1 : 1 / a);
      (composite.uniforms['texel']!.value as THREE.Vector2).set(1 / w, 1 / h);
    },

    render(scene, camera, t) {
      const previousColor = renderer.getClearColor(clearColor).getHex();
      const previousAlpha = renderer.getClearAlpha();
      const previousAutoClear = renderer.autoClear;
      renderer.autoClear = true;

      // 1. Fondo (sin el personaje) a media resolucion.
      camera.layers.set(0);
      renderer.setRenderTarget(bg);
      renderer.render(scene, camera);

      // 2. Desenfoque: media -> cuarto de resolucion, horizontal y vertical.
      blurPass(bg, blurA, 1, 0);
      blurPass(blurA, blurB, 0, 1);

      // 3. Halo de las luces: lo brillante, a un octavo, desenfocado ancho.
      bright.uniforms['src']!.value = blurB.texture;
      pass(bright, bloomA);
      blurPass(bloomA, bloomB, 1.5, 0);
      blurPass(bloomB, bloomA, 0, 1.5);

      // 4. Personaje nitido sobre transparente.
      const background = scene.background;
      scene.background = null;
      camera.layers.set(CHARACTER_LAYER);
      renderer.setClearColor(0x000000, 0);
      renderer.setRenderTarget(character);
      renderer.render(scene, camera);
      scene.background = background;
      camera.layers.set(0);

      // 5. Todo junto, en pantalla.
      composite.uniforms['time']!.value = t % 100;
      pass(composite, null);

      renderer.setClearColor(previousColor, previousAlpha);
      renderer.autoClear = previousAutoClear;
    },

    dispose() {
      for (const t of targets) t.dispose();
      for (const m of materials) m.dispose();
      quad.geometry.dispose();
    },
  };
}

/**
 * Pone el personaje en su capa y deja las luces en todas, para que iluminen tanto el
 * fondo como al personaje aunque se dibujen por separado.
 */
export function assignLayers(scene: THREE.Scene, character: THREE.Object3D): void {
  character.traverse((o) => o.layers.set(CHARACTER_LAYER));
  scene.traverse((o) => {
    if ((o as THREE.Light).isLight) o.layers.enableAll();
  });
}
