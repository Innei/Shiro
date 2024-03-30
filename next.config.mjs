import { execSync } from 'child_process'
import path from 'path'
import { config } from 'dotenv'

import NextBundleAnalyzer from '@next/bundle-analyzer'

// const pkg = require('./package.json')
import pkg from './package.json' assert {type: 'json'}

process.title = 'Shiro (NextJS)'

const env = config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

let commitHash = ''

try {
  commitHash = execSync('git log --pretty=format:"%h" -n1')
    .toString()
    .trim()
} catch (err) {
  console.error('Error getting commit hash', err)
}
 
/** @type {import('next').NextConfig} */
// eslint-disable-next-line import/no-mutable-exports
let nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  env: {
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  output: 'standalone',
  assetPrefix: isProd ? env.ASSETPREFIX || undefined : undefined,
  compiler: {
    // reactRemoveProperties: { properties: ['^data-id$', '^data-(\\w+)-id$'] },
  },
  experimental: {
    serverMinification: true,

    webpackBuildWorker: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline';",
  },

  async rewrites() {
    return {
      beforeFiles: [
        { source: '/atom.xml', destination: '/feed' },
        { source: '/feed.xml', destination: '/feed' },
        { source: '/sitemap.xml', destination: '/sitemap' },
      ],
    }
  },

  webpack: (config, { webpack }) => {
    const __dirname = new URL('./', import.meta.url).pathname
    config.resolve.alias['jotai'] = path.resolve(
      __dirname,
      'node_modules/jotai',
    )

    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })

    // config.plugins.push(
    //   new webpack.optimize.MinChunkSizePlugin({
    //     minChunkSize: 1024 * 100, // Minimum number of characters
    //   }),
    // )

    // if (
    //   process.env.SENTRY === 'true' &&
    //   process.env.NEXT_PUBLIC_SENTRY_DSN &&
    //   isProd
    // ) {
    //   config.plugins.push(
    //     sentryWebpackPlugin({
    //       org: 'inneis-site',
    //
    //       project: 'springtide',
    //       authToken: process.env.SENTRY_AUTH_TOKEN,
    //     }),
    //   )
    // }

    return config
  },
}

// if (env.SENTRY === 'true' && isProd) {
//   // @ts-expect-error
//   nextConfig = withSentryConfig(
//     nextConfig,
//     {
//       // For all available options, see:
//       // https://github.com/getsentry/sentry-webpack-plugin#options
//
//       // Suppresses source map uploading logs during build
//       silent: true,
//
//       org: 'inneis-site',
//       project: 'Shiro',
//     },
//     {
//       // For all available options, see:
//       // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
//
//       // Upload a larger set of source maps for prettier stack traces (increases build time)
//       widenClientFileUpload: true,
//
//       // Transpiles SDK to be compatible with IE11 (increases bundle size)
//       transpileClientSDK: true,
//
//       // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
//       tunnelRoute: '/monitoring',
//
//       // Hides source maps from generated client bundles
//       hideSourceMaps: true,
//
//       // Automatically tree-shake Sentry logger statements to reduce bundle size
//       disableLogger: true,
//     },
//   )
// }

if (process.env.ANALYZE === 'true') {
  nextConfig = NextBundleAnalyzer({
    enabled: true,
  })(nextConfig)
}

export default nextConfig
