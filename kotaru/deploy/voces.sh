#!/usr/bin/env bash
# Activa las voces realistas de Gemini (una por personaje: Nova, Sage y Rio) usando la
# clave de Gemini que ya puso deploy/gemini.sh. No pide nada.
#
#   bash deploy/voces.sh
#
# Antes de tocar nada hace una prueba real con Google: sintetiza "Hola." en streaming con
# la voz de Rio (menos de una milesima de centavo) y comprueba que llega audio en el
# formato que espera el adaptador. Si la prueba falla, no cambia nada y dice por que.
# Si el gateway no arranca con la voz nueva, vuelve al archivo anterior.
set -euo pipefail

ENV_FILE=/etc/kotaru/gateway.env
SERVICE=kotaru-gateway
MODEL="${GEMINI_TTS_MODEL:-gemini-3.8-flash-lite-tts}"

[ "$(id -u)" -eq 0 ] || { echo "Ejecuta como root." >&2; exit 1; }
[ -f "$ENV_FILE" ] || { echo "No existe $ENV_FILE: primero bash deploy/install.sh" >&2; exit 1; }
grep -Eq '^GEMINI_API_KEY=.+' "$ENV_FILE" || { echo "Falta la clave de Gemini: primero bash deploy/gemini.sh. Nada cambió." >&2; exit 1; }
grep -Eq '^KOTARU_GEMINI_PAID_TIER_CONFIRMED=true$' "$ENV_FILE" || { echo "Falta confirmar la facturación de Gemini (deploy/gemini.sh). Nada cambió." >&2; exit 1; }

key="$(grep -E '^GEMINI_API_KEY=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"
out="$(mktemp)"
trap 'rm -f "$out"' EXIT
body='{"model":"'"$MODEL"'","input":[{"type":"user_input","content":[{"type":"text","text":"Hola.","annotations":[{"type":"speech_metadata","style":"cálido y cercano"}]}]}],"response_format":{"type":"audio"},"generation_config":{"speech_config":[{"voice":"Achird"}]},"stream":true}'
# La clave va a curl por la entrada estandar, nunca en la linea de comandos.
status="$(printf 'header = "x-goog-api-key: %s"\n' "$key" | curl -sS -K - -o "$out" -w '%{http_code}' --max-time 30 \
  -H 'content-type: application/json' -H 'accept: text/event-stream' \
  -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" -d "$body" || echo 000)"
unset key

if [ "$status" != "200" ]; then
  echo "Google no aceptó la prueba de voz (HTTP $status). Nada cambió. Respuesta:" >&2
  head -c 600 "$out" | grep -v -i 'key' >&2 || true
  echo >&2
  exit 1
fi
audio_events="$(grep -c '"step.delta"' "$out" || true)"
audio_bytes="$(python3 - "$out" <<'PY'
import base64, json, sys
total = 0
for line in open(sys.argv[1], encoding='utf-8', errors='replace'):
    line = line.strip()
    if not line.startswith('data:'):
        continue
    try:
        event = json.loads(line[5:].strip())
    except Exception:
        continue
    delta = event.get('delta') or {}
    if event.get('event_type') == 'step.delta' and delta.get('type') == 'audio' and delta.get('data'):
        total += len(base64.b64decode(delta['data']))
print(total)
PY
)"
if [ "${audio_bytes:-0}" -lt 4800 ]; then
  echo "La respuesta de Google no trae audio en el formato esperado (eventos: $audio_events, bytes: ${audio_bytes:-0}). Nada cambió." >&2
  echo "Primeros eventos (sin el audio):" >&2
  grep '^data:' "$out" | head -5 | sed -E 's/"data":"[A-Za-z0-9+\/=]{40,}"/"data":"…"/g' | cut -c1-300 >&2 || true
  exit 1
fi
echo "Prueba de voz correcta: $audio_bytes bytes de audio en $audio_events eventos ($MODEL, voz Achird)."

providers="$(grep -E '^KOTARU_PROVIDERS=' "$ENV_FILE" | tail -1 | cut -d= -f2- || true)"
case ",$providers," in
  *,gemini-tts,*) echo "Las voces de Gemini ya estaban activas (KOTARU_PROVIDERS=$providers)."; exit 0 ;;
esac
providers="$providers,gemini-tts"

backup="$ENV_FILE.bak-$(date +%Y%m%d%H%M%S)"
cp -p "$ENV_FILE" "$backup"
chmod 600 "$backup"
tmp="$(mktemp "$ENV_FILE.XXXX")"
chmod 600 "$tmp"
grep -v -E '^KOTARU_PROVIDERS=' "$ENV_FILE" > "$tmp" || true
printf 'KOTARU_PROVIDERS=%s\n' "$providers" >> "$tmp"
mv "$tmp" "$ENV_FILE"
chmod 600 "$ENV_FILE"

systemctl restart "$SERVICE"
ok=0
for _ in $(seq 1 20); do
  if systemctl is-active --quiet "$SERVICE" && journalctl -u "$SERVICE" --since "-30s" --no-pager -o cat | grep -q '"event":"started"'; then ok=1; break; fi
  sleep 1
done
if [ "$ok" -ne 1 ]; then
  echo "El gateway no arrancó con las voces de Gemini. Vuelvo a la configuración anterior." >&2
  journalctl -u "$SERVICE" -n 20 --no-pager -o cat | grep -v -i 'key' >&2 || true
  cp -p "$backup" "$ENV_FILE"
  systemctl restart "$SERVICE"
  exit 1
fi
line="$(journalctl -u "$SERVICE" --since "-30s" --no-pager -o cat | grep '"event":"started"' | tail -1)"
echo "Gateway en marcha: $line"
if printf '%s' "$line" | grep -q "$MODEL"; then
  echo "Listo: Nova, Sage y Rio hablan con voces de Gemini (KOTARU_PROVIDERS=$providers)."
else
  echo "Aviso: el gateway arrancó pero no aparece $MODEL en los proveedores. Revisa $ENV_FILE." >&2
fi
