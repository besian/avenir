import type { MetadataRoute } from 'next';

/** Web app manifest: name, colours and icons for "Add to Home Screen". */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Avenir Housing',
    short_name: 'Avenir',
    description: 'Safe, supported accommodation for vulnerable adults across South London.',
    start_url: '/',
    display: 'browser',
    background_color: '#f5f4ef',
    theme_color: '#f5f4ef',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
