import { defineConfig } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";
import preact from '@preact/preset-vite';
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
  plugins: [ tsconfigPaths(), preact(), svgr() ],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }
  }
})
