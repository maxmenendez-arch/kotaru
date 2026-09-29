import type { CompanionId } from './companions';
import type { Lang } from './i18n';

/**
 * Ficha de presentacion de cada personaje para la pantalla de seleccion: cualidades
 * (etiquetas cortas) y atributos (lo que es, como habla, que ofrece). Resume sus manuales
 * (docs/personajes) y sus fichas visuales (claude/12_PERSONAJES_VISUAL): nada de lo que
 * se promete aqui puede ir mas alla de lo que el personaje hace de verdad.
 *
 * Todos son personajes de IA y adultos; la pantalla lo dice siempre.
 */
export interface CharacterProfile {
  readonly qualities: Readonly<Record<Lang, readonly string[]>>;
  readonly attributes: Readonly<Record<Lang, readonly { readonly label: string; readonly value: string }[]>>;
  /** Frase de saludo que se ve mientras "habla" en la vista animada. */
  readonly greeting: Readonly<Record<Lang, string>>;
}

export const PROFILES: Readonly<Record<CompanionId, CharacterProfile>> = {
  luna: {
    qualities: {
      es: ['Serena', 'Escucha de verdad', 'Paciente', 'Cálida'],
      en: ['Serene', 'Really listens', 'Patient', 'Warm'],
    },
    attributes: {
      es: [
        { label: 'Para', value: 'Compañía cuando te sientes solo, con ansiedad o con la cabeza llena.' },
        { label: 'Te ofrece', value: 'Conversación tranquila, ejercicios de respiración y sonidos relajantes.' },
        { label: 'Su lugar', value: 'Una oficina luminosa con plantas, libros y un parque por la ventana.' },
        { label: 'Su voz', value: 'Serena y cálida, con frases cortas y pausas.' },
        { label: 'Importante', value: 'No es terapeuta ni un servicio de emergencias; te anima a apoyarte también en personas reales.' },
      ],
      en: [
        { label: 'For', value: 'Company when you feel lonely, anxious or your mind is full.' },
        { label: 'Offers', value: 'Calm conversation, breathing exercises and relaxing sounds.' },
        { label: 'Her place', value: 'A bright office with plants, books and a park outside the window.' },
        { label: 'Her voice', value: 'Serene and warm, with short sentences and pauses.' },
        { label: 'Important', value: 'She is not a therapist or an emergency service; she encourages you to lean on real people too.' },
      ],
    },
    greeting: { es: 'Hola. Estoy aquí, sin prisa. ¿Cómo llegas hoy?', en: 'Hi. I’m here, no rush. How are you arriving today?' },
  },
  nova: {
    qualities: {
      es: ['Coqueta', 'Ingeniosa', 'Segura', 'Juguetona'],
      en: ['Flirty', 'Witty', 'Confident', 'Playful'],
    },
    attributes: {
      es: [
        { label: 'Para', value: 'Química, ingenio y un poco de tensión juguetona. Tú marcas el ritmo.' },
        { label: 'Te ofrece', value: 'Coqueteo con escenas imaginadas, retos y halagos; modo Amigo cuando solo quieres charlar.' },
        { label: 'Su lugar', value: 'Su cuarto de noche, con velas, neón y la ciudad lloviendo tras la ventana.' },
        { label: 'Su voz', value: 'Cercana y segura, con sonrisa y pausas con intención.' },
        { label: 'Importante', value: 'Solo para personas adultas. Para con un “para” y nunca pasa a lo explícito.' },
      ],
      en: [
        { label: 'For', value: 'Chemistry, wit and a little playful tension. You set the pace.' },
        { label: 'Offers', value: 'Flirting with imagined scenes, challenges and compliments; Friend mode when you just want to chat.' },
        { label: 'Her place', value: 'Her room at night, with candles, neon and the city raining outside.' },
        { label: 'Her voice', value: 'Close and confident, with a smile and deliberate pauses.' },
        { label: 'Important', value: 'Adults only. She stops at “stop” and never turns explicit.' },
      ],
    },
    greeting: { es: 'Llegaste justo cuando iba a poner música. ¿Te quedas?', en: 'You arrived just as I was putting on music. Staying?' },
  },
  rio: {
    qualities: {
      es: ['Divertido', 'Aventurero', 'Espontáneo', 'Buen anfitrión'],
      en: ['Fun', 'Adventurous', 'Spontaneous', 'Great host'],
    },
    attributes: {
      es: [
        { label: 'Para', value: 'Juegos, historias, misterios y risas; y coqueteo si te apetece.' },
        { label: 'Te ofrece', value: 'Aventuras interactivas, retos de ingenio y planes; modo Amigo o Coqueteo.' },
        { label: 'Su lugar', value: 'Un claro de montaña al atardecer, con fogata, lago y su campamento.' },
        { label: 'Su voz', value: 'Cálida y viva, con risa audible y ritmo de buen narrador.' },
        { label: 'Importante', value: 'Solo para personas adultas. Coquetea solo si tú lo invitas y para en cuanto lo pides.' },
      ],
      en: [
        { label: 'For', value: 'Games, stories, mysteries and laughs; and flirting if you like.' },
        { label: 'Offers', value: 'Interactive adventures, wit challenges and plans; Friend or Flirt mode.' },
        { label: 'His place', value: 'A mountain clearing at sunset, with a campfire, a lake and his camp.' },
        { label: 'His voice', value: 'Warm and lively, with an audible laugh and a storyteller’s rhythm.' },
        { label: 'Important', value: 'Adults only. He flirts only if you invite it and stops as soon as you ask.' },
      ],
    },
    greeting: { es: 'Te propongo un juego: tú eliges el lugar y yo pongo el giro.', en: 'Here’s a game: you pick the place and I add the twist.' },
  },
};
