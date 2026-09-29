#!/usr/bin/env bash
# Descarga las vistas pintadas de los escenarios (docs/escenarios/VISTAS.md) a
# mobile/public/escenarios/vistas/, para que las publique deploy/web.sh.
#
#   bash deploy/vistas.sh URL_NOVA URL_LUNA URL_RIO && bash deploy/web.sh
#
# Las URL son las de exportacion de Canva (firmadas, caducan en unas horas; se vuelven a
# pedir exportando el diseño "Kotaru vistas", paginas 2, 3 y 4).
# Guarda los bytes tal cual: los terminos de Canva piden no quitar los metadatos de
# procedencia. Comprueba que cada archivo es un JPEG y que no pesa de mas.
set -Eeuo pipefail
cd "$(dirname "$0")/.."

if [ $# -ne 3 ]; then
  echo "uso: bash deploy/vistas.sh URL_NOVA URL_LUNA URL_RIO" >&2
  exit 2
fi

DIR=mobile/public/escenarios/vistas
mkdir -p "$DIR"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

names=(nova-room luna-office rio-outdoors)
urls=("$1" "$2" "$3")
for i in 0 1 2; do
  name=${names[$i]}
  curl -fsS --max-time 60 -o "$TMP/$name.jpg" "${urls[$i]}"
  # JPEG empieza por FF D8 FF.
  if [ "$(head -c 3 "$TMP/$name.jpg" | od -An -tx1 | tr -d ' ')" != "ffd8ff" ]; then
    echo "error: $name no es un JPEG" >&2
    exit 1
  fi
  size=$(stat -c %s "$TMP/$name.jpg")
  if [ "$size" -gt 4000000 ]; then
    echo "error: $name pesa $size bytes (maximo 4 MB)" >&2
    exit 1
  fi
  echo "ok: $name ($((size / 1024)) KB)"
done
# Todo bien: se mueven juntas (o ninguna).
for name in "${names[@]}"; do mv "$TMP/$name.jpg" "$DIR/$name.jpg"; done
echo "listo: $DIR. Ahora: bash deploy/web.sh"
