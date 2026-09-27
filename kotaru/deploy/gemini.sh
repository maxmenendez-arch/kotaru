#!/usr/bin/env bash
# Activa Gemini (el modelo de lenguaje real) en el gateway de Kotaru.
#
#   bash deploy/gemini.sh
#
# Pide la clave de API sin mostrarla (no queda en el historial de la terminal ni en
# ningun registro), la guarda en /etc/kotaru/gateway.env (solo root puede leerlo) y
# reinicia el gateway con KOTARU_PROVIDERS=gemini,mock-voice:
#   - el chat de texto con Rio usa Gemini de verdad;
#   - la voz sigue simulada (frase fija y tono) hasta tener AssemblyAI y Polly.
# Si el gateway no arranca con la clave nueva, se vuelve al archivo anterior.
#
# Requisito (lo hace el dueño en https://aistudio.google.com): la clave es de un proyecto
# CON FACTURACION activa. En el nivel gratuito Google usa las conversaciones para mejorar
# sus productos y personas pueden leerlas; por eso el script lo pregunta.
set -euo pipefail

ENV_FILE=/etc/kotaru/gateway.env
SERVICE=kotaru-gateway

[ "$(id -u)" -eq 0 ] || { echo "Ejecuta como root." >&2; exit 1; }
[ -f "$ENV_FILE" ] || { echo "No existe $ENV_FILE: primero bash deploy/install.sh" >&2; exit 1; }

read -r -p "¿La clave es de un proyecto de Google con facturación activa (no el nivel gratuito)? [s/N] " paid
case "$paid" in s|S|si|SI|sí|Sí) ;; *) echo "Sin facturación activa no se activa: Google podría usar las conversaciones. Nada cambió."; exit 1 ;; esac

read -r -s -p "Pega la clave de Gemini (no se verá) y pulsa Enter: " key
echo
key="$(printf '%s' "$key" | tr -d '[:space:]')"
# Dos formatos: el clasico (AIza..., 39 caracteres) y el nuevo de AI Studio (AQ.Ab8...,
# con un punto).
if ! printf '%s' "$key" | grep -Eq '^[A-Za-z0-9_.-]{30,128}$'; then
  echo "Eso no parece una clave de Gemini (empiezan por AIza o por AQ.). Nada cambió." >&2
  exit 1
fi

model="$(grep -E '^GEMINI_MODEL=' "$ENV_FILE" | tail -1 | cut -d= -f2- || true)"
model="${model:-gemini-3.1-flash-lite}"
# Comprobacion gratuita (no genera texto): pedir los datos del modelo con esa clave. La
# clave va a curl por la entrada estandar, no en la linea de comandos.
status="$(printf 'header = "x-goog-api-key: %s"\n' "$key" | curl -sS -K - -o /dev/null -w '%{http_code}' \
  "https://generativelanguage.googleapis.com/v1beta/models/$model" || echo 000)"
case "$status" in
  200) echo "Clave válida para $model." ;;
  400|401|403) echo "Google rechazó la clave (HTTP $status). Revisa que esté bien copiada y que la API esté habilitada. Nada cambió." >&2; exit 1 ;;
  404) echo "La clave vale pero el modelo $model no aparece (HTTP 404). Nada cambió." >&2; exit 1 ;;
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
case ",$providers," in
  *,assemblyai,*|*,polly,*)
    # Ya hay proveedores reales de voz: solo se añade gemini si falta.
    case ",$providers," in *,gemini,*) ;; *) providers="$providers,gemini" ;; esac ;;
  *) providers="gemini,mock-voice" ;;
esac

set_var GEMINI_API_KEY "$key"
set_var KOTARU_GEMINI_PAID_TIER_CONFIRMED true
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
if printf '%s' "$line" | grep -q 'gemini'; then
  echo "Listo: Gemini activo (KOTARU_PROVIDERS=$providers). Abre https://app.kotaru.app y escríbele a Rio."
else
  echo "Aviso: el gateway arrancó pero no aparece Gemini en los proveedores. Revisa $ENV_FILE." >&2
fi
echo "Copia de seguridad del archivo anterior: $backup"
