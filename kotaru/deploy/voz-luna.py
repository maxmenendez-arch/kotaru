#!/usr/bin/env python3
"""Muestras para elegir una voz de Luna mas claramente femenina (pedido del dueño, 2026-09-29).

Genera la misma frase de Luna con las voces femeninas de Google:
  - Chirp 3 HD (sin tope diario): 11 voces, a la velocidad de Luna.
  - Gemini TTS (con instrucciones de actuacion): 4 voces, pidiendo voz de mujer suave y calida.
Y deja una pagina para escucharlas: https://app.kotaru.app/voces/luna/

    sudo python3 deploy/voz-luna.py

Costo: menos de 1 centavo (unos 1.500 caracteres en Chirp, dentro del millon gratis del mes,
y 4 peticiones de Gemini). Las claves se leen del servidor y nunca se imprimen. El siguiente
deploy/web.sh borra la pagina.
"""
import base64
import json
import os
import struct
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

ENV_FILE = '/etc/kotaru/gateway.env'
KEY_FILE = '/etc/kotaru/google-tts.json'
OUT = '/etc/caddy/otros-sitios/kotaru-web/voces/luna'
TEXT = 'Hola, aquí estoy contigo. Respira despacio, sin prisa. Cuéntame cómo llegas hoy, te escucho.'
STYLE = ('Voz de mujer joven adulta, claramente femenina, suave, cálida y serena; '
         'cercana, con frases tranquilas y pausas cortas.')
CHIRP = ['Vindemiatrix', 'Sulafat', 'Achernar', 'Aoede', 'Despina', 'Callirrhoe', 'Erinome', 'Laomedeia', 'Autonoe', 'Kore', 'Zephyr']
GEMINI = ['Vindemiatrix', 'Sulafat', 'Achernar', 'Despina']
UA = 'kotaru-deploy/1.0 (+https://app.kotaru.app)'


def env(name: str) -> str:
    for line in open(ENV_FILE):
        if line.startswith(name + '='):
            return line.split('=', 1)[1].strip()
    return ''


def wav(pcm: bytes, rate: int = 24000) -> bytes:
    return b'RIFF' + struct.pack('<I', 36 + len(pcm)) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 1, 1, rate, rate * 2, 2, 16) + b'data' + struct.pack('<I', len(pcm)) + pcm


def post(url: str, body: bytes, headers: dict) -> tuple[int, bytes]:
    req = urllib.request.Request(url, data=body, method='POST')
    req.add_header('User-Agent', UA)
    for k, v in headers.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()


def chirp_token() -> str | None:
    try:
        creds = json.load(open(KEY_FILE))
    except Exception:
        print('Chirp: no se pudo leer la clave de la cuenta de servicio (¿deploy/chirp.sh?)')
        return None
    now = int(time.time())
    header = b64url(json.dumps({'alg': 'RS256', 'typ': 'JWT'}).encode())
    claims = b64url(json.dumps({'iss': creds['client_email'], 'scope': 'https://www.googleapis.com/auth/cloud-platform',
                                'aud': 'https://oauth2.googleapis.com/token', 'iat': now, 'exp': now + 600}).encode())
    with tempfile.NamedTemporaryFile('w', delete=True) as pem:
        os.chmod(pem.name, 0o600)
        pem.write(creds['private_key'])
        pem.flush()
        sig = subprocess.run(['openssl', 'dgst', '-sha256', '-sign', pem.name], input=f'{header}.{claims}'.encode(), capture_output=True, check=True).stdout
    body = urllib.parse.urlencode({'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion': f'{header}.{claims}.{b64url(sig)}'}).encode()
    status, raw = post('https://oauth2.googleapis.com/token', body, {'Content-Type': 'application/x-www-form-urlencoded'})
    if status != 200:
        print(f'Chirp: Google no dio el token (HTTP {status})')
        return None
    return json.loads(raw).get('access_token')


def chirp(token: str, voice: str) -> bytes | None:
    body = json.dumps({'input': {'text': TEXT}, 'voice': {'languageCode': 'es-US', 'name': f'es-US-Chirp3-HD-{voice}'},
                       'audioConfig': {'audioEncoding': 'LINEAR16', 'sampleRateHertz': 24000, 'speakingRate': 0.95}}).encode()
    status, raw = post('https://texttospeech.googleapis.com/v1/text:synthesize', body, {'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
    if status != 200:
        print(f'  Chirp {voice}: HTTP {status} {raw[:160].decode(errors="replace")}')
        return None
    return base64.b64decode(json.loads(raw)['audioContent'])  # ya es WAV


def gemini(key: str, voice: str) -> bytes | None:
    model = env('GEMINI_TTS_MODEL') or 'gemini-3.8-flash-lite-tts'
    body = json.dumps({
        'model': model,
        'input': [{'type': 'user_input', 'content': [{'type': 'text', 'text': TEXT, 'annotations': [{'type': 'speech_metadata', 'style': STYLE}]}]}],
        'response_format': {'type': 'audio'},
        'generation_config': {'speech_config': [{'voice': voice}]},
        'stream': True,
    }, ensure_ascii=False).encode()
    status, raw = post('https://generativelanguage.googleapis.com/v1beta/interactions', body,
                       {'Content-Type': 'application/json', 'Accept': 'text/event-stream', 'x-goog-api-key': key})
    if status != 200:
        msg = raw[:300].decode(errors='replace')
        print(f'  Gemini {voice}: HTTP {status}' + (' (cuota diaria agotada)' if status == 429 else '') )
        return None
    pcm = bytearray()
    for line in raw.decode('utf-8', errors='replace').splitlines():
        line = line.strip()
        if not line.startswith('data:'):
            continue
        try:
            ev = json.loads(line[5:].strip())
        except Exception:
            continue
        d = ev.get('delta') or {}
        if ev.get('event_type') == 'step.delta' and d.get('type') == 'audio' and d.get('data'):
            pcm += base64.b64decode(d['data'])
    if pcm[:4] == b'RIFF':
        i = pcm.find(b'data')
        pcm = pcm[i + 8:] if i > 0 else pcm[44:]
    return wav(bytes(pcm)) if len(pcm) > 4800 else None


def main() -> None:
    if os.geteuid() != 0:
        sys.exit('Ejecuta como root (sudo).')
    os.makedirs(OUT, exist_ok=True)
    rows = []
    token = chirp_token()
    if token:
        for v in CHIRP:
            audio = chirp(token, v)
            if audio:
                open(f'{OUT}/chirp-{v}.wav', 'wb').write(audio)
                tag = ' (la actual)' if v == 'Vindemiatrix' else ''
                rows.append(f'<li><strong>{v}</strong> · Chirp{tag}<audio controls preload="none" src="chirp-{v}.wav"></audio></li>')
                print(f'  Chirp {v} ✓')
    key = env('GEMINI_API_KEY')
    if key:
        for v in GEMINI:
            audio = gemini(key, v)
            if audio:
                open(f'{OUT}/gemini-{v}.wav', 'wb').write(audio)
                rows.append(f'<li><strong>{v}</strong> · Gemini, pidiendo voz de mujer suave<audio controls preload="none" src="gemini-{v}.wav"></audio></li>')
                print(f'  Gemini {v} ✓')
            time.sleep(1)
    key = ''
    html = f'''<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Kotaru · voz de Luna</title>
<style>body{{margin:0;background:#0B1020;color:#F5F7FC;font:16px/1.5 system-ui,sans-serif}}main{{max-width:640px;margin:0 auto;padding:24px 16px}}ul{{list-style:none;padding:0;display:grid;gap:12px}}li{{background:#151B31;border:1px solid #252D4A;border-radius:16px;padding:12px 16px}}audio{{width:100%;margin-top:6px}}p{{color:#AAB3C8}}</style>
<main><h1>Voz de Luna, más femenina</h1><p>Todas dicen: «{TEXT}». Las de Chirp suenan igual cuando se acaba la cuota de Gemini; las de Gemini llevan además la instrucción de voz de mujer suave. Dime el nombre que más te guste.</p><ul>{"".join(rows)}</ul></main></html>'''
    open(f'{OUT}/index.html', 'w').write(html)
    subprocess.run(['chmod', '-R', 'a+rX', OUT], check=False)
    print(f'Listo: https://app.kotaru.app/voces/luna/ ({len(rows)} muestras)')


if __name__ == '__main__':
    main()
