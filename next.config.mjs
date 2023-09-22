import { config } from 'dotenv'

import NextBundleAnalyzer from '@next/bundle-analyzer'

process.title = 'Shiro (NextJS)'

const env = config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
// eslint-disable-next-line import/no-mutable-exports
let nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  output: 'standalone',
  assetPrefix: isProd ? env.ASSETPREFIX || undefined : undefined,
  compiler: {
    // reactRemoveProperties: { properties: ['^data-id$', '^data-(\\w+)-id$'] },
  },
  experimental: {
    serverMinification: true,

    // @see https://vercel.com/blog/version-skew-protection
    useDeploymentId: true,
    // If use with serverActions is desired
    serverActions: true,
    useDeploymentIdServerActions: true,
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
        { source: '/sitemap.xml', destination: '/sitemap' },
      ],
    }
  },

  webpack: (config, options) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })

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
