export default {
  before: ['pnpm run build'],
  changelog: false,
  tag: false,
  publish: true,
  push: false,
  allowDirty: true,
  commit: false,
  allowedBranches: ['main', 'pro/dev'],
}
