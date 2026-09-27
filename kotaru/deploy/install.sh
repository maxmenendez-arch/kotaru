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
NODE_BIN=$(command -v node) || die "falta Node.js"
NODE_BIN=$(readlink -f "$NODE_BIN")
NODE_MAJOR=$("$NODE_BIN" -p 'process.versions.node.split(".")[0]')
[ "$NODE_MAJOR" -ge 22 ] || die "Node $NODE_MAJOR es viejo; hace falta 22 o superior"
# El servicio corre con ProtectHome: un Node instalado bajo /root o /home (nvm) no lo vera.
case "$NODE_BIN" in /root/*|/home/*) die "Node esta en $NODE_BIN; el servicio no puede usarlo. Instala Node 22 del sistema (NodeSource)." ;; esac
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
# Nombre unico aunque se reinstale el mismo commit: nunca se pisa la version en marcha, y
# siempre hay una anterior distinta a la que volver.
RELEASE="$ROOT/releases/$COMMIT-$(date +%Y%m%d%H%M%S)"
PREVIOUS=$(readlink -f "$ROOT/current" 2>/dev/null || true)
mkdir -p "$ROOT/releases"
STAGING="$RELEASE.tmp"
rm -rf "$STAGING"
cp -r "$REPO_DIR/dist/gateway" "$STAGING"
cp "$REPO_DIR/deploy/README.md" "$STAGING/README-deploy.md"
(cd "$STAGING" && npm install --omit=dev --no-audit --no-fund --silent)
chown -R root:kotaru "$STAGING"
chmod -R g+rX,o-rwx "$STAGING"
mv "$STAGING" "$RELEASE"

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
PORT=8787
KOTARU_GRANT_AUDIENCE=kotaru-gateway
KOTARU_API_AUDIENCE=kotaru-api
KOTARU_MONTHLY_HARD_CAP_USD=50
KOTARU_MESSAGE_RETENTION_DAYS=30
KOTARU_PROVIDERS=mock
# Login: se activa al poner los client ids (ver deploy/README.md).
KOTARU_APPLE_CLIENT_IDS=
KOTARU_GOOGLE_CLIENT_IDS=
KOTARU_EMAIL_HASH_KEY=$(openssl rand -base64 32)
KOTARU_EMAIL_ENCRYPTION_KEY=$(openssl rand -base64 32)
KOTARU_TRUST_PROXY=false
EOF
  echo "creado $ENV_FILE con claves nuevas"
else
  echo "ya existe $ENV_FILE (no se toca)"
fi
chown root:kotaru "$ENV_FILE"
chmod 640 "$ENV_FILE"

say "Migraciones"
# Se lee como lo lee systemd (CLAVE=valor, literal), sin ejecutarlo con bash: un $ o una
# comilla en una contrasena no se expanden, y el archivo no corre como codigo de root.
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in ''|'#'*) continue ;; esac
  key=${line%%=*}
  value=${line#*=}
  [[ $key =~ ^[A-Z_][A-Z0-9_]*$ ]] && export "$key=$value"
done < "$ENV_FILE"
runuser -u kotaru -- "$NODE_BIN" "$RELEASE/bin/migrate.mjs"

say "Puerto"
# Otro programa en el mismo puerto hace que el gateway no arranque (EADDRINUSE) y que la
# prueba de humo hable con ese otro programa. Se comprueba antes de tocar los servicios.
PORT_NOW=${PORT:-8787}
OWNER=$(ss -Hltnp "sport = :$PORT_NOW" 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2 || true)
if [ -n "$OWNER" ] && [ "$(ps -o user= -p "$OWNER" 2>/dev/null | tr -d ' ')" != "kotaru" ]; then
  echo "El puerto $PORT_NOW lo usa otro programa:" >&2
  ps -o pid=,user=,args= -p "$OWNER" >&2 || true
  die "cambia PORT en $ENV_FILE (por ejemplo PORT=8787) y vuelve a correr install.sh"
fi
echo "libre: $PORT_NOW"

say "Servicios"
ln -sfn "$RELEASE" "$ROOT/current"
for unit in kotaru-gateway.service kotaru-retention.service kotaru-retention.timer; do
  sed "s|/usr/bin/node|$NODE_BIN|g" "$REPO_DIR/deploy/systemd/$unit" > "/etc/systemd/system/$unit"
  chmod 644 "/etc/systemd/system/$unit"
done
systemctl daemon-reload
systemctl enable --now kotaru-retention.timer >/dev/null
systemctl enable kotaru-gateway >/dev/null
systemctl restart kotaru-gateway

say "Comprobacion"
for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:$PORT_NOW/readyz" >/dev/null 2>&1; then break; fi
  sleep 1
done
# runuser sin -l conserva el entorno ya cargado de $ENV_FILE.
if runuser -u kotaru -- "$NODE_BIN" "$RELEASE/bin/smoke.mjs" "http://127.0.0.1:$PORT_NOW"; then
  say "Listo: version $COMMIT en marcha"
  systemctl --no-pager --lines=0 status kotaru-gateway | head -5
  # Conserva las 5 ultimas versiones para poder volver atras.
  # shellcheck disable=SC2012
  ls -1dt "$ROOT"/releases/*/ | tail -n +6 | xargs -r rm -rf
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
