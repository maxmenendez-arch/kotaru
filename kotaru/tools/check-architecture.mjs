#!/usr/bin/env node
/**
 * Lint de arquitectura. Falla el build si se rompe la regla de dependencias
 * del proyecto. No es un linter de estilo: cada regla protege una decision.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * SDK de proveedores de IA. Solo packages/ai-adapters-* puede declararlos.
 *
 * Esta es la regla que hace real la independencia de proveedor: si la logica de
 * negocio puede importar el SDK de un proveedor, en seis meses lo importa, y cambiar
 * de proveedor deja de ser una linea de configuracion.
 */
const AI_VENDOR_SDKS = [
  'openai', '@anthropic-ai/sdk', '@google/generative-ai', '@google/genai',
  '@google-cloud/text-to-speech', '@google-cloud/speech',
  '@aws-sdk/client-polly', '@aws-sdk/client-transcribe',
  'assemblyai', '@deepgram/sdk', 'deepgram', 'elevenlabs', '@elevenlabs/elevenlabs-js',
  '@cartesia/cartesia-js', 'together-ai', 'minimax', 'groq-sdk',
  '@alicloud/openapi-client', '@volcengine/openapi', 'microsoft-cognitiveservices-speech-sdk',
];

const violations = [];

function sourceFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (full.endsWith('.ts')) out.push(full);
  }
  return out;
}

function workspaces(root) {
  try {
    return readdirSync(root)
      .map((name) => join(root, name))
      .filter((path) => statSync(path).isDirectory());
  } catch {
    return [];
  }
}

for (const path of [...workspaces('packages'), ...workspaces('apps')]) {
  const isApp = path.startsWith('apps');
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(join(path, 'package.json'), 'utf8'));
  } catch {
    continue;
  }
  const deps = Object.keys(manifest.dependencies ?? {});
  const isAdapter = manifest.name.startsWith('@kotaru/ai-adapters');

  // Regla 1: ai-contracts define el limite con proveedores. Cero dependencias.
  if (manifest.name === '@kotaru/ai-contracts' && deps.length > 0) {
    violations.push(
      `@kotaru/ai-contracts declara dependencias (${deps.join(', ')}). Debe tener cero: es el limite con los proveedores.`,
    );
  }

  // Regla 2: solo los adaptadores pueden declarar un SDK de proveedor de IA.
  if (!isAdapter) {
    const vendor = deps.filter((dep) => AI_VENDOR_SDKS.includes(dep));
    if (vendor.length > 0) {
      violations.push(
        `${manifest.name} declara un SDK de proveedor de IA (${vendor.join(', ')}). Solo packages/ai-adapters-* puede hacerlo.`,
      );
    }
  }

  // Regla 3: un paquete de logica no toma dependencias de terceros; una app si puede
  // (necesita servidor, sockets, base de datos), pero nunca un SDK de IA.
  if (!isApp && !isAdapter) {
    const external = deps.filter((dep) => !dep.startsWith('@kotaru/'));
    if (external.length > 0) {
      violations.push(
        `${manifest.name} declara dependencias de terceros (${external.join(', ')}). Los paquetes de logica solo dependen de @kotaru/*.`,
      );
    }
  }

  // Regla 4: las dependencias van en un solo sentido y nadie cruza el limite de otro
  // paquete por ruta relativa.
  let files = [];
  try {
    files = sourceFiles(join(path, 'src'));
  } catch {
    continue;
  }
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const specifier = match[1];
      if (!isApp && specifier.includes('apps/')) {
        violations.push(`${file} importa desde apps/ ('${specifier}'). Las dependencias van en un solo sentido.`);
      }
      if (specifier.startsWith('../../')) {
        violations.push(
          `${file} cruza el limite de su paquete por ruta relativa ('${specifier}'). Usa el nombre del paquete.`,
        );
      }
    }
  }
}

if (violations.length > 0) {
  console.error('Lint de arquitectura: FALLO\n');
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}
console.log('Lint de arquitectura: OK');
