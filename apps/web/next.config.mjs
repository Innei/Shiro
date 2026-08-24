import { execSync } from 'node:child_process'

import NextBundleAnalyzer from '@next/bundle-analyzer'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import { config } from 'dotenv'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

process.title = 'Shiro (NextJS)'

const env = config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

let commitHash = ''
let commitUrl = ''
const repoInfo = getRepoInfo()

if (repoInfo) {
  commitHash = repoInfo.hash
  commitUrl = repoInfo.url
}

/** @type {import('next').NextConfig} */

let nextConfig = {
  env: {
    COMMIT_HASH: commitHash,
    COMMIT_URL: commitUrl,
    BUILD_TIME: new Date().toISOString(),
  },

  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  output: 'standalone',
  assetPrefix: isProd ? env.ASSETPREFIX || undefined : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    // reactRemoveProperties: { properties: ['^data-id$', '^data-(\\w+)-id$'] },
  },
  experimental: {
    serverMinification: true,
    webpackBuildWorker: true,
    globalNotFound: true,
    // ❌ 已彻底移除 turbopackImportTypeText
  },
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
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

  async redirects() {
    return [
      {
        source: '/notes/topics',
        destination: '/notes/series',
        permanent: true,
      },
      {
        source: '/notes/topics/:slug',
        destination: '/notes/series/:slug',
        permanent: true,
      },
      {
        source: '/:locale/notes/topics',
        destination: '/:locale/notes/series',
        permanent: true,
      },
      {
        source: '/:locale/notes/topics/:slug',
        destination: '/:locale/notes/series/:slug',
        permanent: true,
      },
    ]
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

  // ✅ 保持 turbopack 配置简洁，仅用于 codeInspectorPlugin (如果需要)
  // 如果 codeInspectorPlugin 在 Turbopack 下有问题，可以先注释掉 rules
  turbopack: {
    rules: {
      '*.css': {
        loaders: [], 
      },
    },
  },

  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })

    config.plugins.push(
      codeInspectorPlugin({ bundler: 'webpack', hotKeys: ['altKey'] }),
    )

    config.module.rules.push({
      test: /\.svg$/i,
      type: 'asset/source',
    })

    return config
  },
}

if (process.env.ANALYZE === 'true') {
  nextConfig = NextBundleAnalyzer({
    enabled: true,
  })(nextConfig)
}

export default withNextIntl(nextConfig)

function getRepoInfo() {
  if (process.env.VERCEL) {
    const { VERCEL_GIT_PROVIDER, VERCEL_GIT_REPO_SLUG, VERCEL_GIT_REPO_OWNER } =
      process.env

    switch (VERCEL_GIT_PROVIDER) {
      case 'github': {
        return {
          hash: process.env.VERCEL_GIT_COMMIT_SHA,
          url: `https://github.com/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`,
        }
      }
    }
  } else {
    return getRepoInfoFromGit()
  }
}

function getRepoInfoFromGit() {
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim()
    const remoteName = execSync(`git config branch.${currentBranch}.remote`)
      .toString()
      .trim()
    let remoteUrl = execSync(`git remote get-url ${remoteName}`)
      .toString()
      .trim()

    const hash = execSync('git rev-parse HEAD').toString().trim()
    if (remoteUrl.startsWith('git@')) {
      remoteUrl = remoteUrl
        .replace(':', '/')
        .replace('git@', 'https://')
        .replace('.git', '')
    } else if (remoteUrl.endsWith('.git')) {
      remoteUrl = remoteUrl.slice(0, -4)
    }

    let webUrl
    if (remoteUrl.includes('github.com')) {
      webUrl = `${remoteUrl}/commit/${hash}`
    } else if (remoteUrl.includes('gitlab.com')) {
      webUrl = `${remoteUrl}/-/commit/${hash}`
    } else if (remoteUrl.includes('bitbucket.org')) {
      webUrl = `${remoteUrl}/commits/${hash}`
    } else {
      webUrl = `${remoteUrl}/commits/${hash}`
    }

    return { hash, url: webUrl }
  } catch (error) {
    console.error('Error fetching repo info:', error?.stderr?.toString())
    return null
  }
}
