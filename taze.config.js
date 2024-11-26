import { defineConfig } from 'taze'

export default defineConfig({
  // ignore packages from bumping
  exclude: ['next'],
  // fetch latest package info from registry without cache
  force: true,
  // write to package.json
  write: true,
  // run `npm install` or `yarn install` right after bumping
  install: true,
  // ignore paths for looking for package.json in monorepo
  ignorePaths: ['**/node_modules/**', '**/test/**'],
  // override with different bumping mode for each package
  packageMode: {
    typescript: 'major',
  },
  // disable checking for "overrides" package.json field
  depFields: {
    overrides: false,
  },
  recursive: true,
  mode: 'latest',
})
