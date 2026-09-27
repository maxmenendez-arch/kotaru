#!/usr/bin/env bash
# Publica el gateway en internet con HTTPS, detras de Caddy. Idempotente.
#
#   sudo bash deploy/expose.sh api.kotaru.app tu-correo@ejemplo.com
#
# Antes: el registro DNS A del dominio tiene que apuntar a la IP de este servidor, y el
# gateway tiene que estar instalado (deploy/install.sh).
#
# Que hace:
#   1. Comprueba que el DNS del dominio apunta aqui (si no, Let's Encrypt fallaria).
#   2. Instala Caddy desde su repositorio oficial si falta.
#   3. Escribe /etc/caddy/Caddyfile desde deploy/Caddyfile (guarda copia del anterior) y
#      lo valida antes de recargar.
#   4. Si el firewall ufw esta activo, abre 80 y 443 (no el 8080).
#   5. Pone KOTARU_TRUST_PROXY=true y HOST=127.0.0.1 en /etc/kotaru/gateway.env y reinicia.
#   6. Espera a que https://<dominio>/readyz responda.
set -euo pipefail

DOMAIN=${1:-}
EMAIL=${2:-}
ENV_FILE=/etc/kotaru/gateway.env
REPO_DIR=$(cd "$(dirname "$0")/.." && pwd)
say() { printf '\n==> %s\n' "$*"; }
die() { printf '\nERROR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "hay que correrlo como root"
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then die "uso: sudo bash deploy/expose.sh <dominio> <correo>"; fi
[[ "$DOMAIN" =~ ^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$ ]] || die "dominio no valido: $DOMAIN"
[[ "$EMAIL" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$ ]] || die "correo no valido: $EMAIL"
[ -f "$ENV_FILE" ] || die "no existe $ENV_FILE: instala antes el gateway con deploy/install.sh"

say "DNS de $DOMAIN"
command -v dig >/dev/null || apt-get install -y -qq dnsutils >/dev/null
RESOLVED=$(dig +short A "$DOMAIN" @1.1.1.1 | tail -1)
MY_IPS=$(hostname -I)
PUBLIC_IP=$(curl -fsS --max-time 5 https://api.ipify.org 2>/dev/null || true)
if [ -z "$RESOLVED" ]; then
  die "$DOMAIN no resuelve todavia. Crea el registro A -> ${PUBLIC_IP:-la IP del servidor} y espera unos minutos."
fi
if [ "$RESOLVED" != "$PUBLIC_IP" ] && ! grep -qw -- "$RESOLVED" <<<"$MY_IPS"; then
  die "$DOMAIN apunta a $RESOLVED, pero este servidor es ${PUBLIC_IP:-$MY_IPS}. Corrige el registro A."
fi
echo "ok: $DOMAIN -> $RESOLVED"

say "Caddy"
if ! command -v caddy >/dev/null; then
  apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl gnupg >/dev/null
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -qq
  apt-get install -y -qq caddy
fi
caddy version

say "Configuracion de Caddy"
NEW=$(mktemp)
sed -e "s/__DOMAIN__/$DOMAIN/g" -e "s/__EMAIL__/$EMAIL/g" "$REPO_DIR/deploy/Caddyfile" > "$NEW"
caddy validate --adapter caddyfile --config "$NEW" >/dev/null || die "la configuracion de Caddy no es valida"
if ! cmp -s "$NEW" /etc/caddy/Caddyfile; then
  [ -f /etc/caddy/Caddyfile ] && cp /etc/caddy/Caddyfile "/etc/caddy/Caddyfile.$(date +%Y%m%d%H%M%S).bak"
  install -m 644 "$NEW" /etc/caddy/Caddyfile
  echo "escrito: /etc/caddy/Caddyfile"
else
  echo "sin cambios"
fi
rm -f "$NEW"
systemctl enable --now caddy >/dev/null
systemctl reload caddy

say "Firewall"
if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
  ufw allow 80/tcp >/dev/null
  ufw allow 443/tcp >/dev/null
  ufw allow 443/udp >/dev/null
  echo "ufw: 80 y 443 abiertos"
  if ufw status | grep -qE '^8080'; then echo "AVISO: ufw permite el 8080; quitalo con: ufw delete allow 8080"; fi
else
  echo "ufw no esta activo. Si el proveedor tiene firewall propio (panel de Hostinger), abre 80 y 443 alli y NO el 8080."
fi

say "Gateway detras del proxy"
set_env() {
  if grep -qE "^$1=" "$ENV_FILE"; then sed -i "s|^$1=.*|$1=$2|" "$ENV_FILE"; else echo "$1=$2" >> "$ENV_FILE"; fi
}
set_env KOTARU_TRUST_PROXY true
set_env HOST 127.0.0.1
systemctl restart kotaru-gateway

say "Comprobando https://$DOMAIN/readyz (el primer certificado tarda unos segundos)"
for _ in $(seq 1 30); do
  if curl -fsS --max-time 5 "https://$DOMAIN/readyz" >/dev/null 2>&1; then
    echo "ok: https://$DOMAIN responde"
    if curl -fsS --max-time 3 "http://$RESOLVED:8080/healthz" >/dev/null 2>&1; then
      echo "AVISO: el 8080 responde desde fuera; el gateway deberia escuchar solo en 127.0.0.1"
    fi
    echo
    echo "Listo. La app se compila con EXPO_PUBLIC_KOTARU_SERVER_URL=https://$DOMAIN"
    exit 0
  fi
  sleep 2
done
die "https://$DOMAIN no responde. Mira: journalctl -u caddy -n 50 --no-pager"
