import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capa multiplataforma: el mismo build de Vite se empaqueta para Android e iOS.
 * `webDir` apunta al directorio real que genera `npm run build`.
 */
const config: CapacitorConfig = {
  appId: 'com.serviprox.app',
  appName: 'Serviprox',
  webDir: 'dist',
  server: {
    // Android sirve el bundle en https://localhost (iOS usa capacitor://localhost).
    // Ambos origenes deben estar en CORS_ALLOWED_ORIGINS del backend.
    androidScheme: 'https',
  },
};

export default config;
