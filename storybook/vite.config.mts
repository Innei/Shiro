import { readFileSync } from 'node:fs'
import path, { resolve } from 'node:path'

import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import { parse } from 'dotenv'
import Macros from 'unplugin-macros'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import ViteRestart from 'vite-plugin-restart'
import tsConfigPaths from 'vite-tsconfig-paths'

const __dirname = new URL('.', import.meta.url).pathname
const env = parse(readFileSync(path.resolve(__dirname, '../.env')))

// `options` are passed to `@mdx-js/mdx`
const options = {
  // See https://mdxjs.com/advanced/plugins
  remarkPlugins: [
    // E.g. `remark-frontmatter`
  ],
  rehypePlugins: [],
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Macros.vite(),
    react(),
    tsConfigPaths(),
    nodePolyfills({
      include: ['events', 'crypto'],
      globals: {
        Buffer: false,
        process: false,
        global: false,
      },
    }),
    mdx(options),
    ViteRestart({
      restart: ['../**/index.demo.tsx', '../**/index.demo.mdx'],
    }),
  ],

  define: {
    __ROOT__: `"${__dirname}"`,
    __COMPONENT_ROOT__: `"${resolve(__dirname, '..')}"`,
    'process.env': { ...env },
    __dirname: `"${__dirname}"`,
  },
  base: '',
  resolve: {
    alias: {
      'next/image': resolve(__dirname, './mock-packages/next_image'),
      'next/link': resolve(__dirname, './mock-packages/next_link'),
      'next/dynamic': resolve(__dirname, './mock-packages/next_dynamic'),
      'next/navigation': resolve(__dirname, './mock-packages/next_navigation'),
      'next-runtime-env': resolve(
        __dirname,
        './mock-packages/next-runtime-env',
      ),
      '~': resolve(__dirname, '../src'),
    },
  },

  build: {
    chunkSizeWarningLimit: 2500,
    target: 'esnext',

    // sourcemap: true,
    rollupOptions: {
      output: {
        // chunkFileNames: `js/[name]-[hash].js`,
        // entryFileNames: `js/[name]-[hash].js`,
      },
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      plugins: [Macros.esbuild()],
    },
  },
})
