#!/usr/bin/env bash
# Activa Google Cloud Text-to-Speech con voces Chirp 3 HD (las mismas de Gemini: Leda,
# Vindemiatrix, Algieba) como respaldo de Gemini TTS SIN su tope de 100 peticiones diarias.
# Orden de voces: Gemini -> Chirp -> Cartesia -> Kokoro.
#
#   bash deploy/chirp.sh
#
# Antes (una vez, en la consola de Google Cloud, proyecto "kotaru"):
#   - La API Cloud Text-to-Speech ya esta activada y la cuenta de servicio
#     kotaru-voz@kotaru-509922.iam.gserviceaccount.com ya existe (sin permisos extra).
#   - Crea su clave: IAM y administracion -> Cuentas de servicio -> kotaru-voz -> Claves ->
#     Agregar clave -> Crear clave nueva -> JSON. Se descarga un archivo .json.
#   - Abre ese archivo, copia TODO su contenido y pegalo cuando este script lo pida.
#     (No se ve en pantalla mientras lo pegas, igual que una contraseña.)
#
# La clave queda en /etc/kotaru/google-tts.json (solo root y el servicio kotaru pueden
# leerla). Nunca se imprime. Antes de activar nada hace una prueba real (una frase, una
# fraccion de centavo; el primer millon de caracteres al mes es gratis). Si algo falla,
# no cambia nada; si el gateway no arranca con el cambio, vuelve atras.
set -euo pipefail
ENV_FILE=/etc/kotaru/gateway.env
KEY_FILE=/etc/kotaru/google-tts.json
SERVICE=kotaru-gateway
[ "$(id -u)" -eq 0 ] || { echo "Ejecuta como root." >&2; exit 1; }
command -v openssl >/dev/null || { echo "Falta openssl." >&2; exit 1; }

echo "Términos de Google Cloud: Google no usa los datos del cliente para entrenar modelos y el"
echo "audio generado es tuyo para uso comercial (Service Specific Terms de Google Cloud)."
read -r -p "¿Los revisaste y los aceptas para Kotaru? (si/no) " answer
[ "$answer" = "si" ] || [ "$answer" = "sí" ] || { echo "Nada cambió." ; exit 1; }

work="$(mktemp -d /run/kotaru-chirp.XXXX)"; chmod 700 "$work"
trap 'rm -rf "$work"' EXIT
echo
echo "Pega ahora el contenido completo del archivo .json de la clave. Al terminar pulsa"
echo "Enter y después Ctrl-D (no se verá mientras pegas):"
stty -echo 2>/dev/null || true
cat > "$work/key.json"
stty echo 2>/dev/null || true
echo

# Validar sin imprimir la clave: solo el correo de la cuenta.
email="$(python3 - "$work" <<'PY'
import json, sys, os
work = sys.argv[1]
try:
    data = json.load(open(os.path.join(work, 'key.json')))
except Exception:
    sys.exit('El texto pegado no es JSON (¿se copió el archivo completo?). Nada cambió.')
if data.get('type') != 'service_account' or not data.get('private_key') or not data.get('client_email'):
    sys.exit('Ese JSON no es la clave de una cuenta de servicio. Nada cambió.')
open(os.path.join(work, 'pk.pem'), 'w').write(data['private_key'])
os.chmod(os.path.join(work, 'pk.pem'), 0o600)
print(data['client_email'])
PY
)"
echo "Cuenta: $email"

# Prueba real: token OAuth (JWT firmado con openssl) + una frase con la voz de Nova.
b64url() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }
now="$(date +%s)"
header="$(printf '{"alg":"RS256","typ":"JWT"}' | b64url)"
claims="$(printf '{"iss":"%s","scope":"https://www.googleapis.com/auth/cloud-platform","aud":"https://oauth2.googleapis.com/token","iat":%s,"exp":%s}' "$email" "$now" "$((now + 600))" | b64url)"
signature="$(printf '%s.%s' "$header" "$claims" | openssl dgst -sha256 -sign "$work/pk.pem" | b64url)"
token="$(curl -sS --max-time 20 https://oauth2.googleapis.com/token \
  --data-urlencode 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' \
  --data-urlencode "assertion=$header.$claims.$signature" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("access_token",""))' || true)"
[ -n "$token" ] || { echo "Google no aceptó la clave (¿clave borrada o de otra cuenta?). Nada cambió." >&2; exit 1; }
body='{"input":{"text":"Hola, aquí estoy."},"voice":{"languageCode":"es-US","name":"es-US-Chirp3-HD-Leda"},"audioConfig":{"audioEncoding":"LINEAR16","sampleRateHertz":24000}}'
status="$(printf 'header = "Authorization: Bearer %s"\n' "$token" | curl -sS -K - -o "$work/out.json" -w '%{http_code}' --max-time 30 \
  -H 'content-type: application/json' -X POST https://texttospeech.googleapis.com/v1/text:synthesize -d "$body" || echo 000)"
unset token
if [ "$status" != 200 ] || ! grep -q '"audioContent"' "$work/out.json"; then
  echo "La prueba con Chirp falló (HTTP $status). Nada cambió:" >&2
  python3 -c 'import json,sys; e=json.load(open(sys.argv[1])).get("error",{}); print(e.get("status",""), e.get("message","")[:200])' "$work/out.json" >&2 || true
  exit 1
fi
bytes="$(python3 -c 'import json,sys,base64; print(len(base64.b64decode(json.load(open(sys.argv[1]))["audioContent"])))' "$work/out.json")"
echo "Prueba de voz correcta: $bytes bytes de audio ($(( bytes / 48 )) ms) con es-US-Chirp3-HD-Leda."

# Guardar la clave y activar.
backup="$ENV_FILE.bak-$(date +%Y%m%d%H%M%S)"
cp -p "$ENV_FILE" "$backup"; chmod 600 "$backup"
install -m 640 -o root -g kotaru "$work/key.json" "$KEY_FILE"
providers="$(grep -E '^KOTARU_PROVIDERS=' "$ENV_FILE" | tail -1 | cut -d= -f2- || true)"
tmp="$(mktemp "$ENV_FILE.XXXX")"; chmod 600 "$tmp"
grep -v -E '^(KOTARU_PROVIDERS|GOOGLE_TTS_CREDENTIALS_FILE|KOTARU_GOOGLE_TTS_TERMS_REVIEWED)=' "$ENV_FILE" > "$tmp" || true
case ",$providers," in *,chirp,*) new="$providers" ;; *) new="$providers,chirp" ;; esac
printf 'KOTARU_PROVIDERS=%s\nGOOGLE_TTS_CREDENTIALS_FILE=%s\nKOTARU_GOOGLE_TTS_TERMS_REVIEWED=true\n' "$new" "$KEY_FILE" >> "$tmp"
mv "$tmp" "$ENV_FILE"

systemctl restart "$SERVICE"
ok=0
for _ in $(seq 1 20); do
  if journalctl -u "$SERVICE" --since "-30s" --no-pager -o cat | grep '"event":"started"' | grep -q 'google-chirp3-hd'; then ok=1; break; fi
  sleep 1
done
if [ "$ok" != 1 ]; then
  echo "El gateway no arrancó con Chirp: vuelvo atrás." >&2
  cp -p "$backup" "$ENV_FILE"
  rm -f "$KEY_FILE"
  systemctl restart "$SERVICE"
  journalctl -u "$SERVICE" -n 15 --no-pager -o cat | grep -v -i -E 'key|private' >&2 || true
  exit 1
fi
echo "Listo: la voz de Gemini va primero; si se agota su cuota diaria, Chirp 3 HD (las mismas voces); luego Cartesia."
echo "Puedes borrar el archivo .json de tu ordenador: la clave ya está en el servidor."
