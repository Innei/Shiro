import { config } from 'dotenv'
import type { NextConfig } from 'next'

import { withSentryConfig } from '@sentry/nextjs'
import { sentryWebpackPlugin } from '@sentry/webpack-plugin'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()

process.title = 'Kami (NextJS)'

const env = config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

// eslint-disable-next-line import/no-mutable-exports
let nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, options) => {
    if (
      process.env.SENTRY === 'true' &&
      process.env.NEXT_PUBLIC_SENTRY_DSN &&
      isProd
    ) {
      config.plugins.push(
        sentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules', 'cypress', 'test'],
          urlPrefix: '~/_next',

          org: 'inneis-site',
          headers: {
            Authorization: `DSN ${process.env.NEXT_PUBLIC_SENTRY_DSN}`,
          },
          project: 'kami',
        }),
      )
    }

    return config
  },
}

if (process.env.SENTRY === 'true' && isProd) {
  // @ts-expect-error
  nextConfig = withSentryConfig(
    nextConfig,
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,

      org: 'inneis-site',
      project: 'springtide',
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: true,

      // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
      tunnelRoute: '/monitoring',

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,
    },
  )
}

nextConfig = withVanillaExtract(nextConfig)

export default nextConfig
