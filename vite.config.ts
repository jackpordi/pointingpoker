import { defineConfig } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/ws": {
        target: "ws://localhost:8080",
        ws: true,
      },
      "/api/": {
        target: "http://localhost:8080",
      },
    }
  },
  plugins: [ 
    tsconfigPaths(), 
    react(), 
    svgr({
      svgrOptions: {
        exportType: 'default',
      },
    }) 
  ],
})
