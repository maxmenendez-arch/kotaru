#!/usr/bin/env bash
# Activa Whisper Large v3 (voz a texto de Together AI, 0,0015 USD por minuto de voz) para
# que Rio oiga de verdad. Usa la clave de Together que ya puso deploy/kokoro.sh: no pide
# nada. Si el gateway no arranca, vuelve al archivo anterior.
#
#   bash deploy/whisper.sh
set -euo pipefail

ENV_FILE=/etc/kotaru/gateway.env
SERVICE=kotaru-gateway

[ "$(id -u)" -eq 0 ] || { echo "Ejecuta como root." >&2; exit 1; }
[ -f "$ENV_FILE" ] || { echo "No existe $ENV_FILE: primero bash deploy/install.sh" >&2; exit 1; }
grep -Eq '^TOGETHER_API_KEY=.+' "$ENV_FILE" || { echo "Falta la clave de Together: primero bash deploy/kokoro.sh. Nada cambió." >&2; exit 1; }
grep -Eq '^KOTARU_TOGETHER_ZERO_RETENTION_CONFIRMED=true$' "$ENV_FILE" || { echo "Falta confirmar la retención cero de Together (deploy/kokoro.sh). Nada cambió." >&2; exit 1; }

providers="$(grep -E '^KOTARU_PROVIDERS=' "$ENV_FILE" | tail -1 | cut -d= -f2- || true)"
case ",$providers," in
  *,whisper,*) echo "Whisper ya estaba activo (KOTARU_PROVIDERS=$providers)."; exit 0 ;;
esac
providers="$providers,whisper"

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
  echo "El gateway no arrancó con Whisper. Vuelvo a la configuración anterior." >&2
  journalctl -u "$SERVICE" -n 20 --no-pager -o cat | grep -v -i 'key' >&2 || true
  cp -p "$backup" "$ENV_FILE"
  systemctl restart "$SERVICE"
  exit 1
fi

line="$(journalctl -u "$SERVICE" --since "-30s" --no-pager -o cat | grep '"event":"started"' | tail -1)"
echo "Gateway en marcha: $line"
if printf '%s' "$line" | grep -q 'together-whisper'; then
  echo "Listo: Rio ya te oye (KOTARU_PROVIDERS=$providers). Recarga https://app.kotaru.app y mantén pulsado Hablar."
else
  echo "Aviso: el gateway arrancó pero no aparece Whisper en los proveedores. Revisa $ENV_FILE." >&2
fi
