#!/usr/bin/env bash
# Prueba de punta a punta con voz de verdad contra el gateway en marcha: una persona
# (sintetizada con Cartesia) le habla al personaje por defecto, y se comprueba que el oido la entiende, que el
# modelo contesta sin etiquetas de emocion y con que voz responde (Gemini, Cartesia o Kokoro).
# Crea un usuario de prueba y lo borra al terminar. Costo: uno o dos centavos.
#
#   bash deploy/prueba-voz.sh ["frase que dice la persona"]
set -euo pipefail
ENV_FILE=/etc/kotaru/gateway.env
[ "$(id -u)" -eq 0 ] || { echo "Ejecuta como root." >&2; exit 1; }
TEXT="${1:-Hola, hoy estuve un poco nervioso en el trabajo. ¿Me acompañas un rato?}"
key="$(grep -E '^TOGETHER_API_KEY=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"
[ -n "$key" ] || { echo "Falta TOGETHER_API_KEY" >&2; exit 1; }
work="$(mktemp -d)"; trap 'rm -rf "$work"' EXIT
chmod 755 "$work"
body="$(python3 -c 'import json,sys; print(json.dumps({"model":"cartesia/sonic-3","input":sys.argv[1],"voice":"2fc4f1ec-bfd0-46f1-8e6d-d4279eaaf838","language":"es","response_format":"raw","response_encoding":"pcm_s16le","sample_rate":24000,"stream":False}, ensure_ascii=False))' "$TEXT")"
status="$(printf 'header = "Authorization: Bearer %s"\n' "$key" | curl -sS -K - -o "$work/voz.pcm" -w '%{http_code}' --max-time 30 \
  -H 'content-type: application/json' -X POST https://api.together.ai/v1/audio/speech --data-binary "$body" || echo 000)"
unset key
[ "$status" = 200 ] || { echo "No se pudo sintetizar la frase de prueba (HTTP $status)" >&2; head -c 300 "$work/voz.pcm" >&2; exit 1; }
chmod 644 "$work/voz.pcm"
echo "La persona dice: \"$TEXT\" ($(( $(stat -c %s "$work/voz.pcm") / 48 )) ms de voz)"
HOST_NOW="$(grep -E '^HOST=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"
PORT_NOW="$(grep -E '^PORT=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"
set -a; . "$ENV_FILE"; set +a
runuser -u kotaru -- "$(command -v node)" /opt/kotaru/current/bin/smoke.mjs "http://${HOST_NOW:-127.0.0.1}:${PORT_NOW:-8787}" --audio="$work/voz.pcm"
