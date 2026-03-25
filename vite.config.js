import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "Sivakami's Cinematic Suite",
        short_name: "Sivakami's Keys",
        description: 'Elite Cinematic Scoring Workstation for Sivakami A G',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'landscape'
      }
    })
  ]
});
