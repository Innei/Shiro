import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import ViteRestart from 'vite-plugin-restart'
import tsConfigPaths from 'vite-tsconfig-paths'

import mdx from '@mdx-js/rollup'

const __dirname = new URL('.', import.meta.url).pathname

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
    react(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment

    tsConfigPaths(),
    mdx(options),
    ViteRestart({
      restart: ['../**/index.demo.tsx', '../**/index.demo.mdx'],
    }),
  ],

  define: {
    __ROOT__: `"${__dirname}"`,
    __COMPONENT_ROOT__: `"${resolve(__dirname, '..')}"`,
  },
  resolve: {
    alias: {
      'next/image': resolve(__dirname, './mock-packages/next_image'),
      '~': resolve(__dirname, '../src'),
    },
  },
})
