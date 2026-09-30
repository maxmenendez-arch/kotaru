#!/usr/bin/env python3
"""Comprueba que una voz suene siempre femenina (pedido del dueño, 2026-09-29: «que Despina
para Luna no suene como hombre a veces»).

Genera varias frases distintas (tranquilas, largas, preguntas, en voz baja) con la voz y el
estilo del personaje, en Gemini y en Chirp, y mide el tono (frecuencia fundamental, F0) de
cada toma. Una voz de mujer adulta suele hablar entre 165 y 255 Hz; una de hombre, entre 85 y
155. Marca cualquier toma con la mediana por debajo de 165 Hz o con mas de un 20 % del tiempo
por debajo de 150 Hz. Deja las tomas en https://app.kotaru.app/voces/tono/ para oirlas.

    sudo python3 deploy/voz-tono.py luna Despina
    sudo python3 deploy/voz-tono.py nova Sulafat

Costo: 8 peticiones de Gemini y unos 900 caracteres de Chirp (dentro del millon gratis).
Las claves se leen del servidor y nunca se imprimen.
"""
import array
import base64
import importlib.util
import json
import math
import os
import sys
import time

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('vozluna', os.path.join(here, 'voz-luna.py'))
vl = importlib.util.module_from_spec(spec)
spec.loader.exec_module(vl)  # reutiliza token de Chirp, llamadas y cabecera WAV

OUT_BASE = '/etc/caddy/otros-sitios/kotaru-web/voces/tono'

PHRASES = {
    'luna': [
        'Hola, aquí estoy contigo. Respira despacio, sin prisa.',
        'Eso suena muy pesado. No tienes que resolverlo todo esta noche.',
        '¿Quieres contarme qué pasó, o prefieres que solo te acompañe un momento?',
        'Vamos a probar algo sencillo: mira a tu alrededor y nómbrame tres cosas que ves.',
        'Estoy orgullosa de ti por haberlo dicho en voz alta. De verdad.',
        'Mañana podemos pensar en un paso pequeño. Por ahora, descansa un poco.',
        'Mmm, entiendo. Cuéntame un poco más, te escucho.',
        'Buenas noches. Aquí voy a estar cuando quieras volver.',
    ],
    'nova': [
        'Llegaste justo cuando iba a poner música. ¿Te quedas?',
        'Esa sonrisa tuya dice más de lo que crees.',
        '¿Bailamos? Tú eliges la canción y yo marco el primer paso.',
        'Mmm, me gusta cómo piensas. Sigue.',
        'No tan rápido. Primero dime qué canción pondrías.',
        'Eso estuvo bien dicho. A ver si superas la siguiente.',
        'Acércate un poco, tengo una idea para esta noche.',
        'Bueno, me quedo con la última palabra, como siempre.',
    ],
}

STYLES = {
    'luna': ('Voz de mujer joven adulta, claramente femenina: tono medio-agudo y luminoso, nunca grave ni ronco, sin bajar la voz al final de las frases; suave, serena y cálida, con cadencia conversacional, frases cortas y pausas.'),
    'nova': 'Voz de mujer adulta, femenina, coqueta y segura, con sonrisa en la voz y pausas con intención.',
}


def pcm_of(wav_bytes: bytes) -> tuple[array.array, int]:
    i = wav_bytes.find(b'data')
    rate = int.from_bytes(wav_bytes[24:28], 'little') if wav_bytes[:4] == b'RIFF' else 24000
    body = wav_bytes[i + 8:] if i > 0 else wav_bytes
    a = array.array('h')
    a.frombytes(body[: len(body) - len(body) % 2])
    return a, rate


def f0_track(samples: array.array, rate: int) -> list[float]:
    """F0 por autocorrelacion normalizada en ventanas de 40 ms (paso 20 ms), solo tramos con voz."""
    step = max(1, rate // 8000)  # a ~8 kHz: suficiente para 70-400 Hz y mas rapido
    x = [samples[i] / 32768.0 for i in range(0, len(samples), step)]
    sr = rate / step
    win, hop = int(sr * 0.04), int(sr * 0.02)
    lag_min, lag_max = int(sr / 400), int(sr / 70)
    out = []
    for start in range(0, len(x) - win - lag_max, hop):
        frame = x[start:start + win]
        energy = sum(v * v for v in frame) / win
        if energy < 1e-4:
            continue
        best, best_lag = 0.0, 0
        for lag in range(lag_min, lag_max):
            seg = x[start + lag:start + lag + win]
            num = sum(a * b for a, b in zip(frame, seg))
            den = math.sqrt(sum(a * a for a in frame) * sum(b * b for b in seg)) or 1
            r = num / den
            if r > best:
                best, best_lag = r, lag
        if best > 0.55 and best_lag:
            out.append(sr / best_lag)
    return out


def median(v: list[float]) -> float:
    s = sorted(v)
    return s[len(s) // 2] if s else 0.0


def main() -> None:
    if os.geteuid() != 0:
        sys.exit('Ejecuta como root (sudo).')
    who, voice = (sys.argv[1], sys.argv[2]) if len(sys.argv) > 2 else ('luna', 'Despina')
    phrases, style = PHRASES[who], STYLES[who]
    out = f'{OUT_BASE}/{who}-{voice}'
    os.makedirs(out, exist_ok=True)
    rows, flagged = [], 0
    token = vl.chirp_token()
    key = vl.env('GEMINI_API_KEY')
    for n, text in enumerate(phrases):
        takes = []
        if key:
            vl.TEXT, vl.STYLE = text, style
            takes.append(('gemini', vl.gemini(key, voice)))
            time.sleep(1)
        if token:
            vl.TEXT = text
            takes.append(('chirp', vl.chirp(token, voice)))
        for engine, audio in takes:
            if not audio:
                continue
            name = f'{engine}-{n + 1}.wav'
            open(f'{out}/{name}', 'wb').write(audio)
            samples, rate = pcm_of(audio)
            track = f0_track(samples, rate)
            med = median(track)
            low = sum(1 for f in track if f < 150) / max(1, len(track))
            bad = med < 165 or low > 0.2
            flagged += bad
            mark = '  ← GRAVE' if bad else ''
            print(f'{engine:6} {n + 1}: mediana {med:5.0f} Hz, bajo 150 Hz {low * 100:3.0f} %{mark}')
            rows.append(f'<li><strong>{engine} {n + 1}</strong> · {med:.0f} Hz{" · grave" if bad else ""}<br><small>{text}</small><audio controls preload="none" src="{name}"></audio></li>')
    key = ''
    open(f'{out}/index.html', 'w').write(
        f'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">'
        f'<title>Tono de {who}</title><style>body{{background:#0B1020;color:#F5F7FC;font:16px/1.5 system-ui;margin:0}}main{{max-width:640px;margin:auto;padding:24px 16px}}'
        f'ul{{list-style:none;padding:0;display:grid;gap:10px}}li{{background:#151B31;border-radius:14px;padding:10px 14px}}audio{{width:100%}}small{{color:#AAB3C8}}</style>'
        f'<main><h1>{who.capitalize()} con {voice}</h1><ul>{"".join(rows)}</ul></main>')
    os.system(f'chmod -R a+rX {OUT_BASE}')
    print(f'{len(rows)} tomas, {flagged} graves. Para oírlas: https://app.kotaru.app/voces/tono/{who}-{voice}/')


if __name__ == '__main__':
    main()
