# UX, personas and memory

## Experience principles

- Voice-first, but never voice-only.
- The user should know whether the app is listening, thinking or speaking.
- Interruption must feel immediate.
- Memory creates continuity; it must not feel like surveillance.
- Emotional warmth without emotional coercion.
- Usage and pricing must be understandable before purchase.

## Visual direction

- Modern manga rather than retro comic styling.
- Original characters with clean silhouettes, expressive eyes and facial rigs optimized for mobile animation.
- Premium interface using restrained gradients, generous spacing and high-contrast typography.
- The avatar is the emotional focus; controls remain minimal and never cover the face during conversation.
- Support dark and light themes, reduced motion and non-avatar accessibility equivalents.
- Avoid visual imitation of named artists, studios, franchises or recognizable copyrighted characters.

## Primary journey

1. Age gate and concise AI disclosure.
2. Choose language and goals.
3. Preview three original companions.
4. Select voice and tune a few personality sliders.
5. Complete a short text/voice introduction.
6. Companion proposes the first candidate memory.
7. User approves, edits or rejects it.
8. Usage screen explains plan and remaining minutes.

## Conversation states

- idle;
- listening;
- endpoint detected;
- thinking;
- speaking;
- interrupted;
- reconnecting;
- limit reached;
- safety handoff.

Each state needs animation, accessibility label and failure behavior.

## Persona schema

```json
{
  "id": "nova-v1",
  "displayName": "Nova",
  "languages": ["es", "en"],
  "traits": {"warmth": 0.8, "humor": 0.7, "initiative": 0.5},
  "speechStyle": {"verbosity": "short", "usesEmojis": false},
  "interests": ["creativity", "music", "daily-life"],
  "boundaries": ["no_deception", "no_professional_claims", "no_dependency_pressure"],
  "promptVersion": "1.0.0"
}
```

Personality is structured data plus a versioned system policy. User customization cannot remove disclosure or safety boundaries.

## Emotion and gesture output

The model may emit only a constrained side channel, for example:

```json
{"emotion":"warm","intensity":0.55,"gesture":"small_wave"}
```

Validate against allowlists. Never allow generated code, arbitrary animation names or client commands.

## Memory UX

Memory categories:

- preferences;
- important people/pets;
- ongoing goals/projects;
- stable biographical facts;
- notable events;
- boundaries and communication preferences.

Avoid inferring sensitive attributes. Show “I’d like to remember…” with approve/edit/not now controls. The memory center must show why a memory exists and where it came from. “Forget this” should immediately suppress retrieval and queue permanent deletion.

## Voice UX

- Start MVP with push-to-talk to control privacy and cost.
- Stream partial transcript visibly when appropriate.
- Provide captions and text fallback.
- Stop audio instantly on interruption.
- Let users choose voice speed and disable expressive sounds.
- Never clone a real person’s voice without documented consent and provider terms that support it.

## Accessibility

- screen-reader labels;
- captions/transcripts;
- reduced motion;
- color contrast;
- haptic alternatives;
- adjustable text size;
- no essential information conveyed only by avatar motion.
