import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

import NextBundleAnalyzer from '@next/bundle-analyzer'

import pkg from './package.json' assert { type: 'json' }

process.title = 'Shiro (NextJS)'

const env = config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let commitHash = ''
let commitUrl = ''
const repoInfo = getRepoInfo()

if (repoInfo) {
  commitHash = repoInfo.hash
  commitUrl = repoInfo.url
}

/** @type {import('next').NextConfig} */
// eslint-disable-next-line import/no-mutable-exports
let nextConfig = {
  // logging: {
  //   fetches: {

  //     // fullUrl: true,
  //   },
  // },
  env: {
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash,
    COMMIT_URL: commitUrl,
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
    // optimizePackageImports: ['dayjs'],
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
    config.resolve.alias['jotai'] = path.resolve(
      __dirname,
      'node_modules/jotai',
    )

    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })

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

function getRepoInfo() {
  if (process.env.VERCEL) {
    const { VERCEL_GIT_PROVIDER, VERCEL_GIT_REPO_SLUG, VERCEL_GIT_REPO_OWNER } =
      process.env

    // eslint-disable-next-line no-console
    console.log(
      'VERCEL_GIT_PROVIDER',
      VERCEL_GIT_PROVIDER,
      VERCEL_GIT_REPO_SLUG,
      VERCEL_GIT_REPO_OWNER,
    )
    switch (VERCEL_GIT_PROVIDER) {
      case 'github':
        return {
          hash: process.env.VERCEL_GIT_COMMIT_SHA,
          url: `https://github.com/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`,
        }
    }
  } else {
    return getRepoInfoFromGit()
  }
}

function getRepoInfoFromGit() {
  try {
    // 获取最新的 commit hash
    // 获取当前分支名称
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim()
    // 获取当前分支跟踪的远程仓库名称
    const remoteName = execSync(`git config branch.${currentBranch}.remote`)
      .toString()
      .trim()
    // 获取当前分支跟踪的远程仓库的 URL
    let remoteUrl = execSync(`git remote get-url ${remoteName}`)
      .toString()
      .trim()

    // 获取最新的 commit hash
    const hash = execSync('git rev-parse HEAD').toString().trim()
    // 转换 git@ 格式的 URL 为 https:// 格式
    if (remoteUrl.startsWith('git@')) {
      remoteUrl = remoteUrl
        .replace(':', '/')
        .replace('git@', 'https://')
        .replace('.git', '')
    } else if (remoteUrl.endsWith('.git')) {
      // 对于以 .git 结尾的 https URL，移除 .git
      remoteUrl = remoteUrl.slice(0, -4)
    }

    // 根据不同的 Git 托管服务自定义 URL 生成规则
    let webUrl
    if (remoteUrl.includes('github.com')) {
      webUrl = `${remoteUrl}/commit/${hash}`
    } else if (remoteUrl.includes('gitlab.com')) {
      webUrl = `${remoteUrl}/-/commit/${hash}`
    } else if (remoteUrl.includes('bitbucket.org')) {
      webUrl = `${remoteUrl}/commits/${hash}`
    } else {
      // 对于未知的托管服务，可以返回 null 或一个默认格式
      webUrl = `${remoteUrl}/commits/${hash}`
    }

    return { hash, url: webUrl }
  } catch (error) {
    console.error('Error fetching repo info:', error?.stderr?.toString())
    return null
  }
}
