import { defineConfig } from 'tsdown'

export default defineConfig(() => [
  {
    entry: ['./index.ts'],
    outDir: 'dist',
    format: ['es'],
    clean: true,
    dts: true,

    sourcemap: true,
  },
  {
    entry: ['./sandbox.ts'],
    outDir: 'dist',
    format: ['es'],
    clean: true,
    dts: true,

    sourcemap: true,
    treeshake: true,
    external: ['react', 'react-dom', 'motion'],
  },
])
