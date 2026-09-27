#!/usr/bin/env bash
# Activa Kokoro-82M (voz barata de Together AI, 4 USD por millon de caracteres frente a los
# 16 de Polly) en el gateway de Kotaru. Es la prueba D-011: menos de la mitad del costo
# por hora de voz, si la calidad aguanta.
#
#   bash deploy/kokoro.sh
#
# Pide la clave sin mostrarla, la valida con Together (gratis: lista de modelos), la guarda
# en /etc/kotaru/gateway.env y reinicia. Si el gateway no arranca, vuelve atras.
#
# Requisitos (los hace el dueño en https://api.together.ai):
#   - Settings -> Privacy & Security -> Zero Data Retention activado.
#   - Leidos los terminos de uso comercial del audio generado.
set -euo pipefail

ENV_FILE=/etc/kotaru/gateway.env
SERVICE=kotaru-gateway

[ "$(id -u)" -eq 0 ] || { echo "Ejecuta como root." >&2; exit 1; }
[ -f "$ENV_FILE" ] || { echo "No existe $ENV_FILE: primero bash deploy/install.sh" >&2; exit 1; }

# Kokoro solo pone la voz: hace falta el modelo de lenguaje real (el simulado "mock"
# traeria tambien una voz simulada gratis, que el router elegiria siempre).
if ! grep -Eq '^KOTARU_PROVIDERS=(.*,)?gemini(,.*)?$' "$ENV_FILE"; then
  echo "Primero activa Gemini: bash deploy/gemini.sh. Nada cambió." >&2
  exit 1
fi

read -r -p "¿Activaste Zero Data Retention en Together (Settings → Privacy & Security)? [s/N] " zdr
case "$zdr" in s|S|si|SI|sí|Sí) ;; *) echo "Sin retención cero no se activa. Nada cambió."; exit 1 ;; esac
read -r -p "¿Revisaste los términos de Together sobre el uso comercial del audio? [s/N] " terms
case "$terms" in s|S|si|SI|sí|Sí) ;; *) echo "Sin revisar los términos no se activa. Nada cambió."; exit 1 ;; esac

read -r -s -p "Pega la clave de Together (no se verá) y pulsa Enter: " key
echo
key="$(printf '%s' "$key" | tr -d '[:space:]')"
if ! printf '%s' "$key" | grep -Eq '^[A-Za-z0-9_.-]{20,128}$'; then
  echo "Eso no parece una clave de Together. Nada cambió." >&2
  exit 1
fi

# Comprobacion gratuita: la lista de modelos con esa clave. La clave va a curl por la
# entrada estandar, no en la linea de comandos.
status="$(printf 'header = "Authorization: Bearer %s"\n' "$key" | curl -sS -K - -o /dev/null -w '%{http_code}' \
  "https://api.together.ai/v1/models" || echo 000)"
case "$status" in
  200) echo "Clave de Together válida." ;;
  401|403) echo "Together rechazó la clave (HTTP $status). Nada cambió." >&2; exit 1 ;;
  *) echo "No se pudo comprobar la clave (HTTP $status). Nada cambió; prueba otra vez en un momento." >&2; exit 1 ;;
esac

backup="$ENV_FILE.bak-$(date +%Y%m%d%H%M%S)"
cp -p "$ENV_FILE" "$backup"
chmod 600 "$backup"

# Cambia (o añade) una variable sin tocar el resto del archivo. El valor no pasa por la
# linea de comandos de ningun proceso: se escribe desde bash.
set_var() {
  local name="$1" value="$2" tmp
  tmp="$(mktemp "$ENV_FILE.XXXX")"
  chmod 600 "$tmp"
  grep -v -E "^${name}=" "$ENV_FILE" > "$tmp" || true
  printf '%s=%s\n' "$name" "$value" >> "$tmp"
  mv "$tmp" "$ENV_FILE"
}

providers="$(grep -E '^KOTARU_PROVIDERS=' "$ENV_FILE" | tail -1 | cut -d= -f2- || true)"
case ",$providers," in *,kokoro,*) ;; *) providers="$providers,kokoro" ;; esac

set_var TOGETHER_API_KEY "$key"
set_var KOTARU_TOGETHER_ZERO_RETENTION_CONFIRMED true
set_var KOTARU_TOGETHER_COMMERCIAL_TERMS_REVIEWED true
set_var KOTARU_PROVIDERS "$providers"
unset key
chmod 600 "$ENV_FILE"

systemctl restart "$SERVICE"
ok=0
for _ in $(seq 1 20); do
  if systemctl is-active --quiet "$SERVICE" && journalctl -u "$SERVICE" --since "-30s" --no-pager -o cat | grep -q '"event":"started"'; then ok=1; break; fi
  sleep 1
done

if [ "$ok" -ne 1 ]; then
  echo "El gateway no arrancó con la configuración nueva. Vuelvo a la anterior." >&2
  journalctl -u "$SERVICE" -n 20 --no-pager -o cat | grep -v -i 'key' >&2 || true
  cp -p "$backup" "$ENV_FILE"
  systemctl restart "$SERVICE"
  exit 1
fi

line="$(journalctl -u "$SERVICE" --since "-30s" --no-pager -o cat | grep '"event":"started"' | tail -1)"
echo "Gateway en marcha: $line"
if printf '%s' "$line" | grep -q 'together-kokoro'; then
  echo "Listo: Kokoro activo (KOTARU_PROVIDERS=$providers). Habla con Rio en https://app.kotaru.app."
else
  echo "Aviso: el gateway arrancó pero no aparece Kokoro en los proveedores. Revisa $ENV_FILE." >&2
fi
echo "Copia de seguridad del archivo anterior: $backup"
