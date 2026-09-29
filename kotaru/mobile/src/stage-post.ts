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
uniform float bloomAmount;
uniform float saturation;
uniform float contrast;
uniform float warmth;
uniform float vignette;
uniform float time;
uniform vec2 aspect;
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
  // El personaje llega premultiplicado (se dibujo sobre transparente).
  vec3 c = ch.rgb + bg * (1.0 - ch.a);
  // El halo del fondo apenas pasa por encima del personaje (lo dejaria lechoso).
  c += texture2D(bloom, vUv).rgb * bloomAmount * (1.0 - ch.a * 0.75);
  c = shoulder(c);
  vec3 s = toSRGB(c);
  float luma = dot(s, vec3(0.2126, 0.7152, 0.0722));
  s = mix(vec3(luma), s, saturation);
  s = (s - 0.5) * contrast + 0.5;
  s += vec3(warmth, warmth * 0.3, -warmth);
  vec2 d = (vUv - 0.5) * aspect;
  s *= 1.0 - vignette * smoothstep(0.35, 0.95, length(d));
  s += (hash(vUv * 997.0 + time) - 0.5) / 255.0 * 1.5;
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
    bloomAmount: { value: grade.bloom },
    saturation: { value: grade.saturation },
    contrast: { value: grade.contrast },
    warmth: { value: grade.warmth },
    vignette: { value: grade.vignette },
    time: { value: 0 },
    aspect: { value: new THREE.Vector2(1, 1) },
  });
  const materials = [blur, bright, composite];

  const pass = (material: THREE.ShaderMaterial, into: THREE.WebGLRenderTarget | null) => {
    quad.material = material;
    renderer.setRenderTarget(into);
    renderer.render(quadScene, quadCamera);
  };
  const blurPass = (from: THREE.WebGLRenderTarget, into: THREE.WebGLRenderTarget, dx: number, dy: number) => {
    blur.uniforms['src']!.value = from.texture;
    (blur.uniforms['dir']!.value as THREE.Vector2).set(dx / from.width, dy / from.height);
    pass(blur, into);
  };

  const clearColor = new THREE.Color();

  return {
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
      const a = w / h;
      (composite.uniforms['aspect']!.value as THREE.Vector2).set(a >= 1 ? a : 1, a >= 1 ? 1 : 1 / a);
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
