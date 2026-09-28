#!/usr/bin/env python3
"""Comprueba muestras de voz con Whisper (Together): transcribe cada .wav de
/etc/caddy/otros-sitios/kotaru-web/voces y lo compara con la frase original. Sirve para
saber, sin oirlas, si una voz pronuncia bien el espanol. Tambien imprime el id de las voces
de Cartesia que se usaron.

    sudo python3 deploy/voces-transcribir.py [patron]

Costo: 0,0015 USD por minuto de audio (centavos).
"""
import glob
import json
import os
import re
import sys
import unicodedata
import urllib.request
import uuid

ENV_FILE = "/etc/kotaru/gateway.env"
VOCES = "/etc/caddy/otros-sitios/kotaru-web/voces"
TEXT = "Hola, aquí estoy contigo. Respira despacio, no hay prisa. ¿Quieres contarme cómo te fue hoy? Me encantaría escucharte."


def env(name):
    value = ""
    for line in open(ENV_FILE, encoding="utf-8"):
        if line.startswith(name + "="):
            value = line.split("=", 1)[1].strip()
    return value


def words(text):
    text = unicodedata.normalize("NFD", text.lower())
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-z]+", text)


def wer(ref, hyp):
    r, h = words(ref), words(hyp)
    d = [[0] * (len(h) + 1) for _ in range(len(r) + 1)]
    for i in range(len(r) + 1):
        d[i][0] = i
    for j in range(len(h) + 1):
        d[0][j] = j
    for i in range(1, len(r) + 1):
        for j in range(1, len(h) + 1):
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (r[i - 1] != h[j - 1]))
    return d[len(r)][len(h)] / max(1, len(r))


def transcribe(key, path):
    boundary = uuid.uuid4().hex
    audio = open(path, "rb").read()
    parts = []
    for name, value in (("model", "openai/whisper-large-v3"), ("language", "es"), ("response_format", "json")):
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode())
    parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n'.encode() + audio + b"\r\n")
    parts.append(f"--{boundary}--\r\n".encode())
    req = urllib.request.Request("https://api.together.xyz/v1/audio/transcriptions", data=b"".join(parts), method="POST",
                                 headers={"Authorization": f"Bearer {key}", "content-type": f"multipart/form-data; boundary={boundary}", "user-agent": "kotaru-voces/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read()).get("text", "")


def main():
    key = env("TOGETHER_API_KEY")
    pattern = sys.argv[1] if len(sys.argv) > 1 else "*"
    for path in sorted(glob.glob(os.path.join(VOCES, f"{pattern}.wav"))):
        name = os.path.basename(path)
        if not re.search(r"cartesia|Kokoro|orpheus|chirp|minimax|rime", name, re.I):
            continue
        try:
            text = transcribe(key, path)
            print(f"{wer(TEXT, text):.2f}  {name}: {text[:140]}")
        except Exception as e:
            print(f"x  {name}: {e}")
    req = urllib.request.Request("https://api.together.xyz/v1/voices?model=cartesia/sonic-3", headers={"Authorization": f"Bearer {key}", "user-agent": "kotaru-voces/1.0"})
    data = json.loads(urllib.request.urlopen(req, timeout=60).read())
    for v in data.get("voices", []):
        if re.search(r"^(Helena|Elena|Mateo|Isabella|Lucia|Sofia|Valentina|Carmen|Mariana|Diego|Carlos)\b", v.get("name", "")):
            print(f"cartesia {v.get('name')} = {v.get('id')}  {json.dumps({k: v[k] for k in v if k not in ('name', 'id')}, ensure_ascii=False)[:120]}")


if __name__ == "__main__":
    main()
