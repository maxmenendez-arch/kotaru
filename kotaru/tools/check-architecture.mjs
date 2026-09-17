#!/usr/bin/env node
/**
 * Lint de arquitectura. Falla el build si se rompe la regla de dependencias
 * del proyecto. No es un linter de estilo: cada regla protege una decision.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PACKAGES_DIR = 'packages';
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

for (const pkg of readdirSync(PACKAGES_DIR)) {
  const pkgPath = join(PACKAGES_DIR, pkg);
  if (!statSync(pkgPath).isDirectory()) continue;

  const manifest = JSON.parse(readFileSync(join(pkgPath, 'package.json'), 'utf8'));
  const deps = Object.keys(manifest.dependencies ?? {});

  // Regla 1: ai-contracts define el limite con proveedores. Cero dependencias.
  if (manifest.name === '@kotaru/ai-contracts' && deps.length > 0) {
    violations.push(
      `@kotaru/ai-contracts declara dependencias (${deps.join(', ')}). Debe tener cero: es el limite con los proveedores.`,
    );
  }

  // Regla 2: solo los adaptadores pueden declarar un SDK de proveedor.
  const isAdapter = manifest.name.startsWith('@kotaru/ai-adapters');
  if (!isAdapter) {
    const vendor = deps.filter((d) => !d.startsWith('@kotaru/'));
    if (vendor.length > 0) {
      violations.push(
        `${manifest.name} declara dependencias de terceros (${vendor.join(', ')}). Solo packages/ai-adapters-* puede hacerlo.`,
      );
    }
  }

  // Regla 3: ningun paquete importa desde apps/ ni cruza el limite de otro paquete por ruta relativa.
  const srcDir = join(pkgPath, 'src');
  let files = [];
  try {
    files = sourceFiles(srcDir);
  } catch {
    continue;
  }
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const specifier = match[1];
      if (specifier.includes('apps/')) {
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
