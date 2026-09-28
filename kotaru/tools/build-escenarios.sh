#!/usr/bin/env bash
# Compila la pagina de muestra de los fondos (app.kotaru.app/escenarios/) a
# mobile/public/escenarios/app.js. Hay que volver a correrlo al cambiar las escenas o el
# visor del avatar (mobile/src/scene3d.ts, scenes.ts, avatar-viewer.ts, avatar-motion.ts).
set -euo pipefail
cd "$(dirname "$0")/.."
npx esbuild tools/escenarios/entry.ts --bundle --minify --format=iife --target=es2020 \
  --alias:three=./mobile/node_modules/three \
  --outfile=mobile/public/escenarios/app.js --log-level=warning
echo "listo: mobile/public/escenarios/app.js ($(du -h mobile/public/escenarios/app.js | cut -f1))"
