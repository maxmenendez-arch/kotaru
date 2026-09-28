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


PERSONAJES = {
    "nova": ("¡Hola, guapo! Te estaba esperando. ¿Sabes que tu sonrisa me alegra el día? Cuéntame algo divertido.",
             ["Lucia - Radiant Host", "Mariana - Welcome Host", "Carmen - Friendly Neighbor", "Isabella - Warm Storyteller",
              "Elena - Client Liaison", "Sofia - Methodical Moderator", "Helena - Solution Facilitator"]),
    "rio": ("¡Qué tal! Hoy traigo un juego buenísimo: adivina en qué animal estoy pensando. Te doy una pista: tiene rayas.",
            ["Mateo - Friendly Host", "Carlos", "Diego - Hype Guy", "Daniel - Modern Assistant"]),
}


def personajes():
    """Muestras de Cartesia Sonic-3 para elegir la voz de Nova y de Rio."""
    key = env("TOGETHER_API_KEY")
    th = {"Authorization": f"Bearer {key}", "content-type": "application/json"}
    status, _, raw = call("https://api.together.xyz/v1/voices?model=cartesia/sonic-3", th)
    ids = {v.get("name"): v.get("id") for v in json.loads(raw).get("voices", [])} if status == 200 else {}
    os.makedirs(OUT, exist_ok=True)
    sections = []
    for who, (text, names) in PERSONAJES.items():
        items = []
        for name in names:
            vid = ids.get(name)
            if not vid:
                print(f"  x {who}: no encuentro la voz {name}")
                continue
            body = {"model": "cartesia/sonic-3", "input": text, "voice": vid, "response_format": "wav", "language": "es", "stream": False}
            status, _, audio = call("https://api.together.xyz/v1/audio/speech", th, body, timeout=90)
            if status != 200 or len(audio) < 4000:
                print(f"  x {who} {name}: HTTP {status} {short(audio)}")
                continue
            filename = re.sub(r"[^A-Za-z0-9_.-]+", "_", f"{who}-{name}") + ".wav"
            with open(os.path.join(OUT, filename), "wb") as f:
                f.write(audio)
            items.append(f'<li><div><strong>{name}</strong> <span>{vid}</span></div><audio controls preload="none" src="{filename}"></audio></li>')
            print(f"  ok {who}: {name}")
        sections.append(f"<h2>{who.capitalize()}</h2><p>«{text}»</p><ul>{''.join(items)}</ul>")
    html = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Voces de Nova y Rio</title><style>body{{margin:0;background:#0B1020;color:#F5F7FC;font:16px/1.5 system-ui,sans-serif;padding:24px 16px}}
main{{max-width:680px;margin:0 auto}}h1{{font-size:24px;margin:0 0 8px}}h2{{margin-top:28px}}p{{color:#AAB3C8}}ul{{list-style:none;padding:0;display:grid;gap:12px}}
li{{background:#151B31;border:1px solid #252D4A;border-radius:16px;padding:12px 16px;display:grid;gap:8px}}span{{color:#6F7A96;font-size:12px}}audio{{width:100%}}</style></head>
<body><main><h1>Voz de respaldo (Cartesia) para Nova y Rio</h1><p>Luna ya tiene a Helena. Dime el nombre que te guste para cada uno. Página temporal.</p>{''.join(sections)}</main></body></html>"""
    with open(os.path.join(OUT, "personajes.html"), "w", encoding="utf-8") as f:
        f.write(html)
    os.system(f"chmod -R a+rX {OUT}")
    print("Listo: https://app.kotaru.app/voces/personajes.html")


def main():
    if "--personajes" in sys.argv:
        personajes()
        return
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
                if re.match(r"(rime-labs|minimax|cartesia|deepgram|canopylabs|hexgrad|elevenlabs|inworld|resemble)/", mid, re.I) or kind in ("audio", "tts"):
                    if re.search(r"whisper|parakeet|nemotron|asr|transcri|nova-", mid, re.I):
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
            if "--crudo" in sys.argv:
                print(f"[together] {mid} crudo: {short(raw, 500)}")
            voices = []

            def walk(node):
                if isinstance(node, dict):
                    if ("id" in node or "name" in node) and not isinstance(node.get("voices"), list):
                        name = str(node.get("name") or node.get("id"))
                        voices.append((name, str(node.get("id") or name), json.dumps(node, ensure_ascii=False)))
                        return
                    for value in node.values():
                        walk(value)
                elif isinstance(node, list):
                    for value in node:
                        if isinstance(value, str):
                            voices.append((value, value, value))
                        else:
                            walk(value)

            walk(data)
            spanish = [v for v in voices if re.search(r'span|espa|latin|mexic|"language": "es', v[2], re.I)]
            if re.match(r"cartesia/", mid):
                spanish = [v for v in voices if re.search(r"span|latin|mexic|espa|lucia|sofia|valentina|isabel|carmen|mateo|diego|carlos|elena|mariana", v[0], re.I)]
            print(f"[together] {mid}: {len(voices)} voces, {len(spanish)} en espanol: "
                  + ", ".join(n for n, i, _ in spanish[:40]))
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
        cartesia = {n: i for m, vs in rows if m == "cartesia/sonic-3" for n, i, _ in vs}
        wanted = [
            ("hexgrad/Kokoro-82M", ["ef_dora"], "4 USD/M (la actual)"),
            ("minimax/speech-2.8-turbo", [], "MiniMax (china), 30 USD/M"),
            ("minimax/speech-2.6-turbo", [], "MiniMax (china), 30 USD/M"),
            ("rime-labs/rime-arcana-v3", ["luz", "mar", "seraphina", "celestino"], "Rime Arcana v3"),
            ("rime-labs/rime-mist-v3-omni", ["sofia", "lucia", "isa", "mateo"], "Rime Mist v3"),
            ("cartesia/sonic-3", list(cartesia)[:4], "Cartesia Sonic 3, 65 USD/M"),
        ]
        spanish_by_model = {m: [n for n, _, _ in vs] for m, vs in rows}
        for mid, names, note in wanted:
            if not names:
                names = [n for n in spanish_by_model.get(mid, []) if re.search(r"girl|woman|lady|queen|calm|gentle|sweet|man|boy", n, re.I)][:5]
            for name in names:
                vid = cartesia.get(name, name)
                body = {"model": mid, "input": TEXT, "voice": vid, "response_format": "wav", "language": "es", "stream": False}
                status, ctype, raw = call("https://api.together.xyz/v1/audio/speech", th, body, timeout=90)
                safe = re.sub(r"[^A-Za-z0-9_.-]+", "_", f"{mid}-{name}")[:80]
                if status == 200 and len(raw) > 4000:
                    save(f"{mid} · {name}", f"{safe}.wav", raw, note)
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
