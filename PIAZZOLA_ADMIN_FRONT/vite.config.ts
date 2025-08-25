import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import removeConsole from 'vite-plugin-remove-console';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
    },
  },
  optimizeDeps: {
    include: ["tailwind-config"],
  },
  plugins: [react(), removeConsole()],
  resolve: {
    alias: {
      "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
    },
  },
});
