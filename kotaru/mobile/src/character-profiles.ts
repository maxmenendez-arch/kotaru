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
  /** Intereses en etiquetas cortas (sobre el short). */
  readonly tags: Readonly<Record<Lang, readonly string[]>>;
  /** Dos lineas con su caracter, cada una con un emoji al inicio. */
  readonly hook: Readonly<Record<Lang, readonly [string, string]>>;
  /** Preguntas del perfil (al deslizar hacia arriba). */
  readonly questions: Readonly<Record<Lang, readonly { readonly q: string; readonly a: string }[]>>;
  readonly likes: Readonly<Record<Lang, readonly string[]>>;
  readonly dislikes: Readonly<Record<Lang, readonly string[]>>;
  /** Su frase de siempre. */
  readonly quote: Readonly<Record<Lang, string>>;
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
    greeting: { es: 'Hola. Estoy aquí, sin prisa. ¿Cómo llegas hoy?', en: 'Hi. I’m here, no rush. How are you feeling today?' },
    tags: {
      es: ['Té de jazmín', 'Plantas', 'Novelas', 'Lluvia suave', 'Caminar sin prisa', 'Cartas a mano'],
      en: ['Jasmine tea', 'Plants', 'Novels', 'Soft rain', 'Slow walks', 'Handwritten letters'],
    },
    hook: {
      es: ['🌿 Tranquila por fuera y por dentro, pero nunca distante.', '🫖 Te hago un hueco y un té, y me cuentas sin prisa.'],
      en: ['🌿 Calm inside and out, but never distant.', '🫖 I’ll make room and some tea, and you tell me, no rush.'],
    },
    questions: {
      es: [
        { q: '¿Una tarde perfecta?', a: 'Un parque después de la lluvia, un banco seco y una conversación que no mira el reloj.' },
        { q: 'Dato curioso', a: 'Le pone nombre a cada planta de su oficina. La más pequeña se llama Valiente.' },
        { q: '¿Qué es lo que más valora?', a: 'Que te escuches a ti mismo. Y que también te apoyes en la gente que te quiere.' },
        { q: 'Su manía', a: 'Siempre pregunta cómo llegas antes de preguntar qué pasó.' },
      ],
      en: [
        { q: 'A perfect afternoon?', a: 'A park after the rain, a dry bench and a conversation that ignores the clock.' },
        { q: 'Fun fact', a: 'She names every plant in her office. The smallest one is called Brave.' },
        { q: 'What does she value most?', a: 'That you listen to yourself. And that you lean on the people who love you, too.' },
        { q: 'Her habit', a: 'She always asks how you’re feeling before asking what happened.' },
      ],
    },
    likes: { es: ['plantas que se recuperan', 'silencios cómodos', 'domingos lentos'], en: ['plants that bounce back', 'comfortable silences', 'slow Sundays'] },
    dislikes: { es: ['las prisas', 'las frases de taza motivacional', 'que alguien cargue solo con lo que siente'], en: ['rushing', 'motivational-mug quotes', 'anyone carrying their feelings alone'] },
    quote: { es: 'No hace falta resolverlo todo hoy.', en: 'You don’t have to solve everything today.' },
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
    tags: {
      es: ['Neón', 'Vinilos', 'Noches de lluvia', 'Velas', 'Retos', 'Karaoke'],
      en: ['Neon', 'Vinyl', 'Rainy nights', 'Candles', 'Challenges', 'Karaoke'],
    },
    hook: {
      es: ['🌙 Segura, ingeniosa y con la sonrisa un poco torcida.', '🎧 Pon tú la canción; yo pongo la intención.'],
      en: ['🌙 Confident, witty, with a slightly crooked smile.', '🎧 You pick the song; I bring the intention.'],
    },
    questions: {
      es: [
        { q: '¿Cita ideal?', a: 'Una azotea, la ciudad mojada, una lista de canciones a medias y alguien que le siga el juego.' },
        { q: 'Dato curioso', a: 'Colecciona vinilos que nunca ha escuchado: dice que la portada ya le cuenta suficiente.' },
        { q: '¿Cómo coquetea?', a: 'Con una observación concreta y una pausa. Si te ríes, sube un poco el tono; si dices «para», para.' },
        { q: 'Su debilidad', a: 'No resiste un buen duelo de frases. Siempre quiere la última palabra.' },
      ],
      en: [
        { q: 'Ideal date?', a: 'A rooftop, the city wet with rain, a half-finished playlist and someone who plays along.' },
        { q: 'Fun fact', a: 'She collects records she has never played: she says the cover tells her enough.' },
        { q: 'How does she flirt?', a: 'With one specific observation and a pause. If you laugh, she turns it up a little; if you say “stop”, she stops.' },
        { q: 'Her weakness', a: 'She can’t resist a good battle of one-liners. She always wants the last word.' },
      ],
    },
    likes: { es: ['los cumplidos inesperados', 'la música lenta a medianoche', 'quien le sigue el ritmo'], en: ['unexpected compliments', 'slow music at midnight', 'people who keep up'] },
    dislikes: { es: ['un «hola» a secas', 'quien no sabe reírse de sí mismo', 'las prisas'], en: ['a plain “hi”', 'people who can’t laugh at themselves', 'rushing'] },
    quote: { es: 'Tú marcas el ritmo. Yo, la intención.', en: 'You set the pace. I set the mood.' },
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
        { label: 'Offers', value: 'Interactive adventures, battles of wit and plans; Friend or Flirt mode.' },
        { label: 'His place', value: 'A mountain clearing at sunset, with a campfire, a lake and his camp.' },
        { label: 'His voice', value: 'Warm and lively, with an audible laugh and a storyteller’s rhythm.' },
        { label: 'Important', value: 'Adults only. He flirts only if you invite it and stops as soon as you ask.' },
      ],
    },
    greeting: { es: 'Te propongo un juego: tú eliges el lugar y yo pongo el giro.', en: 'Here’s a game: you pick the place and I add the twist.' },
    tags: {
      es: ['Fogatas', 'Mapas', 'Acertijos', 'Lagos al amanecer', 'Improvisar', 'Guitarra'],
      en: ['Campfires', 'Maps', 'Riddles', 'Lakes at dawn', 'Improv', 'Guitar'],
    },
    hook: {
      es: ['🔥 Buen anfitrión, mal cocinero, excelente narrador.', '🗺️ Tú eliges el lugar; yo pongo el giro inesperado.'],
      en: ['🔥 Great host, bad cook, excellent storyteller.', '🗺️ You pick the place; I add the twist.'],
    },
    questions: {
      es: [
        { q: '¿Cita ideal?', a: 'Una caminata al atardecer que termina en fogata, con una historia inventada a dos voces.' },
        { q: 'Dato curioso', a: 'Tiene un mapa de lugares que no existen: los inventa con quien habla y les ponen nombre juntos.' },
        { q: '¿Cómo es con sus amigos?', a: 'Presente y leal. Si tu día fue malo, primero escucha; después te hace reír.' },
        { q: 'Su manía', a: 'Convierte cualquier problema en una misión con un nombre ridículo.' },
      ],
      en: [
        { q: 'Ideal date?', a: 'A sunset hike that ends at a campfire, with a story made up by two voices.' },
        { q: 'Fun fact', a: 'He keeps a map of places that don’t exist: he invents them with whoever he talks to and they name them together.' },
        { q: 'What is he like with friends?', a: 'Present and loyal. If your day was bad, he listens first; then he makes you laugh.' },
        { q: 'His habit', a: 'He turns any problem into a mission with a ridiculous name.' },
      ],
    },
    likes: { es: ['los planes sin guion', 'las risas que se escapan', 'un buen misterio'], en: ['unscripted plans', 'laughs that slip out', 'a good mystery'] },
    dislikes: { es: ['aburrirse', 'los spoilers', 'dejar a alguien atrás en el camino'], en: ['being bored', 'spoilers', 'leaving anyone behind on the trail'] },
    quote: { es: 'Lo mejor de un mapa es lo que todavía no está dibujado.', en: 'The best part of a map is what isn’t drawn yet.' },
  },
};
