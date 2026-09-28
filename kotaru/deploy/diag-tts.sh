#!/usr/bin/env bash
# Diagnostico de la voz de Gemini: 6 peticiones seguidas de una frase corta con las voces
# en uso, midiendo codigo HTTP, tiempo al primer byte y total. Muestra el error de Google
# si lo hay (nunca la clave). Costo: menos de un centavo.
#
#   bash deploy/diag-tts.sh
set -euo pipefail
ENV_FILE=/etc/kotaru/gateway.env
MODEL="${GEMINI_TTS_MODEL:-gemini-3.8-flash-lite-tts}"
[ "$(id -u)" -eq 0 ] || { echo "Ejecuta como root." >&2; exit 1; }
key="$(grep -E '^GEMINI_API_KEY=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"
[ -n "$key" ] || { echo "Falta GEMINI_API_KEY" >&2; exit 1; }
out="$(mktemp)"; trap 'rm -f "$out"' EXIT
for voice in Vindemiatrix Leda Algieba Vindemiatrix Leda Algieba; do
  body='{"model":"'"$MODEL"'","input":[{"type":"user_input","content":[{"type":"text","text":"Hola, aquí estoy contigo. Cuéntame cómo te fue hoy."}]}],"response_format":{"type":"audio"},"generation_config":{"speech_config":[{"voice":"'"$voice"'"}]},"stream":true}'
  res="$(printf 'header = "x-goog-api-key: %s"\n' "$key" | curl -sS -K - -o "$out" -w '%{http_code} %{time_starttransfer} %{time_total}' --max-time 40 \
    -H 'content-type: application/json' -H 'accept: text/event-stream' \
    -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" -d "$body" || echo "000 - -")"
  err="$(grep -o '"message": *"[^"]*"' "$out" | head -1 | cut -c1-200 || true)"
  echo "$voice: HTTP ${res%% *} primer-byte ${res#* }s ${err}"
done
unset key
