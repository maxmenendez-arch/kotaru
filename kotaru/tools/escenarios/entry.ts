/**
 * Pagina de muestra de los fondos de ambientacion: app.kotaru.app/escenarios/
 * Muestra a los tres personajes en su lugar sin iniciar sesion (no hay conversacion ni datos).
 * Se compila con tools/build-escenarios.sh a mobile/public/escenarios/app.js.
 */
import { startViewer } from '../../mobile/src/avatar-viewer';

const PEOPLE = [
  { id: 'luna', name: 'Luna', place: 'Una oficina tranquila de día: ventana, plantas, libros y una lámpara cálida.' },
  { id: 'nova', name: 'Nova', place: 'Su cuarto al anochecer: luz rosa y ámbar, velas, neón y la ciudad por la ventana.' },
  { id: 'rio', name: 'Rio', place: 'Un claro de montaña al atardecer: pinos, lago, montañas y su campamento.' },
] as const;

async function main(): Promise<void> {
  const root = document.getElementById('escenarios');
  if (!root) return;
  for (const person of PEOPLE) {
    const card = document.createElement('section');
    card.className = 'card';
    const title = document.createElement('h2');
    title.textContent = person.name;
    const text = document.createElement('p');
    text.textContent = person.place;
    const canvas = document.createElement('canvas');
    const width = Math.min(520, root.clientWidth || 520);
    const height = Math.round(width * 0.62);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const status = document.createElement('p');
    status.className = 'status';
    status.textContent = 'Cargando…';
    card.append(title, canvas, text, status);
    root.append(card);
    const props = { companion: person.id, size: height, width, background: true, state: 'idle', affect: null, level: () => 0, fallback: null };
    try {
      // Uno detras de otro: tres modelos a la vez pesan demasiado en un telefono.
      await startViewer(canvas, `/avatars/${person.id}.vrm`, () => props as never);
      status.remove();
    } catch (error) {
      status.textContent = 'No se pudo cargar el 3D en este navegador.';
      console.warn(error);
    }
  }
}

void main();
