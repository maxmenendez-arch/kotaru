#!/usr/bin/env bash
# Genera una muestra de cada una de las 30 voces de Gemini diciendo la misma frase en
# español, y una pagina para escucharlas en https://app.kotaru.app/voces/index.html . Sirve para
# elegir de oido la voz de Nova, Luna y Rio (Google no publica el genero de cada voz).
#
#   bash deploy/muestras-voz.sh
#
# Costo: unos 3 segundos de audio por voz, menos de 2 centavos en total. Usa la clave de
# Gemini de /etc/kotaru/gateway.env; la clave nunca sale en la linea de comandos.
# La pagina es temporal: el siguiente deploy/web.sh la borra (o bash deploy/muestras-voz.sh --borrar).
set -euo pipefail

ENV_FILE=/etc/kotaru/gateway.env
WEB_ROOT=/etc/caddy/otros-sitios/kotaru-web
OUT="$WEB_ROOT/voces"
MODEL="${GEMINI_TTS_MODEL:-gemini-3.8-flash-lite-tts}"
TEXT="${MUESTRA_TEXTO:-Hola, aquí estoy contigo. Respira despacio, no hay prisa. Cuéntame cómo te sientes esta noche.}"

[ "$(id -u)" -eq 0 ] || { echo "Ejecuta como root." >&2; exit 1; }
if [ "${1:-}" = "--borrar" ]; then rm -rf "$OUT"; echo "Muestras borradas."; exit 0; fi
grep -Eq '^GEMINI_API_KEY=.+' "$ENV_FILE" || { echo "Falta la clave de Gemini (deploy/gemini.sh)." >&2; exit 1; }
grep -Eq '^KOTARU_GEMINI_PAID_TIER_CONFIRMED=true$' "$ENV_FILE" || { echo "Falta confirmar la facturación de Gemini." >&2; exit 1; }
[ -d "$WEB_ROOT" ] || { echo "No existe $WEB_ROOT: primero bash deploy/web.sh" >&2; exit 1; }

VOICES="Zephyr:Bright Puck:Upbeat Charon:Informative Kore:Firm Fenrir:Excitable Leda:Youthful Orus:Firm Aoede:Breezy Callirrhoe:Easy-going Autonoe:Bright Enceladus:Breathy Iapetus:Clear Umbriel:Easy-going Algieba:Smooth Despina:Smooth Erinome:Clear Algenib:Gravelly Rasalgethi:Informative Laomedeia:Upbeat Achernar:Soft Alnilam:Firm Schedar:Even Gacrux:Mature Pulcherrima:Forward Achird:Friendly Zubenelgenubi:Casual Vindemiatrix:Gentle Sadachbia:Lively Sadaltager:Knowledgeable Sulafat:Warm"

key="$(grep -E '^GEMINI_API_KEY=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
mkdir -p "$OUT"

ok=0
rows=""
for pair in $VOICES; do
  voice="${pair%%:*}"
  desc="${pair#*:}"
  body="$(python3 - "$MODEL" "$voice" "$TEXT" <<'PY'
import json, sys
model, voice, text = sys.argv[1:4]
print(json.dumps({
  "model": model,
  "input": [{"type": "user_input", "content": [{"type": "text", "text": text,
    "annotations": [{"type": "speech_metadata", "style": "cálida, serena y cercana"}]}]}],
  "response_format": {"type": "audio"},
  "generation_config": {"speech_config": [{"voice": voice}]},
  "stream": True,
}, ensure_ascii=False))
PY
)"
  # Ya generada en una pasada anterior: no se paga dos veces.
  if [ -s "$OUT/$voice.wav" ]; then
    ok=$((ok + 1))
    rows="$rows<li><div><strong>$voice</strong> <span>$desc</span></div><audio controls preload=\"none\" src=\"$voice.wav\"></audio></li>"
    echo "  $voice ✓ (ya estaba)"
    continue
  fi
  # Google limita las peticiones seguidas: reintentos con espera creciente.
  done_one=0
  for wait_s in 2 5 10 20; do
  status="$(printf 'header = "x-goog-api-key: %s"\n' "$key" | curl -sS -K - -o "$work/$voice.sse" -w '%{http_code}' --max-time 60 \
    -H 'content-type: application/json' -H 'accept: text/event-stream' \
    -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" --data-binary "$body" || echo 000)"
  if [ "$status" = "200" ] && python3 - "$work/$voice.sse" "$OUT/$voice.wav" <<'PY'
import base64, json, struct, sys
pcm = bytearray()
for line in open(sys.argv[1], encoding='utf-8', errors='replace'):
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
if len(pcm) < 4800:
    sys.exit(1)
rate = 24000
header = b'RIFF' + struct.pack('<I', 36 + len(pcm)) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 1, 1, rate, rate * 2, 2, 16) + b'data' + struct.pack('<I', len(pcm))
open(sys.argv[2], 'wb').write(header + pcm)
PY
  then
    done_one=1
    break
  fi
  sleep "$wait_s"
  done
  if [ "$done_one" = 1 ]; then
    ok=$((ok + 1))
    rows="$rows<li><div><strong>$voice</strong> <span>$desc</span></div><audio controls preload=\"none\" src=\"$voice.wav\"></audio></li>"
    echo "  $voice ✓"
  else
    echo "  $voice ✗ (HTTP $status): $(grep -o '"error"[^}]*' "$work/$voice.sse" | head -1 | cut -c1-160)"
  fi
  sleep 1
done
unset key

cat > "$OUT/index.html" <<HTML
<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Voces de Kotaru</title>
<style>
body{margin:0;background:#0B1020;color:#F5F7FC;font:16px/1.5 system-ui,sans-serif;padding:24px 16px}
main{max-width:640px;margin:0 auto}h1{font-size:24px;margin:0 0 8px}p{color:#AAB3C8;margin:0 0 20px}
ul{list-style:none;padding:0;margin:0;display:grid;gap:12px}
li{background:#151B31;border:1px solid #252D4A;border-radius:16px;padding:12px 16px;display:grid;gap:8px}
span{color:#AAB3C8;font-size:14px}audio{width:100%}
</style></head><body><main>
<h1>Voces de Gemini para Nova, Luna y Rio</h1>
<p>Todas dicen: «$TEXT». Apunta cuál te gusta para Luna (paz), Nova (coqueta) y Rio (chico, divertido). Página temporal.</p>
<ul>$rows</ul>
</main></body></html>
HTML
chmod -R a+rX "$OUT"
echo "Listo: $ok de 30 muestras en https://app.kotaru.app/voces/index.html"
