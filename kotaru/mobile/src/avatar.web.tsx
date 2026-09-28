import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import type { AvatarProps } from './avatar-types';

export type { AvatarProps } from './avatar-types';

/**
 * Retrato 3D del personaje en la webapp: el modelo VRM hecho en VRoid, encuadrado de
 * pecho para arriba dentro del circulo. Parpadea, respira, mira a la camara, mueve la boca
 * con el volumen de su voz y cambia de cara con la emocion que manda el servidor.
 *
 * - three.js y three-vrm (avatar-viewer.ts) se cargan aparte, en su propio archivo, y solo
 *   si hay WebGL: no pesan en el arranque de la app.
 * - Mientras carga, o si algo falla, se ve el monograma de siempre (`fallback`).
 * - Con "reducir movimiento" no hay balanceo, respiracion ni gestos; si parpadeo y boca.
 * - El audio no se analiza: solo se lee el volumen del instante (AudioOutput.level).
 *
 * Los modelos se sirven desde mobile/public/avatars (aligerados con tools/vrm-optimize.py).
 */

const MODEL_URL: Readonly<Record<string, string>> = {
  luna: '/avatars/luna.vrm',
  nova: '/avatars/nova.vrm',
  rio: '/avatars/rio.vrm',
};

type Status = 'loading' | 'ready' | 'failed';

export function Avatar(props: AvatarProps) {
  const { companion, size, fallback } = props;
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const live = useRef(props);
  live.current = props;
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const element = canvas.current;
    const url = MODEL_URL[companion];
    if (!element || !url || !hasWebGL()) {
      setStatus('failed');
      return;
    }
    setStatus('loading');
    let stopped = false;
    let dispose: (() => void) | null = null;
    import('./avatar-viewer')
      .then(({ startViewer }) => startViewer(element, url, () => live.current))
      .then((stop) => {
        if (stopped) stop();
        else {
          dispose = stop;
          setStatus('ready');
        }
      })
      .catch((error: unknown) => {
        if (!stopped) setStatus('failed');
        console.warn('[avatar] no se pudo cargar el modelo 3D', error);
      });
    return () => {
      stopped = true;
      dispose?.();
    };
  }, [companion]);

  useEffect(() => {
    // El tamano cambia al achicarse el retrato: se ajusta sin recargar el modelo.
    canvas.current?.dispatchEvent(new Event('kotaru-resize'));
  }, [size]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {status !== 'ready' ? fallback : null}
      {/* Un lienzo nuevo por personaje: el anterior pierde su contexto WebGL al cerrarse. */}
      <canvas
        key={companion}
        ref={canvas}
        aria-hidden="true"
        data-avatar-status={status}
        style={{
          position: 'absolute',
          inset: 0,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: status === 'ready' ? 1 : 0,
          transition: 'opacity 400ms ease',
          pointerEvents: 'none',
        }}
      />
    </View>
  );
}

function hasWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
  } catch {
    return false;
  }
}
