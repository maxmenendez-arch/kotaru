/** Carga un script externo una sola vez (solo web). */
const loading = new Map<string, Promise<void>>();

export function loadScript(src: string): Promise<void> {
  let promise = loading.get(src);
  if (!promise) {
    promise = new Promise<void>((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.async = true;
      el.onload = () => resolve();
      el.onerror = () => {
        loading.delete(src);
        reject(new Error(`no se pudo cargar ${src}`));
      };
      document.head.appendChild(el);
    });
    loading.set(src, promise);
  }
  return promise;
}
