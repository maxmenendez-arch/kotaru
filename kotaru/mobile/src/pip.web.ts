/**
 * Ventana flotante tipo videollamada (web): al salir de la pestaña o de la app, el
 * personaje sigue a la vista en una ventana pequeña encima de todo, con su voz sonando y
 * un boton para hablarle.
 *
 * - Chrome y Edge de escritorio (Document Picture-in-Picture): se lleva el lienzo del
 *   personaje a la ventana flotante, con el nombre, "Inteligencia artificial", el estado,
 *   "Mantén para hablar" y "Volver". Al cerrarla, el lienzo vuelve a su sitio.
 *   Si el navegador lo permite, se abre sola al cambiar de pestaña (mediaSession).
 * - Safari (iPhone y Mac) y otros (video Picture-in-Picture): el personaje se ve en la
 *   ventanita de video del sistema, con su voz dentro del video para que siga sonando al
 *   salir de Safari; para hablar hay que volver a la app. El video se prepara antes del toque
 *   (preparePip): iOS solo abre la ventana si se pide en el mismo toque.
 *
 * Solo se abre por un gesto de la persona (icono) o por el mecanismo automatico del propio
 * navegador; nunca graba ni envia la imagen: el lienzo se muestra, nada mas.
 */

import { pipVoiceTrack, routeVoiceToPip } from './web-audio';

export type PipMode = 'document' | 'video' | null;

interface DocumentPipApi {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
  readonly window: Window | null;
}

function documentPip(): DocumentPipApi | null {
  const api = (window as unknown as { documentPictureInPicture?: DocumentPipApi }).documentPictureInPicture;
  return api && typeof api.requestWindow === 'function' ? api : null;
}

export function pipSupport(): PipMode {
  if (typeof window === 'undefined') return null;
  if (documentPip()) return 'document';
  const video = document.createElement('video') as HTMLVideoElement & { webkitSupportsPresentationMode?: (m: string) => boolean };
  const canvasStream = typeof HTMLCanvasElement !== 'undefined' && 'captureStream' in HTMLCanvasElement.prototype;
  if (canvasStream && (document.pictureInPictureEnabled || video.webkitSupportsPresentationMode?.('picture-in-picture'))) return 'video';
  return null;
}

export interface PipOptions {
  readonly canvas: HTMLCanvasElement;
  readonly name: string;
  readonly aiBadge: string;
  readonly accent: string;
  readonly talkLabel: string;
  readonly releaseLabel: string;
  readonly backLabel: string;
  onTalkStart(): void;
  onTalkEnd(): void;
  onClosed(): void;
}

export interface PipHandle {
  /** Estado para mostrar (texto) y si esta escuchando. */
  update(stateLabel: string, listening: boolean, canTalk: boolean): void;
  close(): void;
}

export async function openPip(options: PipOptions): Promise<PipHandle | null> {
  const api = documentPip();
  if (api) return openDocumentPip(api, options);
  if (pipSupport() === 'video') return openVideoPip(options);
  return null;
}

async function openDocumentPip(api: DocumentPipApi, o: PipOptions): Promise<PipHandle | null> {
  if (api.window) api.window.close();
  const pip = await api.requestWindow({ width: 360, height: 600 });
  const doc = pip.document;
  doc.title = o.name;
  const style = doc.createElement('style');
  style.textContent = `
    html, body { margin: 0; height: 100%; background: #0B1020; color: #F5F7FC; font: 15px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; overflow: hidden; }
    .stage { position: absolute; inset: 0; }
    .stage canvas { width: 100% !important; height: 100% !important; object-fit: cover; display: block; }
    .top { position: absolute; top: 10px; left: 10px; right: 10px; display: flex; gap: 8px; align-items: center; }
    .pill { background: rgba(11,16,32,0.72); border-radius: 999px; padding: 4px 10px; }
    .name { font-weight: 600; }
    .ai { font-size: 11px; color: #AAB3C8; letter-spacing: .5px; }
    .bottom { position: absolute; left: 12px; right: 12px; bottom: 12px; display: flex; flex-direction: column; gap: 8px; }
    button { font: inherit; font-weight: 600; border: 0; border-radius: 999px; padding: 14px; cursor: pointer; user-select: none; -webkit-user-select: none; touch-action: none; }
    .talk { background: #7C5CFF; color: #fff; }
    .talk.on { background: #37D6C8; color: #0B1020; }
    .talk:disabled { opacity: .5; }
    .back { background: rgba(11,16,32,0.72); color: #F5F7FC; padding: 10px; }
    button:focus-visible { outline: 2px solid #9FB4FF; outline-offset: 2px; }
  `;
  doc.head.append(style);

  // El lienzo se muda a la ventana flotante; un hueco con su tamaño lo espera en la app.
  const home = o.canvas.parentElement;
  const placeholder = document.createElement('div');
  placeholder.style.width = o.canvas.style.width;
  placeholder.style.height = o.canvas.style.height;
  home?.replaceChild(placeholder, o.canvas);
  const stage = doc.createElement('div');
  stage.className = 'stage';
  stage.append(doc.adoptNode(o.canvas));

  const top = doc.createElement('div');
  top.className = 'top';
  const who = doc.createElement('div');
  who.className = 'pill';
  who.innerHTML = '';
  const name = doc.createElement('span');
  name.className = 'name';
  name.textContent = o.name;
  name.style.color = o.accent;
  const ai = doc.createElement('div');
  ai.className = 'ai';
  ai.textContent = o.aiBadge;
  who.append(name, ai);
  const stateEl = doc.createElement('div');
  stateEl.className = 'pill';
  stateEl.setAttribute('aria-live', 'polite');
  top.append(who, stateEl);

  const bottom = doc.createElement('div');
  bottom.className = 'bottom';
  const talk = doc.createElement('button');
  talk.className = 'talk';
  talk.textContent = o.talkLabel;
  let holding = false;
  const start = (e: Event) => {
    e.preventDefault();
    if (holding || talk.disabled) return;
    holding = true;
    o.onTalkStart();
  };
  const end = (e: Event) => {
    e.preventDefault();
    if (!holding) return;
    holding = false;
    o.onTalkEnd();
  };
  talk.addEventListener('pointerdown', start);
  talk.addEventListener('pointerup', end);
  talk.addEventListener('pointerleave', end);
  talk.addEventListener('pointercancel', end);
  const back = doc.createElement('button');
  back.className = 'back';
  back.textContent = o.backLabel;
  back.addEventListener('click', () => {
    window.focus();
    pip.close();
  });
  bottom.append(talk, back);
  doc.body.append(stage, top, bottom);

  // La ventana flotante cambia de tamaño: el visor ajusta su lienzo (object-fit cubre).
  let closed = false;
  const restore = () => {
    if (closed) return;
    closed = true;
    if (holding) o.onTalkEnd();
    placeholder.replaceWith(document.adoptNode(o.canvas));
    o.onClosed();
  };
  pip.addEventListener('pagehide', restore);

  return {
    update(stateLabel, listening, canTalk) {
      stateEl.textContent = stateLabel;
      talk.classList.toggle('on', listening);
      talk.textContent = listening ? o.releaseLabel : o.talkLabel;
      talk.disabled = !canTalk;
    },
    close() {
      pip.close();
      restore();
    },
  };
}

type PipVideo = HTMLVideoElement & {
  webkitSetPresentationMode?: (m: string) => void;
  webkitPresentationMode?: string;
  autoPictureInPicture?: boolean;
};

/** Video preparado de antemano (iPhone): el lienzo del personaje y la voz, ya reproduciendose. */
let prepared: { canvas: HTMLCanvasElement; video: PipVideo; stream: MediaStream } | null = null;

/**
 * Prepara la ventana de video ANTES del toque. En iPhone la ventana flotante solo se abre si
 * se pide en el mismo instante del toque y con un video que ya se esta reproduciendo; si hay
 * que esperar a que arranque, Safari ya no la concede. Se llama con cada toque en la
 * conversacion (barato: si ya esta preparado para ese lienzo, no hace nada).
 */
export function preparePip(canvas: HTMLCanvasElement | null): void {
  if (!canvas || documentPip() || pipSupport() !== 'video') return;
  if (prepared?.canvas === canvas) return;
  disposePrepared();
  const stream = canvas.captureStream(30);
  const voice = pipVoiceTrack();
  if (voice) stream.addTrack(voice);
  const video = document.createElement('video') as PipVideo;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.srcObject = stream;
  // Visible (iOS no deja flotar un video que no se ve), diminuto y sin tapar nada.
  Object.assign(video.style, { position: 'fixed', width: '48px', height: '48px', opacity: '0.01', pointerEvents: 'none', left: '0', bottom: '0', zIndex: '0' });
  document.body.append(video);
  void video.play().catch(() => undefined);
  prepared = { canvas, video, stream };
}

function disposePrepared(): void {
  if (!prepared) return;
  prepared.stream.getVideoTracks().forEach((t) => t.stop());
  prepared.video.remove();
  prepared = null;
}

function openVideoPip(o: PipOptions): PipHandle | null {
  // Sin esperas antes de pedir la ventana: el toque todavia cuenta.
  preparePip(o.canvas);
  if (!prepared) return null;
  const { video } = prepared;
  void video.play().catch(() => undefined);
  let closed = false;
  const cleanup = () => {
    if (closed) return;
    closed = true;
    // La voz vuelve a sonar por la pagina y el video queda preparado para la proxima vez.
    video.muted = true;
    routeVoiceToPip(false);
    o.onClosed();
  };
  video.addEventListener('leavepictureinpicture', cleanup, { once: true });
  video.addEventListener('webkitpresentationmodechanged', () => {
    if (video.webkitPresentationMode === 'inline') cleanup();
  });
  try {
    if (video.webkitSetPresentationMode) video.webkitSetPresentationMode('picture-in-picture');
    else if (video.requestPictureInPicture) void video.requestPictureInPicture().catch(() => cleanup());
    else return null;
  } catch {
    cleanup();
    return null;
  }
  // En la ventana flotante la voz sale por el video: asi sigue sonando fuera de Safari.
  video.muted = false;
  routeVoiceToPip(true);
  return {
    update() {
      // La ventana de video del sistema no admite botones propios.
    },
    close() {
      if (video.webkitSetPresentationMode) video.webkitSetPresentationMode('inline');
      else if (document.pictureInPictureElement === video) void document.exitPictureInPicture().catch(() => undefined);
      cleanup();
    },
  };
}

/**
 * Pide al navegador que abra la ventana flotante solo al cambiar de pestaña (Chrome, si la
 * persona lo tiene permitido). Devuelve como quitarlo.
 */
export function autoPip(open: () => void): () => void {
  const session = (navigator as Navigator & { mediaSession?: MediaSession }).mediaSession;
  if (!session || !documentPip()) return () => undefined;
  try {
    session.setActionHandler('enterpictureinpicture' as MediaSessionAction, () => open());
  } catch {
    return () => undefined;
  }
  return () => {
    try {
      session.setActionHandler('enterpictureinpicture' as MediaSessionAction, null);
    } catch {
      // Nada que quitar.
    }
  };
}
