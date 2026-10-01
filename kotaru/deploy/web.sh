#!/usr/bin/env bash
# Compila y publica la webapp de Kotaru (https://app.kotaru.app). Idempotente.
#
#   cd ~/Kotaru/kotaru && git pull && sudo bash deploy/web.sh
#
# Pensado para srv1987174, donde un Caddy en Docker (rapimula-caddy-1) sirve todos los
# sitios e importa /etc/caddy/otros-sitios/*.caddy (ver "Caddy compartido" en
# deploy/README.md). Antes: el registro DNS A de app.kotaru.app apunta a este servidor.
#
# Que hace:
#   1. Crea /etc/kotaru/web.env la primera vez (direccion del servidor y client id de login;
#      nada de eso es secreto: va dentro de la pagina).
#   2. Compila la app para la web con esos valores.
#   3. Deja los archivos en /etc/caddy/otros-sitios/kotaru-web (cambio atomico) y copia
#      deploy/kotaru-web.caddy junto a ellos, con la politica de seguridad apuntando al API.
#   4. Configura el gateway para ese origen (CORS y passkeys en app.kotaru.app), lo
#      reinicia si cambio algo y espera a que responda de verdad.
#   5. Valida la configuracion de Caddy y la recarga (los demas sitios no se cortan).
#   6. Comprueba la pagina, el CORS y las passkeys.
# Si algo falla desde el paso 3, deja todo como estaba: archivos, sitio de Caddy y
# configuracion del gateway.
set -Eeuo pipefail

DOMAIN=${KOTARU_WEB_DOMAIN:-app.kotaru.app}
CONTAINER=${KOTARU_CADDY_CONTAINER:-rapimula-caddy-1}
SITES=/etc/caddy/otros-sitios
TARGET=$SITES/kotaru-web
SITE_FILE=$SITES/kotaru-web.caddy
WEB_ENV=/etc/kotaru/web.env
GATEWAY_ENV=/etc/kotaru/gateway.env
REPO_DIR=$(cd "$(dirname "$0")/.." && pwd)
HOSTNAME_RE='^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$'
say() { printf '\n==> %s\n' "$*"; }
die() { printf '\nERROR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "hay que correrlo como root"
[[ "$DOMAIN" =~ $HOSTNAME_RE ]] || die "dominio no valido: $DOMAIN"
[ -d "$SITES" ] || die "no existe $SITES (la carpeta que importa el Caddy compartido)"
docker inspect "$CONTAINER" >/dev/null 2>&1 || die "no existe el contenedor $CONTAINER"
[ -f "$GATEWAY_ENV" ] || die "instala antes el gateway (deploy/install.sh)"

say "Configuracion de la webapp"
if [ ! -f "$WEB_ENV" ]; then
  cat > "$WEB_ENV" <<'EOF'
# Valores de la webapp. Van DENTRO de la pagina: aqui no se pone nada secreto.
EXPO_PUBLIC_KOTARU_SERVER_URL=https://api.kotaru.app
# Client id de Google de tipo "web" (el mismo de KOTARU_GOOGLE_CLIENT_IDS).
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
# Services ID de Sign in with Apple para la web (tambien en KOTARU_APPLE_CLIENT_IDS).
EXPO_PUBLIC_APPLE_WEB_SERVICE_ID=
# Passkeys en las apps nativas (no son secretos): Team ID de Apple Developer (10 letras y
# numeros) y huella SHA-256 del certificado con que se firma la app de Android.
KOTARU_APPLE_TEAM_ID=
KOTARU_ANDROID_CERT_SHA256=
EOF
  chmod 644 "$WEB_ENV"
  echo "creado $WEB_ENV"
fi
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in ''|'#'*) continue ;; esac
  key=${line%%=*}
  value=${line#*=}
  [[ $key =~ ^(EXPO_PUBLIC_[A-Z0-9_]+|KOTARU_APPLE_TEAM_ID|KOTARU_ANDROID_CERT_SHA256)$ ]] && export "$key=$value"
done < "$WEB_ENV"
API=${EXPO_PUBLIC_KOTARU_SERVER_URL:-https://api.kotaru.app}
API_HOST=${API#https://}
API_HOST=${API_HOST%/}
[[ "$API" == https://* && "$API_HOST" =~ $HOSTNAME_RE ]] || die "EXPO_PUBLIC_KOTARU_SERVER_URL debe ser https://<dominio>: $API"
echo "servidor: $API"
echo "Google: ${EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID:-(sin configurar)}"
echo "Apple: ${EXPO_PUBLIC_APPLE_WEB_SERVICE_ID:-(sin configurar)}"

# Dominio de las passkeys: el de la propia webapp. Tambien lo usaran las apps nativas
# (dominio asociado webcredentials:app.kotaru.app), cuyos archivos de verificacion sirve este
# mismo sitio. Cambiarlo despues invalida las passkeys ya creadas.
RP_ID=${KOTARU_WEBAUTHN_RP_ID:-$DOMAIN}
[[ "$RP_ID" =~ $HOSTNAME_RE ]] || die "dominio de passkeys no valido: $RP_ID"

say "Compilando"
WORK=$(mktemp -d)
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT
cd "$REPO_DIR/mobile"
npm ci --no-audit --no-fund --loglevel=error
EXPO_NO_TELEMETRY=1 npx expo export --platform web --clear --output-dir "$WORK/dist" >/dev/null
[ -f "$WORK/dist/index.html" ] || die "la compilacion no genero index.html"
echo "listo: $(du -sh "$WORK/dist" | cut -f1)"

# Desde aqui se toca lo que esta en marcha: copia de seguridad y vuelta atras automatica.
mkdir -p "$WORK/backup"
cp -p "$GATEWAY_ENV" "$WORK/backup/gateway.env"
if [ -f "$SITE_FILE" ]; then cp -p "$SITE_FILE" "$WORK/backup/site.caddy"; fi
GATEWAY_TOUCHED=0
rollback() {
  local status=${1:-$?}
  trap - ERR
  echo "Algo fallo: vuelvo a dejarlo todo como estaba" >&2
  if [ -d "$TARGET.old" ]; then
    rm -rf "$TARGET"
    mv "$TARGET.old" "$TARGET"
  fi
  if [ -f "$WORK/backup/site.caddy" ]; then cp -p "$WORK/backup/site.caddy" "$SITE_FILE"; else rm -f "$SITE_FILE"; fi
  if [ "$GATEWAY_TOUCHED" = 1 ]; then
    cp -p "$WORK/backup/gateway.env" "$GATEWAY_ENV"
    systemctl restart kotaru-gateway || true
  fi
  docker exec "$CONTAINER" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 || true
  exit "$status"
}
trap rollback ERR
fail() {
  printf '\nERROR: %s\n' "$*" >&2
  rollback 1
}

say "Publicando archivos"
rm -rf "$TARGET.new" "$TARGET.old"
cp -r "$WORK/dist" "$TARGET.new"
# Verificacion de dominio para las passkeys de las apps nativas: iOS pregunta por
# apple-app-site-association y Android por assetlinks.json. Solo si hay datos.
mkdir -p "$TARGET.new/.well-known"
if [[ "${KOTARU_APPLE_TEAM_ID:-}" =~ ^[A-Z0-9]{10}$ ]]; then
  printf '{"webcredentials":{"apps":["%s.app.kotaru.mobile"]}}\n' "$KOTARU_APPLE_TEAM_ID" > "$TARGET.new/.well-known/apple-app-site-association"
  echo "iOS: dominio asociado para $KOTARU_APPLE_TEAM_ID.app.kotaru.mobile"
fi
if [[ "${KOTARU_ANDROID_CERT_SHA256:-}" =~ ^([0-9A-F]{2}:){31}[0-9A-F]{2}$ ]]; then
  printf '[{"relation":["delegate_permission/common.get_login_creds"],"target":{"namespace":"android_app","package_name":"app.kotaru.mobile","sha256_cert_fingerprints":["%s"]}}]\n' "$KOTARU_ANDROID_CERT_SHA256" > "$TARGET.new/.well-known/assetlinks.json"
  echo "Android: dominio asociado para app.kotaru.mobile"
fi
# Voz de los shorts de presentacion (deploy/intro-voces.py la genera una vez y la guarda fuera de la web).
if [ -d /var/lib/kotaru/intro ]; then
  cp -r /var/lib/kotaru/intro "$TARGET.new/intro"
  echo "Voz de presentación: $(ls /var/lib/kotaru/intro | wc -l) archivos"
fi
# Animaciones de Mixamo (Adobe), descargadas con la cuenta del dueño y convertidas con
# mobile/scripts/fbx-convert.mjs; se guardan fuera del repositorio, como la voz de presentacion.
if [ -d /var/lib/kotaru/mixamo-json ]; then
  mkdir -p "$TARGET.new/motions"
  cp /var/lib/kotaru/mixamo-json/*.json "$TARGET.new/motions/"
  echo "Animaciones Mixamo: $(ls /var/lib/kotaru/mixamo-json | wc -l) archivos"
fi
chmod -R a+rX "$TARGET.new"
if [ -d "$TARGET" ]; then mv "$TARGET" "$TARGET.old"; fi
mv "$TARGET.new" "$TARGET"
sed -e "s/app\.kotaru\.app {/$DOMAIN {/" -e "s/api\.kotaru\.app/$API_HOST/g" "$REPO_DIR/deploy/kotaru-web.caddy" > "$SITE_FILE"

say "Gateway: $DOMAIN (CORS y passkeys en $RP_ID)"
ORIGIN="https://$DOMAIN"
CHANGED=0
env_get() { grep -E "^$1=" "$GATEWAY_ENV" | tail -1 | cut -d= -f2- || true; }
env_set() {
  if grep -qE "^$1=" "$GATEWAY_ENV"; then sed -i "s|^$1=.*|$1=$2|" "$GATEWAY_ENV"; else echo "$1=$2" >> "$GATEWAY_ENV"; fi
  CHANGED=1
}
list_add() {
  local current
  current=$(env_get "$1")
  if ! tr ',' '\n' <<<"$current" | grep -qx "$2"; then env_set "$1" "${current:+$current,}$2"; fi
}
list_add KOTARU_CORS_ORIGINS "$ORIGIN"
list_add KOTARU_WEBAUTHN_ORIGINS "$ORIGIN"
if [ -z "$(env_get KOTARU_WEBAUTHN_RP_ID)" ]; then env_set KOTARU_WEBAUTHN_RP_ID "$RP_ID"; fi
# El gateway solo cree la IP de X-Forwarded-For si la conexion viene del contenedor de Caddy:
# otro contenedor de la misma red no puede inventarse IPs para saltarse los limites. La IP
# del contenedor puede cambiar si Docker lo recrea; correr web.sh otra vez la actualiza.
CADDY_IP=$(docker inspect "$CONTAINER" --format '{{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' | awk '{print $1}')
if [[ "$CADDY_IP" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] && [ "$(env_get KOTARU_TRUSTED_PROXIES)" != "$CADDY_IP" ]; then
  env_set KOTARU_TRUSTED_PROXIES "$CADDY_IP"
  echo "proxy de confianza: $CADDY_IP"
fi
if [ "$CHANGED" = 1 ]; then
  GATEWAY_TOUCHED=1
  systemctl restart kotaru-gateway
  echo "configurado; gateway reiniciado"
else
  echo "ya estaba"
fi
# `systemctl is-active` dice "active" antes de que el gateway lea su configuracion: se
# pregunta al gateway mismo.
GW_HOST=$(env_get HOST)
GW_PORT=$(env_get PORT)
READY=0
for _ in $(seq 1 30); do
  if curl -fsS --max-time 2 -o /dev/null "http://${GW_HOST:-127.0.0.1}:${GW_PORT:-8787}/readyz" 2>/dev/null; then READY=1; break; fi
  sleep 1
done
[ "$READY" = 1 ] || fail "el gateway no responde tras el cambio: journalctl -u kotaru-gateway -n 30"

say "Caddy"
if ! docker exec "$CONTAINER" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then
  docker exec "$CONTAINER" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile 2>&1 | tail -5 >&2 || true
  fail "la configuracion de Caddy no valida"
fi
docker exec "$CONTAINER" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1
echo "recargado"

say "Comprobando https://$DOMAIN (el primer certificado tarda unos segundos)"
UP=0
for _ in $(seq 1 30); do
  if curl -fsS --max-time 5 -o /dev/null "https://$DOMAIN/" 2>/dev/null; then UP=1; break; fi
  sleep 2
done
[ "$UP" = 1 ] || fail "https://$DOMAIN no responde. Mira el DNS y: docker logs --tail 50 $CONTAINER"
curl -fsS --max-time 5 -o /dev/null "https://$DOMAIN/audio-capture-worklet.js" || fail "falta el archivo del microfono"
for model in luna nova rio; do
  curl -fsS --max-time 30 -o /dev/null "https://$DOMAIN/avatars/$model.vrm" || fail "falta el modelo 3D de $model"
done
ALLOW=$(curl -sS --max-time 5 -o /dev/null -D - -X OPTIONS -H "Origin: $ORIGIN" -H 'Access-Control-Request-Method: POST' "$API/v1/auth/refresh" | tr -d '\r' | grep -i '^access-control-allow-origin:' || true)
[ -n "$ALLOW" ] || fail "el gateway ($API) no acepta el origen $ORIGIN"
curl -fsS --max-time 5 -o /dev/null -X POST -H 'content-type: application/json' -d '{}' "$API/v1/auth/passkey/login/options" \
  || fail "el gateway no ofrece passkeys (revisa KOTARU_WEBAUTHN_* en $GATEWAY_ENV)"

trap - ERR
rm -rf "$TARGET.old"
echo "ok: https://$DOMAIN responde, el gateway acepta su origen y ofrece passkeys"
