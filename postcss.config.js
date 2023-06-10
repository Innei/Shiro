module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    'postcss-prune-var': { skip: ['node_modules/**'] },
    tailwindcss: {},
    autoprefixer: {},
  },
}
