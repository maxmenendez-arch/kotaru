#!/usr/bin/env bash
# Activa Cartesia Sonic-3 (Together AI) como respaldo de la voz de Gemini, por delante de
# Kokoro. Usa la clave de Together que ya puso deploy/kokoro.sh y sus mismas confirmaciones
# (retencion cero y terminos de uso comercial). No pide nada.
#
#   bash deploy/cartesia.sh
#
# Antes de tocar nada hace una prueba real (una frase corta, una fraccion de centavo) en el
# mismo formato que usa el adaptador (PCM 16 bits a 24 kHz). Si el gateway no arranca con
# el cambio, vuelve al archivo anterior.
set -euo pipefail
ENV_FILE=/etc/kotaru/gateway.env
SERVICE=kotaru-gateway
[ "$(id -u)" -eq 0 ] || { echo "Ejecuta como root." >&2; exit 1; }
grep -Eq '^TOGETHER_API_KEY=.+' "$ENV_FILE" || { echo "Falta la clave de Together: bash deploy/kokoro.sh. Nada cambió." >&2; exit 1; }
grep -Eq '^KOTARU_TOGETHER_ZERO_RETENTION_CONFIRMED=true$' "$ENV_FILE" || { echo "Falta confirmar la retención cero de Together. Nada cambió." >&2; exit 1; }

key="$(grep -E '^TOGETHER_API_KEY=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"
out="$(mktemp)"; trap 'rm -f "$out"' EXIT
body='{"model":"cartesia/sonic-3","input":"Hola, aquí estoy.","voice":"8a6d0b8e-8cd8-4952-a41e-b7af18662135","language":"es","response_format":"raw","response_encoding":"pcm_s16le","sample_rate":24000,"stream":false}'
status="$(printf 'header = "Authorization: Bearer %s"\n' "$key" | curl -sS -K - -o "$out" -w '%{http_code}' --max-time 30 \
  -H 'content-type: application/json' -X POST https://api.together.ai/v1/audio/speech -d "$body" || echo 000)"
unset key
bytes="$(stat -c %s "$out")"
if [ "$status" != 200 ] || [ "$bytes" -lt 9600 ] || head -c 1 "$out" | grep -q '{'; then
  echo "La prueba con Cartesia falló (HTTP $status, $bytes bytes). Nada cambió:" >&2
  head -c 300 "$out" >&2; echo >&2
  exit 1
fi
echo "Prueba de voz correcta: $bytes bytes de audio ($(( bytes / 48 )) ms)."

backup="$ENV_FILE.bak-$(date +%Y%m%d%H%M%S)"
cp -p "$ENV_FILE" "$backup"; chmod 600 "$backup"
providers="$(grep -E '^KOTARU_PROVIDERS=' "$ENV_FILE" | tail -1 | cut -d= -f2- || true)"
case ",$providers," in *,cartesia,*) echo "Cartesia ya estaba activado." ;; *)
  tmp="$(mktemp "$ENV_FILE.XXXX")"; chmod 600 "$tmp"
  grep -v -E '^KOTARU_PROVIDERS=' "$ENV_FILE" > "$tmp" || true
  printf 'KOTARU_PROVIDERS=%s\n' "$providers,cartesia" >> "$tmp"
  mv "$tmp" "$ENV_FILE" ;;
esac

systemctl restart "$SERVICE"
ok=0
for _ in $(seq 1 20); do
  if journalctl -u "$SERVICE" --since "-30s" --no-pager -o cat | grep '"event":"started"' | grep -q 'together-cartesia-sonic-3'; then ok=1; break; fi
  sleep 1
done
if [ "$ok" != 1 ]; then
  echo "El gateway no arrancó con Cartesia: vuelvo atrás." >&2
  cp -p "$backup" "$ENV_FILE"
  systemctl restart "$SERVICE"
  journalctl -u "$SERVICE" -n 15 --no-pager -o cat | grep -v -i key >&2 || true
  exit 1
fi
echo "Listo: la voz de Gemini va primero; si falla o se agota su cuota, Cartesia; Kokoro al final."
