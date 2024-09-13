import config from '../tailwind.config'

export default {
  ...config,
  content: [
    './src/**/*.{ts,tsx}',
    './index.html',
    '../src/components/**/*.{ts,tsx}',
  ],
}
