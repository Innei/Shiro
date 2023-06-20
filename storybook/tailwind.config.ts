import config from '../tailwind.config'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...config,
  content: [
    './src/**/*.{ts,tsx}',
    './index.html',
    '../src/components/**/*.{ts,tsx}',
  ],
}
