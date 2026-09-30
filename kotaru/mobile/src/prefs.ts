/** Preferencias pequeñas del dispositivo (en la web, localStorage; si no hay, el valor por defecto). */
export function readFlag(key: string, fallback: boolean): boolean {
  try {
    const v = (globalThis as { localStorage?: Storage }).localStorage?.getItem(key);
    return v === 'on' ? true : v === 'off' ? false : fallback;
  } catch {
    return fallback;
  }
}

export function writeFlag(key: string, on: boolean): void {
  try {
    (globalThis as { localStorage?: Storage }).localStorage?.setItem(key, on ? 'on' : 'off');
  } catch {
    // Sin almacenamiento (privado, bloqueado): se usa solo mientras la app esta abierta.
  }
}
