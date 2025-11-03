import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [react() as any],
    server: {
      port: 5002,
    },
    resolve: {
      alias: {
        '@repo/common': path.resolve(__dirname, "../../libs/common/dist/index.mjs"),
        // '@': path.resolve(__dirname, 'src'),
        util: 'rollup-plugin-node-polyfills/polyfills/util'
      },
    },
  }
})
