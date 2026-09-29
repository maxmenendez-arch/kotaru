#!/usr/bin/env python3
"""Prueba de emocion y velocidad de Cartesia Sonic-3 por Together (docs/CHANGELOG, 2026-09-28).

Por que: con Gemini, Nova suena coqueta (Gemini recibe instrucciones de actuacion por
personaje); con Cartesia no (solo recibe el texto). Cartesia Sonic-3 admite emocion y
velocidad por `generation_config` y por etiquetas en linea (<emotion value="..."/>), pero
Together no documenta si las deja pasar. Esta prueba lo comprueba:

  1. Genera la misma frase de Nova en varias variantes (sin control, con etiquetas en linea,
     con generation_config) y con voces candidatas.
  2. Transcribe cada audio con Whisper: si en el texto aparece "emotion", "value" o
     "flirtatious", la etiqueta se leyo en voz alta (mal).
  3. Deja una pagina para escucharlas: https://app.kotaru.app/voces/emocion/

    sudo python3 deploy/prueba-cartesia-emocion.py

Costo: unas 12 frases cortas (~65 USD por millon de caracteres) + sus transcripciones:
menos de 3 centavos. La clave se lee de /etc/kotaru/gateway.env y nunca se imprime.
El siguiente deploy/web.sh borra la pagina.
"""
import json
import os
import re
import struct
import sys
import urllib.error
import urllib.request
import uuid

ENV_FILE = '/etc/kotaru/gateway.env'
OUT = '/etc/caddy/otros-sitios/kotaru-web/voces/emocion'
BASE = 'https://api.together.ai/v1'

TEXT_NOVA = 'Llegaste justo cuando iba a poner música. Acércate un poco… tengo una idea para esta noche, y creo que te va a gustar.'
TEXT_LUNA = 'Estoy aquí contigo. Respira despacio, sin prisa. Vamos a bajar el ritmo juntas.'
TEXT_RIO = '¡Mira ese atardecer! Te propongo un reto: tú eliges el camino y yo pongo la aventura.'

CURRENT = {
    'nova': 'c0925108-d541-4dc4-bbae-39f4e57ba10c',  # Lucia - Radiant Host
    'luna': '8a6d0b8e-8cd8-4952-a41e-b7af18662135',  # Helena
    'rio': '2fc4f1ec-bfd0-46f1-8e6d-d4279eaaf838',  # Mateo
}
# Voces que Cartesia dice que mejor responden a la emocion (docs de Sonic-3).
CANDIDATE_NAMES = ['Maya', 'Tessa', 'Dana', 'Marian']


def key() -> str:
    with open(ENV_FILE) as f:
        for line in f:
            if line.startswith('TOGETHER_API_KEY='):
                return line.split('=', 1)[1].strip()
    sys.exit('Falta TOGETHER_API_KEY en gateway.env')


KEY = key()


def request(path: str, body: bytes | None = None, content_type: str = 'application/json', method: str | None = None):
    req = urllib.request.Request(BASE + path, data=body, method=method or ('POST' if body else 'GET'))
    req.add_header('Authorization', f'Bearer {KEY}')
    # Sin esto, el Cloudflare de Together rechaza el User-Agent por defecto de Python (1010).
    req.add_header('User-Agent', 'kotaru-deploy/1.0 (+https://app.kotaru.app)')
    req.add_header('Accept', '*/*')
    if body:
        req.add_header('Content-Type', content_type)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def find_voices() -> dict:
    status, raw = request('/voices?model=cartesia/sonic-3')
    found = {}
    if status != 200:
        print(f'Lista de voces: HTTP {status}')
        return found
    data = json.loads(raw)

    def walk(node):
        if isinstance(node, dict):
            if 'id' in node and 'name' in node and isinstance(node['name'], str):
                yield node
            for v in node.values():
                yield from walk(v)
        elif isinstance(node, list):
            for v in node:
                yield from walk(v)

    voices = list(walk(data))
    print(f'Voces de Cartesia en Together: {len(voices)}')
    for want in CANDIDATE_NAMES:
        for v in voices:
            if re.match(rf'^{want}\b', v['name']):
                found[v['name']] = v['id']
                break
    return found


def wav(pcm: bytes, rate: int = 24000) -> bytes:
    header = b'RIFF' + struct.pack('<I', 36 + len(pcm)) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 1, 1, rate, rate * 2, 2, 16)
    return header + b'data' + struct.pack('<I', len(pcm)) + pcm


def speak(voice: str, text: str, config: dict | None = None) -> tuple[int, bytes]:
    body = {
        'model': 'cartesia/sonic-3', 'input': text, 'voice': voice, 'language': 'es',
        'response_format': 'raw', 'response_encoding': 'pcm_s16le', 'sample_rate': 24000, 'stream': False,
    }
    if config:
        body['generation_config'] = config
    return request('/audio/speech', json.dumps(body, ensure_ascii=False).encode())


def transcribe(wav_bytes: bytes) -> str:
    boundary = uuid.uuid4().hex
    parts = []
    for name, value in (('model', 'openai/whisper-large-v3'), ('language', 'es')):
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode())
    parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n'.encode() + wav_bytes + b'\r\n')
    parts.append(f'--{boundary}--\r\n'.encode())
    status, raw = request('/audio/transcriptions', b''.join(parts), f'multipart/form-data; boundary={boundary}')
    if status != 200:
        return f'(Whisper HTTP {status})'
    try:
        return json.loads(raw).get('text', '').strip()
    except Exception:
        return raw.decode(errors='replace')[:200]


def main() -> None:
    if os.geteuid() != 0:
        sys.exit('Ejecuta como root (sudo).')
    os.makedirs(OUT, exist_ok=True)
    candidates = find_voices()
    ssml_nova = '<emotion value="flirtatious"/><speed ratio="0.9"/>' + TEXT_NOVA
    variants = [
        ('nova-lucia-actual', 'Nova, voz actual (Lucia), sin control: lo que suena hoy', CURRENT['nova'], TEXT_NOVA, None),
        ('nova-lucia-etiquetas', 'Nova, Lucia + etiquetas en línea (coqueta, 0,9)', CURRENT['nova'], ssml_nova, None),
        ('nova-lucia-config', 'Nova, Lucia + generation_config (coqueta, 0,9)', CURRENT['nova'], TEXT_NOVA, {'emotion': 'flirtatious', 'speed': 0.9}),
        ('luna-helena-calma', 'Luna, Helena + generation_config (calma, 0,9)', CURRENT['luna'], TEXT_LUNA, {'emotion': 'calm', 'speed': 0.9}),
        ('rio-mateo-entusiasmo', 'Rio, Mateo + generation_config (entusiasmo, 1,05)', CURRENT['rio'], TEXT_RIO, {'emotion': 'enthusiastic', 'speed': 1.05}),
    ]
    for name, vid in candidates.items():
        slug = re.sub(r'[^a-z]+', '-', name.lower()).strip('-')
        variants.append((f'nova-{slug}-config', f'Nova, candidata {name} + generation_config (coqueta, 0,9)', vid, TEXT_NOVA, {'emotion': 'flirtatious', 'speed': 0.9}))

    results = []
    for slug, label, voice, text, config in variants:
        status, audio = speak(voice, text, config)
        if status != 200 or audio[:1] == b'{':
            note = audio[:160].decode(errors='replace')
            print(f'  {slug}: HTTP {status} {note}')
            results.append({'slug': slug, 'label': label, 'ok': False, 'status': status, 'error': note})
            continue
        data = wav(audio)
        with open(f'{OUT}/{slug}.wav', 'wb') as f:
            f.write(data)
        heard = transcribe(data)
        leaked = bool(re.search(r'emotion|value|flirt|ratio|speed', heard, re.I))
        print(f'  {slug}: {len(audio) // 48} ms · Whisper: "{heard}"' + ('  ← ¡LEYÓ LA ETIQUETA!' if leaked else ''))
        results.append({'slug': slug, 'label': label, 'ok': True, 'ms': len(audio) // 48, 'heard': heard, 'leaked': leaked})

    with open(f'{OUT}/resultados.json', 'w') as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    rows = ''.join(
        f'<li><strong>{r["label"]}</strong><br>'
        + (f'<audio controls preload="none" src="{r["slug"]}.wav"></audio><br><small>Whisper: {r["heard"]}{" — leyó la etiqueta" if r["leaked"] else ""}</small>' if r['ok'] else f'<small>No se pudo (HTTP {r["status"]})</small>')
        + '</li>'
        for r in results
    )
    html = f'''<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Kotaru · voz con emoción</title>
<style>body{{margin:0;background:#14111c;color:#ece8f4;font:16px/1.5 system-ui,sans-serif}}main{{max-width:620px;margin:0 auto;padding:24px 16px}}li{{margin:0 0 18px}}audio{{width:100%;margin-top:6px}}small{{color:#b3abc4}}</style>
<main><h1>Voz de Cartesia con emoción</h1><p>La misma frase con y sin control de emoción y velocidad. Compara la primera (lo que suena hoy) con las demás, y elige la voz de Nova.</p><ul>{rows}</ul></main></html>'''
    with open(f'{OUT}/index.html', 'w') as f:
        f.write(html)
    print(f'Listo: https://app.kotaru.app/voces/emocion/ ({sum(r["ok"] for r in results)} de {len(results)} audios)')


if __name__ == '__main__':
    main()
