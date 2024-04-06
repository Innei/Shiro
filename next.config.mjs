import { execSync } from 'child_process'
 
import { config } from 'dotenv'
import path from 'path'

import CopyPlugin from 'copy-webpack-plugin'
import NextBundleAnalyzer from '@next/bundle-analyzer'

// const pkg = require('./package.json')
import pkg from './package.json' assert {type: 'json'}

const __dirname = path.resolve()

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
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        publicPath: '/_next/',
        worker: {
          type: "SharedWorker",
          // https://v4.webpack.js.org/loaders/worker-loader/#worker
          options: {
            name: "shiro-ws-worker",
          },
        },

      },
    })

    // plugins
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(
              __dirname,
              './node_modules/socket.io-client/dist/socket.io.min.js',
            ),
            to: path.resolve(__dirname, './public/static/socket.io.js'),
          },
        ],
      }),
    )

    config.resolve.alias['socket.io-client'] = path.resolve(
      __dirname,
      './public/static/socket.io.js',
    )

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
