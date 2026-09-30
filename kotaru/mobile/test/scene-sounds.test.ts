import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MUSIC_BUILDERS, MUSIC_OF, SCENE_BUILDERS, SCENE_OF, SONGS } from '../src/scene-sounds.ts';

test('cada personaje tiene sonido de su lugar y musica propia', () => {
  for (const id of ['luna', 'nova', 'rio'] as const) {
    assert.equal(typeof SCENE_BUILDERS[SCENE_OF[id]], 'function', id);
    assert.equal(typeof MUSIC_BUILDERS[MUSIC_OF[id]], 'function', id);
  }
  assert.equal(new Set(Object.values(SCENE_OF)).size, 3);
});

test('la musica va con el caracter: Luna lenta y sin bateria, Nova nocturna, Rio alegre y rapida', () => {
  assert.ok(SONGS['music-luna'].bpm < SONGS['music-nova'].bpm && SONGS['music-nova'].bpm < SONGS['music-rio'].bpm);
  assert.equal(SONGS['music-luna'].drums, 'none');
  assert.equal(SONGS['music-rio'].drums, 'shaker');
  for (const song of Object.values(SONGS)) {
    assert.ok(song.chords.length >= 4);
    for (const chord of song.chords) for (const m of chord) assert.ok(m >= 45 && m <= 76, `nota ${m} fuera de registro`);
    // Nada sube mas que un susurro: la musica va debajo de todo.
    assert.ok(song.pad <= 0.1 && song.pluck <= 0.1 && song.bass <= 0.2);
  }
});
