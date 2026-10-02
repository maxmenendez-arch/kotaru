/**
 * Modo de audio de llamada durante toda la conversacion (Safari en iPhone).
 *
 * iOS cambia el modo de audio al abrir y cerrar el microfono: con el micro abierto suena en
 * modo "llamada" y al cerrarlo vuelve al modo normal, con otro volumen. En la conversacion
 * eso hacia que todo (voz y fondo) se oyera a la mitad justo cuando hablaba el personaje
 * (lo noto el dueño el 2026-09-29). Fijando el modo "play-and-record" mientras la
 * conversacion esta abierta, el volumen no cambia entre escuchar y hablar.
 *
 * La API (navigator.audioSession) existe en Safari 17+; en otros navegadores no hace nada.
 * No abre el microfono: solo fija el modo.
 */
type AudioSessionType = 'auto' | 'playback' | 'transient' | 'transient-solo' | 'ambient' | 'play-and-record';

export function keepCallAudio(on: boolean): void {
  const session = (navigator as unknown as { audioSession?: { type: AudioSessionType } }).audioSession;
  if (!session) return;
  try {
    session.type = on ? 'play-and-record' : 'auto';
  } catch {
    // Navegador que la tiene pero no deja cambiarla: se queda como estaba.
  }
}

/**
 * Musica de la pantalla de elegir (Safari en iPhone): modo "reproduccion", para que suene por
 * el altavoz a volumen de musica aunque el telefono este en silencio y aunque se venga de una
 * conversacion (en modo llamada sonaba bajito, por el auricular). Al salir, vuelve a "auto".
 */
export function keepMusicAudio(on: boolean): void {
  const session = (navigator as unknown as { audioSession?: { type: AudioSessionType } }).audioSession;
  if (!session) return;
  try {
    session.type = on ? 'playback' : 'auto';
  } catch {
    // Navegador que no deja cambiarla.
  }
}
