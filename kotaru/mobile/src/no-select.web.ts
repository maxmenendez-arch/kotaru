/**
 * En el navegador, mantener pulsado el boton de hablar seleccionaba su texto (y en Safari
 * de iPhone abria el menu de copiar/buscar), lo que ademas podia cortar la pulsacion.
 * Todo lo marcado con `dataSet={{ [NO_SELECT_ATTR]: 'true' }}` queda sin seleccion, sin
 * menu contextual y sin la "lupa" de iOS. Se instala una sola vez.
 */
export const NO_SELECT_ATTR = 'kotaruNoSelect';
const SELECTOR = '[data-kotaru-no-select]';
let installed = false;

export function installNoSelect(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  const style = document.createElement('style');
  style.textContent = `${SELECTOR}, ${SELECTOR} * {
  -webkit-user-select: none; user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}`;
  document.head.appendChild(style);
  document.addEventListener('contextmenu', (e) => {
    if (e.target instanceof Element && e.target.closest(SELECTOR)) e.preventDefault();
  });
  // Un arrastre accidental del dedo no debe empezar una seleccion desde el boton.
  document.addEventListener('selectstart', (e) => {
    if (e.target instanceof Node) {
      const el = e.target instanceof Element ? e.target : e.target.parentElement;
      if (el?.closest(SELECTOR)) e.preventDefault();
    }
  });
}
