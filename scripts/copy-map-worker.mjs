// Copies MapLibre's web-worker file into /public so the browser can load it.
// MapLibre resolves its worker relative to its own module URL, which doesn't
// survive bundling; SiteMap.tsx points setWorkerUrl() at this copy instead.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve('maplibre-gl/package.json'));
const { version } = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
const outDir = join(process.cwd(), 'public', 'vendor');
mkdirSync(outDir, { recursive: true });
copyFileSync(join(pkgDir, 'dist', 'maplibre-gl-worker.mjs'), join(outDir, `maplibre-gl-worker-${version}.mjs`));
console.log(`[map] copied maplibre-gl worker v${version} to public/vendor/`);
