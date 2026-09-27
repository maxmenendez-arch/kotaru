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
#      deploy/kotaru-web.caddy junto a ellos.
#   4. Permite ese origen en el gateway (CORS) y lo reinicia si cambio.
#   5. Valida la configuracion de Caddy y la recarga (los demas sitios no se cortan). Si no
#      valida, deja todo como estaba.
#   6. Comprueba que la pagina responde y que el gateway acepta su origen.
set -euo pipefail

DOMAIN=${KOTARU_WEB_DOMAIN:-app.kotaru.app}
CONTAINER=${KOTARU_CADDY_CONTAINER:-rapimula-caddy-1}
SITES=/etc/caddy/otros-sitios
TARGET=$SITES/kotaru-web
WEB_ENV=/etc/kotaru/web.env
GATEWAY_ENV=/etc/kotaru/gateway.env
REPO_DIR=$(cd "$(dirname "$0")/.." && pwd)
say() { printf '\n==> %s\n' "$*"; }
die() { printf '\nERROR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "hay que correrlo como root"
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
EOF
  chmod 644 "$WEB_ENV"
  echo "creado $WEB_ENV"
fi
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in ''|'#'*) continue ;; esac
  key=${line%%=*}
  value=${line#*=}
  [[ $key =~ ^EXPO_PUBLIC_[A-Z0-9_]+$ ]] && export "$key=$value"
done < "$WEB_ENV"
echo "servidor: ${EXPO_PUBLIC_KOTARU_SERVER_URL:-}"
echo "Google: ${EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID:-(sin configurar)}"
echo "Apple: ${EXPO_PUBLIC_APPLE_WEB_SERVICE_ID:-(sin configurar)}"

say "Compilando"
BUILD=$(mktemp -d)
trap 'rm -rf "$BUILD"' EXIT
cd "$REPO_DIR/mobile"
npm ci --no-audit --no-fund --loglevel=error
EXPO_NO_TELEMETRY=1 npx expo export --platform web --clear --output-dir "$BUILD/dist" >/dev/null
[ -f "$BUILD/dist/index.html" ] || die "la compilacion no genero index.html"
echo "listo: $(du -sh "$BUILD/dist" | cut -f1)"

say "Publicando archivos"
rm -rf "$TARGET.new" "$TARGET.old"
cp -r "$BUILD/dist" "$TARGET.new"
chmod -R a+rX "$TARGET.new"
[ -f "$SITES/kotaru-web.caddy" ] && cp "$SITES/kotaru-web.caddy" "$BUILD/kotaru-web.caddy.old"
[ -d "$TARGET" ] && mv "$TARGET" "$TARGET.old"
mv "$TARGET.new" "$TARGET"
sed "s/app\.kotaru\.app {/$DOMAIN {/" "$REPO_DIR/deploy/kotaru-web.caddy" > "$SITES/kotaru-web.caddy"

rollback() {
  echo "Volviendo a lo anterior" >&2
  rm -rf "$TARGET"
  [ -d "$TARGET.old" ] && mv "$TARGET.old" "$TARGET"
  if [ -f "$BUILD/kotaru-web.caddy.old" ]; then cp "$BUILD/kotaru-web.caddy.old" "$SITES/kotaru-web.caddy"; else rm -f "$SITES/kotaru-web.caddy"; fi
}

say "Gateway: permitir https://$DOMAIN"
ORIGIN="https://$DOMAIN"
CURRENT=$(grep -E '^KOTARU_CORS_ORIGINS=' "$GATEWAY_ENV" | tail -1 | cut -d= -f2- || true)
if ! tr ',' '\n' <<<"$CURRENT" | grep -qx "$ORIGIN"; then
  NEW=${CURRENT:+$CURRENT,}$ORIGIN
  if grep -qE '^KOTARU_CORS_ORIGINS=' "$GATEWAY_ENV"; then
    sed -i "s|^KOTARU_CORS_ORIGINS=.*|KOTARU_CORS_ORIGINS=$NEW|" "$GATEWAY_ENV"
  else
    echo "KOTARU_CORS_ORIGINS=$NEW" >> "$GATEWAY_ENV"
  fi
  systemctl restart kotaru-gateway
  echo "anadido; gateway reiniciado"
else
  echo "ya estaba"
fi

say "Caddy"
if ! docker exec "$CONTAINER" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then
  docker exec "$CONTAINER" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile 2>&1 | tail -5 >&2 || true
  rollback
  die "la configuracion de Caddy no valida; no se recargo nada"
fi
docker exec "$CONTAINER" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1
rm -rf "$TARGET.old"
echo "recargado"

say "Comprobando https://$DOMAIN (el primer certificado tarda unos segundos)"
API=${EXPO_PUBLIC_KOTARU_SERVER_URL:-https://api.kotaru.app}
for _ in $(seq 1 30); do
  if curl -fsS --max-time 5 -o /dev/null "https://$DOMAIN/" 2>/dev/null; then
    curl -fsS --max-time 5 -o /dev/null "https://$DOMAIN/audio-capture-worklet.js" || die "falta el archivo del microfono"
    ALLOW=$(curl -sS --max-time 5 -o /dev/null -D - -X OPTIONS -H "Origin: $ORIGIN" -H 'Access-Control-Request-Method: POST' "$API/v1/auth/refresh" | tr -d '\r' | grep -i '^access-control-allow-origin:' || true)
    [ -n "$ALLOW" ] || die "el gateway ($API) no acepta el origen $ORIGIN"
    echo "ok: https://$DOMAIN responde y el gateway acepta su origen"
    exit 0
  fi
  sleep 2
done
die "https://$DOMAIN no responde. Mira el DNS y: docker logs --tail 50 $CONTAINER"
