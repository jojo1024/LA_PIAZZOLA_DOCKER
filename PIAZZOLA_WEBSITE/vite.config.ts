import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import removeConsole from 'vite-plugin-remove-console';
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), removeConsole(), viteCompression(),],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Définir des règles pour découper les dépendances en différents chunks
          if (id.includes('node_modules')) {
            // Si l'id fait référence à une dépendance dans `node_modules`, créer un chunk séparé
            return 'vendor';
          }
          // Exemple : découper les composants dans des chunks séparés
          if (id.includes('src/components')) {
            return 'components';
          }
          // Laisser d'autres fichiers dans le chunk principal
          return null;
        }
      },
    },
  },
})
