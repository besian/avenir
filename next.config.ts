import type { NextConfig } from 'next';

import { readFileSync } from 'node:fs';

const maplibreVersion: string = JSON.parse(readFileSync('node_modules/maplibre-gl/package.json', 'utf8')).version;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Lets SiteMap.tsx build the worker URL (public/vendor/maplibre-gl-worker-<version>.mjs).
  env: { NEXT_PUBLIC_MAPLIBRE_VERSION: maplibreVersion },
};

export default nextConfig;
