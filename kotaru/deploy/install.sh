#!/usr/bin/env bash
# Instala o actualiza el gateway de Kotaru en este servidor. Idempotente: correrlo dos
# veces deja lo mismo. Se ejecuta como root desde la carpeta kotaru/ del repositorio:
#
#   cd ~/Kotaru/kotaru && git pull && sudo bash deploy/install.sh
#
# Que hace:
#   1. Comprueba Node 22+ y PostgreSQL.
#   2. Compila el gateway (npm ci + build).
#   3. Crea el usuario de sistema `kotaru` (sin login) si no existe.
#   4. Copia la version a /opt/kotaru/releases/<commit> y apunta /opt/kotaru/current a ella.
#   5. Crea /etc/kotaru/gateway.env la primera vez (claves nuevas, base de /root/kotaru.env).
#   6. Aplica migraciones.
#   7. Instala y (re)arranca los servicios systemd y el temporizador de retencion.
#   8. Espera a /readyz y corre la prueba de humo.
# Si el paso 8 falla, vuelve a la version anterior.
set -euo pipefail

ROOT=/opt/kotaru
ENV_FILE=/etc/kotaru/gateway.env
REPO_DIR=$(cd "$(dirname "$0")/.." && pwd)
say() { printf '\n==> %s\n' "$*"; }
die() { printf '\nERROR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "hay que correrlo como root"
command -v node >/dev/null || die "falta Node.js"
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
[ "$NODE_MAJOR" -ge 22 ] || die "Node $NODE_MAJOR es viejo; hace falta 22 o superior"
command -v psql >/dev/null || die "falta PostgreSQL (apt install -y postgresql)"

say "Compilando"
cd "$REPO_DIR"
npm ci --no-audit --no-fund
npm run build:gateway
COMMIT=$(git -C "$REPO_DIR" rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)

say "Usuario de sistema"
if ! id kotaru >/dev/null 2>&1; then
  useradd --system --home-dir "$ROOT" --shell /usr/sbin/nologin kotaru
  echo "creado: kotaru"
else
  echo "ya existe: kotaru"
fi

say "Version $COMMIT"
RELEASE="$ROOT/releases/$COMMIT"
PREVIOUS=$(readlink -f "$ROOT/current" 2>/dev/null || true)
mkdir -p "$ROOT/releases"
rm -rf "$RELEASE"
cp -r "$REPO_DIR/dist/gateway" "$RELEASE"
cp "$REPO_DIR/deploy/README.md" "$RELEASE/README-deploy.md"
(cd "$RELEASE" && npm install --omit=dev --no-audit --no-fund --silent)
chown -R root:kotaru "$RELEASE"
chmod -R g+rX,o-rwx "$RELEASE"

say "Configuracion"
mkdir -p /etc/kotaru
if [ ! -f "$ENV_FILE" ]; then
  [ -f /root/kotaru.env ] || die "no existe /root/kotaru.env con DATABASE_URL (paso de instalacion de PostgreSQL)"
  DB_URL=$(grep '^DATABASE_URL=' /root/kotaru.env | head -1 | cut -d= -f2-)
  [ -n "$DB_URL" ] || die "/root/kotaru.env no tiene DATABASE_URL"
  umask 077
  cat > "$ENV_FILE" <<EOF
DATABASE_URL=$DB_URL
KOTARU_GRANT_KEYS=g1:$(openssl rand -base64 32)
KOTARU_ACCESS_KEYS=a1:$(openssl rand -base64 32)
HOST=127.0.0.1
PORT=8080
KOTARU_GRANT_AUDIENCE=kotaru-gateway
KOTARU_API_AUDIENCE=kotaru-api
KOTARU_MONTHLY_HARD_CAP_USD=50
KOTARU_MESSAGE_RETENTION_DAYS=30
KOTARU_PROVIDERS=mock
EOF
  echo "creado $ENV_FILE con claves nuevas"
else
  echo "ya existe $ENV_FILE (no se toca)"
fi
chown root:kotaru "$ENV_FILE"
chmod 640 "$ENV_FILE"

say "Migraciones"
set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a
runuser -u kotaru -- node "$RELEASE/bin/migrate.mjs"

say "Servicios"
ln -sfn "$RELEASE" "$ROOT/current"
install -m 644 "$REPO_DIR/deploy/systemd/kotaru-gateway.service" /etc/systemd/system/
install -m 644 "$REPO_DIR/deploy/systemd/kotaru-retention.service" /etc/systemd/system/
install -m 644 "$REPO_DIR/deploy/systemd/kotaru-retention.timer" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now kotaru-retention.timer >/dev/null
systemctl enable kotaru-gateway >/dev/null
systemctl restart kotaru-gateway

say "Comprobacion"
PORT_NOW=${PORT:-8080}
for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:$PORT_NOW/readyz" >/dev/null 2>&1; then break; fi
  sleep 1
done
# runuser sin -l conserva el entorno ya cargado de $ENV_FILE.
if runuser -u kotaru -- node "$RELEASE/bin/smoke.mjs" "http://127.0.0.1:$PORT_NOW"; then
  say "Listo: version $COMMIT en marcha"
  systemctl --no-pager --lines=0 status kotaru-gateway | head -5
  # Conserva las 5 ultimas versiones para poder volver atras.
  # shellcheck disable=SC2012
  ls -1dt "$ROOT"/releases/* | tail -n +6 | xargs -r rm -rf
else
  echo "La prueba de humo fallo. Ultimas lineas del servicio:" >&2
  journalctl -u kotaru-gateway --no-pager -n 30 >&2 || true
  if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ] && [ "$PREVIOUS" != "$RELEASE" ]; then
    ln -sfn "$PREVIOUS" "$ROOT/current"
    systemctl restart kotaru-gateway
    die "se volvio a la version anterior ($(basename "$PREVIOUS"))"
  fi
  die "no hay version anterior a la que volver; el servicio queda con la nueva"
fi
