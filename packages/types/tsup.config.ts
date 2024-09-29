import { defineConfig } from 'tsup'

export default defineConfig(() => [
  {
    entry: ['./index.ts'],
    outDir: 'dist',
    format: 'esm',
    clean: true,
    dts: true,
    splitting: false,
    sourcemap: true,
  },
  {
    entry: ['./sandbox.ts'],
    outDir: 'dist',
    format: 'esm',
    clean: true,
    dts: true,
    splitting: false,
    sourcemap: true,
    treeshake: true,
    external: ['react', 'react-dom', 'framer-motion'],
  },
])
