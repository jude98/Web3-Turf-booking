import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {global: 'globalThis'},
      plugins: [
        NodeGlobalsPolyfillPlugin({ process: true, buffer: true}) as any,
        NodeModulesPolyfillPlugin() as any,
      ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        (rollupNodePolyFill as any)(),
      ],
    },
  },
  server: {
    host: '0.0.0.0',
    port:3000
  },
})
