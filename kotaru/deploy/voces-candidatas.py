#!/usr/bin/env python3
"""Busca voces mejores que Kokoro con las cuentas que ya tiene Kotaru y deja muestras para
escucharlas en https://app.kotaru.app/voces/candidatas.html .

    sudo python3 deploy/voces-candidatas.py            # lista modelos y voces (gratis)
    sudo python3 deploy/voces-candidatas.py --muestras # ademas genera las muestras (centavos)

Prueba:
  - Together AI (la clave de TOGETHER_API_KEY): todos sus modelos de voz, con las voces que
    anuncian para espanol.
  - Google Cloud Text-to-Speech "Chirp 3 HD" con la clave de Gemini: son las MISMAS 30 voces
    que Gemini (Leda, Vindemiatrix, Algieba...), a 30 USD por millon de caracteres y sin el
    tope de 100 peticiones al dia. Solo funciona si la API "Cloud Text-to-Speech" esta
    activada en el proyecto de esa clave; si no, lo dice.

Las claves se leen de /etc/kotaru/gateway.env y nunca se imprimen.
"""
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request

ENV_FILE = "/etc/kotaru/gateway.env"
WEB_ROOT = "/etc/caddy/otros-sitios/kotaru-web"
OUT = os.path.join(WEB_ROOT, "voces")
TEXT = "Hola, aquí estoy contigo. Respira despacio, no hay prisa. ¿Quieres contarme cómo te fue hoy? Me encantaría escucharte."


def env(name):
    value = ""
    try:
        for line in open(ENV_FILE, encoding="utf-8"):
            if line.startswith(name + "="):
                value = line.split("=", 1)[1].strip()  # la ultima gana
    except FileNotFoundError:
        pass
    return value


def call(url, headers, body=None, timeout=60):
    data = json.dumps(body).encode() if body is not None else None
    # Cloudflare (delante de Together) rechaza el agente por defecto de Python.
    headers = {"user-agent": "kotaru-voces/1.0", "accept": "*/*", **headers}
    req = urllib.request.Request(url, data=data, headers=headers, method="POST" if data else "GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.headers.get("content-type", ""), r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("content-type", ""), e.read()
    except Exception as e:  # red
        return 0, "", str(e).encode()


def short(raw, n=240):
    text = raw.decode("utf-8", "replace") if isinstance(raw, bytes) else str(raw)
    return re.sub(r"\s+", " ", text)[:n]


def wav_from_pcm(pcm, rate=24000):
    import struct
    return (b"RIFF" + struct.pack("<I", 36 + len(pcm)) + b"WAVEfmt " + struct.pack("<IHHIIHH", 16, 1, 1, rate, rate * 2, 2, 16)
            + b"data" + struct.pack("<I", len(pcm)) + pcm)


def main():
    samples = "--muestras" in sys.argv
    together = env("TOGETHER_API_KEY")
    gemini = env("GEMINI_API_KEY")
    rows = []

    # ---- Together: modelos de voz y voces en espanol ----
    if together:
        th = {"Authorization": f"Bearer {together}"}
        status, _, raw = call("https://api.together.xyz/v1/models", th)
        models = []
        if status == 200:
            for m in json.loads(raw):
                mid = m.get("id", "")
                kind = (m.get("type") or "").lower()
                if "audio" in kind or "tts" in kind or re.search(r"sonic|rime|arcana|mist|minimax|speech|orpheus|kokoro|tts", mid, re.I):
                    if re.search(r"whisper|parakeet|nemotron|asr|transcri", mid, re.I):
                        continue
                    price = (m.get("pricing") or {})
                    models.append(mid)
                    print(f"[together] modelo {mid}  tipo={kind}  precio={json.dumps(price)[:120]}")
        else:
            print(f"[together] no pude listar modelos: HTTP {status} {short(raw)}")
        for mid in models:
            status, _, raw = call(f"https://api.together.xyz/v1/voices?model={urllib.request.quote(mid)}", th)
            if status != 200:
                print(f"[together] {mid}: voces HTTP {status} {short(raw, 160)}")
                continue
            data = json.loads(raw)
            voices = []
            for entry in data.get("data", data if isinstance(data, list) else []):
                for v in entry.get("voices", [entry]) if isinstance(entry, dict) else []:
                    name = v.get("name") or v.get("id") or ""
                    blob = json.dumps(v, ensure_ascii=False)
                    voices.append((name, v.get("id", name), blob))
            spanish = [v for v in voices if re.search(r"span|espa|\bes[-_]|latin|mexic", v[2], re.I)]
            print(f"[together] {mid}: {len(voices)} voces, {len(spanish)} en espanol: "
                  + ", ".join(f"{n}={i}" for n, i, _ in spanish[:12]))
            rows.append((mid, spanish or voices[:3]))
    else:
        print("[together] sin TOGETHER_API_KEY")

    # ---- Google Cloud TTS Chirp 3 HD con la clave de Gemini ----
    chirp_ok = False
    if gemini:
        body = {"input": {"text": "Hola."}, "voice": {"languageCode": "es-US", "name": "es-US-Chirp3-HD-Leda"},
                "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 24000}}
        status, _, raw = call("https://texttospeech.googleapis.com/v1/text:synthesize", {"x-goog-api-key": gemini, "content-type": "application/json"}, body)
        chirp_ok = status == 200
        print(f"[chirp3-hd] prueba con la clave de Gemini: HTTP {status} {'' if chirp_ok else short(raw, 300)}")

    if not samples:
        return

    os.makedirs(OUT, exist_ok=True)
    items = []

    def save(label, filename, audio_bytes, note):
        with open(os.path.join(OUT, filename), "wb") as f:
            f.write(audio_bytes)
        items.append((label, filename, note))
        print(f"  ok {label}")

    if chirp_ok:
        for voice in ["Vindemiatrix", "Leda", "Algieba", "Achernar", "Sulafat"]:
            body = {"input": {"text": TEXT}, "voice": {"languageCode": "es-US", "name": f"es-US-Chirp3-HD-{voice}"},
                    "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 24000}}
            status, _, raw = call("https://texttospeech.googleapis.com/v1/text:synthesize", {"x-goog-api-key": gemini, "content-type": "application/json"}, body)
            if status == 200:
                save(f"Google Chirp 3 HD · {voice}", f"chirp-{voice}.wav", base64.b64decode(json.loads(raw)["audioContent"]), "30 USD/M caracteres")
            else:
                print(f"  x chirp {voice}: HTTP {status} {short(raw)}")

    if together:
        th = {"Authorization": f"Bearer {together}", "content-type": "application/json"}
        for mid, voices in rows:
            if re.search(r"kokoro", mid, re.I):
                voices = voices[:1]
            for name, vid, _ in voices[:4]:
                body = {"model": mid, "input": TEXT, "voice": vid, "response_format": "wav", "language": "es", "stream": False}
                status, ctype, raw = call("https://api.together.xyz/v1/audio/speech", th, body, timeout=90)
                safe = re.sub(r"[^A-Za-z0-9_.-]+", "_", f"{mid}-{name}")[:80]
                if status == 200 and len(raw) > 4000:
                    save(f"{mid} · {name}", f"{safe}.wav", raw, "Together")
                else:
                    print(f"  x {mid} {name}: HTTP {status} {short(raw, 200)}")

    lis = "".join(f'<li><div><strong>{l}</strong> <span>{n}</span></div><audio controls preload="none" src="{f}"></audio></li>' for l, f, n in items)
    html = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Voces candidatas</title><style>body{{margin:0;background:#0B1020;color:#F5F7FC;font:16px/1.5 system-ui,sans-serif;padding:24px 16px}}
main{{max-width:680px;margin:0 auto}}h1{{font-size:24px;margin:0 0 8px}}p{{color:#AAB3C8}}ul{{list-style:none;padding:0;display:grid;gap:12px}}
li{{background:#151B31;border:1px solid #252D4A;border-radius:16px;padding:12px 16px;display:grid;gap:8px}}span{{color:#AAB3C8;font-size:14px}}audio{{width:100%}}</style></head>
<body><main><h1>Voces candidatas (reemplazo de Kokoro)</h1><p>Todas dicen: «{TEXT}». Página temporal.</p><ul>{lis}</ul></main></body></html>"""
    with open(os.path.join(OUT, "candidatas.html"), "w", encoding="utf-8") as f:
        f.write(html)
    os.system(f"chmod -R a+rX {OUT}")
    print(f"Listo: {len(items)} muestras en https://app.kotaru.app/voces/candidatas.html")


if __name__ == "__main__":
    main()
